import {
  Plus,
  Star,
  Flame,
  Leaf,
  Sparkles,
  ChefHat,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem as APIMenuItem } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  prepTime?: number;
  calories?: number;
}

export const convertMenuItem = (apiItem: APIMenuItem): MenuItemType => {
  const categoryName =
    typeof apiItem.category === "object" && apiItem.category !== null
      ? apiItem.category.name
      : apiItem.category;

  return {
    id: apiItem._id,
    name: apiItem.name,
    description: apiItem.description,
    price: apiItem.price,
    image: apiItem.image || "",
    category: categoryName || "",
    prepTime: apiItem.prepTime,
    calories: apiItem.calories,
  };
};

interface MenuItemProps {
  item: MenuItemType;
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

  const isPopular = item.price > 15;
  const isVegetarian =
    item.category.toLowerCase().includes("vegetarian") ||
    item.name.toLowerCase().includes("veggie") ||
    item.name.toLowerCase().includes("vegan");
  const isSpicy =
    item.name.toLowerCase().includes("spicy") ||
    item.name.toLowerCase().includes("hot") ||
    item.name.toLowerCase().includes("fiery");
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
      <Card className="group relative overflow-hidden border border-border/40 bg-background hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {item.name}
                </h3>
                {isSpicy && (
                  <Flame className="h-3 w-3 text-orange-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-lg">
                  £{item.price.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddToCart}
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-primary/5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10"></div>
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
            <Badge className="bg-background/95 backdrop-blur-md border border-primary/20 text-primary font-bold px-3 py-1 shadow-lg">
              {item.category}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
            {isChefSpecial && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 shadow-lg">
                <ChefHat className="h-3 w-3 mr-1" />
                Chef's Special
              </Badge>
            )}
            {isPopular && (
              <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 shadow-lg">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
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

              <p className="text-muted-foreground leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
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
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {item.prepTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.prepTime} min
                    </div>
                  )}
                  {item.calories && <div>{item.calories} cal</div>}
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="rounded-xl px-8 py-6 bg-gradient-to-r from-primary via-primary/90 to-primary shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group/btn relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <Plus className="h-5 w-5" />
                  <span className="font-bold text-lg">Add to Order</span>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border/40 bg-gradient-to-b from-background to-secondary/5 rounded-2xl",
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
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/20 to-transparent -translate-x-full animate-shimmer"></div>

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
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Category badge with subtle animation */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className={cn(
              "bg-background/95 backdrop-blur-sm border border-border/50",
              "font-medium px-3 py-1.5 shadow-md",
              "transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg",
            )}
          >
            {item.category}
          </Badge>
        </div>

        {/* Feature badges with staggered animation */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {isChefSpecial && (
            <Badge
              className={cn(
                "bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white px-3 py-1.5",
                "shadow-lg backdrop-blur-sm border border-amber-400/30",
                "transition-all duration-300 delay-75",
                isHovered
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0",
              )}
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              Special
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm border border-amber-400/30">
              <Star className="h-3 w-3 mr-1.5" />
              Popular
            </Badge>
          )}
          {isVegetarian && (
            <Badge className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm border border-green-400/30">
              <Leaf className="h-3 w-3 mr-1.5" />
              Veggie
            </Badge>
          )}
          {isSpicy && (
            <Badge className="bg-gradient-to-r from-red-500/90 to-orange-500/90 text-white px-3 py-1.5 shadow-lg backdrop-blur-sm border border-red-400/30">
              <Flame className="h-3 w-3 mr-1.5" />
              Spicy
            </Badge>
          )}
          {isQuickPrep && (
            <Badge
              className={cn(
                "bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white px-3 py-1.5",
                "shadow-lg backdrop-blur-sm border border-blue-400/30",
                "transition-all duration-300 delay-150",
                isHovered
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0",
              )}
            >
              <Clock className="h-3 w-3 mr-1.5" />
              Quick
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
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
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                {item.prepTime} min prep
              </div>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            size="default"
            className={cn(
              "rounded-full px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80",
              "text-white shadow-lg hover:shadow-xl hover:scale-105",
              "transition-all duration-300 group/btn relative overflow-hidden",
              "border border-primary/30",
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

            <span className="flex items-center gap-2 relative z-10">
              <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90 duration-300" />
              <span className="font-semibold">Add</span>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Add to your global CSS or Tailwind config:
/*
 */
