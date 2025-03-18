
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Key } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading to show animation
    setTimeout(() => {
      const success = login(password);
      if (success) {
        navigate("/home");
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 page-transition-enter">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full animate-pulse-slow">
              <Shield className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl font-semibold mb-2">Secure Vault</h1>
          <p className="text-muted-foreground">
            Enter your master password to unlock your passwords
          </p>
        </div>

        <div className="glass p-6 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Master password"
              required
              autoFocus
              className="text-center"
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Key className="mr-2 h-5 w-5" />
                  Unlock
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Demo hint: The password is "password123"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
