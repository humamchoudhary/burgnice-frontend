import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { ServiceIcons } from "@/components/ServiceIcons";
import { FeaturedItems } from "@/components/FeaturedItems";
import { Link } from "react-router-dom";
import { MenuItemType, convertMenuItem } from "@/components/MenuItem";
import { categoryAPI, menuItemAPI } from "@/services/api";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-burger.jpg";
import burgersImage from "@/assets/category-burgers.jpg";
import friesImage from "@/assets/category-fries.jpg";
import icecreamImage from "@/assets/category-icecream.jpg";
import drinksImage from "@/assets/category-drinks.jpg";

// Fallback images for categories
const categoryImages: { [key: string]: string } = {
  burgers: burgersImage,
  fries: friesImage,
  icecream: icecreamImage,
  ice: icecreamImage,
  drinks: drinksImage,
  beverage: drinksImage,
  beverages: drinksImage,
};

interface HomeProps {
  onAddToCart?: (item: MenuItemType) => void;
}

export const Home = ({ onAddToCart }: HomeProps) => {
  const handleAddToCart = onAddToCart || (() => {});
  const [categories, setCategories] = useState<Array<{ title: string; image: string; link: string }>>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories and menu items
        const [categoriesData, menuData] = await Promise.all([
          categoryAPI.getAll(),
          menuItemAPI.getAll()
        ]);

        // Map categories with fallback images
        const mappedCategories = categoriesData.map(cat => {
          const slug = cat.name.toLowerCase().replace(/\s+/g, '');
          const image = categoryImages[slug] || burgersImage; // Default to burgers image
          
          return {
            title: cat.name,
            image: image,
            link: `/menu?category=${slug}`
          };
        });

        // Get first 4 items as featured
        const convertedItems = menuData.slice(0, 4).map(convertMenuItem);

        setCategories(mappedCategories);
        setFeaturedItems(convertedItems);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load data. Using fallback content.');
        
        // Fallback categories if API fails
        setCategories([
          { title: "Burgers", image: burgersImage, link: "/menu?category=burgers" },
          { title: "Fries", image: friesImage, link: "/menu?category=fries" },
          { title: "Ice Cream", image: icecreamImage, link: "/menu?category=icecream" },
          { title: "Drinks", image: drinksImage, link: "/menu?category=drinks" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-background via-accent/30 to-secondary">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Delicious burger at Burg N Ice Manchester"
            className="w-full h-full object-cover opacity-20 animate-parallax"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Manchester's{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Finest
              </span>{" "}
              Burgers & Ice Cream
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Handcrafted with love, delivered with care. Experience the perfect blend of flavor and freshness.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button size="lg" className="text-lg h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg h-14 px-8 hover:bg-secondary transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Icons */}
      <ServiceIcons />

      {/* About Section */}
      <section className="py-20 bg-secondary/30 scroll-fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Welcome to Burg N Ice</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Born in the heart of Manchester, Burg N Ice combines the city's vibrant food culture with our passion for creating exceptional burgers and artisan ice cream. We source locally, cook with care, and serve with a smile. Every bite tells a story of quality, creativity, and community.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20 scroll-fade-in">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-foreground">Explore Our Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <div key={category.title} className="scroll-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CategoryCard {...category} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Items Section */}
      {featuredItems.length > 0 && (
        <FeaturedItems items={featuredItems} onAddToCart={handleAddToCart} />
      )}

      {/* Testimonials Section */}
      <TestimonialCarousel />
    </div>
  );
};
