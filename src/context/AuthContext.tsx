import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string, confirmPassword: string) => boolean;
  register: (username: string, password: string, confirmPassword: string) => boolean;
  logout: () => void;
  lastActivity: number | null;
  updateLastActivity: () => void;
  hasRegistered: boolean;
}

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "password123";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [lastActivity, setLastActivity] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const registeredStatus = localStorage.getItem("hasRegistered");
    
    if (authStatus === "true") {
      setIsAuthenticated(true);
      updateLastActivity();
    }
    
    if (registeredStatus === "true") {
      setHasRegistered(true);
    }
  }, []);

  const register = (username: string, password: string, confirmPassword: string): boolean => {
    if (!username.trim()) {
      toast({
        title: "Registration failed",
        description: "Username is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }
    
    if (password.length < 6) {
      toast({
        title: "Registration failed",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }
    
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localStorage.setItem("hasRegistered", "true");
    setHasRegistered(true);
    
    toast({
      title: "Registration successful",
      description: "Your account has been created",
    });
    
    return true;
  };

  const login = (username: string, password: string, confirmPassword: string): boolean => {
    if (!hasRegistered) {
      return register(username, password, confirmPassword);
    }
    
    const storedUsername = localStorage.getItem("username") || DEFAULT_USERNAME;
    const storedPassword = localStorage.getItem("password") || DEFAULT_PASSWORD;
    
    if (username === storedUsername && password === storedPassword) {
      setIsAuthenticated(true);
      updateLastActivity();
      localStorage.setItem("isAuthenticated", "true");
      return true;
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid username or password",
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
        register,
        logout,
        lastActivity,
        updateLastActivity,
        hasRegistered,
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
