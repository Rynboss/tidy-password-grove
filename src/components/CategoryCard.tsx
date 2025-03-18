
import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Building2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  count: number;
  type: "work" | "social" | "banking" | "others";
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  count, 
  type,
  className 
}) => {
  const navigate = useNavigate();

  const getCategoryIcon = () => {
    switch (type) {
      case "work":
        return <Briefcase className="w-6 h-6 text-primary" aria-hidden="true" />;
      case "social":
        return <Users className="w-6 h-6 text-primary" aria-hidden="true" />;
      case "banking":
        return <Building2 className="w-6 h-6 text-primary" aria-hidden="true" />;
      case "others":
      default:
        return <Package className="w-6 h-6 text-primary" aria-hidden="true" />;
    }
  };

  return (
    <button
      onClick={() => navigate(`/view/${type}`)}
      className={cn(
        "glass w-full p-5 rounded-xl flex flex-col items-start space-y-2 transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
        className
      )}
    >
      <div className="p-2 bg-primary-light rounded-lg">
        {getCategoryIcon()}
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">
        {count} {count === 1 ? "password" : "passwords"}
      </p>
    </button>
  );
};

export default CategoryCard;
