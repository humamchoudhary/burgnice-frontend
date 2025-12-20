import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-center">
        <div className="text-center flex-1">
          <p className="text-sm md:text-base font-medium">
            🎉 <span className="font-bold">GRAND OPENING SPECIAL</span> - 20% OFF ALL ORDERS THIS WEEK! 
            <span className="hidden md:inline"> USE CODE: <span className="font-bold">BURGNICE20</span></span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 text-primary-foreground hover:bg-primary/20"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};