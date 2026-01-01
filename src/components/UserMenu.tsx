import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Package, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

export const UserMenu: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  // Show loading state
  if (loading) {
    return (
      <button
        disabled
        className="h-12 px-3 rounded-full bg-transparent hover:bg-white/10 cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="hidden md:block">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
          </div>
        </div>
      </button>
    );
  }

  // If not authenticated, show login button
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/login")}
          className="h-10 px-4 bg-transparent text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="h-10 px-4 bg-white text-black hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          Sign Up
        </button>
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
    navigate("/profile");
  };

  const handleOrdersClick = () => {
    setIsOpen(false);
    navigate("/orders");
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    navigate("/settings");
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 px-3 rounded-full bg-transparent hover:bg-white/10 transition-all duration-300 group"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="h-full w-full rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all bg-primary/10 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm text-white font-semibold leading-none">
              {user.username || "User"}
            </span>
            <span className="text-xs text-gray-300">
              {user.loyaltyPoints || 0} points
            </span>
          </div>

          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed md:absolute right-4 md:right-0 top-16 md:top-full mt-2 w-64 p-2 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-50"
          role="menu"
        >
          {/* User Info */}
          <div className="px-3 py-2 mb-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-base">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-gray-900 dark:text-white">
                  {user.username || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email || "No email"}
                </p>
              </div>
            </div>
            <div className="mt-3 px-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Loyalty Points
                </span>
                <span className="font-bold text-primary">
                  {user.loyaltyPoints || 0}
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                  style={{
                    width: `${Math.min((user.loyaltyPoints || 0) % 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />

          {/* Menu Items */}
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            role="menuitem"
          >
            <User className="h-4 w-4 mr-2" />
            <span>My Profile</span>
          </button>

          <button
            onClick={handleOrdersClick}
            className="w-full flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            role="menuitem"
          >
            <Package className="h-4 w-4 mr-2" />
            <span>My Orders</span>
          </button>

          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            role="menuitem"
          >
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </button>

          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors text-gray-700 dark:text-gray-300"
            role="menuitem"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};
