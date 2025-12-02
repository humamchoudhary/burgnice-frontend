import { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MenuItemType } from "./MenuItem";
import { useNavigate } from "react-router-dom";

export interface CartItem extends MenuItemType {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from session storage whenever the cart opens
  useEffect(() => {
    if (isOpen) {
      const storedCart = sessionStorage.getItem("cart");
      const cartItems: MenuItemType[] = storedCart ? JSON.parse(storedCart) : [];
      // Aggregate quantities for identical items
      const aggregated: CartItem[] = [];
      cartItems.forEach((item) => {
        const existing = aggregated.find((i) => i.id === item.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          aggregated.push({ ...item, quantity: 1 });
        }
      });
      setItems(aggregated);
    }
  }, [isOpen]);

  const updateQuantity = (id: string, quantity: number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    ).filter(i => i.quantity > 0); // remove if 0
    setItems(updated);
    sessionStorage.setItem(
      "cart",
      JSON.stringify(updated.flatMap(item => Array(item.quantity).fill({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: item.category,
      })))
    );
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    sessionStorage.setItem(
      "cart",
      JSON.stringify(updated.flatMap(item => Array(item.quantity).fill({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: item.category,
      })))
    );
    window.dispatchEvent(new Event("cart-updated"));
  };

  const clearCart = () => {
    setItems([]);
    sessionStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const goToCheckout = () => {
    const storedCart = sessionStorage.getItem("cart");
    const cartItems: MenuItemType[] = storedCart ? JSON.parse(storedCart) : [];
    
    // Aggregate quantities
    const aggregated: CartItem[] = [];
    cartItems.forEach((item) => {
      const existing = aggregated.find((i) => i.id === item.id);
      if (existing) existing.quantity += 1;
      else aggregated.push({ ...item, quantity: 1 });
    });
  
    navigate("/checkout", { state: { items: aggregated } });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-2">Add some delicious items to get started!</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-accent/50 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-sm text-primary font-bold mt-1">£{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({itemCount})</span>
                  <span className="font-medium">£{total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">£{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
                onClick={goToCheckout}
              >
                Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
