import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const TestimonialCard = ({ name, rating, text, date }: TestimonialCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? "fill-primary text-primary" : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 italic">"{text}"</p>
        <p className="font-semibold text-foreground">{name}</p>
      </CardContent>
    </Card>
  );
};
