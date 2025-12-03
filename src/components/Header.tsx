import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/authContext";
import { LoyaltyPoints } from "@/components/LoyaltyPoints";
import { UserMenu } from "@/components/UserMenu";
import { AuthModal } from "@/components/AuthModal";

export const Header = ({ onCartClick }: { onCartClick: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

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

  // Initialize and listen for changes
  useEffect(() => {
    window.addEventListener("cart-updated", updateCartCount);
    updateCartCount();

    // Listen to sessionStorage updates from other tabs
    const handleStorage = () => updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/90 border-b shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
            Burg N Ice
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                className="transition-all duration-300 hover:scale-105"
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Loyalty Points */}
          <LoyaltyPoints />

          {/* Cart Icon */}
          <Button
            variant="outline"
            size="icon"
            className="relative transition-all duration-300 hover:scale-110 hover:shadow-md group"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs animate-bounce"
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
              variant="default"
              size="sm"
              className="hidden md:inline-flex h-10 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96 p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Burg N Ice
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2 mb-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className="w-full justify-start text-lg h-12"
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth Section */}
                <div className="space-y-3 pt-4 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Signed in as
                      </p>
                      <p className="font-semibold">{}</p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          // Handle logout
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full h-12"
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
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
