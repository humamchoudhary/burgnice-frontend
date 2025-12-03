import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { ServiceIcons } from "@/components/ServiceIcons";
import { FeaturedItems } from "@/components/FeaturedItems";
import { Link } from "react-router-dom";
import { MenuItemType } from "@/components/MenuItem";
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
          const image = categoryImages[slug] || burgersImage;
          
          return {
            title: cat.name,
            image: image,
            link: `/menu?category=${slug}`
          };
        });

        // Convert menu items to MenuItemType
        const convertedItems = menuData.slice(0, 4).map(item => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || '/placeholder-image.jpg',
          category: typeof item.category === 'string' ? item.category : item.category.name,
        }));

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
      <section className="relative h-[700px] overflow-hidden bg-gradient-to-br from-background via-accent/20 to-secondary/30">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Delicious burger at Burg N Ice Manchester"
            className="w-full h-full object-cover opacity-30 scale-105 animate-parallax"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="max-w-4xl text-center animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Welcome to Manchester's Favourite</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
              BURG N ICE
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Burgers & Ice Cream
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Handcrafted perfection. Delivered fresh. Experience Manchester's finest burgers and artisan ice cream.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" className="text-lg h-16 px-10 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 font-semibold">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg h-16 px-10 rounded-full border-2 hover:bg-accent transition-all duration-300 font-semibold">
                  Our Story
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