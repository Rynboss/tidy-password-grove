
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PasswordItem from "@/components/PasswordItem";
import { usePasswords } from "@/context/PasswordContext";
import { Plus } from "lucide-react";

const ViewPasswords: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { getPasswordsByCategory } = usePasswords();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState<any[]>([]);

  useEffect(() => {
    if (category) {
      setPasswords(getPasswordsByCategory(category));
    }
  }, [category, getPasswordsByCategory]);

  const getCategoryTitle = () => {
    switch (category) {
      case "work":
        return "Work";
      case "social":
        return "Social";
      case "banking":
        return "Banking";
      case "others":
        return "Others";
      default:
        return "Passwords";
    }
  };

  return (
    <Layout title={getCategoryTitle()} showBackButton>
      <div className="space-y-6">
        {passwords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">
              No passwords found in this category
            </p>
            <button
              onClick={() => navigate("/add")}
              className="bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Password
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {passwords.map((password, index) => (
              <div 
                key={password.id} 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <PasswordItem
                  id={password.id}
                  service={password.service}
                  username={password.username}
                  password={password.password}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewPasswords;
