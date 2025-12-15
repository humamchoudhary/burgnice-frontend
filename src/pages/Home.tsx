import { useState, useEffect } from "react";
import { ArrowRight, ChevronRight, Star, Heart, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { ServiceIcons } from "@/components/ServiceIcons";
import { FeaturedItems } from "@/components/FeaturedItems";
import { Link } from "react-router-dom";
import { MenuItemType } from "@/components/MenuItem";
import { categoryAPI, menuItemAPI } from "@/services/api";
import heroImage from "@/assets/hero-burger.jpg";
import maybeamilkshakeImage from "@/assets/category-maybeamilkshake.jpeg";
import burgerImage from "@/assets/category-burgers.jpeg";
import smashBurgerImage from "@/assets/category-smashedburgers.jpeg";

// Fallback images for categories
const categoryImages: { [key: string]: string } = {
  maybeamilkshake: maybeamilkshakeImage,
  smashedburgers: smashBurgerImage,
  burgers: burgerImage,
};

interface HomeProps {
  onAddToCart?: (item: MenuItemType) => void;
}

export const Home = ({ onAddToCart }: HomeProps) => {
  const handleAddToCart = onAddToCart || (() => {});
  const [categories, setCategories] = useState<
    Array<{ title: string; image: string; link: string }>
  >([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, menuData] = await Promise.all([
          categoryAPI.getAll(),
          menuItemAPI.getAll(),
        ]);

        // Map categories
        const mappedCategories = categoriesData.map((cat) => {
          const slug = cat.name.toLowerCase().replace(/\s+/g, "");
          const image = categoryImages[slug] || burgerImage;

          return {
            title: cat.name,
            image: image,
            link: `/menu?category=${slug}`,
          };
        });

        // Featured items
        const convertedItems = menuData.slice(0, 4).map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || "/placeholder-image.jpg",
          category:
            typeof item.category === "string"
              ? item.category
              : item.category.name,
        }));

        setCategories(mappedCategories);
        setFeaturedItems(convertedItems);
      } catch (err) {
        console.error("Error fetching home data:", err);
        // Fallback categories
        setCategories([
          {
            title: "Burgers",
            image: smashBurgerImage,
            link: "/menu?category=burgers",
          },
          {
            title: "Ice Cream",
            image: maybeamilkshakeImage,
            link: "/menu?category=icecream",
          },
          {
            title: "Drinks",
            image: maybeamilkshakeImage,
            link: "/menu?category=drinks",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-foreground">Loading Burg N Ice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-secondary/5">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Delicious burger at Burg N Ice Manchester"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8">
            <span className="inline-block px-6 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-sm font-medium border border-primary/20 text-primary">
              MANCHESTER'S FAVORITE SINCE 2020
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-[0.9] text-foreground">
            BURG N ICE
          </h1>
          
          <p className="text-2xl md:text-3xl lg:text-4xl mb-10 max-w-3xl mx-auto font-light text-muted-foreground">
            Where artisan burgers meet handcrafted ice cream
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all"
              >
                ORDER NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 px-10 py-6 rounded-full text-lg font-semibold"
              >
                OUR STORY
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Icons */}
      <ServiceIcons />

      {/* Featured Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Explore Our Menu</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully crafted categories, each with unique flavors and stories
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.title}
                className="group relative overflow-hidden rounded-3xl aspect-square border border-border"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{category.title}</h3>
                  <Link to={category.link}>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/20 px-6 py-2 rounded-full"
                    >
                      Explore →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Showcase */}
      {featuredItems.length > 0 && (
        <section className="py-20 bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                  <img
                    src={featuredItems[0]?.image || burgerImage}
                    alt={featuredItems[0]?.name}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute top-6 right-6 bg-background/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-bold text-lg text-foreground">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  MOST POPULAR
                </span>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
                  Our Signature Creation
                </h2>
                <h3 className="text-3xl font-bold mb-4 text-foreground">{featuredItems[0]?.name}</h3>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {featuredItems[0]?.description}
                </p>
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-3xl font-bold text-foreground">£{featuredItems[0]?.price}</span>
                  <Button
                    onClick={() => featuredItems[0] && handleAddToCart(featuredItems[0])}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full text-lg font-semibold"
                  >
                    Add to Order
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-muted-foreground">
                    <Check className="h-5 w-5 text-primary mr-3" />
                    <span>Made with 100% locally-sourced beef</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Check className="h-5 w-5 text-primary mr-3" />
                    <span>Freshly baked buns daily</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Check className="h-5 w-5 text-primary mr-3" />
                    <span>House-made signature sauce</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Why Choose Burg N Ice</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering more than just great food
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Premium Ingredients</h3>
              <p className="text-muted-foreground">
                We source only the finest local ingredients for every dish
              </p>
            </div>
            
            <div className="text-center p-8 rounded-3xl border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Crafted with Passion</h3>
              <p className="text-muted-foreground">
                Every item is handcrafted with care and attention to detail
              </p>
            </div>
            
            <div className="text-center p-8 rounded-3xl border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Exceptional Service</h3>
              <p className="text-muted-foreground">
                Our team is dedicated to making your experience memorable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      {featuredItems.length > 1 && (
        <FeaturedItems items={featuredItems.slice(1)} onAddToCart={handleAddToCart} />
      )}

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* Final CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Experience Manchester's Best?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join our community of satisfied customers who choose Burg N Ice for every occasion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 px-10 py-6 rounded-full text-lg font-semibold"
              >
                ORDER NOW
              </Button>
            </Link>
            <Link to="/locations">
              <Button
                variant="outline"
                size="lg"
                className="border-background  text-foreground  hover:bg-background/10 px-10 py-6 rounded-full text-lg font-semibold"
              >
                FIND US
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};