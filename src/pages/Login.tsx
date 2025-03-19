
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Key, User } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (isLoginMode) {
        success = await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        
        success = await signup(email, password);
      }
      
      if (success) {
        navigate("/home");
      }
    } catch (error: any) {
      // Error is handled in login/signup functions
    } finally {
      setIsLoading(false);
    }
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
            {isLoginMode 
              ? "Enter your credentials to unlock your passwords" 
              : "Create an account to get started"}
          </p>
        </div>

        <div className="glass p-6 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                    placeholder="Enter your email"
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
                label="Password"
                placeholder="Enter password"
                required
              />

              {!isLoginMode && (
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
                  {isLoginMode ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-border text-center">
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)} 
              className="text-sm text-primary hover:underline"
            >
              {isLoginMode ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
