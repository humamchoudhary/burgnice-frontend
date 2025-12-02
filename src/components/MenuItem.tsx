import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItem as APIMenuItem } from "@/services/api";

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
  onAddToCart: () => void; // Changed: no item passed, parent already knows
}

export const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="aspect-square overflow-hidden bg-accent">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-foreground">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">£{item.price.toFixed(2)}</span>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click from opening modal
              onAddToCart();
            }}
            size="icon"
            className="rounded-full transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
