import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Use existing images
import burgerImage from "@/assets/category-burgers.jpeg";
import maybeamilkshakeImage from "@/assets/category-maybeamilkshake.jpeg";
import smashBurgerImage from "@/assets/category-smashedburgers.jpeg";
import heroImage from "@/assets/hero-burger.jpg";

const gridItems = [
  {
    id: 1,
    title: "Full Menu",
    description: "Explore all options",
    link: "/menu", // Goes to menu page
    image: burgerImage,
    bgColor: "bg-gray-900",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "Delivery",
    description: "Get it delivered",
    link: "/menu", // Changed to menu page
    image: maybeamilkshakeImage,
    bgColor: "bg-gray-800",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Our Locations",
    description: "Visit us",
    link: "/about", // Changed to about page
    image: smashBurgerImage,
    bgColor: "bg-gray-900",
    textColor: "text-white",
  },
  {
    id: 4,
    title: "Weekly Specials",
    description: "Limited time offers",
    link: "/menu", // Changed to menu page
    image: heroImage,
    bgColor: "bg-gray-800",
    textColor: "text-white",
  },
];

interface VisualGridProps {
  className?: string;
}

export const VisualGrid = ({ className }: VisualGridProps) => {
  return (
    <section className={`py-12 bg-white ${className || ""}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0">
          {gridItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative overflow-hidden aspect-square md:aspect-auto md:h-[400px] block border border-gray-200 hover:border-black transition-colors"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
              </div>
              
              {/* Content Overlay */}
              <div className="relative h-full flex flex-col justify-end p-8">
                <div className={`inline-flex items-center px-3 py-1 ${item.bgColor} rounded-sm mb-4 w-fit opacity-90`}>
                  <span className={`text-sm font-medium ${item.textColor}`}>
                    {item.description}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className={`p-3 rounded-sm ${item.bgColor} opacity-90 group-hover:opacity-100 transition-opacity`}>
                    <ArrowRight className={`h-5 w-5 ${item.textColor}`} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};  