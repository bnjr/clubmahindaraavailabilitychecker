// src/background/utils.ts
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from './constants';

// Encrypt function
export function encrypt(data: string | object) {
  const plaintext = typeof data === 'string' ? data : JSON.stringify(data); // Ensure input is a string
  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY); // Parse the key
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV


  // Perform AES encryption
  const ciphertext = CryptoJS.AES.encrypt(plaintext, key, { iv }).toString();

  // Return the IV (Base64) and the ciphertext, separated by ":"
  return iv.toString(CryptoJS.enc.Base64) + ':' + ciphertext;
}

// Decrypt function
export function decrypt(data: string): string | object {
  const [ivBase64, ciphertext] = data.split(':'); // Split the input into IV and ciphertext
  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY); // Parse the key
  const iv = CryptoJS.enc.Base64.parse(ivBase64); // Parse the IV from Base64


  // Perform AES decryption
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv }).toString(
    CryptoJS.enc.Utf8
  );

  try {
    // Attempt to parse as JSON (to handle objects)
    return JSON.parse(decrypted);
  } catch (err) {
    // Return as plain text if JSON parsing fails
    return decrypted;
  }
}

function decodeJwtPayload(token: string): any {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

    // Parse the JSON payload
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT payload:', error);
    return null;
  }
}

export function getExpiryDateFromToken(token: string): Date | null {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) {
    return null;
  }

  // Convert the `exp` timestamp to a Date object
  return new Date(payload.exp * 1000); // Multiply by 1000 to convert seconds to milliseconds
}

export function isTokenExpired(token: string): boolean {
  const expiryDate = getExpiryDateFromToken(token);
  if (!expiryDate) {
    return true; // If expiry date is missing or invalid, assume token is expired
  }

  // Compare the current time with the expiry time
  return expiryDate.getTime() <= Date.now();
}
