// services/paymentUtils.ts
import { stripeAPI } from "./api";

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface PaymentData {
  items: PaymentItem[];
  customerName: string;
  contactPhone: string;
  deliveryAddress: string;
  orderType: "delivery" | "pickup";
  notes?: string;
  discountAmount?: number;
  loyaltyPointsUsed?: number;
  subtotal: number;
  total: number;
}

export class PaymentProcessor {
  /**
   * Handle card payment flow
   */
  static async processCardPayment(data: PaymentData) {
    try {
      // Create Stripe checkout session
      const session = await stripeAPI.processCardPayment(data);

      if (session.url) {
        // Store order ID in session storage for recovery
        sessionStorage.setItem("pendingOrderId", session.orderId);
        sessionStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            orderId: session.orderId,
            timestamp: new Date().toISOString(),
            total: data.total,
          }),
        );

        // Redirect to Stripe
        window.location.href = session.url;
        return { success: true, redirecting: true };
      }

      throw new Error("No payment URL received");
    } catch (error: any) {
      console.error("Payment processing failed:", error);
      return {
        success: false,
        error: error.message || "Payment processing failed",
      };
    }
  }

  /**
   * Check if there's a pending payment that needs recovery
   */
  static hasPendingPayment(): boolean {
    const pendingPayment = sessionStorage.getItem("pendingPayment");
    if (!pendingPayment) return false;

    const { timestamp } = JSON.parse(pendingPayment);
    const timeElapsed = Date.now() - new Date(timestamp).getTime();

    // Clear if more than 1 hour has passed
    if (timeElapsed > 60 * 60 * 1000) {
      this.clearPendingPayment();
      return false;
    }

    return true;
  }

  /**
   * Get pending payment details
   */
  static getPendingPayment() {
    const pendingPayment = sessionStorage.getItem("pendingPayment");
    return pendingPayment ? JSON.parse(pendingPayment) : null;
  }

  /**
   * Clear pending payment data
   */
  static clearPendingPayment() {
    sessionStorage.removeItem("pendingPayment");
    sessionStorage.removeItem("pendingOrderId");
  }

  /**
   * Verify payment status for an order
   */
  static async verifyPayment(orderId: string): Promise<{
    paid: boolean;
    order: any;
    sessionStatus?: string;
  }> {
    try {
      const status = await stripeAPI.checkStatus(orderId);

      if (status.paid) {
        // Clear cart and checkout data on successful payment
        sessionStorage.removeItem("cart");
        sessionStorage.removeItem("checkoutData");
        window.dispatchEvent(new Event("cart-updated"));

        // Clear pending payment
        this.clearPendingPayment();
      }

      return status;
    } catch (error) {
      console.error("Payment verification failed:", error);
      throw error;
    }
  }

  /**
   * Handle payment cancellation
   */
  static handlePaymentCancellation() {
    // Keep cart items for retry
    const cart = sessionStorage.getItem("cart");
    const checkoutData = sessionStorage.getItem("checkoutData");

    // Clear only pending payment data
    this.clearPendingPayment();

    return {
      cart: cart ? JSON.parse(cart) : [],
      checkoutData: checkoutData ? JSON.parse(checkoutData) : null,
    };
  }

  /**
   * Format payment amount for display
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  }

  /**
   * Calculate payment fees (if any)
   */
  static calculateFees(amount: number): {
    serviceFee: number;
    totalWithFees: number;
  } {
    // Example: 2.9% + £0.30 Stripe fee
    const serviceFee = amount * 0.029 + 0.3;
    return {
      serviceFee: parseFloat(serviceFee.toFixed(2)),
      totalWithFees: parseFloat((amount + serviceFee).toFixed(2)),
    };
  }
}
