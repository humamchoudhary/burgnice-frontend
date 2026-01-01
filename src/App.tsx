import { Toaster } from "sonner";
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
import AuthPage from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* All routes that use the Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/menu" element={<MenuWrapper />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Protected Routes - Only accessible when logged in */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all 404 route - MUST BE LAST */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* Sonner Toaster - Using the standalone package */}
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-950 dark:group-[.toaster]:text-gray-50 dark:group-[.toaster]:border-gray-800",
            description:
              "group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400",
            actionButton:
              "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50 dark:group-[.toast]:bg-gray-50 dark:group-[.toast]:text-gray-900",
            cancelButton:
              "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 dark:group-[.toast]:bg-gray-800 dark:group-[.toast]:text-gray-400",
          },
        }}
      />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
