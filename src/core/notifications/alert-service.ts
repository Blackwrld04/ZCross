/**
 * Real-Time Web Push & Telegram Alert Service
 * Pings users across browser notification API and Telegram when cross-chain legs settle.
 */

const STORAGE_KEY_TELEGRAM = 'zcross_alert_telegram_handle';
const STORAGE_KEY_NOTIF_PREF = 'zcross_alert_browser_enabled';

export interface SettlementAlertPayload {
  swapId: string;
  originAmountZec: string | number;
  destAmountEst: string | number;
  destChain: string;
  destToken: string;
  recipientAddress: string;
  destTxHash?: string;
}

export class AlertService {
  /**
   * Checks if browser push notifications are supported and permitted
   */
  static isNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  static getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (!this.isNotificationSupported()) return 'unsupported';
    return Notification.permission;
  }

  static isBrowserAlertEnabled(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY_NOTIF_PREF) === 'true' && Notification.permission === 'granted';
  }

  static setBrowserAlertEnabled(enabled: boolean): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_NOTIF_PREF, enabled ? 'true' : 'false');
    }
  }

  /**
   * Prompts the user for browser push notification permissions
   */
  static async requestNotificationPermission(): Promise<boolean> {
    if (!this.isNotificationSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      this.setBrowserAlertEnabled(granted);
      return granted;
    } catch (err) {
      console.warn('Failed to request notification permission:', err);
      return false;
    }
  }

  /**
   * Sends a native OS browser push notification
   */
  static sendBrowserPushNotification(title: string, options?: NotificationOptions): boolean {
    if (!this.isNotificationSupported() || Notification.permission !== 'granted') {
      return false;
    }
    try {
      new Notification(title, {
        icon: '/brand/favicon-64.png',
        badge: '/brand/favicon-32.png',
        ...options,
      });
      return true;
    } catch (err) {
      console.warn('Failed to send browser notification:', err);
      return false;
    }
  }

  private static memoryStore = new Map<string, string>();

  /**
   * Telegram Alert preferences
   */
  static getTelegramRecipient(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_TELEGRAM) || '';
    }
    return this.memoryStore.get(STORAGE_KEY_TELEGRAM) || '';
  }

  static setTelegramRecipient(recipient: string): void {
    const clean = recipient.trim();
    if (typeof localStorage !== 'undefined') {
      if (clean) {
        localStorage.setItem(STORAGE_KEY_TELEGRAM, clean);
      } else {
        localStorage.removeItem(STORAGE_KEY_TELEGRAM);
      }
    } else {
      if (clean) {
        this.memoryStore.set(STORAGE_KEY_TELEGRAM, clean);
      } else {
        this.memoryStore.delete(STORAGE_KEY_TELEGRAM);
      }
    }
  }

  /**
   * Dispatches settlement notification to browser push and Telegram API
   */
  static async notifySettlement(payload: SettlementAlertPayload): Promise<{
    browserNotified: boolean;
    telegramDispatched: boolean;
    telegramMessage?: string;
  }> {
    const chainName = payload.destChain.toUpperCase();
    const title = `🛡️ ZCross Settlement Complete: ${payload.destAmountEst} ${payload.destToken}`;
    const body = `${payload.originAmountZec} ZEC successfully settled to your ${chainName} address (${payload.recipientAddress.slice(0, 8)}...). Zero unshielded traces.`;

    // 1. Browser Notification
    let browserNotified = false;
    if (this.isBrowserAlertEnabled()) {
      browserNotified = this.sendBrowserPushNotification(title, {
        body,
        tag: `settlement_${payload.swapId}`,
      });
    }

    // 2. Telegram Alert
    const telegramRecipient = this.getTelegramRecipient();
    let telegramDispatched = false;
    let telegramMessage: string | undefined;

    if (telegramRecipient) {
      try {
        const baseUrl = typeof window !== 'undefined' ? '' : (process.env.APP_URL || 'http://localhost:3001');
        const res = await fetch(`${baseUrl}/api/alerts/telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: telegramRecipient,
            payload,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          telegramDispatched = Boolean(data.success);
          telegramMessage = data.message;
        }
      } catch (err) {
        console.warn('Failed to dispatch telegram settlement alert:', err);
      }
    }

    return {
      browserNotified,
      telegramDispatched,
      telegramMessage,
    };
  }
}
