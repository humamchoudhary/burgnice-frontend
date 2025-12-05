import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import { Home } from "./pages/Home";
import { MenuWrapper } from "./pages/MenuWrapper";
import { About } from "./pages/About";
import { Checkout } from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/authContext"; 
import ProfilePage from "@/pages/Profile";
import SettingsPage from "@/pages/Settings";
import OrdersPage from "@/pages/Orders";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* All routes that use the Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<MenuWrapper />} />
              <Route path="/about" element={<About />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Protected Routes - Only accessible when logged in */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
            </Route>
            

            
            {/* Catch-all 404 route - MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;