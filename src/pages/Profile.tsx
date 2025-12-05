import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {Mail, Award, Shield, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Settings, Package } from "lucide-react";
import  api  from "@/services/api";
const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchProfileData = async () => {
    if (user && !loading) {
      try {
        // Use the new user profile API
        const response = await api.get('/user/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to auth context data
        setProfileData({
          ...user,
          joinDate: new Date(user.createdAt || Date.now()).toLocaleDateString(),
          totalOrders: 0,
          tier: user.loyaltyPoints > 1000 ? "Gold" : user.loyaltyPoints > 500 ? "Silver" : "Bronze"
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
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/settings")}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
              <CardDescription>
                Your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user.username || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">Member since {profileData?.joinDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                    <p className="font-medium">{user.email || 'No email provided'}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Account Tier</span>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {profileData?.tier}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Points Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Loyalty Points</CardTitle>
              <CardDescription>
                Earn points with every purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {user.loyaltyPoints || 0}
                    </span>
                    <span className="text-muted-foreground">points</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {profileData?.tier} Member
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress to next tier</span>
                    <span className="font-medium">
                      {user.loyaltyPoints || 0} / {profileData?.tier === "Bronze" ? 500 : profileData?.tier === "Silver" ? 1000 : "∞"}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      style={{
                        width: `${Math.min((user.loyaltyPoints || 0) % (profileData?.tier === "Bronze" ? 500 : 1000), 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {profileData?.tier === "Gold" 
                      ? "You've reached the highest tier!"
                      : `Need ${(profileData?.tier === "Bronze" ? 500 : 1000) - (user.loyaltyPoints || 0)} more points for ${profileData?.tier === "Bronze" ? "Silver" : "Gold"} tier`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <span className="font-bold">{profileData?.totalOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Points Earned</span>
                <span className="font-bold text-primary">{user.loyaltyPoints || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="font-medium">{profileData?.joinDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/orders")}
              >
                <Package className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/shop")}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;