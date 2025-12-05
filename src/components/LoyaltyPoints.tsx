import React, { useState, useEffect } from "react";
import { Award, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { AuthModal } from "./AuthModal";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export const LoyaltyPoints: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [points, setPoints] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

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
      console.log(response);
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
    }
  };

  const getRewardTier = () => {
    if (points >= 1000) return { name: "Gold", color: "text-yellow-500" };
    if (points >= 500) return { name: "Silver", color: "text-gray-400" };
    return { name: "Bronze", color: "text-amber-700" };
  };

  const rewardTier = getRewardTier();

  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          className="h-12 px-4 rounded-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group relative overflow-hidden"
          onClick={handlePointsClick}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

          <div className="flex items-center gap-2 relative z-10">
            <div className="relative">
              <Award className="h-5 w-5 text-primary" />
              {isAuthenticated && (
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
              )}
            </div>

            <div className="flex flex-col items-start">
              {loading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <span className="text-sm font-semibold">
                  {isAuthenticated ? `${points} Points` : "Earn Points"}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {isAuthenticated ? rewardTier.name : "Login to earn"}
              </span>
            </div>

            {isAuthenticated && (
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${showDetails ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </Button>

        {/* Points Details Dropdown */}
        {showDetails && isAuthenticated && (
          <Card className="absolute top-full right-0 mt-2 w-80 z-50 animate-in slide-in-from-top-5">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Loyalty Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Your current status
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${rewardTier.color}`}>
                    {points}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to next tier</span>
                    <span>{points % 100}/100</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${points % 100}%` }}
                    />
                  </div>
                </div>

                {/* Points Info */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Points Value
                    </p>
                    <p className="font-semibold">
                      £{(points * 0.1).toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Next Reward</p>
                    <p className="font-semibold">
                      {100 - (points % 100)} points
                    </p>
                  </div>
                </div>

                {/* How It Works */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    How it works:
                  </p>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      Earn 1 point for every £10 spent
                    </li>
                    <li className="flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      100 points = £10 discount
                    </li>
                    <li className="flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      Points never expire
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
