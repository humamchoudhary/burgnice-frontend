import { menuItemAPI, MenuItem } from "@/services/api";
import { useState, useEffect } from "react";
// Remove the hardcoded deals array and interface
//
const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

import { useOutletContext } from "react-router-dom";
type LayoutContext = {
  onAddToCart: (item: MenuItem) => void;
};

export default function TopDealsGrid() {
  const { onAddToCart } = useOutletContext<LayoutContext>();
  const [deals, setDeals] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTopDeals();
  }, []);

  const fetchTopDeals = async () => {
    try {
      setLoading(true);
      const topDeals = await menuItemAPI.getTopDeals(4); // Get top 4 deals
      setDeals(topDeals);
    } catch (error) {
      console.error("Error fetching top deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (item: MenuItem) => {
    const existingCart = sessionStorage.getItem("cart");
    const cartItems: (MenuItem & { quantity: number })[] = existingCart
      ? JSON.parse(existingCart)
      : [];
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated"));
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  if (loading) {
    return <div className="py-12 text-center">Loading top deals...</div>;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">TOP DEALS</h2>
          <div
            className="mt-1 w-16 h-1 rounded-full"
            style={{ backgroundColor: "#a63872" }}
          />
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="px-4 py-2">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={`${UPLOAD_BASE_URL}${deal.image}`}
                    alt={deal.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {deal.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[60px]">
                  {deal.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    $ {deal.price.toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(deal)}
                  className="w-full text-white font-bold py-3 px-6 rounded-full transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#a63872" }}
                >
                  + ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
