import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import {
  Mail,
  Award,
  Shield,
  Edit,
  ShoppingBag,
  Settings,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface ProfileData {
  username: string;
  email: string;
  loyaltyPoints: number;
  totalSpent: number;
  joinDate: string;
  totalOrders: number;
  tier: string;
}

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user && !loading) {
        try {
          // Fetch user profile and order history in parallel
          const [profileResponse, orderHistoryResponse] = await Promise.all([
            api.get("/auth/profile"),
            api.get("/orders/history"),
          ]);

          const profile = profileResponse.data;
          const orderHistory = orderHistoryResponse.data;

          // Calculate tier based on loyalty points
          const loyaltyPoints =
            profile.loyaltyPoints || user.loyaltyPoints || 0;
          const tier =
            loyaltyPoints >= 1000
              ? "Gold"
              : loyaltyPoints >= 500
                ? "Silver"
                : "Bronze";
          console.log("Profile");
          console.log(profile);
          console.log({
            username: profile.username || user.username,
            email: profile.email || user.email,
            loyaltyPoints,
            totalSpent: orderHistory.totalSpent || profile.totalSpent || 0,
            joinDate: new Date(
              profile.createdAt || user.createdAt || Date.now(),
            ).toLocaleDateString(),
            totalOrders:
              orderHistory.totalOrders || orderHistory.orders?.length || 0,
            tier,
          });

          setProfileData({
            username: profile.username || user.username,
            email: profile.email || user.email,
            loyaltyPoints,
            totalSpent: orderHistory.totalSpent || profile.totalSpent || 0,
            joinDate: new Date(
              profile.createdAt || user.createdAt || Date.now(),
            ).toLocaleDateString(),
            totalOrders:
              orderHistory.totalOrders || orderHistory.orders?.length || 0,
            tier,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          // Fallback to user data with minimal order info
          const loyaltyPoints = user.loyaltyPoints || 0;
          setProfileData({
            username: user.username,
            email: user.email,
            loyaltyPoints,
            totalSpent: 0,
            joinDate: new Date(
              user.createdAt || Date.now(),
            ).toLocaleDateString(),
            totalOrders: 0,
            tier:
              loyaltyPoints >= 1000
                ? "Gold"
                : loyaltyPoints >= 500
                  ? "Silver"
                  : "Bronze",
          });
        }
        setIsLoading(false);
      } else if (!loading && !user) {
        navigate("/login");
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, loading, navigate]);

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="p-6 pb-3">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profileData) {
    return null;
  }

  const getNextTierInfo = () => {
    if (profileData.tier === "Bronze") {
      return {
        next: "Silver",
        required: 500,
        current: profileData.loyaltyPoints,
      };
    } else if (profileData.tier === "Silver") {
      return {
        next: "Gold",
        required: 1000,
        current: profileData.loyaltyPoints,
      };
    } else {
      return {
        next: "Gold",
        required: 1000,
        current: profileData.loyaltyPoints,
      };
    }
  };

  const nextTierInfo = getNextTierInfo();
  const progressPercentage =
    profileData.tier === "Gold"
      ? 100
      : Math.min((nextTierInfo.current / nextTierInfo.required) * 100, 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="p-6 pb-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Your basic profile information
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {profileData.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profileData.username || "User"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Member since {profileData.joinDate}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profileData.email || "No email provided"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Shield className="h-4 w-4" />
                      <span>Account Tier</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                      {profileData.tier}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Points Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="p-6 pb-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Loyalty Points
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Earn points with every purchase
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {profileData.loyaltyPoints}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      points
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {profileData.tier} Member
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress to next tier
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {profileData.loyaltyPoints} /{" "}
                      {profileData.tier === "Gold"
                        ? "∞"
                        : nextTierInfo.required}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {profileData.tier === "Gold"
                      ? "You've reached the highest tier!"
                      : `Need ${nextTierInfo.required - nextTierInfo.current} more points for ${nextTierInfo.next} tier`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="p-6 pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Quick Stats
              </h2>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Orders
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {profileData.totalOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Spent
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${profileData.totalSpent.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Points Earned
                </span>
                <span className="font-bold text-primary">
                  {profileData.loyaltyPoints}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Member Since
                </span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {profileData.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="p-6 pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={() => navigate("/orders")}
                className="w-full flex items-center justify-start px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Package className="h-4 w-4 mr-2" />
                View Orders
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center justify-start px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-start px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
