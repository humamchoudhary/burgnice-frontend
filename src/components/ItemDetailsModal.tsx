import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MenuItemType, convertMenuItem } from "@/components/MenuItem";
import { menuItemAPI } from "@/services/api";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface ItemDetailsModalProps {
  item: MenuItemType | null;
  onClose: () => void;
  onAddToCart: (item: MenuItemType) => void; // still needed for parent updates if required
}

export const ItemDetailsModal = ({ item, onClose, onAddToCart }: ItemDetailsModalProps) => {
  const [suggestions, setSuggestions] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Fetch suggestions
  useEffect(() => {
    if (!item) return;
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const allItems = await menuItemAPI.getAll();
        const converted = allItems.map(convertMenuItem);
        const filtered = converted.filter((i) => {
          const cat = i.category?.toLowerCase();
          return ["fries", "addons", "drinks", "drink", "other", "others"].includes(cat);
        });
        setSuggestions(filtered);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [item]);

  if (!item) return null;

  const handleAddToCart = () => {
    const existingCart = sessionStorage.getItem("cart");
  const cartItems: (MenuItemType & { quantity: number })[] = existingCart
    ? JSON.parse(existingCart)
    : [];
    // Check if item already exists in cart
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += quantity; 
    } else {
      cartItems.push({ ...item, quantity }); 
    }
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(`Added ${item.name} to cart`);
  };
  const addToCartSession = (menuItem: MenuItemType, qty = 1) =>{ 
    const existingCart = sessionStorage.getItem("cart");
    const cartItems: (MenuItemType & { quantity: number })[] = existingCart
    ? JSON.parse(existingCart)
    : [];
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += quantity; 
    } else {
      cartItems.push({ ...item, quantity }); 
    }
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated")); 
    toast.success(`Added ${item.name} to cart`);
  }
  

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl w-full mx-auto rounded-2xl p-6 md:p-8 bg-white shadow-lg 
        overflow-hidden max-h-[75vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center md:text-left">{item.name}</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto mt-4 pr-1">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full md:w-1/2 h-56 object-cover rounded-2xl"
            />

            {/* Right: Details */}
            <div className="flex-1 flex flex-col justify-between">
              <p className="text-muted-foreground mb-3">{item.description}</p>
              <p className="text-2xl font-semibold mb-4 text-primary">
                £{item.price.toFixed(2)}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={handleAddToCart} className="w-full md:w-auto">
                Add {quantity > 1 ? `${quantity} to Cart` : "to Cart"}
              </Button>
            </div>
          </div>

          {/* Suggested Items Section */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Add a Side or Drink</h3>

            {loading ? (
              <p className="text-muted-foreground">Loading suggestions...</p>
            ) : suggestions.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {suggestions.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    className="group relative p-3 border rounded-xl hover:shadow-md transition-all"
                  >
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                    />
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        £{s.price.toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => addToCartSession(s, 1)}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No suggestions available.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
