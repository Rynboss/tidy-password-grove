
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showBackButton = false,
  title,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, lastActivity, updateLastActivity } = useAuth();
  
  // Auto logout after 5 minutes of inactivity
  const AUTO_LOGOUT_TIME = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (isAuthenticated) {
      const handleUserActivity = () => {
        updateLastActivity();
      };

      window.addEventListener("mousemove", handleUserActivity);
      window.addEventListener("keydown", handleUserActivity);
      window.addEventListener("touchstart", handleUserActivity);

      const checkInactivity = setInterval(() => {
        if (lastActivity && Date.now() - lastActivity > AUTO_LOGOUT_TIME) {
          logout();
          navigate("/");
        }
      }, 60000); // Check every minute

      return () => {
        window.removeEventListener("mousemove", handleUserActivity);
        window.removeEventListener("keydown", handleUserActivity);
        window.removeEventListener("touchstart", handleUserActivity);
        clearInterval(checkInactivity);
      };
    }
  }, [isAuthenticated, lastActivity, logout, navigate, updateLastActivity]);

  // If trying to access protected routes while not authenticated
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/" && !location.pathname.includes("/login")) {
      navigate("/");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {title && (
        <header className="glass w-full py-4 px-4 sm:px-6 flex items-center sticky top-0 z-10">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <h1 className="text-xl font-medium">{title}</h1>
        </header>
      )}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 md:px-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
