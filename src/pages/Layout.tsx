import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cart, CartItem } from "@/components/Cart";
import { MenuItemType } from "@/components/MenuItem";
import { toast } from "sonner";

export const Layout = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: MenuItemType) => {
    console.log(item);
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      // if (existingItem) {
      //   toast.success(`Added another ${item.name} to cart`);
      //   return prev.map((i) =>
      //     i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      //   );
      // }
      toast.success(`${item.name} added to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
      />
      <main className="flex-1 pt-20">
        <Outlet context={{ onAddToCart: handleAddToCart, cartItemCount }} />
      </main>
      <Footer />
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};
