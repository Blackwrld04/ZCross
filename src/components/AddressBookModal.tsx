'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, BookOpen, Plus, Trash2, Check, Copy, 
  ExternalLink, Search, ShieldCheck, Tag
} from 'lucide-react';
import { 
  AddressBookContact, 
  getSavedContacts, 
  saveContact, 
  deleteContact,
  resolveWeb3Domain 
} from '@/core/wallet/address-book';
import { TokenIcon } from './TokenIcon';

interface AddressBookModalProps {
  chainFilter?: string;
  onSelectAddress: (address: string, contactName?: string) => void;
  onClose: () => void;
}

export const AddressBookModal: React.FC<AddressBookModalProps> = ({
  chainFilter,
  onSelectAddress,
  onClose,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [contacts, setContacts] = useState<AddressBookContact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>(chainFilter || 'all');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Contact Form State
  const [newName, setNewName] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');
  const [newChain, setNewChain] = useState<'arb' | 'sol' | 'btc' | 'eth' | 'base' | 'zec'>(
    (chainFilter as any) || 'arb'
  );
  const [newTag, setNewTag] = useState<string>('Personal');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setContacts(getSavedContacts());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const refreshList = () => {
    setContacts(getSavedContacts());
  };

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteContact(id);
    refreshList();
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = newName.trim();
    let cleanAddress = newAddress.trim();

    if (!cleanName || !cleanAddress) {
      setFormError('Please provide both contact name and destination address.');
      return;
    }

    // Auto-resolve domain if entered in address field
    if (cleanAddress.endsWith('.eth') || cleanAddress.endsWith('.sol') || cleanAddress.endsWith('.zec')) {
      const resolved = resolveWeb3Domain(cleanAddress);
      if (resolved) {
        cleanAddress = resolved.resolvedAddress;
      }
    }

    saveContact({
      name: cleanName,
      address: cleanAddress,
      chain: newChain,
      tag: newTag.trim() || undefined,
    });

    setNewName('');
    setNewAddress('');
    setIsAdding(false);
    refreshList();
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesChain = selectedTab === 'all' || c.chain === selectedTab;
    const matchesQuery = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tag && c.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChain && matchesQuery;
  });

  if (!mounted || typeof document === 'undefined') return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-white my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white">
              <BookOpen className="w-5 h-5 text-black dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                Address Book
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Verified cross-chain contacts &amp; shielded vaults
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Action Row */}
        {!isAdding && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, domain, or address..."
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-amber-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="px-3 py-2 bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Chain Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'arb', label: 'Arbitrum' },
                { id: 'sol', label: 'Solana' },
                { id: 'btc', label: 'Bitcoin' },
                { id: 'zec', label: 'Zcash Orchard' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-3 py-1 rounded-full font-medium text-xs transition cursor-pointer whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'bg-black text-white dark:bg-amber-500 dark:text-black font-semibold shadow-xs'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADD CONTACT FORM */}
        {isAdding ? (
          <form onSubmit={handleSaveNew} className="p-4 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-2xl space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">New Contact Details</span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">Contact Label / Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. My Ledger Cold Storage"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">Target Network</label>
                <select
                  value={newChain}
                  onChange={(e) => setNewChain(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="arb">Arbitrum One (USDC)</option>
                  <option value="sol">Solana (SOL)</option>
                  <option value="btc">Bitcoin Native (BTC)</option>
                  <option value="zec">Zcash Orchard (u1...)</option>
                  <option value="eth">Ethereum (USDC)</option>
                  <option value="base">Base (USDC)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">Tag (Optional)</label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. Personal, Exchange"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Recipient Address or Web3 Domain (.eth, .sol, .zec)
              </label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x..., base58..., bc1..., or vitalik.eth"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-amber-400"
                required
              />
            </div>

            {formError && (
              <div className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Save to Address Book
            </button>
          </form>
        ) : (
          /* CONTACT LIST */
          <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">No contacts found</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Add contacts or search with different keywords.
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    onSelectAddress(contact.address, contact.name);
                    onClose();
                  }}
                  className="p-3 bg-gray-50 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 border border-gray-200 dark:border-slate-800 rounded-2xl transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <TokenIcon symbol={contact.chain === 'zec' ? 'ZEC' : contact.chain === 'sol' ? 'SOL' : contact.chain === 'btc' ? 'BTC' : 'USDC'} chain={contact.chain} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {contact.name}
                        </span>
                        {contact.isVerified && (
                          <span title="Verified Protocol Safe" className="inline-flex items-center">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          </span>
                        )}
                        {contact.tag && (
                          <span className="px-1.5 py-0.2 rounded bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-[9px] font-semibold">
                            {contact.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate max-w-[240px]">
                        {contact.address}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(contact.address, contact.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                      title="Copy Address"
                    >
                      {copiedId === contact.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {!contact.isVerified && (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(contact.id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span>Click any contact to auto-fill recipient</span>
          <span className="font-mono">{contacts.length} Saved</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
