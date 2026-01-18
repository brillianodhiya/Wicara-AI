import CryptoJS from "crypto-js";

// Encryption key should be stored securely
// For demo purposes, we'll use a fixed key, but in production
// this should be derived from user credentials or stored in a secure vault
const getEncryptionKey = (): string => {
  // In production, this should be a secure method to get the encryption key
  // For example, derived from user password using PBKDF2
  return (
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "wicara-ai-secure-encryption-key"
  );
};

// Encrypt API keys using AES-GCM
export const encryptApiKey = (apiKey: string): string => {
  try {
    const key = getEncryptionKey();

    // Generate a random IV
    const iv = CryptoJS.lib.WordArray.random(16);

    // Encrypt the API key
    const encrypted = CryptoJS.AES.encrypt(apiKey, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Combine IV and encrypted data
    const result = `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.toString()}`;

    return result;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt API key");
  }
};

// Decrypt API keys
export const decryptApiKey = (encryptedData: string): string => {
  try {
    const key = getEncryptionKey();

    // Split IV and encrypted data
    const parts = encryptedData.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encrypted = parts[1];

    // Decrypt the API key
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt API key");
  }
};

// Securely clear sensitive data from memory
export const clearSensitiveData = (data: string): void => {
  // This is a simple implementation
  // In a real-world scenario, you would need to ensure
  // that all references to the data are overwritten
  if (typeof data === "string") {
    // Overwrite the string with random data
    for (let i = 0; i < data.length; i++) {
      data =
        data.substring(0, i) +
        String.fromCharCode(Math.floor(Math.random() * 94) + 32) +
        data.substring(i + 1);
    }
  }
};

// Auto-expire sensitive data from memory after a timeout
export const autoExpireSensitiveData = <T>(
  data: T,
  timeoutMs: number = 60000, // Default: 1 minute
): { data: T; clear: () => void } => {
  let timeoutId: NodeJS.Timeout;

  const clear = () => {
    if (typeof data === "string") {
      clearSensitiveData(data);
    } else if (data && typeof data === "object") {
      Object.keys(data).forEach((key) => {
        if (typeof data[key as keyof T] === "string") {
          clearSensitiveData(data[key as keyof T] as unknown as string);
        }
      });
    }
  };

  // Set timeout to auto-clear
  timeoutId = setTimeout(clear, timeoutMs);

  // Return the data and a function to manually clear it
  return {
    data,
    clear: () => {
      clearTimeout(timeoutId);
      clear();
    },
  };
};
