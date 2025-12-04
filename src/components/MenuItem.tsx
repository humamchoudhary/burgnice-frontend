import { Plus, Star, Flame, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem as APIMenuItem } from "@/services/api";
import { Badge } from "@/components/ui/badge";

export interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const convertMenuItem = (apiItem: APIMenuItem): MenuItemType => {
  const categoryName = typeof apiItem.category === 'object' && apiItem.category !== null 
    ? apiItem.category.name 
    : apiItem.category;
  
  return {
    id: apiItem._id,
    name: apiItem.name,
    description: apiItem.description,
    price: apiItem.price,
    image: apiItem.image || '',
    category: categoryName || '',
  };
};

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: () => void;
}

export const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  const isPopular = item.price > 15;
  const isVegetarian = item.category.toLowerCase().includes('ice') || item.name.toLowerCase().includes('veggie');
  const isSpicy = item.name.toLowerCase().includes('spicy') || item.name.toLowerCase().includes('hot');
  
  return (
    <Card className="group overflow-hidden border-0 bg-gradient-to-b from-background to-secondary/5 hover:to-accent/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg';
          }}
        />
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm border border-border/50 font-medium">
            {item.category}
          </Badge>
        </div>
        
        {/* Feature badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isPopular && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
          {isVegetarian && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1">
              <Leaf className="h-3 w-3 mr-1" />
              Veggie
            </Badge>
          )}
          {isSpicy && (
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1">
              <Flame className="h-3 w-3 mr-1" />
              Spicy
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div>
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              £{item.price.toFixed(2)}
            </span>
            <div className="text-xs text-muted-foreground mt-1">
              {item.price < 10 ? "Great value" : item.price < 20 ? "Premium" : "Signature"}
            </div>
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            size="default"
            className="rounded-full px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group/btn relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="flex items-center gap-2 relative z-10">
              <Plus className="h-4 w-4" />
              <span className="font-semibold">Add</span>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};