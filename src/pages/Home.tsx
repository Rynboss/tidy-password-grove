
import React, { useEffect } from "react";
import { PlusCircle, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import CategoryCard from "@/components/CategoryCard";
import { useAuth } from "@/context/AuthContext";
import { usePasswords } from "@/context/PasswordContext";

const Home: React.FC = () => {
  const { logout, updateLastActivity } = useAuth();
  const { passwords } = usePasswords();
  const navigate = useNavigate();

  // Update last activity timestamp to prevent auto-logout
  useEffect(() => {
    updateLastActivity();
  }, [updateLastActivity]);

  // Count passwords by category
  const categoryCount = {
    work: passwords.filter(pass => pass.category === "work").length,
    social: passwords.filter(pass => pass.category === "social").length,
    banking: passwords.filter(pass => pass.category === "banking").length,
    others: passwords.filter(pass => pass.category === "others").length,
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout title="Password Manager">
      <motion.div 
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CategoryCard
            key="work"
            title="Work"
            count={categoryCount.work}
            type="work" 
            className="bg-blue-50 border-blue-200 text-blue-600"
            animationDelay="0s"
          />
          <CategoryCard
            key="social"
            title="Social"
            count={categoryCount.social}
            type="social"
            className="bg-purple-50 border-purple-200 text-purple-600"
            animationDelay="0.1s"
          />
          <CategoryCard
            key="banking"
            title="Banking"
            count={categoryCount.banking}
            type="banking"
            className="bg-green-50 border-green-200 text-green-600"
            animationDelay="0.2s"
          />
          <CategoryCard
            key="others"
            title="Others"
            count={categoryCount.others}
            type="others"
            className="bg-amber-50 border-amber-200 text-amber-600"
            animationDelay="0.3s"
          />
        </div>

        <div className="flex justify-center">
          <Link 
            to="/add"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] animate-fade-in"
          >
            <PlusCircle size={20} />
            Add New Password
          </Link>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Home;
