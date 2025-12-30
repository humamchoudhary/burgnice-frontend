import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const menuCategories = [
  {
    id: 1,
    title: "Promotion",
    link: "/menu?category=promotion",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Everyday Value",
    link: "/menu?category=value",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Ala-Carte & Combos",
    link: "/menu?category=combos",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Signature Boxes",
    link: "/menu?category=signature",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Sharing",
    link: "/menu?category=sharing",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Ice Cream",
    link: "/menu?category=ice-cream",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
  },
];

export default function HorizontalMenuGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
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
    <section className="py-8 bg-gray-50">
      <div className="relative container mx-auto px-4">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg transition-colors hidden md:block"
          style={{ backgroundColor: '#a63872' }}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg transition-colors hidden md:block"
          style={{ backgroundColor: '#a63872' }}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 px-8 md:px-12"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
          }}
        >
          {menuCategories.map((category) => (
            <a
              key={category.id}
              href={category.link}
              className="group flex-shrink-0 w-[240px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image Container */}
              <div className="relative h-[200px] bg-gray-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Title */}
              <div className="p-4 text-center">
                <h3 className="text-base font-semibold text-gray-900">
                  {category.title}
                </h3>
                {/* Underline */}
                <div className="mt-2 mx-auto w-12 h-1 rounded-full" style={{ backgroundColor: '#a63872' }} />
              </div>
            </a>
          ))}
        </div>

        {/* Hide scrollbar CSS */}
        <style>{`
          div[style*="scrollbar"] {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          div[style*="scrollbar"]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}