import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
}

export const CategoryCard = ({ title, image, link }: CategoryCardProps) => {
  return (
    <Link to={link}>
      <div className="group relative overflow-hidden rounded-2xl bg-card shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{title}</h3>
          <div className="flex items-center text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            <span className="text-sm font-medium">View Menu</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
