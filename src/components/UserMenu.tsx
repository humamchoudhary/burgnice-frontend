import React, { useState } from "react";
import { User, LogOut, Package, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/authContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export const UserMenu: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <Button
        variant="ghost"
        className="h-12 px-3 rounded-full"
        disabled
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-200 animate-pulse" />
          </Avatar>
          <div className="hidden md:block">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
          </div>
        </div>
      </Button>
    );
  }

  // If not authenticated, show login button
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="h-10"
        >
          Login
        </Button>
        <Button
          onClick={() => navigate('/register')}
          className="h-10"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    // Navigate to profile page when created
    navigate('/profile');
  };

  const handleOrdersClick = () => {
    setIsOpen(false);
    navigate('/orders');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 px-3 rounded-full hover:bg-accent/50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold leading-none">
                {user.username || 'User'}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.loyaltyPoints || 0} points
              </span>
            </div>

            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:rotate-180" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 rounded-xl shadow-lg border-0 mt-2"
        sideOffset={8}
      >
        {/* User Info */}
        <div className="px-3 py-2 mb-1">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.username || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email || 'No email'}
              </p>
            </div>
          </div>
          <div className="mt-3 px-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Loyalty Points</span>
              <span className="font-bold text-primary">
                {user.loyaltyPoints || 0}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                style={{
                  width: `${Math.min((user.loyaltyPoints || 0) % 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Menu Items */}
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
        >
          <User className="h-4 w-4 mr-2" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleOrdersClick}
          className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
        >
          <Package className="h-4 w-4 mr-2" />
          <span>My Orders</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-accent/50 focus:bg-accent/50">
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};