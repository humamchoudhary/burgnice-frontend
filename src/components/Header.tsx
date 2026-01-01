import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, MapPin, Store } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { LoyaltyPoints } from "@/components/LoyaltyPoints";
import { UserMenu } from "@/components/UserMenu";
import { AuthModal } from "@/components/AuthModal";
import logo from "@/assets/logo.png";

export const Header = ({ onCartClick }: { onCartClick: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Calculate cart count from session storage
  const updateCartCount = () => {
    const cart = sessionStorage.getItem("cart");
    if (!cart) {
      setCartItemCount(0);
      return;
    }
    const items = JSON.parse(cart);
    const total = items.reduce((sum: number, item: any) => {
      if (!item) return sum;
      return sum + (item.quantity ?? 1);
    }, 0);
    setCartItemCount(total);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  // Handle order type change
  const handleOrderTypeChange = (value: "delivery" | "pickup") => {
    setOrderType(value);
    sessionStorage.setItem("orderType", value);
    console.log(`Order type changed to: ${value}`);
    window.dispatchEvent(
      new CustomEvent("order-type-changed", { detail: value }),
    );
  };

  // Initialize and listen for changes
  useEffect(() => {
    window.addEventListener("cart-updated", updateCartCount);
    updateCartCount();

    const handleStorage = () => updateCartCount();
    window.addEventListener("storage", handleStorage);

    const savedOrderType = sessionStorage.getItem("orderType") as
      | "delivery"
      | "pickup";
    if (savedOrderType) {
      setOrderType(savedOrderType);
    }

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-[#A63872] border-b shadow-lg`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Left Section - Menu Button & Logo */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <img
              src={logo}
              alt="Burg N Ice Logo"
              className="h-16 w-auto transition-all duration-300 group-hover:scale-105 "
            />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Delivery/Pickup Toggle - Desktop */}
          <div className="hidden md:flex">
            <div className="flex bg-white/20 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleOrderTypeChange("delivery")}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  orderType === "delivery"
                    ? "bg-white text-[#A63872]"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Delivery
              </button>
              <button
                type="button"
                onClick={() => handleOrderTypeChange("pickup")}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  orderType === "pickup"
                    ? "bg-white text-[#A63872]"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Store className="h-4 w-4 mr-2" />
                Pickup
              </button>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex max-w-xs">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-white/30 bg-white/90 text-gray-900 placeholder-gray-500"
              />
            </form>
          </div>

          {/* Loyalty Points - Desktop */}

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative p-2.5 rounded-full bg-white text-[#A63872] hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
          >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs animate-bounce bg-red-500 text-white rounded-full text-xs font-bold">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </button>

          {/* Auth Buttons / User Menu - Desktop */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <button
              className="hidden md:inline-flex h-10 px-4 rounded-full bg-white text-[#A63872] shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 font-medium"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/20"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-80 md:w-96 bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Burg N Ice Logo" className="h-10 w-auto" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Mobile Order Type Toggle */}
              <div className="mb-6">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleOrderTypeChange("delivery");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center py-3 rounded-md transition-all duration-200 ${
                      orderType === "delivery"
                        ? "bg-white text-[#A63872] shadow-sm"
                        : "text-gray-600 hover:text-[#A63872]"
                    }`}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleOrderTypeChange("pickup");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center py-3 rounded-md transition-all duration-200 ${
                      orderType === "pickup"
                        ? "bg-white text-[#A63872] shadow-sm"
                        : "text-gray-600 hover:text-[#A63872]"
                    }`}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Pickup
                  </button>
                </div>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A63872] focus:border-transparent"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2 mb-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`w-full px-4 py-3 rounded-lg text-left text-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-[#A63872] text-white font-semibold"
                          : "hover:bg-gray-100 text-gray-900"
                      }`}
                    >
                      {item.name}
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Mobile Loyalty Points */}

              {/* Mobile Auth Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="font-semibold text-lg text-gray-900">
                        {user?.username || user?.email || "User"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          navigate("/orders");
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-2.5 rounded-lg border border-[#A63872] text-[#A63872] hover:bg-[#A63872] hover:text-white transition-colors"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      className="w-full px-4 py-3 rounded-lg bg-[#A63872] text-white hover:bg-[#9A3068] font-medium transition-colors"
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      className="w-full px-4 py-3 rounded-lg border border-[#A63872] text-[#A63872] hover:bg-[#A63872] hover:text-white transition-colors"
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};
