import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ServiceIcons } from "@/components/ServiceIcons";
import HorizontalMenuGrid from "@/components/HorizontalMenuGrid";
import { Link } from "react-router-dom";
import { categoryAPI } from "@/services/api";
import  TopDealsGrid  from "@/components/TopDealGrid";

// In your Home component, replace or add:

import heroImage from "@/assets/hero.png";
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
            #1 in Northwich
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

      {/* Horizontal Grid */}
      <HorizontalMenuGrid />
        <TopDealsGrid onAddToCart={onAddToCart} />
      
      <TestimonialCarousel />

    </div>
  );
};