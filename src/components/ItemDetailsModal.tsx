import { useEffect, useState } from "react";
import { MenuItemType, convertMenuItem } from "@/components/MenuItem";
import { menuItemAPI } from "@/services/api";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

interface ItemDetailsModalProps {
  item: MenuItemType | null;
  onClose: () => void;
  onAddToCart: (item: MenuItemType) => void;
}

export const ItemDetailsModal = ({
  item,
  onClose,
  onAddToCart,
}: ItemDetailsModalProps) => {
  const [suggestions, setSuggestions] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(!!item);

  // Update open state when item changes
  useEffect(() => {
    setIsOpen(!!item);
  }, [item]);

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
          return [
            "fries",
            "addons",
            "drinks",
            "drink",
            "other",
            "others",
          ].includes(cat);
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

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  if (!item || !isOpen) return null;

  const handleAddToCart = () => {
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
  };

  const addToCartSession = (menuItem: MenuItemType, qty = 1) => {
    const existingCart = sessionStorage.getItem("cart");
    const cartItems: (MenuItemType & { quantity: number })[] = existingCart
      ? JSON.parse(existingCart)
      : [];
    const existing = cartItems.find((i) => i.id === menuItem.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cartItems.push({ ...menuItem, quantity: qty });
    }
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(`Added ${menuItem.name} to cart`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="relative max-w-3xl w-full mx-4 max-h-[75vh] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
            {item.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: Image */}
            <img
              src={`${UPLOAD_BASE_URL}${item.image}`}
              alt={item.name}
              className="w-full md:w-1/2 h-96 object-cover rounded-2xl"
            />

            {/* Right: Details */}
            <div className="flex-1 flex flex-col justify-between">
              <p className="text-gray-600 mb-3">{item.description}</p>
              <p className="text-2xl font-semibold mb-4 text-primary">
                £{item.price.toFixed(2)}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4 text-gray-700" />
                </button>
                <span className="text-lg font-semibold w-6 text-center text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4 text-gray-700" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium w-full md:w-auto"
              >
                Add {quantity > 1 ? `${quantity} to Cart` : "to Cart"}
              </button>
            </div>
          </div>

          {/* Suggested Items Section */}
        </div>
      </div>
    </div>
  );
};
