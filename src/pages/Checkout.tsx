import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { Loader2, Tag, Award } from "lucide-react";
import { toast } from "sonner";
import { orderAPI } from "@/services/api";

const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({
    customerName: "",
    contactPhone: "",
    deliveryAddress: "",
    paymentMethod: "COD",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  // Load cart items and checkout data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("cart");
    const checkoutData = sessionStorage.getItem("checkoutData");
    const savedOrderType = sessionStorage.getItem("orderType") as "delivery" | "pickup";

    if (savedOrderType) {
      setOrderType(savedOrderType);
    }

    if (stored) {
      const cartItems = JSON.parse(stored);
      const aggregated: Record<string, CartItem> = {};
      cartItems.forEach((item: any) => {
        if (!item) return;
        if (aggregated[item.id]) {
          aggregated[item.id].quantity += 1;
        } else {
          aggregated[item.id] = { ...item, quantity: 1 };
        }
      });
      setItems(Object.values(aggregated));
    }

    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      setUseLoyaltyPoints(data.useLoyaltyPoints || false);
      setDiscountAmount(data.discountAmount || 0);
      setPointsUsed(data.pointsUsed || 0);
    }

    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: user.username,
      }));
    }

    // Listen for order type changes
    const handleOrderTypeChange = (e: CustomEvent) => {
      setOrderType(e.detail);
    };

    window.addEventListener("order-type-changed", handleOrderTypeChange as EventListener);

    return () => {
      window.removeEventListener("order-type-changed", handleOrderTypeChange as EventListener);
    };
  }, [user]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const pointsEarned = Math.floor(subtotal / 10);
  const total = Math.max(0, subtotal - discountAmount);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const placeOrder = async () => {
    // Validate required fields based on order type
    if (!form.customerName || !form.contactPhone) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Only require delivery address if order type is delivery
    if (orderType === "delivery" && !form.deliveryAddress) {
      toast.error("Please enter your delivery address.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderItems = items.map((item) => ({
      menuItem: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const payload = {
      orderItems: orderItems,
      subtotal: subtotal,
      discountAmount: discountAmount,
      loyaltyPointsUsed: pointsUsed,
      total: total,
      deliveryAddress: orderType === "delivery" ? form.deliveryAddress : "Pickup Order",
      paymentMethod: form.paymentMethod,
      notes: form.notes,
      contactPhone: form.contactPhone,
      customerName: form.customerName,
      status: "pending" as const,
      loyaltyPointsEarned: pointsEarned,
      orderType: orderType, // Add order type to payload
    };

    setLoading(true);
    try {
      const response = await orderAPI.create(payload);

      toast.success("Order placed successfully!");

      if (isAuthenticated) {
        if (response.loyaltyPointsEarned) {
          toast.success(
            `You earned ${response.loyaltyPointsEarned} loyalty points!`,
          );
        }
        if (pointsUsed > 0) {
          toast.info(
            `You used ${pointsUsed} loyalty points for a £${discountAmount.toFixed(2)} discount!`,
          );
        }
      }

      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("checkoutData");
      window.dispatchEvent(new Event("cart-updated"));

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Delivery Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
              <div className="p-6 pb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {orderType === "delivery" ? "Delivery Information" : "Pickup Information"}
                </h2>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name *
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    placeholder="Enter your name"
                    value={form.customerName}
                    onChange={(e) =>
                      updateField("customerName", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={form.contactPhone}
                    onChange={(e) =>
                      updateField("contactPhone", e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Conditionally render delivery address only for delivery orders */}
                {orderType === "delivery" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="deliveryAddress"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Delivery Address *
                    </label>
                    <input
                      id="deliveryAddress"
                      type="text"
                      placeholder="Street, City, House #"
                      value={form.deliveryAddress}
                      onChange={(e) =>
                        updateField("deliveryAddress", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}

                {/* Show pickup info message for pickup orders */}
                {orderType === "pickup" && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      📍 You'll receive a call when your order is ready for pickup at our location.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Order Notes (Optional)
                  </label>
                  <input
                    id="notes"
                    type="text"
                    placeholder="Any special instructions?"
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
              <div className="p-6 pb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Payment Method
                </h2>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="COD"
                      checked={form.paymentMethod === "COD"}
                      onChange={(e) =>
                        updateField("paymentMethod", e.target.value)
                      }
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="cod"
                      className="text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Cash on {orderType === "delivery" ? "Delivery" : "Pickup"}
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 pl-6">
                    Pay when you {orderType === "delivery" ? "receive" : "collect"} your order
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="CARD"
                      checked={form.paymentMethod === "CARD"}
                      onChange={(e) =>
                        updateField("paymentMethod", e.target.value)
                      }
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="card"
                      className="text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Debit/Credit Card
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 pl-6">
                    Pay first for hassle free {orderType === "delivery" ? "delivery" : "pickup"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 sticky top-24">
              <div className="p-6 pb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Order Summary
                </h2>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`${UPLOAD_BASE_URL}${item.image}`}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              £{item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-gray-200 dark:bg-gray-800" />

                  {/* Loyalty Points Discount */}
                  {isAuthenticated &&
                    useLoyaltyPoints &&
                    discountAmount > 0 && (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-300">
                              Loyalty Discount Applied
                            </span>
                          </div>
                          <span className="text-lg font-bold text-green-700 dark:text-green-400">
                            -£{discountAmount.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          You used {pointsUsed} points (
                          {Math.floor(pointsUsed / 10) * 10}% discount)
                        </p>
                      </div>
                    )}

                  {/* Loyalty Points Earned */}
                  {isAuthenticated && (
                    <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Loyalty Points Earned
                          </span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          +{pointsEarned}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        You'll earn 1 point for every £10 spent
                      </p>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        £{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        {orderType === "delivery" ? "Delivery" : "Pickup"}
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Loyalty Discount
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          -£{discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-primary">£{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Loyalty Points Note */}
                  {isAuthenticated &&
                    !useLoyaltyPoints &&
                    user?.loyaltyPoints &&
                    user.loyaltyPoints >= 10 &&
                    total >= 10 && (
                      <div className="p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                          💡 You have {user.loyaltyPoints} loyalty points
                          available. Go back to cart to apply{" "}
                          {Math.floor(user.loyaltyPoints / 10) * 10}% discount!
                        </p>
                      </div>
                    )}

                  {/* Place Order Button */}
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full px-6 py-4 text-lg font-medium rounded-lg bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Order...
                      </span>
                    ) : (
                      `Place Order - £${total.toFixed(2)}`
                    )}
                  </button>

                  {/* Security Notice */}
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                    🔒 Your payment information is secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};