import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/components/Cart";

export const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    contactPhone: "",
    deliveryAddress: "",
  });

  // Load cart items from localStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("cart");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const placeOrder = async () => {
    if (!form.customerName || !form.contactPhone || !form.deliveryAddress) {
      alert("Please fill all required fields.");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const payload = {
      orderItems: items.map((item) => ({ menuItem: item.id, quantity: item.quantity })),
      total,
      deliveryAddress: form.deliveryAddress,
      contactPhone: form.contactPhone,
      user: form.customerName,
      paymentMethod: "COD",
    };

    try {
      await axios.post("http://localhost:5000/api/orders", payload);

      alert("Order placed successfully!");

      // Clear cart
      sessionStorage.removeItem("cart");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Checkout</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="font-medium">Full Name</label>
            <Input
              placeholder="Enter your name"
              value={form.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Phone</label>
            <Input
              placeholder="03XX-XXXXXXX"
              value={form.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Delivery Address</label>
            <Input
              placeholder="Street, City, House #"
              value={form.deliveryAddress}
              onChange={(e) => updateField("deliveryAddress", e.target.value)}
            />
          </div>

          <Separator />

          <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>

          <Button className="w-full h-12 text-lg mt-4" onClick={placeOrder}>
            Place Order (Cash on Delivery)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
