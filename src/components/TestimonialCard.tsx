import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  initials = name.split(' ').map(n => n[0]).join(''),
  location,
  type 
}: TestimonialCardProps) => {
  return (
    <Card className="h-full group border-0 bg-gradient-to-b from-background to-accent/5 hover:to-primary/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <CardContent className="p-6">
        {/* Customer Info */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 space-y-1">
            {/* Name and Rating */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-foreground truncate">
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
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Location and Date */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {location && (
                <>
                  <span className="truncate">{location}</span>
                  <span className="text-xs opacity-50">•</span>
                </>
              )}
              <span>{date}</span>
            </div>
          </div>
        </div>
        
        {/* Testimonial Text */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed italic relative pl-4 border-l-2 border-primary/30 group-hover:border-primary/50 transition-colors">
            "{text}"
          </p>
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Verified Customer
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-amber-500 font-bold">{rating}.0</span>
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};