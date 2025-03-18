
import React, { useState } from "react";
import { Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { usePasswords } from "@/context/PasswordContext";
import { useToast } from "@/hooks/use-toast";

interface PasswordItemProps {
  id: string;
  service: string;
  username: string;
  password: string;
}

const PasswordItem: React.FC<PasswordItemProps> = ({
  id,
  service,
  username,
  password,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { deletePassword } = usePasswords();
  const { toast } = useToast();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(username);
    toast({
      title: "Username copied",
      description: "The username has been copied to clipboard",
      duration: 2000,
    });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Password copied",
      description: "The password has been copied to clipboard",
      duration: 2000,
    });
  };

  const handleDelete = () => {
    deletePassword(id);
    toast({
      title: "Password deleted",
      description: "The password has been deleted successfully",
      duration: 2000,
    });
  };

  return (
    <div className="glass w-full p-4 rounded-xl animate-scale-in">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-foreground">{service}</h3>
        <button
          onClick={handleDelete}
          className="p-1 rounded-full hover:bg-destructive/10 transition-colors"
          aria-label="Delete password"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Username</p>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{username}</span>
            <button
              onClick={handleCopyUsername}
              className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Copy username"
            >
              <Copy className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Password</p>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">
              {showPassword ? password : "•".repeat(password.length)}
            </span>
            <button
              onClick={toggleShowPassword}
              className="p-1.5 rounded-full hover:bg-primary/10 transition-colors mr-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-primary" />
              )}
            </button>
            <button
              onClick={handleCopyPassword}
              className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Copy password"
            >
              <Copy className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordItem;
