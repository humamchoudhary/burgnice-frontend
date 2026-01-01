import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ReviewModal, ReviewData } from "@/components/ReviewModal";
import { toast } from "sonner";

interface Testimonial {
  name: string;
  rating: number;
  text: string;
  date: string;
  initials: string;
  location?: string;
  type?: string;
}

const initialTestimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Best burgers in Manchester! The bacon cheeseburger is absolutely divine. Can't wait to come back for more!",
    date: "2 weeks ago",
    initials: "SM",
    location: "Deansgate",
    type: "Burger Lover",
  },
  {
    name: "James T.",
    rating: 5,
    text: "Amazing food and incredible service. The salted caramel ice cream is the perfect way to end any meal. Highly recommend!",
    date: "1 month ago",
    initials: "JT",
    location: "Manchester City Centre",
    type: "Regular Customer",
  },
  {
    name: "Emily R.",
    rating: 5,
    text: "Absolutely love this place! The burgers are juicy perfection, the fries are crispy, and the staff always make us feel welcome.",
    date: "3 weeks ago",
    initials: "ER",
    location: "Salford Quays",
    type: "Food Enthusiast",
  },
  {
    name: "Michael P.",
    rating: 5,
    text: "Outstanding quality and generous portion sizes. Delivery was super quick too. Five stars all around!",
    date: "1 week ago",
    initials: "MP",
    location: "Northern Quarter",
    type: "Delivery Customer",
  },
  {
    name: "Lisa K.",
    rating: 5,
    text: "The veggie burger exceeded all expectations. Finally, a place that does plant-based burgers right - absolutely delicious!",
    date: "4 days ago",
    initials: "LK",
    location: "Ancoats",
    type: "Vegetarian Foodie",
  },
  {
    name: "David W.",
    rating: 5,
    text: "Family favorite spot! Kids love the ice cream, we love the burgers. Perfect combination for a family meal out.",
    date: "2 days ago",
    initials: "DW",
    location: "MediaCity",
    type: "Family Regular",
  },
];

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    // Load saved reviews from localStorage on initial render
    const savedReviews = localStorage.getItem("burgNiceReviews");
    return savedReviews ? JSON.parse(savedReviews) : initialTestimonials;
  });

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1280) {
        setItemsToShow(3);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(2);
      } else {
        setItemsToShow(1);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsToShow >= testimonials.length ? 0 : prev + itemsToShow,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - itemsToShow : prev - itemsToShow,
    );
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, testimonials.length]);

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    Math.min(currentIndex + itemsToShow, testimonials.length),
  );

  // If we're at the end and don't have enough items, fill from the beginning
  const finalVisibleTestimonials =
    visibleTestimonials.length < itemsToShow
      ? [
          ...visibleTestimonials,
          ...testimonials.slice(0, itemsToShow - visibleTestimonials.length),
        ]
      : visibleTestimonials;

  const handleReviewSubmit = async (reviewData: ReviewData) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Create new testimonial from review data
        const newTestimonial: Testimonial = {
          name: reviewData.name,
          rating: reviewData.rating,
          text: reviewData.comment,
          date: "Just now",
          initials: reviewData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          location: reviewData.location || "Manchester",
          type: "Recent Reviewer",
        };

        // Add new testimonial to the beginning of the list
        const updatedTestimonials = [newTestimonial, ...testimonials];
        setTestimonials(updatedTestimonials);

        // Save to localStorage
        localStorage.setItem(
          "burgNiceReviews",
          JSON.stringify(updatedTestimonials),
        );

        console.log("Review saved:", newTestimonial);
        toast.success(
          "Thank you for your review! It has been added to our testimonials.",
        );
        resolve();
      }, 1500);
    });
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-gray-900 via-primary/5 to-transparent"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Customer Stories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Northwich
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear what our customers have to say about their Burg N Ice
            experience
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Carousel Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {finalVisibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${currentIndex}-${index}`}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-full group bg-gradient-to-b from-white dark:from-gray-900 to-primary/5 hover:to-primary/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="p-6 md:p-8">
                    <div className="relative">
                      {/* Customer Info */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">
                            {testimonial.initials}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          {/* Name and Rating */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg truncate">
                                {testimonial.name}
                              </h4>
                              {testimonial.type && (
                                <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full inline-block mt-1">
                                  {testimonial.type}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-0.5 flex-shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 md:h-4 md:w-4 ${
                                    i < testimonial.rating
                                      ? "fill-amber-500 text-amber-500"
                                      : "fill-gray-300 text-gray-300 dark:fill-gray-700 dark:text-gray-700"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Location and Date */}
                          <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.location && (
                              <>
                                <span className="truncate">
                                  {testimonial.location}
                                </span>
                                <span className="text-xs opacity-50">•</span>
                              </>
                            )}
                            <span>{testimonial.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <div className="mt-4 md:mt-6">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic text-sm md:text-base relative pl-4 border-l-2 border-primary/30">
                          "{testimonial.text}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > itemsToShow && (
            <>
              <button
                className="absolute left-0 top-1/4 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 rounded-full shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/30 transition-all duration-300 group p-3"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                className="absolute right-0 top-1/4 -translate-y-1/2 translate-x-4 lg:translate-x-6 rounded-full shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/30 transition-all duration-300 group p-3"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-3 mt-12">
                {Array.from({
                  length: Math.ceil(testimonials.length / itemsToShow),
                }).map((_, index) => (
                  <button
                    key={index}
                    className={`rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / itemsToShow) === index
                        ? "w-10 h-2 bg-gradient-to-r from-primary to-primary/80 shadow-md"
                        : "w-2 h-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => setCurrentIndex(index * itemsToShow)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Stats Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Average Rating", value: "4.9★" },
                { label: "Happy Customers", value: "5K+" },
                { label: "5-Star Reviews", value: "98%" },
                { label: "Would Recommend", value: "99%" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-gradient-to-b from-white dark:from-gray-900 to-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Join our satisfied customers and share your Burg N Ice experience
          </p>
          <button
            className="rounded-full px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white font-medium shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
            onClick={() => setIsReviewModalOpen(true)}
          >
            <span className="flex items-center gap-2">
              Write a Review
              <Sparkles className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </section>
  );
};
