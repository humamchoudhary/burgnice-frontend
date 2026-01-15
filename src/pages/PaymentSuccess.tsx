import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Clock,
  MapPin,
  Phone,
  User,
  Loader2,
} from "lucide-react";
import { checkoutAPI, orderAPI } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";

const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

export const PaymentSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    console.log(user);
    const verifyPayment = async () => {
      if (!orderId) {
        toast.error("Order ID not found");
        // navigate("/");
        return;
      }

      try {
        // Check payment status with Stripe
        const isPaid = await checkoutAPI.checkStatus(orderId);
        console.log("Paid: ", isPaid);

        if (isPaid) {
          setPaymentVerified(true);

          // Fetch order details
          const orderDetails = await orderAPI.getById(orderId);
          setOrder(orderDetails);

          // Clear cart
          sessionStorage.removeItem("cart");
          sessionStorage.removeItem("checkoutData");
          window.dispatchEvent(new Event("cart-updated"));

          toast.success("Payment successful!");
        } else {
          toast.error("Payment not completed");
          navigate(`/cancel?orderId=${orderId}`);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Failed to verify payment");
        // navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (!paymentVerified || !order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for your order. We'll start preparing it right away.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          {/* Order Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Order Number
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Paid
                </p>
                <p className="text-2xl font-bold text-primary">
                  £{order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customer Name
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.customerName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contact Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.contactPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.orderType === "pickup"
                      ? "Pickup Location"
                      : "Delivery Address"}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </h2>
            <div className="space-y-3">
              {order.orderItems.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {item.menuItem?.image && (
                      <img
                        src={`${UPLOAD_BASE_URL}${item.menuItem.image}`}
                        alt={item.menuItem?.name || item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.menuItem?.name || item.name}
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
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>£{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>
                    Loyalty Discount ({order.loyaltyPointsUsed} points)
                  </span>
                  <span>-£{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total Paid</span>
                  <span className="text-primary">
                    £{order.total.toFixed(2)}
                  </span>
                </div>
              </div>
              {order.loyaltyPointsEarned > 0 && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-center text-green-600 dark:text-green-400">
                    🎉 You earned {order.loyaltyPointsEarned} loyalty points!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>What's next?</strong> We've received your order and payment.
            {order.orderType === "pickup"
              ? " You'll receive a call when your order is ready for pickup."
              : " Your order will be ready soon."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
