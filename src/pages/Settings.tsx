import React, { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Bell, CreditCard, Package, User } from "lucide-react";
import api from "@/services/api";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect if not authenticated
  React.useEffect(() => {
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
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: [
        { met: password.length >= minLength, text: "At least 8 characters" },
        { met: hasUpperCase, text: "One uppercase letter" },
        { met: hasLowerCase, text: "One lowercase letter" },
        { met: hasNumbers, text: "One number" },
        { met: hasSpecialChar, text: "One special character" },
      ]
    };
  };

// In SettingsPage.tsx, update handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage(null);

  // ... validation code ...

  try {
    // Use the new change password endpoint
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });

    if (response.data.message) {
      setMessage({ type: 'success', text: response.data.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to change password';
    setMessage({ type: 'error', text: errorMessage });
  } finally {
    setLoading(false);
  }
};

  const passwordValidation = validatePassword(newPassword);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account security and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md sticky top-6">
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium bg-accent/50"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium"
                  onClick={() => navigate("/orders")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  disabled
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  disabled
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Change Password Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Change Password</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                    {message.type === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="h-11"
                    required
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="h-11"
                    required
                  />

                  {/* Password Requirements */}
                  {newPassword && (
                    <div className="mt-3 p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm font-medium mb-2">Password must contain:</p>
                      <ul className="space-y-1">
                        {passwordValidation.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            {req.met ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
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
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="h-11"
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && newPassword && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Passwords match
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Change Password"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Make sure to use a strong, unique password that you don't use elsewhere.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Tips */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Security Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Use a strong password</p>
                  <p className="text-sm text-muted-foreground">
                    Include uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Don't reuse passwords</p>
                  <p className="text-sm text-muted-foreground">
                    Use a unique password for each of your accounts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Enable 2FA (Coming Soon)</p>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication adds an extra layer of security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;