import { Heart } from "lucide-react";
import { useState } from "react";

interface Deal {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

const deals: Deal[] = [
  {
    id: 1,
    title: "The smash",
    description: "Good Burger",
    price: 15,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Value Bucket",
    description: "Enjoy 9 pcs of our Signature Crispy Fried Chicken, hand-breaded in-house",
    price: 80,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Loaded Fries",
    description: "Big Fries",
    price: 20,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Duo Box",
    description: "The irresistible combo of 2 Signature smash burger + 2 loaded fries + drink",
    price: 30,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
  },
];

interface TopDealsGridProps {
  onAddToCart?: (deal: Deal) => void;
}

export default function TopDealsGrid({ onAddToCart }: TopDealsGridProps) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
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

  const handleAddToCart = (deal: Deal) => {
    if (onAddToCart) {
      onAddToCart(deal);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">TOP DEALS</h2>
          <div className="mt-1 w-16 h-1 rounded-full" style={{ backgroundColor: '#a63872' }} />
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Card Header with Badge and Favorite */}
              <div className="relative p-4 pb-0">
                <div className="flex items-start justify-between">
                  {/* Badge */}
                  <div className="flex gap-1">
                    <div className="w-3 h-8 rounded-sm" style={{ backgroundColor: '#a63872' }} />
                    <div className="w-3 h-8 rounded-sm" style={{ backgroundColor: '#a63872' }} />
                    <div className="w-3 h-8 rounded-sm" style={{ backgroundColor: '#a63872' }} />
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(deal.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Add to favorites"
                  >
                    <Heart
                      className={`h-6 w-6 transition-colors ${
                        favorites.has(deal.id)
                          ? "fill-current"
                          : "stroke-current"
                      }`}
                      style={{ color: favorites.has(deal.id) ? '#a63872' : '#9ca3af' }}
                    />
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="px-4 py-2">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[60px]">
                  {deal.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    $ {deal.price}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(deal)}
                  className="w-full text-white font-bold py-3 px-6 rounded-full transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#a63872' }}
                >
                  + ADD TO BUCKET
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}