
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  label, 
  className,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "w-full px-4 py-3 bg-white rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
