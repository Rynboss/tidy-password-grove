
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import Layout from "@/components/Layout";
import CategoryCard from "@/components/CategoryCard";
import { usePasswords } from "@/context/PasswordContext";
import { useAuth } from "@/context/AuthContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getPasswordCount } = usePasswords();
  const { logout } = useAuth();

  const categories = [
    { id: "work", title: "Work", type: "work" as const },
    { id: "social", title: "Social", type: "social" as const },
    { id: "banking", title: "Banking", type: "banking" as const },
    { id: "others", title: "Others", type: "others" as const },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Layout title="Password Manager">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </button>
      </div>

      <div className="mb-8">
        <button
          onClick={() => navigate("/add")}
          className="w-full bg-primary text-primary-foreground py-3.5 px-4 rounded-xl font-medium transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Password
        </button>
      </div>

      <h2 className="text-xl font-medium mb-4">Categories</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            count={getPasswordCount(category.id)}
            type={category.type}
            className={`animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
