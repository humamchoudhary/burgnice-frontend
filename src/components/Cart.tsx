import { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingBag, Award, Sparkles } from "lucide-react";
import { MenuItemType } from "./MenuItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

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
    const validItems = cartItems.filter((item) => item && item.id);

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
          quantity: 1,
        });
      }
    });

    setItems(Array.from(aggregatedMap.values()));
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updatedItems = items
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((i) => i.quantity > 0); // remove if 0

    setItems(updatedItems);
    updateSessionStorage(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    updateSessionStorage(updatedItems);
  };

  const updateSessionStorage = (items: CartItem[]) => {
    // Flatten items array with quantities
    const flattened = items.flatMap((item) =>
      Array(item.quantity).fill({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        categories: item.categories,
      }),
    );

    sessionStorage.setItem("cart", JSON.stringify(flattened));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const clearCart = () => {
    setItems([]);
    sessionStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
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

  // Close cart when clicking outside (backdrop)
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md">
          <div className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-xl">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Cart
                  </h2>
                </div>
                {itemCount > 0 && (
                  <span className="h-6 px-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="relative mb-6">
                  <ShoppingBag className="h-20 w-20 text-gray-400 opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Your cart is empty
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                  Add some delicious burgers, ice cream, or drinks to get
                  started!
                </p>
                <button
                  className="mt-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    onClose();
                    navigate("/menu");
                  }}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-primary/30"
                    >
                      <div className="relative">
                        <img
                          src={`${UPLOAD_BASE_URL}${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold">
                            {item.quantity}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          <button
                            className="h-8 w-8 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-col items-end md:flex-row md:items-center justify-between mt-3">
                          <p className="text-sm font-bold text-primary">
                            £{(item.price * item.quantity).toFixed(2)}
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-normal ml-1">
                              (£{item.price.toFixed(2)} each)
                            </span>
                          </p>

                          <div className="flex items-center bg-white dark:bg-gray-900 rounded-full px-1.5 py-0.5 border border-gray-200 dark:border-gray-800">
                            <button
                              className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center text-gray-900 dark:text-white mx-1">
                              {item.quantity}
                            </span>
                            <button
                              className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6 px-6 space-y-4 bg-gradient-to-t from-white dark:from-gray-900 via-white dark:via-gray-900 to-transparent">
                  {/* Loyalty Points Section */}
                  {isAuthenticated ? (
                    <div className="space-y-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            Loyalty Points
                          </span>
                        </div>
                        {loading ? (
                          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="font-bold text-primary">
                              {user?.loyaltyPoints || 0}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              points
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Points from this order
                          </span>
                          <span className="font-semibold text-primary">
                            +{pointsEarned}
                          </span>
                        </div>

                        {savings > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Points discount
                            </span>
                            <span className="font-semibold text-green-600">
                              -£{savings.toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-primary/10">
                          💡 Earn 1 point for every £10 spent. 100 points = £10
                          discount.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">
                            Earn Loyalty Points!
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Sign in to earn {pointsEarned} points from this
                            order
                          </p>
                        </div>
                        <button
                          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                          onClick={() => {
                            onClose();
                            // Trigger auth modal from parent component
                            window.dispatchEvent(new Event("open-auth-modal"));
                          }}
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Order Totals */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal ({itemCount} items)
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          £{total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Delivery Fee
                        </span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>

                      {savings > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Loyalty Discount
                          </span>
                          <span className="text-green-600 font-medium">
                            -£{savings.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-gray-800" />

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          Total
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Including VAT
                        </p>
                      </div>
                      <div className="text-right">
                        {savings > 0 && (
                          <p className="text-sm text-gray-600 line-through mb-1">
                            £{total.toFixed(2)}
                          </p>
                        )}
                        <p className="text-2xl font-bold text-primary">
                          £{finalTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pb-6">
                    <button
                      className="w-full h-12 px-6 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                      onClick={goToCheckout}
                    >
                      Proceed to Checkout
                    </button>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => {
                          clearCart();
                        }}
                      >
                        Clear Cart
                      </button>
                      <button
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={onClose}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
