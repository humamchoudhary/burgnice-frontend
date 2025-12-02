import { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingBag, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MenuItemType } from "./MenuItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export interface CartItem extends MenuItemType {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

// Add this function to calculate loyalty points
const calculateLoyaltyPoints = (total: number) => {
  return Math.floor(total / 10); // 1 point per £10
};

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from session storage whenever the cart opens
  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
  }, [isOpen]);

  const loadCartItems = () => {
    const storedCart = sessionStorage.getItem("cart");
    const cartItems: MenuItemType[] = storedCart ? JSON.parse(storedCart) : [];
    
    // Filter out null/undefined items
    const validItems = cartItems.filter(item => item && item.id);
    
    // Aggregate quantities for identical items
    const aggregatedMap = new Map<string, CartItem>();
    
    validItems.forEach((item) => {
      if (!item.id) return;
      
      const existing = aggregatedMap.get(item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        aggregatedMap.set(item.id, { 
          ...item, 
          quantity: 1 
        });
      }
    });
    
    setItems(Array.from(aggregatedMap.values()));
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    ).filter(i => i.quantity > 0); // remove if 0
    
    setItems(updatedItems);
    updateSessionStorage(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    updateSessionStorage(updatedItems);
  };

  const updateSessionStorage = (items: CartItem[]) => {
    // Flatten items array with quantities
    const flattened = items.flatMap(item => 
      Array(item.quantity).fill({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: item.category,
      })
    );
    
    sessionStorage.setItem("cart", JSON.stringify(flattened));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const clearCart = () => {
    setItems([]);
    sessionStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const pointsEarned = calculateLoyaltyPoints(total);

  const goToCheckout = () => {
    // Save current cart items to session storage as-is
    updateSessionStorage(items);
    navigate("/checkout");
    onClose();
  };

  const calculateSavingsWithPoints = () => {
    if (!isAuthenticated || !user?.loyaltyPoints) return 0;
    
    const usablePoints = Math.min(user.loyaltyPoints, 500); // Max 500 points per order
    return Math.floor(usablePoints / 100) * 10; // 100 points = £10 discount
  };

  const savings = calculateSavingsWithPoints();
  const finalTotal = Math.max(0, total - savings);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart
            </SheetTitle>
            {itemCount > 0 && (
              <Badge variant="secondary" className="h-6 px-2">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="relative mb-6">
              <ShoppingBag className="h-20 w-20 text-muted-foreground opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-accent/50 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </div>
            <p className="text-lg font-medium text-foreground mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Add some delicious burgers, ice cream, or drinks to get started!
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                onClose();
                navigate("/menu");
              }}
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 p-4 bg-accent/30 rounded-xl border transition-all duration-300 hover:border-primary/30"
                >
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    {item.quantity > 1 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0"
                      >
                        {item.quantity}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm font-bold text-primary">
                        £{(item.price * item.quantity).toFixed(2)}
                        <span className="text-xs text-muted-foreground font-normal ml-1">
                          (£{item.price.toFixed(2)} each)
                        </span>
                      </p>
                      
                      <div className="flex items-center gap-2 bg-background rounded-full px-2 py-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6 px-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
              {/* Loyalty Points Section */}
              {isAuthenticated ? (
                <div className="space-y-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-sm">Loyalty Points</span>
                    </div>
                    {loading ? (
                      <Skeleton className="h-5 w-16" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-bold text-primary">{user?.loyaltyPoints || 0}</span>
                        <span className="text-xs text-muted-foreground">points</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Points from this order</span>
                      <span className="font-semibold text-primary">+{pointsEarned}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Points discount</span>
                        <span className="font-semibold text-green-600">-£{savings.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground pt-2 border-t border-primary/10">
                      💡 Earn 1 point for every £10 spent. 100 points = £10 discount.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-secondary/50 rounded-xl border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm mb-1">Earn Loyalty Points!</p>
                      <p className="text-xs text-muted-foreground">
                        Sign in to earn {pointsEarned} points from this order
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onClose();
                        // Trigger auth modal from parent component
                        window.dispatchEvent(new Event('open-auth-modal'));
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                </div>
              )}

              {/* Order Totals */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">£{total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Loyalty Discount</span>
                      <span className="text-green-600 font-medium">-£{savings.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">Total</p>
                    <p className="text-xs text-muted-foreground">Including VAT</p>
                  </div>
                  <div className="text-right">
                    {savings > 0 && (
                      <p className="text-sm text-muted-foreground line-through mb-1">
                        £{total.toFixed(2)}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-primary">£{finalTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pb-6">
                <Button
                  className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  onClick={goToCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      clearCart();
                    }}
                  >
                    Clear Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};