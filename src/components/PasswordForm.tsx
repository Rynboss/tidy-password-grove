
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswords } from "@/context/PasswordContext";
import PasswordInput from "./PasswordInput";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "work", label: "Work" },
  { value: "social", label: "Social" },
  { value: "banking", label: "Banking" },
  { value: "others", label: "Others" },
];

const PasswordForm: React.FC = () => {
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("others");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addPassword } = usePasswords();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service || !username || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addPassword({
        service,
        username,
        password,
        category,
      });
      
      navigate("/home");
    } catch (error) {
      console.error("Error saving password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 animate-slide-up">
      <div className="space-y-4">
        <div>
          <label htmlFor="service" className="block text-sm font-medium mb-2">
            Service Name
          </label>
          <input
            id="service"
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
            placeholder="e.g., Gmail, Netflix, Bank"
            required
          />
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username / Email
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
            placeholder="e.g., john.doe@example.com"
            required
          />
        </div>
        
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="Enter password"
          required
        />
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <Check className="mr-2 h-5 w-5" />
            Save Password
          </>
        )}
      </button>
    </form>
  );
};

export default PasswordForm;
