
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PasswordProvider } from "@/context/PasswordContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddPassword from "./pages/AddPassword";
import ViewPasswords from "./pages/ViewPasswords";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PasswordProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/add" element={<AddPassword />} />
              <Route path="/view/:category" element={<ViewPasswords />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PasswordProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
