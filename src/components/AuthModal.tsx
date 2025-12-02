import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/authContext";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (activeTab === "register") {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (activeTab === "register" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (activeTab === "login") {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      onClose();
      resetForm();
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register");
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/30" />

          <div className="relative p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome Back
              </DialogTitle>
              <p className="text-center text-muted-foreground mb-8">
                {activeTab === "login" 
                  ? "Sign in to your account to continue" 
                  : "Create an account to get started"}
              </p>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 bg-secondary/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="login" 
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Terms and Conditions */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};