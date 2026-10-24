
export interface Zip321PaymentRequest {
  recipientAddress: string;
  amountZec: number | string;
  memoBase64?: string;
  message?: string;
}

export function encodeZip321Uri(req: Zip321PaymentRequest): string {
  const address = req.recipientAddress.trim();
  const params: string[] = [];

  const amountNum = typeof req.amountZec === 'string' ? parseFloat(req.amountZec) : req.amountZec;
  if (isNaN(amountNum) || amountNum <= 0) {
    throw new Error('Invalid ZEC amount for payment request');
  }

  params.push(`amount=${amountNum.toFixed(8).replace(/\.?0+$/, '')}`);

  if (req.memoBase64) {
    const urlSafeMemo = req.memoBase64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    params.push(`memo=${urlSafeMemo}`);
  }

  if (req.message) {
    params.push(`message=${encodeURIComponent(req.message)}`);
  }

  return `zcash:${address}?${params.join('&')}`;
}

export function parseZip321Uri(uri: string): Zip321PaymentRequest {
  if (!uri.startsWith('zcash:')) {
    throw new Error('URI must start with "zcash:" scheme');
  }

  const withoutScheme = uri.slice(6);
  const [addressPart, queryPart] = withoutScheme.split('?');

  if (!addressPart) {
    throw new Error('Missing recipient address in ZIP 321 URI');
  }

  const result: Zip321PaymentRequest = {
    recipientAddress: addressPart,
    amountZec: 0,
  };

  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    const amountStr = searchParams.get('amount');
    if (amountStr) {
      result.amountZec = parseFloat(amountStr);
    }

    const memoStr = searchParams.get('memo');
    if (memoStr) {
      let base64 = memoStr.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      result.memoBase64 = base64;
    }

    const msg = searchParams.get('message');
    if (msg) {
      result.message = msg;
    }
  }

  return result;
}
