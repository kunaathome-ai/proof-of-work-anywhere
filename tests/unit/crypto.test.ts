import { sha256, generateKeyPair, sign, verify, generateToken } from '../../shared/utils/crypto';

describe('Crypto Utils', () => {
  describe('sha256', () => {
    it('should generate SHA-256 hash', async () => {
      const data = 'test data';
      const hash = await sha256(data);
      expect(hash).toHaveLength(64);
      expect(typeof hash).toBe('string');
    });

    it('should generate consistent hashes', async () => {
      const data = 'test data';
      const hash1 = await sha256(data);
      const hash2 = await sha256(data);
      expect(hash1).toBe(hash2);
    });
  });

  describe('generateKeyPair', () => {
    it('should generate RSA key pair', async () => {
      const keyPair = await generateKeyPair();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(keyPair.privateKey).toContain('BEGIN PRIVATE KEY');
    });
  });

  describe('sign and verify', () => {
    it('should sign and verify data', async () => {
      const keyPair = await generateKeyPair();
      const data = 'test data';
      const signature = sign(data, keyPair.privateKey);
      const isValid = verify(data, signature, keyPair.publicKey);
      expect(isValid).toBe(true);
    });

    it('should fail verification with wrong data', async () => {
      const keyPair = await generateKeyPair();
      const data = 'test data';
      const signature = sign(data, keyPair.privateKey);
      const isValid = verify('wrong data', signature, keyPair.publicKey);
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate random token', () => {
      const token = generateToken();
      expect(token).toHaveLength(64);
      expect(typeof token).toBe('string');
    });

    it('should generate unique tokens', () => {
      const token1 = generateToken();
      const token2 = generateToken();
      expect(token1).not.toBe(token2);
    });
  });
});
