import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ServiceIcons } from "@/components/ServiceIcons";
import HorizontalMenuGrid from "@/components/HorizontalMenuGrid";
import { Link } from "react-router-dom";
import { categoryAPI, MenuItem } from "@/services/api";
import TopDealsGrid from "@/components/TopDealGrid";
import { useOutletContext } from "react-router-dom";
// Import images
import heroImage from "@/assets/hero.png";
import burgerImage from "@/assets/category-burgers.jpeg";
import maybeamilkshakeImage from "@/assets/category-maybeamilkshake.jpeg";
import smashBurgerImage from "@/assets/category-smashedburgers.jpeg";

// Fallback category images array
const fallbackImages = [
  burgerImage,
  maybeamilkshakeImage,
  smashBurgerImage,
  burgerImage,
  maybeamilkshakeImage,
  smashBurgerImage,
];

type OutletContext = {
  onAddToCart: (item: MenuItem) => void;
};

export const Home = () => {
  const { onAddToCart } = useOutletContext<OutletContext>();
  const [categories, setCategories] = useState<
    Array<{ title: string; image: string; link: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  // Define background images from public folder
  const backgroundImages = [
    "/bg1.jpeg",
    // "/bg2.jpg",
    "/bg3.jpg",
    "/bg4.jpg",
    "/bg5.jpg",
  ];

  // Preload images for better quality
  useEffect(() => {
    const preloadImages = async () => {
      const loadedStatus: boolean[] = [];

      for (let i = 0; i < backgroundImages.length; i++) {
        try {
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.src = backgroundImages[i];
            img.onload = () => {
              loadedStatus[i] = true;
              resolve(true);
            };
            img.onerror = () => {
              loadedStatus[i] = false;
              console.warn(`Failed to load image: ${backgroundImages[i]}`);
              resolve(false);
            };
          });
        } catch (error) {
          loadedStatus[i] = false;
        }
      }

      setImagesLoaded(loadedStatus);
    };

    preloadImages();
  }, []);

  // Handle slide transition
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentSlide(index);

      // Reset transitioning state after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning],
  );

  // Handle next slide
  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % backgroundImages.length);
  }, [currentSlide, backgroundImages.length, goToSlide]);

  // Handle previous slide
  const prevSlide = useCallback(() => {
    goToSlide(
      (currentSlide - 1 + backgroundImages.length) % backgroundImages.length,
    );
  }, [currentSlide, backgroundImages.length, goToSlide]);

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  // Fetch categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await categoryAPI.getAll();

        const mappedCategories = categoriesData
          .slice(0, 6)
          .map((cat, index) => {
            const image = fallbackImages[index] || burgerImage;

            return {
              title: cat.name,
              image: image,
              link: `/menu?category=${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
            };
          });

        if (mappedCategories.length < 6) {
          const defaultTitles = [
            "Burgers",
            "Ice Cream",
            "Smashed Burgers",
            "Drinks",
            "Sides",
            "Desserts",
          ];

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
        setCategories([
          {
            title: "Burgers",
            image: burgerImage,
            link: "/menu?category=burgers",
          },
          {
            title: "Ice Cream",
            image: maybeamilkshakeImage,
            link: "/menu?category=ice-cream",
          },
          {
            title: "Smashed Burgers",
            image: smashBurgerImage,
            link: "/menu?category=smashed-burgers",
          },
          {
            title: "Drinks",
            image: maybeamilkshakeImage,
            link: "/menu?category=drinks",
          },
          { title: "Sides", image: burgerImage, link: "/menu?category=sides" },
          {
            title: "Desserts",
            image: maybeamilkshakeImage,
            link: "/menu?category=desserts",
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
      {/* Hero Section - Slideshow */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Slideshow with high-quality images */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={image}
                alt={`Background ${index + 1}`}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  index === currentSlide ? "scale-100" : "scale-105"
                }`}
                loading={index === 0 ? "eager" : "lazy"}
                // Add srcset for responsive images (optional)
                srcSet={`
                  ${image}?w=640 640w,
                  ${image}?w=768 768w,
                  ${image}?w=1024 1024w,
                  ${image}?w=1280 1280w,
                  ${image}?w=1920 1920w
                `}
                sizes="100vw"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  console.error(`Failed to load image: ${image}`);
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {/* <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 text-white hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 text-white hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-8 h-2"
                  : "bg-white/50 hover:bg-white/70 w-2 h-2"
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white mb-4 leading-tight">
            BURG N ICE
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-md mx-auto font-medium">
            #1 in Northwich
          </p>

          <Link to="/menu">
            <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-10 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl">
              Order Now
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </Link>
        </div>
      </section>
      {/* Service Icons */}
      <ServiceIcons />
      {/* Horizontal Grid */}
      <HorizontalMenuGrid />
      {/* Top Deals Grid */}
      <TopDealsGrid onAddToCart={onAddToCart} />
      {/* Testimonial Carousel */}
      <TestimonialCarousel />
      {/* Bottom Cards Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Pickup Card */}
          <Link to="/menu" className="group">
            <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 h-80 md:h-96">
              <img
                src="/pickup.jpg" // Replace with your image path
                alt="Pickup Made Easy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
