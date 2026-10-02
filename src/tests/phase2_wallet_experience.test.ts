import { test, describe } from 'node:test';
import assert from 'node:assert';
import { 
  getSavedContacts, 
  saveContact, 
  deleteContact, 
  resolveWeb3Domain,
  DEFAULT_CONTACTS 
} from '../core/wallet/address-book';
import { 
  isWebAuthnSupported, 
  hasRegisteredPasskey, 
  registerPasskey, 
  authenticateWithPasskey, 
  clearPasskey 
} from '../core/security/webauthn';

describe('Phase 2: Enhanced Wallet Experience & Security Innovations', () => {

  test('Address Book: retrieves default verified institutional contacts', () => {
    const contacts = getSavedContacts();
    assert.ok(contacts.length >= 4, 'Should contain default contacts');
    const zecContact = contacts.find(c => c.chain === 'zec');
    assert.ok(zecContact, 'Should contain shielded ZEC contact');
    assert.ok(zecContact.address.startsWith('u1'), 'Shielded contact should be ZIP 316 unified address');
    assert.strictEqual(zecContact.isVerified, true, 'Default contacts should have isVerified true');
  });

  test('Address Book: saves and deletes user contacts seamlessly', () => {
    const newContact = saveContact({
      name: 'Arbitrum Treasury Safe',
      address: '0x1714400ff23db4af5926fd1be2234f9a739f7022',
      chain: 'arb',
      tag: 'Treasury',
    });

    assert.ok(newContact.id.startsWith('contact_'), 'Contact ID should be generated');
    assert.strictEqual(newContact.name, 'Arbitrum Treasury Safe');
    assert.strictEqual(newContact.chain, 'arb');

    const all = getSavedContacts();
    const found = all.find(c => c.id === newContact.id);
    assert.ok(found, 'Saved contact should be found in contacts list');

    deleteContact(newContact.id);
    const afterDelete = getSavedContacts();
    assert.strictEqual(afterDelete.some(c => c.id === newContact.id), false, 'Deleted contact should be removed');
  });

  test('Web3 Domain Resolver: resolves .eth ENS domains to checksummed EVM addresses', () => {
    const vitalik = resolveWeb3Domain('vitalik.eth');
    assert.ok(vitalik, 'vitalik.eth should resolve');
    assert.strictEqual(vitalik.domain, 'vitalik.eth');
    assert.strictEqual(vitalik.resolvedAddress.toLowerCase(), '0xd8da6bf26964af9d7eed9e03e53415d37aa96045');
    assert.strictEqual(vitalik.source, 'ENS');

    const arbitrary = resolveWeb3Domain('mycustomwallet.eth');
    assert.ok(arbitrary, 'arbitrary .eth should resolve deterministically');
    assert.ok(arbitrary.resolvedAddress.startsWith('0x'), 'Should resolve to EVM hex address');
    assert.strictEqual(arbitrary.resolvedAddress.length, 42, 'EVM address should be 42 characters');
  });

  test('Web3 Domain Resolver: resolves .sol SNS domains to Solana base58 addresses', () => {
    const toly = resolveWeb3Domain('toly.sol');
    assert.ok(toly, 'toly.sol should resolve');
    assert.strictEqual(toly.domain, 'toly.sol');
    assert.strictEqual(toly.source, 'SNS');
    assert.ok(toly.resolvedAddress.length >= 32, 'Solana address should be valid length');

    const customSol = resolveWeb3Domain('superteam.sol');
    assert.ok(customSol, 'custom .sol should resolve');
    assert.strictEqual(customSol.source, 'SNS');
    assert.ok(customSol.resolvedAddress.length >= 32, 'Custom sol address should be valid length');
  });

  test('Web3 Domain Resolver: resolves .zec domain to pure shielded Orchard Unified Address', () => {
    const zecDomain = resolveWeb3Domain('anonymous.zec');
    assert.ok(zecDomain, 'anonymous.zec should resolve');
    assert.strictEqual(zecDomain.source, 'ZNS');
    assert.ok(zecDomain.resolvedAddress.startsWith('u1'), 'ZEC domain must resolve to shielded u1 address');
  });

  test('Web3 Domain Resolver: returns null for raw addresses without domain extensions', () => {
    const rawEvm = resolveWeb3Domain('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
    assert.strictEqual(rawEvm, null, 'Raw EVM address should not be treated as a domain');

    const rawSol = resolveWeb3Domain('86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY');
    assert.strictEqual(rawSol, null, 'Raw Solana address should not be treated as a domain');
  });

  test('WebAuthn Passkeys: enrollment, verification, and clear lifecycle', async () => {
    clearPasskey();
    assert.strictEqual(hasRegisteredPasskey(), false, 'Passkey should be initially false after clear');

    const testUa = 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6';
    const regRes = await registerPasskey(testUa);
    assert.strictEqual(regRes.success, true, 'Passkey registration should succeed');
    assert.ok(regRes.credentialId, 'Should return valid credential ID');
    assert.strictEqual(hasRegisteredPasskey(), true, 'hasRegisteredPasskey should be true after enrollment');

    const authRes = await authenticateWithPasskey();
    assert.strictEqual(authRes.success, true, 'Passkey authentication should succeed');

    clearPasskey();
    assert.strictEqual(hasRegisteredPasskey(), false, 'hasRegisteredPasskey should be false after clear');
  });

});
