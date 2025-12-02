import { Flame, Truck } from "lucide-react";

export const PromoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 px-4 animate-fade-in">
      <div className="container mx-auto flex items-center justify-center gap-6 text-sm md:text-base font-medium">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 animate-pulse" />
          <span>2-for-1 Tuesdays!</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Free delivery over £15</span>
        </div>
      </div>
    </div>
  );
};
