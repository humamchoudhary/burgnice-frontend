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
import { Loader2, Sparkles } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Preparing Your Experience</h2>
            <p className="text-muted-foreground mt-2">Loading Burg N Ice...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Hero Section - Enhanced */}
      <section className="relative h-[90vh] min-h-[700px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Delicious burger at Burg N Ice Manchester"
            className="w-full h-full object-cover object-center scale-110 animate-parallax transition-transform duration-3000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="max-w-5xl text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Manchester's Favourite Since 2020</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
              BURG N ICE
            </h1>
            
            <p className="text-3xl md:text-4xl font-bold mb-4 text-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Artisan Burgers</span>
              <span className="mx-4">•</span>
              <span className="bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">Handcrafted Ice Cream</span>
            </p>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Where quality meets creativity. Experience Manchester's finest handcrafted burgers and premium artisan ice cream made with locally-sourced ingredients.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Link to="/menu">
                <Button size="lg" className="group text-lg h-16 px-12 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 font-semibold">
                  <span className="flex items-center gap-2">
                    Order Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg h-16 px-12 rounded-full border-2 hover:bg-accent/50 hover:border-accent transition-all duration-300 font-semibold backdrop-blur-sm">
                  Discover Our Story
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Fresh Ingredients Daily</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Locally Sourced</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>Free Delivery Over £15</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Icons */}
      <ServiceIcons />

      {/* About Section - Enhanced */}
      <section className="py-24 relative overflow-hidden scroll-fade-in">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Our Philosophy</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-foreground">
              Crafting Moments of{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Joy</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -rotate-1"></span>
              </span>
            </h2>
            
            <div className="prose prose-lg mx-auto text-muted-foreground leading-relaxed space-y-6">
              <p className="text-xl md:text-2xl font-light">
                Born in the heart of Manchester, Burg N Ice fuses the city's vibrant energy with our passion for culinary excellence.
              </p>
              <p className="text-lg">
                We believe every meal should be an experience. That's why we meticulously source ingredients from local suppliers, 
                handcraft each burger with artisanal techniques, and churn our ice cream daily for maximum freshness. From our 
                signature Manchester Burger to our seasonal ice cream flavors, every creation tells a story of quality, creativity, 
                and community connection.
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-background to-accent/5 border border-accent/10">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Local Ingredients</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-background to-accent/5 border border-accent/10">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Menu Items</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-background to-accent/5 border border-accent/10">
                <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-background to-accent/5 border border-accent/10">
                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                <div className="text-sm text-muted-foreground">Fresh Prep</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      {categories.length > 0 && (
        <section className="py-24 relative scroll-fade-in">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"></div>
          <div className="relative container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">Explore</span>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Our Culinary{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Collections</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated menu categories, each crafted with passion and precision
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <div 
                  key={category.title} 
                  className="scroll-fade-in group" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard {...category} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/menu">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg group">
                  <span className="flex items-center gap-2">
                    View Full Menu
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
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