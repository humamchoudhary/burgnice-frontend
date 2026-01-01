import React, { useState, useEffect } from "react";
import { Award, Sparkles, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { AuthModal } from "./AuthModal";
import axios from "axios";

export const LoyaltyPoints: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [points, setPoints] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchLoyaltyPoints = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/orders/loyalty-summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPoints(response.data.loyaltyPoints || 0);
    } catch (error) {
      console.error("Error fetching loyalty points:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLoyaltyPoints();
    }
  }, [isAuthenticated]);

  const handlePointsClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowDetails(!showDetails);
      setDropdownOpen(!dropdownOpen);
    }
  };

  const getRewardTier = () => {
    if (points >= 1000) return { name: "Gold", color: "text-yellow-500" };
    if (points >= 500) return { name: "Silver", color: "text-gray-400" };
    return { name: "Bronze", color: "text-amber-700" };
  };

  const rewardTier = getRewardTier();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".loyalty-container") && dropdownOpen) {
        setShowDetails(false);
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  return (
    <>
      <div className="relative loyalty-container">
        <button
          onClick={handlePointsClick}
          className="h-12 px-4 rounded-full border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white transition-all duration-300 group relative overflow-hidden"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

          <div className="flex items-center gap-2 relative z-10">
            <div className="relative">
              <Award className="h-5 w-5 text-white" />
              {isAuthenticated && (
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-white animate-pulse" />
              )}
            </div>

            <div className="flex flex-col items-start">
              {loading ? (
                <div className="h-4 w-16 bg-white/30 rounded animate-pulse" />
              ) : (
                <span className="text-sm font-semibold">
                  {isAuthenticated ? `${points} Points` : "Earn Points"}
                </span>
              )}
              <span className="text-xs text-white/80">
                {isAuthenticated ? rewardTier.name : "Login to earn"}
              </span>
            </div>

            {isAuthenticated && (
              <ChevronDown
                className={`h-4 w-4 text-white transition-transform duration-300 ${showDetails ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </button>

        {/* Points Details Dropdown */}
        {showDetails && isAuthenticated && (
          <div className="absolute top-full right-0 mt-2 w-80 z-50 animate-in slide-in-from-top-5 bg-white border border-[#A63872]/20 shadow-lg rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Loyalty Rewards
                    </h3>
                    <p className="text-sm text-gray-500">Your current status</p>
                  </div>
                  <div className={`text-2xl font-bold ${rewardTier.color}`}>
                    {points}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Progress to next tier</span>
                    <span className="text-[#A63872] font-medium">
                      {points % 100}/100
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#A63872] to-[#9A3068] rounded-full transition-all duration-500"
                      style={{ width: `${points % 100}%` }}
                    />
                  </div>
                </div>

                {/* Points Info */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Points Value</p>
                    <p className="font-semibold text-[#A63872]">
                      £{(points * 0.1).toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Next Reward</p>
                    <p className="font-semibold text-[#A63872]">
                      {100 - (points % 100)} points
                    </p>
                  </div>
                </div>

                {/* How It Works */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">How it works:</p>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-center gap-1 text-gray-700">
                      <div className="h-1 w-1 rounded-full bg-[#A63872]" />
                      Earn 1 point for every £10 spent
                    </li>
                    <li className="flex items-center gap-1 text-gray-700">
                      <div className="h-1 w-1 rounded-full bg-[#A63872]" />
                      100 points = £10 discount
                    </li>
                    <li className="flex items-center gap-1 text-gray-700">
                      <div className="h-1 w-1 rounded-full bg-[#A63872]" />
                      Points never expire
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
