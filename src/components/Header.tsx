import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/authContext";
import { LoyaltyPoints } from "@/components/LoyaltyPoints";
import { UserMenu } from "@/components/UserMenu";
import { AuthModal } from "@/components/AuthModal";
import logo from "@/assets/logo.png";
import { Input } from "@/components/ui/input";

export const Header = ({ onCartClick }: { onCartClick: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle order type change
  const handleOrderTypeChange = (value: "delivery" | "pickup") => {
    setOrderType(value);
    console.log(`Order type changed to: ${value}`);
    window.dispatchEvent(new CustomEvent("order-type-changed", { detail: value }));
  };

  // Initialize and listen for changes
  useEffect(() => {
    window.addEventListener("cart-updated", updateCartCount);
    updateCartCount();

    const handleStorage = () => updateCartCount();
    window.addEventListener("storage", handleStorage);
    
    const savedOrderType = sessionStorage.getItem("orderType") as "delivery" | "pickup";
    if (savedOrderType) {
      setOrderType(savedOrderType);
    }

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Save order type to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("orderType", orderType);
  }, [orderType]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-a63872/95 backdrop-blur-md border-b shadow-xl" 
        : "bg-a63872 border-b shadow-lg"
    }`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Left Section - Menu Button & Logo */}
        <div className="flex items-center gap-4">
          {/* Desktop Menu Button */}
          <Sheet>
            <SheetTrigger asChild className="hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-white">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={logo}
                      alt="Burg N Ice Logo"
                      className="h-10 w-auto"
                    />
                    <span className="font-bold text-lg text-a63872">
                      Burg N' Ice
                    </span>
                  </div>
                </div>

                {/* Desktop Menu Navigation */}
                <nav className="space-y-2 mb-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                    >
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className={`w-full justify-start text-lg h-12 ${
                          isActive(item.path) 
                            ? "bg-a63872 text-white font-semibold" 
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <img
              src={logo}
              alt="Burg N Ice Logo"
              className="h-16 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-0 group-hover:invert"
            />
            <span className="hidden xl:inline-block text-white font-bold text-xl ml-2">
              Burg N' Ice
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Delivery/Pickup Toggle */}
          <div className="hidden md:flex">
            <Tabs 
              value={orderType} 
              onValueChange={(value) => handleOrderTypeChange(value as "delivery" | "pickup")}
              className="w-auto"
            >
              <TabsList className="bg-white/20 p-1 h-auto">
                <TabsTrigger 
                  value="delivery" 
                  className={`px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-a63872 transition-all duration-200 ${
                    orderType === "delivery" 
                      ? "bg-white text-a63872" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Delivery
                </TabsTrigger>
                <TabsTrigger 
                  value="pickup" 
                  className={`px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-a63872 transition-all duration-200 ${
                    orderType === "pickup" 
                      ? "bg-white text-a63872" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Store className="h-4 w-4 mr-2" />
                  Pickup
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex max-w-xs">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border-none focus-visible:ring-2 focus-visible:ring-white/30 bg-white/90"
              />
            </form>
          </div>

          {/* Loyalty Points */}
          <div className="hidden lg:block text-white">
            <LoyaltyPoints />
          </div>

          {/* Cart Icon */}
          <Button
            variant="secondary"
            size="icon"
            className="relative bg-white text-a63872 hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs animate-bounce bg-red-500"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {/* Auth Buttons / User Menu */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="hidden md:inline-flex h-10 px-4 rounded-full bg-white text-a63872 shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 font-medium"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="md:w-96 w-80 p-0 bg-white">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={logo}
                      alt="Burg N Ice Logo"
                      className="h-10 w-auto"
                    />
                    <span className="font-bold text-lg text-a63872">
                      Burg N' Ice
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Order Type Toggle */}
                <div className="mb-6">
                  <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => handleOrderTypeChange("delivery")}
                      className={`flex-1 flex items-center justify-center py-3 rounded-md transition-all duration-200 ${
                        orderType === "delivery"
                          ? "bg-white text-a63872 shadow-sm"
                          : "text-gray-600 hover:text-a63872"
                      }`}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOrderTypeChange("pickup")}
                      className={`flex-1 flex items-center justify-center py-3 rounded-md transition-all duration-200 ${
                        orderType === "pickup"
                          ? "bg-white text-a63872 shadow-sm"
                          : "text-gray-600 hover:text-a63872"
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
                    <Input
                      type="search"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-full"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-2 mb-6 flex-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className={`w-full justify-start text-lg h-12 ${
                          isActive(item.path) 
                            ? "bg-a63872 text-white font-semibold" 
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </nav>

                {/* Mobile Loyalty Points */}
                {isAuthenticated && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <LoyaltyPoints compact />
                  </div>
                )}

                {/* Mobile Auth Section */}
                <div className="space-y-3 pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Signed in as
                        </p>
                        <p className="font-semibold text-lg">
                          {user?.name || user?.email || "User"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="border-a63872 text-a63872 hover:bg-a63872 hover:text-white"
                          onClick={() => navigate("/orders")}
                        >
                          My Orders
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        className="w-full h-12 bg-a63872 text-white hover:bg-[#9A3068] font-medium"
                        onClick={() => {
                          setShowAuthModal(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-a63872 text-a63872 hover:bg-a63872 hover:text-white"
                        onClick={() => {
                          setShowAuthModal(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Create Account
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};