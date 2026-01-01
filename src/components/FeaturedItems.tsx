import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MenuItemType } from "@/components/MenuItem";

interface FeaturedItemsProps {
  items: MenuItemType[];
  onAddToCart: (item: MenuItemType) => void;
}

const UPLOAD_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000";

export const FeaturedItems = ({ items, onAddToCart }: FeaturedItemsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update button visibility on scroll
  const updateButtonVisibility = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // Small buffer
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = isMobile ? 280 : 320; // Adjust based on screen size
      const scrollAmount = cardWidth + 24; // width + gap
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
    <section className="py-12 sm:py-16 md:py-20 bg-gray-100/30 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Customer Favourites
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our most loved dishes, handpicked by our Manchester community
          </p>
        </div>

        <div className="relative">
          {/* Left Scroll Button - Always visible on mobile, hover on desktop */}
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 rounded-full shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-300 dark:border-gray-700 p-2 sm:p-3 transition-all duration-300 hover:scale-110 active:scale-95 ${
              showLeftButton ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 sm:pb-6 px-1 sm:px-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            onScroll={updateButtonVisibility}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-72 sm:w-80 snap-center group/card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 animate-fade-in bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image Container */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  <img
                    src={`${UPLOAD_BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    loading="lazy"
                  />
                  {/* Image overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      £{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onAddToCart(item)}
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-xl active:scale-95"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 rounded-full shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-300 dark:border-gray-700 p-2 sm:p-3 transition-all duration-300 hover:scale-110 active:scale-95 ${
              showRightButton ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Scroll indicator dots for mobile */}
        {isMobile && items.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            {items.slice(0, 4).map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = 288; // 72 * 4 (w-72)
                    scrollContainerRef.current.scrollTo({
                      left: index * cardWidth,
                      behavior: "smooth",
                    });
                  }
                }}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
