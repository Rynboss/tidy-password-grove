
import React, { createContext, useContext, useState, useEffect } from "react";
import { encrypt, decrypt } from "@/utils/encryption";

export interface Password {
  id: string;
  service: string;
  username: string;
  password: string;
  category: string;
  createdAt: string;
}

interface PasswordContextType {
  passwords: Password[];
  addPassword: (password: Password) => void;
  deletePassword: (id: string) => void;
  getPasswordsByCategory: (category: string) => Password[];
  getPasswordCount: (category: string) => number;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passwords, setPasswords] = useState<Password[]>([]);

  // Load passwords from local storage
  useEffect(() => {
    const encryptedPasswords = localStorage.getItem("passwords");
    if (encryptedPasswords) {
      try {
        const decryptedData = decrypt(encryptedPasswords);
        const parsedPasswords = JSON.parse(decryptedData);
        setPasswords(Array.isArray(parsedPasswords) ? parsedPasswords : []);
      } catch (error) {
        console.error("Error loading passwords:", error);
        setPasswords([]);
      }
    }
  }, []);

  // Save passwords to local storage whenever they change
  useEffect(() => {
    if (passwords.length > 0) {
      const encryptedData = encrypt(JSON.stringify(passwords));
      localStorage.setItem("passwords", encryptedData);
    }
  }, [passwords]);

  const addPassword = (password: Password) => {
    setPasswords([...passwords, password]);
  };

  const deletePassword = (id: string) => {
    setPasswords(passwords.filter((password) => password.id !== id));
  };

  const getPasswordsByCategory = (category: string) => {
    return passwords.filter((password) => password.category === category);
  };

  const getPasswordCount = (category: string) => {
    return passwords.filter((password) => password.category === category).length;
  };

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        addPassword,
        deletePassword,
        getPasswordsByCategory,
        getPasswordCount,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswords = (): PasswordContextType => {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error("usePasswords must be used within a PasswordProvider");
  }
  return context;
};
