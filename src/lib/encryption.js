import * as forge from 'node-forge';

/**
 * Encrypt data using RSA public key with OAEP padding
 * @param {string} data - Data to encrypt
 * @param {string} publicKeyPem - Public key in PEM format
 * @returns {string} Base64 encoded encrypted data
 */
export function encryptData(data, publicKeyPem) {
  try {
    console.log('🔐 Starting encryption...', {
      dataLength: data.length,
      publicKeyLength: publicKeyPem?.length || 0
    });

    if (!data || !publicKeyPem) {
      throw new Error('Data and public key are required');
    }

    // Clean the public key - remove headers/footers and normalize
    const cleanPublicKey = publicKeyPem
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/-----BEGIN CERTIFICATE-----/g, '')
      .replace(/-----END CERTIFICATE-----/g, '')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .trim();

    if (!cleanPublicKey) {
      throw new Error('Invalid public key format');
    }

    // Reconstruct the public key with proper headers
    const formattedPublicKey = `-----BEGIN PUBLIC KEY-----\n${cleanPublicKey}\n-----END PUBLIC KEY-----`;
    
    console.log('Public key formatted for encryption');

    // Convert the public key from PEM format
    const publicKey = forge.pki.publicKeyFromPem(formattedPublicKey);
    
    // Encrypt the data using RSA-OAEP with SHA-1
    const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha1.create(),
      mgf1: {
        md: forge.md.sha1.create()
      }
    });
    
    // Convert to base64
    const encryptedBase64 = forge.util.encode64(encrypted);
    
    console.log('✅ Data encrypted successfully', {
      originalLength: data.length,
      encryptedLength: encryptedBase64.length
    });

    return encryptedBase64;
  } catch (error) {
    console.error('❌ Encryption error:', error);
    throw new Error(`Failed to encrypt data: ${error.message}`);
  }
}

/**
 * Generate UUID for request tracking
 * @returns {string} UUID v4
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}