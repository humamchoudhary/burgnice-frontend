import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/authContext";
import { Loader2, Tag, Award } from "lucide-react";
import { toast } from "sonner";
import { orderAPI } from "@/services/api";

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
    
    if (stored) {
      const cartItems = JSON.parse(stored);
      // Aggregate quantities
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

    // Load loyalty points preferences
    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      setUseLoyaltyPoints(data.useLoyaltyPoints || false);
      setDiscountAmount(data.discountAmount || 0);
      setPointsUsed(data.pointsUsed || 0);
    }

    // Pre-fill form with user data if logged in
    if (user) {
      setForm(prev => ({
        ...prev,
        customerName: user.username,
        // You can add more user data here if available
      }));
    }
  }, [user]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pointsEarned = Math.floor(subtotal / 10);
  const total = Math.max(0, subtotal - discountAmount);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const placeOrder = async () => {
    if (!form.customerName || !form.contactPhone || !form.deliveryAddress) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Format items for backend
    const orderItems = items.map(item => ({
      menuItem: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const payload = {
      orderItems: orderItems,
      subtotal: subtotal,
      discountAmount: discountAmount,
      loyaltyPointsUsed: pointsUsed,
      total: total,
      deliveryAddress: form.deliveryAddress,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
      contactPhone: form.contactPhone,
      customerName: form.customerName,
      status: 'pending' as const,
      loyaltyPointsEarned: pointsEarned
    };

    setLoading(true);
    try {
      const response = await orderAPI.create(payload);

      toast.success("Order placed successfully!");
      
      // Show loyalty points earned and used
      if (isAuthenticated) {
        if (response.loyaltyPointsEarned) {
          toast.success(`You earned ${response.loyaltyPointsEarned} loyalty points!`);
        }
        if (pointsUsed > 0) {
          toast.info(`You used ${pointsUsed} loyalty points for a £${discountAmount.toFixed(2)} discount!`);
        }
      }

      // Clear cart and checkout data
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("checkoutData");
      window.dispatchEvent(new Event("cart-updated"));

      // Redirect to home
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
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Delivery Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter your name"
                    value={form.customerName}
                    onChange={(e) => updateField("customerName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    placeholder="03XX-XXXXXXX"
                    value={form.contactPhone}
                    onChange={(e) => updateField("contactPhone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Input
                    id="deliveryAddress"
                    placeholder="Street, City, House #"
                    value={form.deliveryAddress}
                    onChange={(e) => updateField("deliveryAddress", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Any special instructions?"
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="COD"
                      checked={form.paymentMethod === "COD"}
                      onChange={(e) => updateField("paymentMethod", e.target.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="cod" className="cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Pay when you receive your order
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              £{item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Loyalty Points Discount */}
                  {isAuthenticated && useLoyaltyPoints && discountAmount > 0 && (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Loyalty Discount Applied</span>
                        </div>
                        <span className="text-lg font-bold text-green-700">
                          -£{discountAmount.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-green-600">
                        You used {pointsUsed} points ({Math.floor(pointsUsed / 10) * 10}% discount)
                      </p>
                    </div>
                  )}

                  {/* Loyalty Points Earned */}
                  {isAuthenticated && (
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Loyalty Points Earned</span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          +{pointsEarned}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You'll earn 1 point for every £10 spent
                      </p>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loyalty Discount</span>
                        <span className="text-green-600">-£{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">£{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Loyalty Points Note */}
                  {isAuthenticated && !useLoyaltyPoints && user?.loyaltyPoints && user.loyaltyPoints >= 10 && total >= 10 && (
                    <div className="p-3 bg-secondary/30 rounded-lg border">
                      <p className="text-xs text-center text-muted-foreground">
                        💡 You have {user.loyaltyPoints} loyalty points available. 
                        Go back to cart to apply {Math.floor(user.loyaltyPoints / 10) * 10}% discount!
                      </p>
                    </div>
                  )}

                  {/* Place Order Button */}
                  <Button
                    className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
                    onClick={placeOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      `Place Order - £${total.toFixed(2)}`
                    )}
                  </Button>

                  {/* Security Notice */}
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    🔒 Your payment information is secure
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};