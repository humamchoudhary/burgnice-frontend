import {
  Plus,
  Star,
  Flame,
  Leaf,
  Sparkles,
  ChefHat,
  Clock,
} from "lucide-react";
import { MenuItem as APIMenuItem, Category } from "@/services/api";
import { cn } from "@/lib/utils";
import { useState } from "react";

const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

export const convertMenuItem = (apiItem: APIMenuItem): APIMenuItem => {
  let categoriesArray: string[] = [];

  if (Array.isArray(apiItem.categories)) {
    categoriesArray = apiItem.categories.map((cat: any) => {
      if (typeof cat === "object" && cat !== null) {
        return cat.name || cat._id || String(cat);
      }
      return String(cat || "");
    });
  } else if (apiItem.category) {
    if (typeof apiItem.category === "object" && apiItem.category !== null) {
      categoriesArray = [
        apiItem.category.name ||
          apiItem.category._id ||
          String(apiItem.category),
      ];
    } else {
      categoriesArray = [String(apiItem.category)];
    }
  }

  return {
    id: apiItem.id,
    name: apiItem.name,
    description: apiItem.description,
    price: apiItem.price,
    image: apiItem.image || "",
    categories: categoriesArray,
  };
};

interface MenuItemProps {
  item: APIMenuItem;
  onAddToCart: () => void;
  variant?: "default" | "minimal" | "featured";
}

export const MenuItem = ({
  item,
  onAddToCart,
  variant = "default",
}: MenuItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get first category for badge display
  const firstCategory =
    item.categories && item.categories.length > 0
      ? item.categories[0]
      : "Menu Item";

  // Helper function to check if any category contains a keyword
  const hasCategoryKeyword = (keywords: string[]): boolean => {
    if (!item.categories || item.categories.length === 0) return false;
    const lowerKeywords = keywords.map((k) => k.toLowerCase());
    return item.categories.some((cat) =>
      lowerKeywords.some((keyword) => cat.toLowerCase().includes(keyword)),
    );
  };

  const isPopular = item.price > 15;
  const isVegetarian =
    hasCategoryKeyword(["vegetarian", "veggie", "vegan"]) ||
    item.name.toLowerCase().includes("veggie") ||
    item.name.toLowerCase().includes("vegan");
  const isSpicy =
    item.name.toLowerCase().includes("spicy") ||
    item.name.toLowerCase().includes("hot") ||
    item.name.toLowerCase().includes("fiery") ||
    hasCategoryKeyword(["spicy", "hot"]);
  const isChefSpecial = item.price > 25;
  const isQuickPrep = item.prepTime && item.prepTime < 15;

  const getPriceCategory = () => {
    if (item.price < 12)
      return { label: "Great Value", color: "text-green-600" };
    if (item.price < 22) return { label: "Premium", color: "text-amber-600" };
    return { label: "Signature", color: "text-purple-600" };
  };

  const priceCategory = getPriceCategory();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onAddToCart();
  };

  if (variant === "minimal") {
    return (
      <div className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/30 transition-all duration-300 hover:shadow-lg rounded-lg">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {item.name}
                </h3>
                {isSpicy && (
                  <Flame className="h-3 w-3 text-orange-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-lg">
                  £{item.price.toFixed(2)}
                </span>
                <button
                  onClick={handleAddToCart}
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className="group relative overflow-hidden border-0 bg-gradient-to-br from-white dark:from-gray-900 via-white dark:via-gray-900 to-primary/5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/50 dark:via-gray-900/50 to-transparent z-10"></div>
          <img
            src={
              imageError
                ? "/placeholder-image.jpg"
                : `${UPLOAD_BASE_URL}${item.image}`
            }
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />

          <div className="absolute top-4 left-4 z-20">
            <span className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-primary/20 text-primary font-bold px-3 py-1 shadow-lg rounded-full text-sm">
              {firstCategory}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
            {isChefSpecial && (
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 shadow-lg rounded-full text-sm flex items-center">
                <ChefHat className="h-3 w-3 mr-1" />
                Chef's Special
              </span>
            )}
            {isPopular && (
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 shadow-lg rounded-full text-sm flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2">
                  {isVegetarian && (
                    <div
                      className="p-1.5 bg-green-500/10 rounded-full"
                      title="Vegetarian"
                    >
                      <Leaf className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {isSpicy && (
                    <div
                      className="p-1.5 bg-orange-500/10 rounded-full"
                      title="Spicy"
                    >
                      <Flame className="h-4 w-4 text-orange-600" />
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Display all categories if available */}
              {item.categories && item.categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.categories.slice(0, 3).map((cat, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
                    >
                      {cat}
                    </span>
                  ))}
                  {item.categories.length > 3 && (
                    <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300">
                      +{item.categories.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800/50">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    £{item.price.toFixed(2)}
                  </span>
                  <span
                    className={cn("text-xs font-semibold", priceCategory.color)}
                  >
                    {priceCategory.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {item.prepTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.prepTime} min
                    </div>
                  )}
                  {item.calories && <div>{item.calories} cal</div>}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="rounded-xl px-8 py-6 bg-gradient-to-r from-primary via-primary/90 to-primary shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group/btn relative overflow-hidden text-white font-bold text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <Plus className="h-5 w-5" />
                  <span>Add to Order</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "group relative overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white dark:from-gray-900 to-gray-100/5 dark:to-gray-800/5 rounded-2xl",
        "hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1",
        "transition-all duration-500 cursor-pointer h-full flex flex-col",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background accent */}
      <div
        className={cn(
          "absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        )}
      ></div>

      {/* Image container with shimmer effect */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        {/* Image loading shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 dark:via-gray-800/20 to-transparent -translate-x-full animate-shimmer"></div>

        <img
          src={
            imageError
              ? "/placeholder-image.jpg"
              : `${UPLOAD_BASE_URL}${item.image}`
          }
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-gray-900/80 via-white/20 dark:via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Category badge with subtle animation */}
        <div className="absolute top-4 left-4">
          <span
            className={cn(
              "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 text-primary",
              "font-medium px-3 py-1.5 shadow-md rounded-full text-sm",
              "transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg",
            )}
          >
            {firstCategory}
          </span>
        </div>

        {/* Feature badges with staggered animation */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {isChefSpecial && (
            <span
              className={cn(
                "bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white px-3 py-1.5",
                "shadow-lg backdrop-blur-sm border border-amber-400/30 rounded-full text-xs flex items-center",
                "transition-all duration-300 delay-75",
                isHovered
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0",
              )}
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              Special
            </span>
          )}
          {isPopular && (
            <span className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm border border-amber-400/30 rounded-full text-xs flex items-center">
              <Star className="h-3 w-3 mr-1.5" />
              Popular
            </span>
          )}
          {isVegetarian && (
            <span className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm border border-green-400/30 rounded-full text-xs flex items-center">
              <Leaf className="h-3 w-3 mr-1.5" />
              Veggie
            </span>
          )}
          {isSpicy && (
            <span className="bg-gradient-to-r from-red-500/90 to-orange-500/90 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm border border-red-400/30 rounded-full text-xs flex items-center">
              <Flame className="h-3 w-3 mr-1.5" />
              Spicy
            </span>
          )}
          {isQuickPrep && (
            <span
              className={cn(
                "bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white px-3 py-1.5",
                "shadow-lg backdrop-blur-sm border border-blue-400/30 rounded-full text-xs flex items-center",
                "transition-all duration-300 delay-150",
                isHovered
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0",
              )}
            >
              <Clock className="h-3 w-3 mr-1.5" />
              Quick
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Display all categories if available */}
          {item.categories && item.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.categories.slice(0, 3).map((cat, index) => (
                <span
                  key={index}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
                >
                  {cat}
                </span>
              ))}
              {item.categories.length > 3 && (
                <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300">
                  +{item.categories.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-800/50">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                £{item.price.toFixed(2)}
              </span>
              <span
                className={cn("text-xs font-semibold", priceCategory.color)}
              >
                {priceCategory.label}
              </span>
            </div>
            {item.prepTime && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
                <Clock className="h-3 w-3" />
                {item.prepTime} min prep
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "rounded-full px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80",
              "text-white shadow-lg hover:shadow-xl hover:scale-105",
              "transition-all duration-300 group/btn relative overflow-hidden",
              "border border-primary/30 font-semibold flex items-center gap-2",
            )}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

            {/* Ripple effect container */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              {isHovered && (
                <div className="absolute inset-0 bg-white/10 animate-ripple rounded-full"></div>
              )}
            </div>

            <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90 duration-300 relative z-10" />
            <span className="relative z-10">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
