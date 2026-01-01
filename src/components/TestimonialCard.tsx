import { Star, MapPin, CheckCircle } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  rating: number;
  text: string;
  date: string;
  initials?: string;
  location?: string;
  type?: string;
}

export const TestimonialCard = ({
  name,
  rating,
  text,
  date,
  initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase(),
  location,
  type,
}: TestimonialCardProps) => {
  return (
    <div className="h-full group bg-gradient-to-b from-white dark:from-gray-900 to-primary/5 hover:to-primary/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="p-6">
        {/* Customer Info */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{initials}</span>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            {/* Name and Rating */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white truncate">
                  {name}
                </h4>
                {type && (
                  <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full inline-block mt-1">
                    {type}
                  </span>
                )}
              </div>
              <div className="flex gap-0.5 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < rating
                        ? "fill-amber-500 text-amber-500"
                        : "fill-gray-300 text-gray-300 dark:fill-gray-700 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Location and Date */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              {location && (
                <>
                  <span className="truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </span>
                  <span className="text-xs opacity-50">•</span>
                </>
              )}
              <span>{date}</span>
            </div>
          </div>
        </div>

        {/* Testimonial Text */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic relative pl-4 border-l-2 border-primary/30 group-hover:border-primary/50 transition-colors">
            "{text}"
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Verified Customer
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-amber-500 font-bold">
              {rating.toFixed(1)}
            </span>
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
