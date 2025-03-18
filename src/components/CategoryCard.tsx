
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Globe, CreditCard, Folder } from "lucide-react";

export type CategoryType = "work" | "social" | "banking" | "others";

export interface CategoryCardProps {
  title: string;
  count: number;
  type: CategoryType;
  className: string;
  animationDelay: string;
}

const getCategoryIcon = (type: CategoryType) => {
  switch (type) {
    case "work":
      return <Briefcase className="h-5 w-5" />;
    case "social":
      return <Globe className="h-5 w-5" />;
    case "banking":
      return <CreditCard className="h-5 w-5" />;
    case "others":
      return <Folder className="h-5 w-5" />;
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  count, 
  type, 
  className,
  animationDelay 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: parseFloat(animationDelay) }}
    >
      <Link 
        to={`/view/${type}`}
        className={`block p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${className}`}
        style={{ animationDelay }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="bg-white p-2 rounded-lg">
            {getCategoryIcon(type)}
          </div>
          <span className="text-xs opacity-70">View All</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-80">{count} passwords</span>
          <ArrowRight className="h-4 w-4 opacity-60" />
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
