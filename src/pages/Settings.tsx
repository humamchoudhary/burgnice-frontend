import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import {
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Bell,
  CreditCard,
  Package,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      requirements: [
        { met: password.length >= minLength, text: "At least 8 characters" },
        { met: hasUpperCase, text: "One uppercase letter" },
        { met: hasLowerCase, text: "One lowercase letter" },
        { met: hasNumbers, text: "One number" },
        { met: hasSpecialChar, text: "One special character" },
      ],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setMessage({
        type: "error",
        text: "Password does not meet requirements",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.data.message) {
        setMessage({ type: "success", text: response.data.message });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(newPassword);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account security and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Navigation */}

        {/* Right Column - Change Password Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="p-6 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Change Password
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Update your password to keep your account secure
              </p>
            </div>
            <div className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      message.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    )}
                    <p
                      className={
                        message.type === "success"
                          ? "text-green-800 dark:text-green-300"
                          : "text-red-800 dark:text-red-300"
                      }
                    >
                      {message.text}
                    </p>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />

                  {/* Password Requirements */}
                  {newPassword && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Password must contain:
                      </p>
                      <ul className="space-y-1">
                        {passwordValidation.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            {req.met ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-gray-400" />
                            )}
                            <span
                              className={
                                req.met
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }
                            >
                              {req.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword &&
                    newPassword === confirmPassword &&
                    newPassword && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Passwords match
                      </p>
                    )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Updating..." : "Change Password"}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Make sure to use a strong, unique password that you don't
                    use elsewhere.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="p-6 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Security Tips
              </h3>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Use a strong password
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Include uppercase, lowercase, numbers, and special
                    characters.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Don't reuse passwords
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use a unique password for each of your accounts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Enable 2FA (Coming Soon)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Two-factor authentication adds an extra layer of security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
