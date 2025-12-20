import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { ServiceIcons } from "@/components/ServiceIcons";
import { VisualGrid } from "@/components/VisualGrid";
import { Link } from "react-router-dom";
import { categoryAPI } from "@/services/api";

// Only import images that actually exist
import heroImage from "@/assets/hero-burger.jpg";
import burgerImage from "@/assets/category-burgers.jpeg";
import maybeamilkshakeImage from "@/assets/category-maybeamilkshake.jpeg";
import smashBurgerImage from "@/assets/category-smashedburgers.jpeg";

// Fallback category images array
const fallbackImages = [
  burgerImage,
  maybeamilkshakeImage,
  smashBurgerImage,
  burgerImage, // Reuse existing images as fallbacks
  maybeamilkshakeImage,
  smashBurgerImage
];

interface HomeProps {
  onAddToCart?: (item: any) => void;
}

export const Home = ({ onAddToCart }: HomeProps) => {
  const [categories, setCategories] = useState<
    Array<{ title: string; image: string; link: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await categoryAPI.getAll();

        // Map categories with fallback images
        const mappedCategories = categoriesData.slice(0, 6).map((cat, index) => {
          // Use fallback image if category image doesn't exist
          const image = fallbackImages[index] || burgerImage;
          
          return {
            title: cat.name,
            image: image,
            link: `/menu?category=${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
          };
        });

        // If we don't have enough categories from API, add some defaults
        if (mappedCategories.length < 6) {
          const defaultTitles = ["Burgers", "Ice Cream", "Smashed Burgers", "Drinks", "Sides", "Desserts"];
          
          for (let i = mappedCategories.length; i < 6; i++) {
            mappedCategories.push({
              title: defaultTitles[i],
              image: fallbackImages[i] || burgerImage,
              link: `/menu?category=${defaultTitles[i].toLowerCase().replace(/\s+/g, "-")}`,
            });
          }
        }

        setCategories(mappedCategories.slice(0, 6));
      } catch (err) {
        console.error("Error fetching home data:", err);
        // Fallback categories with only the images we know exist
        setCategories([
          { title: "Burgers", image: burgerImage, link: "/menu?category=burgers" },
          { title: "Ice Cream", image: maybeamilkshakeImage, link: "/menu?category=ice-cream" },
          { title: "Smashed Burgers", image: smashBurgerImage, link: "/menu?category=smashed-burgers" },
          { title: "Drinks", image: maybeamilkshakeImage, link: "/menu?category=drinks" },
          { title: "Sides", image: burgerImage, link: "/menu?category=sides" },
          { title: "Desserts", image: maybeamilkshakeImage, link: "/menu?category=desserts" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base text-gray-600">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Hero Section - Minimal */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Burg N Ice Manchester"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-white mb-4">
            BURG N ICE
          </h1>
          <p className="text-lg text-gray-200 mb-12 max-w-md mx-auto">
            Manchester
          </p>
          
          <Link to="/menu">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-12 py-6 text-base font-medium border-0 hover:scale-105 transition-transform"
            >
              Order Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Service Icons */}
      <ServiceIcons />

      {/* Visual Grid */}
      <VisualGrid />

      {/* Menu Categories Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-a63872 mb-2">Menu</h2>
            <p className="text-gray-600">Explore our offerings</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden aspect-square bg-gray-100"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-200">View</span>
                    <ArrowRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/menu">
              <Button
                variant="outline"
                className="border-a63872 text-a63872 hover:bg-a63872 hover:text-white px-10 py-5 text-base rounded-none transition-colors"
              >
                View All Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialCarousel />

    </div>
  );
};