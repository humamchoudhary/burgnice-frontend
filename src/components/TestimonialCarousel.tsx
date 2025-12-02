import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  rating: number;
  text: string;
  date: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Best burgers in Manchester! The bacon cheeseburger is absolutely divine. Can't wait to come back!",
    date: "2 weeks ago",
    initials: "SM",
  },
  {
    name: "James T.",
    rating: 5,
    text: "Amazing food and great service. The ice cream is the perfect way to end your meal. Highly recommend!",
    date: "1 month ago",
    initials: "JT",
  },
  {
    name: "Emily R.",
    rating: 5,
    text: "Absolutely love this place! The burgers are juicy, the fries are crispy, and the staff are friendly.",
    date: "3 weeks ago",
    initials: "ER",
  },
  {
    name: "Michael P.",
    rating: 5,
    text: "Outstanding quality and portion sizes. The delivery was super quick too. Five stars!",
    date: "1 week ago",
    initials: "MP",
  },
  {
    name: "Lisa K.",
    rating: 5,
    text: "The veggie burger exceeded my expectations. Finally, a place that does plant-based right!",
    date: "4 days ago",
    initials: "LK",
  },
];

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsToShow = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsToShow >= testimonials.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonials.length - itemsToShow) : prev - 1
    );
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, itemsToShow]);

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-foreground animate-fade-in">
          What Our Customers Say
        </h2>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[280px]">
            {visibleTestimonials.map((testimonial, index) => (
              <Card
                key={`${testimonial.name}-${currentIndex}-${index}`}
                className="h-full transition-all duration-500 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12 bg-primary/10">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "fill-primary text-primary"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {testimonial.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {testimonials.length > itemsToShow && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full shadow-lg bg-background/95 backdrop-blur hover:scale-110 transition-all duration-300"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full shadow-lg bg-background/95 backdrop-blur hover:scale-110 transition-all duration-300"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <div className="flex justify-center gap-2 mt-8">
                {Array.from({
                  length: Math.ceil(testimonials.length / itemsToShow),
                }).map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / itemsToShow) === index
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted hover:bg-muted-foreground"
                    }`}
                    onClick={() => setCurrentIndex(index * itemsToShow)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
