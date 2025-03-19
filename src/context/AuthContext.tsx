import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  lastActivity: number | null;
  updateLastActivity: () => void;
  sendOTP: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, token: string) => Promise<boolean>;
  resendOTP: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [lastActivity, setLastActivity] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session) {
        updateLastActivity();
      }
    });

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session) {
        updateLastActivity();
      }
    };

    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email for a confirmation link before logging in",
            variant: "destructive",
          });
        } else if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
        }
        console.log("Login error:", error.message);
        return false;
      }

      setSession(data.session);
      setUser(data.user);
      setIsAuthenticated(true);
      updateLastActivity();
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Authentication failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        console.log("Signup error:", error.message);
        return false;
      }

      if (!data.session) {
        toast({
          title: "Verification required",
          description: "Please check your email for a confirmation link",
        });
        return true;
      }

      setSession(data.session);
      setUser(data.user);
      setIsAuthenticated(true);
      updateLastActivity();
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      return true;
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setLastActivity(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const sendOTP = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) {
        toast({
          title: "OTP sending failed",
          description: error.message,
          variant: "destructive",
        });
        console.log("OTP sending error:", error.message);
        return false;
      }

      toast({
        title: "OTP sent",
        description: "Please check your email for the OTP",
      });
      return true;
    } catch (error: any) {
      console.error("Unexpected OTP sending error:", error);
      toast({
        title: "OTP sending failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const resendOTP = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        toast({
          title: "OTP resending failed",
          description: error.message,
          variant: "destructive",
        });
        console.log("OTP resending error:", error.message);
        return false;
      }

      toast({
        title: "OTP resent",
        description: "Please check your email for the new OTP",
      });
      return true;
    } catch (error: any) {
      console.error("Unexpected OTP resending error:", error);
      toast({
        title: "OTP resending failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const verifyOTP = async (email: string, token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        toast({
          title: "OTP verification failed",
          description: error.message,
          variant: "destructive",
        });
        console.log("OTP verification error:", error.message);
        return false;
      }

      setSession(data.session);
      setUser(data.user);
      setIsAuthenticated(true);
      updateLastActivity();
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error: any) {
      console.error("Unexpected OTP verification error:", error);
      toast({
        title: "OTP verification failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateLastActivity = () => {
    setLastActivity(Date.now());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        session,
        login,
        signup,
        logout,
        lastActivity,
        updateLastActivity,
        sendOTP,
        verifyOTP,
        resendOTP,
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
