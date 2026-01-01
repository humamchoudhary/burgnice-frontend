import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import api, { categoryAPI, menuItemAPI } from "@/services/api";

interface MenuCategory {
  id: string;
  title: string;
  link: string;
  image: string;
  isPromotion: boolean;
}

export default function HorizontalMenuGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from server
  useEffect(() => {
    const fetchCategoriesWithImages = async () => {
      try {
        setLoading(true);

        // Fetch promotion categories
        const response = await api.get("/categories/promotion"); // Note: api.get returns a response object
        const categories = response.data; // Extract data from response

        // For each promotion category, fetch its menu items to get the first item's image
        const categoryCards = await Promise.all(
          categories.map(async (category: any) => {
            try {
              // Get menu items for this category
              const menuItems = await menuItemAPI.getAll({
                category: category._id,
                isAvailable: true,
              });

              // Get the first menu item's image, or use a fallback
              let imageUrl = "/placeholder-image.jpg"; // Default fallback

              if (menuItems.length > 0 && menuItems[0].image) {
                // Use the first menu item's image
                const menuItemImage = menuItems[0].image;

                // Make sure the URL is absolute
                if (menuItemImage.startsWith("http")) {
                  imageUrl = menuItemImage;
                } else if (
                  menuItemImage.startsWith("/uploads/") ||
                  menuItemImage.startsWith("uploads/")
                ) {
                  // It's a local upload path
                  const UPLOAD_BASE_URL =
                    import.meta.env.VITE_SERVER_BASE_URL ||
                    "http://localhost:5000";
                  imageUrl = `${UPLOAD_BASE_URL}${
                    menuItemImage.startsWith("/") ? "" : "/"
                  }${menuItemImage}`;
                } else if (menuItemImage) {
                  // If it's any other string, use it as-is
                  imageUrl = menuItemImage;
                }
              }

              // If no image found, keep the default fallback
              if (!imageUrl || imageUrl === "") {
                imageUrl = "/placeholder-image.jpg";
              }

              // Create slug from category name
              const slug =
                category.slug ||
                category.name.toLowerCase().replace(/\s+/g, "");

              return {
                id: category._id,
                title: category.name,
                link: `/menu?category=${slug}`,
                image: imageUrl,
                isPromotion: category.promotion || false,
              };
            } catch (err) {
              console.error(
                `Failed to fetch menu items for category ${category.name}:`,
                err,
              );
              // Return category with fallback image
              return {
                id: category._id,
                title: category.name,
                link: `/menu?category=${category.name.toLowerCase().replace(/\s+/g, "-")}`,
                image: "/placeholder-image.jpg", // Simple fallback
                isPromotion: category.promotion || false,
              };
            }
          }),
        );

        setMenuCategories(categoryCards);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load menu categories");

        // Set empty array with fallback in case of error
        setMenuCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithImages();
  }, []);

  // Helper function to get appropriate image based on category name

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

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[240px] h-[250px] bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-full text-white"
            style={{ backgroundColor: "#a63872" }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (menuCategories.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">No categories available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="relative container mx-auto px-4">
        {/* Navigation Buttons - only show if there are enough categories */}
        {menuCategories.length > 4 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg transition-colors hidden md:block"
              style={{ backgroundColor: "#a63872" }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg transition-colors hidden md:block"
              style={{ backgroundColor: "#a63872" }}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 px-8 md:px-12"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {menuCategories.map((category, index) => (
            <a
              key={index}
              href={category.link}
              className="group flex-shrink-0 w-[240px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image Container */}
              <div className="relative h-[200px] bg-gray-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Title */}
              <div className="p-4 text-center">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {category.title}
                </h3>
                {/* Underline */}
                <div
                  className="mt-2 mx-auto w-12 h-1 rounded-full"
                  style={{ backgroundColor: "#a63872" }}
                />
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
