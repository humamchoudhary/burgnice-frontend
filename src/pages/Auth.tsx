import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (
      activeTab === "register" &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login, register } = useAuth();

  const navigate = useNavigate();
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
      resetForm();
      navigate("/");
    } catch (error) {
      console.log(error);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTabChange = (value: "login" | "register") => {
    setActiveTab(value);
    setErrors({});
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/30 p-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-center text-muted-foreground">
              {activeTab === "login"
                ? "Sign in to your account to continue"
                : "Create an account to get started"}
            </p>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-2 gap-1 bg-secondary/50 p-1 rounded-xl">
              <button
                onClick={() => handleTabChange("login")}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  activeTab === "login"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => handleTabChange("register")}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  activeTab === "register"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {activeTab === "login" && (
            <div className="space-y-4" onKeyPress={handleKeyPress}>
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-background ${
                    errors.email
                      ? "border-destructive focus:ring-destructive"
                      : "border-border focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-background ${
                    errors.password
                      ? "border-destructive focus:ring-destructive"
                      : "border-border focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 text-lg font-semibold mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("register")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          )}

          {activeTab === "register" && (
            <div className="space-y-4" onKeyPress={handleKeyPress}>
              <div className="space-y-2">
                <label
                  htmlFor="register-username"
                  className="block text-sm font-medium"
                >
                  Username
                </label>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-background ${
                    errors.username
                      ? "border-destructive focus:ring-destructive"
                      : "border-border focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-background ${
                    errors.email
                      ? "border-destructive focus:ring-destructive"
                      : "border-border focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-background ${
                    errors.password
                      ? "border-destructive focus:ring-destructive"
                      : "border-border focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="register-confirm-password"
                  className="block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-background ${
                    errors.confirmPassword
                      ? "border-destructive focus:ring-destructive"
                      : "border-border focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 text-lg font-semibold mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("login")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
