
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  addPassword: (password: Omit<Password, "id" | "createdAt">) => Promise<void>;
  deletePassword: (id: string) => Promise<void>;
  getPasswordsByCategory: (category: string) => Password[];
  getPasswordCount: (category: string) => number;
  isLoading: boolean;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Fetch passwords from Supabase whenever the authentication state changes
  useEffect(() => {
    const fetchPasswords = async () => {
      if (!isAuthenticated || !user) {
        setPasswords([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("passwords")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching passwords:", error);
          toast({
            title: "Error loading passwords",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Transform the data to match our Password interface
        const formattedPasswords = data.map((item) => ({
          id: item.id,
          service: item.service,
          username: item.username,
          password: item.password,
          category: item.category,
          createdAt: item.created_at,
        }));

        setPasswords(formattedPasswords);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPasswords();
  }, [isAuthenticated, user, toast]);

  // Add a new password to Supabase
  const addPassword = async (passwordData: Omit<Password, "id" | "createdAt">) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save passwords",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.from("passwords").insert([
        {
          user_id: user.id,
          service: passwordData.service,
          username: passwordData.username,
          password: passwordData.password,
          category: passwordData.category,
        },
      ]).select();

      if (error) {
        console.error("Error adding password:", error);
        toast({
          title: "Error saving password",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const newPassword: Password = {
          id: data[0].id,
          service: data[0].service,
          username: data[0].username,
          password: data[0].password,
          category: data[0].category,
          createdAt: data[0].created_at,
        };

        setPasswords([newPassword, ...passwords]);
        
        toast({
          title: "Password saved",
          description: "Your password has been securely saved",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // Delete a password from Supabase
  const deletePassword = async (id: string) => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const { error } = await supabase.from("passwords").delete().eq("id", id);

      if (error) {
        console.error("Error deleting password:", error);
        toast({
          title: "Error deleting password",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setPasswords(passwords.filter((password) => password.id !== id));
      
      toast({
        title: "Password deleted",
        description: "Your password has been deleted successfully",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
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
        isLoading,
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
