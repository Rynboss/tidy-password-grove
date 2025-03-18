
// Note: In a production app, you'd want to use a proper encryption library
// and store the encryption key securely. This is a simple implementation
// for demo purposes only.

const ENCRYPTION_KEY = "YourSecureEncryptionKey123!";

export function encrypt(data: string): string {
  try {
    // Simple XOR encryption for demo
    let result = "";
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result); // Base64 encode the result
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
}

export function decrypt(encryptedData: string): string {
  try {
    const data = atob(encryptedData); // Base64 decode
    let result = "";
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error("Decryption error:", error);
    return "";
  }
}
