// src/encryption/decrypt.js
// Usage
// -----------------------------------------------------------------
// node decrypt.js "<encrypted_value>"
// -----------------------------------------------------------------

const CryptoJS = require('crypto-js')

// Encryption key
const encryptionKey = 'ABCEDE683E783A327B68C887FDBC1XYZ'

// Encrypt function
function encrypt(data) {
  const plaintext = typeof data === 'string' ? data : JSON.stringify(data) // Ensure input is a string
  const key = CryptoJS.enc.Utf8.parse(encryptionKey) // Parse the key
  const iv = CryptoJS.lib.WordArray.random(16) // Generate a random IV

  // Perform AES encryption
  const ciphertext = CryptoJS.AES.encrypt(plaintext, key, { iv }).toString()

  // Return the IV (Base64) and the ciphertext, separated by ":"
  return iv.toString(CryptoJS.enc.Base64) + ':' + ciphertext
}

// Decrypt function
function decrypt(data) {
  const [ivBase64, ciphertext] = data.split(':') // Split the input into IV and ciphertext
  const key = CryptoJS.enc.Utf8.parse(encryptionKey) // Parse the key
  const iv = CryptoJS.enc.Base64.parse(ivBase64) // Parse the IV from Base64

  // Perform AES decryption
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv }).toString(
    CryptoJS.enc.Utf8
  )

  try {
    // Attempt to parse as JSON (to handle objects)
    return JSON.parse(decrypted)
  } catch (err) {
    // Return as plain text if JSON parsing fails
    return decrypted
  }
}

// Test decrypt → encrypt round-trip
function testDecryptEncryptRoundTrip(encryptedValue) {
  // Step 1: Decrypt the encrypted value
  const decryptedPlaintext = decrypt(encryptedValue)
  console.log('Decrypted Plaintext:', decryptedPlaintext)

  // Step 2: Encrypt the plaintext again
  const reEncryptedValue = encrypt(decryptedPlaintext)
  console.log('Re-Encrypted Value:', reEncryptedValue)

  // Step 3: Validate round-trip
  const decryptedAgain = decrypt(reEncryptedValue)
  console.log('Decrypted Again (from re-encrypted value):', decryptedAgain)

  console.log(
    'Round-trip Successful:',
    JSON.stringify(decryptedPlaintext) === JSON.stringify(decryptedAgain)
  )
}

// Get encrypted value from command-line arguments or use a default value
const defaultEncryptedValue =
  '6ake7UEkywqSXTLHcr/OJg==:QH7urVCy82Vm+0Va75jigiWPi6SrDGFMzHD9pGa41d63fepqR/68LRZFWih1rZ0z'
const encryptedValue = process.argv[2] || defaultEncryptedValue

// Run the test
testDecryptEncryptRoundTrip(encryptedValue)
