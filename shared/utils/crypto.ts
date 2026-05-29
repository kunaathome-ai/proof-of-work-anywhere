import crypto from 'crypto';

export async function sha256(data: Buffer | string): Promise<string> {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    }, (err, publicKey, privateKey) => {
      if (err) reject(err);
      else resolve({ publicKey, privateKey });
    });
  });
}

export function sign(data: string, privateKey: string): string {
  return crypto.createSign('SHA256').update(data).sign(privateKey, 'base64');
}

export function verify(data: string, signature: string, publicKey: string): boolean {
  return crypto.createVerify('SHA256').update(data).verify(publicKey, signature, 'base64');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function encrypt(data: string, key: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    encrypted: encrypted + authTag.toString('hex'),
    iv: iv.toString('hex')
  };
}

export function decrypt(encrypted: string, key: string, iv: string): string {
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  const authTag = Buffer.from(encrypted.slice(-32), 'hex');
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted.slice(0, -32), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
