
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Key, User } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const { login, isAuthenticated, hasRegistered } = useAuth();
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
      const success = login(username, password, confirmPassword);
      if (success) {
        navigate("/home");
      }
      setIsLoading(false);
    }, 600);
  };

  // Show account selection screen if user hasn't made a choice yet
  if (hasAccount === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 page-transition-enter">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full animate-pulse-slow">
                <Shield className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-3xl font-semibold mb-2">Welcome to Secure Vault</h1>
            <p className="text-muted-foreground mb-6">
              Your personal password manager
            </p>
            
            <div className="space-y-4 mt-6">
              <button
                onClick={() => setHasAccount(true)}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
              >
                I already have an account
              </button>
              
              <button
                onClick={() => setHasAccount(false)}
                className="w-full bg-white border border-input text-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
              >
                I need to create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {hasAccount 
              ? "Enter your credentials to unlock your passwords" 
              : "Create an account to get started"}
          </p>
        </div>

        <div className="glass p-6 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                    placeholder="Enter username"
                    required
                    autoFocus
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Master Password"
                placeholder="Enter password"
                required
              />

              {!hasAccount && (
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  required
                />
              )}
            </div>
            
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
                  {hasAccount ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-border text-center">
            <button 
              onClick={() => setHasAccount(!hasAccount)} 
              className="text-sm text-primary hover:underline"
            >
              {hasAccount ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>

            {hasAccount && hasRegistered && (
              <p className="text-xs text-center text-muted-foreground mt-4">
                Demo hint: The default username is "admin" and password is "password123"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
