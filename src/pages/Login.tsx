
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Key, User, AlertCircle, Mail, RefreshCw } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useOTP, setUseOTP] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCounter, setResendCounter] = useState(0);
  const { login, signup, isAuthenticated, sendOTP, verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: number | null = null;
    
    if (resendDisabled && resendCounter > 0) {
      interval = window.setInterval(() => {
        setResendCounter((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendDisabled, resendCounter]);

  const validateInputs = () => {
    setErrorMessage(null);
    
    if (!email || !email.includes('@')) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    
    if (!useOTP && !password) {
      setErrorMessage("Please enter your password");
      return false;
    }
    
    if (!useOTP && !isLoginMode) {
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long");
        return false;
      }
      
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (useOTP && showOTPInput) {
        // Verify OTP
        success = await verifyOTP(email, otp);
      } else if (useOTP) {
        // Send OTP
        success = await sendOTP(email);
        if (success) {
          setShowOTPInput(true);
          startResendCountdown();
        }
      } else if (isLoginMode) {
        // Regular login
        console.log("Attempting login with:", email);
        success = await login(email, password);
      } else {
        // Regular signup
        console.log("Attempting signup with:", email);
        success = await signup(email, password);
      }
      
      if (success && !useOTP) {
        navigate("/home");
      } else if (success && useOTP && !showOTPInput) {
        // OTP sent successfully, now wait for user to enter it
      } else if (success && useOTP && showOTPInput) {
        // OTP verified successfully
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setIsLoading(true);
    const success = await resendOTP(email);
    setIsLoading(false);
    
    if (success) {
      startResendCountdown();
    }
  };

  const startResendCountdown = () => {
    setResendDisabled(true);
    setResendCounter(60); // 60 seconds countdown
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setUseOTP(false);
    setShowOTPInput(false);
    setErrorMessage(null);
  };

  const toggleOTP = () => {
    setUseOTP(!useOTP);
    setShowOTPInput(false);
    setErrorMessage(null);
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

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

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
                    disabled={showOTPInput}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              {showOTPInput ? (
                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-medium mb-2">
                    One-Time Password
                  </label>
                  <div className="flex flex-col items-center space-y-4">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      className="w-full"
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    
                    <div className="text-center">
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={resendDisabled || isLoading}
                        onClick={handleResendOTP}
                        className="text-sm"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {resendDisabled 
                          ? `Resend in ${resendCounter}s` 
                          : "Resend OTP"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {!useOTP && (
                    <>
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
                    </>
                  )}
                </>
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
                  {useOTP ? (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      {showOTPInput ? "Verify OTP" : "Send OTP"}
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-5 w-5" />
                      {isLoginMode ? "Sign In" : "Create Account"}
                    </>
                  )}
                </>
              )}
            </button>
            
            {!showOTPInput && (
              <div className="pt-4 border-t border-border text-center">
                <button 
                  type="button"
                  onClick={toggleOTP}
                  className="text-sm text-primary hover:underline mb-3 block w-full"
                >
                  {useOTP 
                    ? "Use password instead" 
                    : `Use one-time password (OTP) ${isLoginMode ? "to login" : "to register"}`}
                </button>
                
                <button 
                  type="button"
                  onClick={switchMode} 
                  className="text-sm text-primary hover:underline"
                >
                  {isLoginMode ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
