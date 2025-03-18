
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Master password for demo purposes (in a real app, this would be securely stored)
const MASTER_PASSWORD = "password123";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  lastActivity: number | null;
  updateLastActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastActivity, setLastActivity] = useState<number | null>(null);
  const { toast } = useToast();

  // Check if user was previously authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      updateLastActivity();
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === MASTER_PASSWORD) {
      setIsAuthenticated(true);
      updateLastActivity();
      localStorage.setItem("isAuthenticated", "true");
      return true;
    } else {
      toast({
        title: "Authentication failed",
        description: "The master password is incorrect",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setLastActivity(null);
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const updateLastActivity = () => {
    setLastActivity(Date.now());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        lastActivity,
        updateLastActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
