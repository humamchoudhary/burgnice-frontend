import { useRef } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItemType } from "@/components/MenuItem";

interface FeaturedItemsProps {
  items: MenuItemType[];
  onAddToCart: (item: MenuItemType) => void;
}

const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

export const FeaturedItems = ({ items, onAddToCart }: FeaturedItemsProps) => {
  console.log(items);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Customer Favourites
          </h2>
          <p className="text-lg text-muted-foreground">
            Our most loved dishes, handpicked by our Manchester community
          </p>
        </div>

        <div className="relative group">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full shadow-lg bg-background/95 backdrop-blur opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item, index) => (
              <Card
                key={item.id}
                className="flex-shrink-0 w-80 snap-center group/card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden bg-accent">
                  <img
                    src={`${UPLOAD_BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      £{item.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => onAddToCart(item)}
                      size="icon"
                      className="rounded-full transition-all duration-300 hover:scale-110 shadow-md hover:shadow-xl"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full shadow-lg bg-background/95 backdrop-blur opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
