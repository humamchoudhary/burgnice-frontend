import { useState, useEffect } from "react";
import { Star, Camera, Loader2, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewData) => Promise<void>;
}

export interface ReviewData {
  name: string;
  rating: number;
  comment: string;
  email?: string;
  location?: string;
  image?: string;
}

export const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write your review");
      return;
    }

    if (review.length < 20) {
      toast.error("Please write at least 20 characters for your review");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        rating,
        comment: review,
        email: email.trim() || undefined,
        location: location.trim() || undefined,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        handleClose();
        toast.success("Thank you for your review!");
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName("");
      setEmail("");
      setLocation("");
      setReview("");
      setRating(0);
      setIsSubmitted(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative max-w-2xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Fixed Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Share Your Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Tell us about your Burg N Ice experience
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Rating Section */}
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                    How would you rate your experience? *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={isSubmitting}
                      >
                        <Star
                          className={`h-10 w-10 md:h-12 md:w-12 transition-all duration-200 ${
                            (hoverRating || rating) >= star
                              ? "fill-amber-500 text-amber-500 scale-110"
                              : "text-gray-300 dark:text-gray-700 fill-gray-300 dark:fill-gray-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label
                    htmlFor="review"
                    className="text-sm font-medium text-gray-900 dark:text-white mb-2 block"
                  >
                    Your Review *
                  </label>
                  <textarea
                    id="review"
                    placeholder="What did you love about your experience? What could we improve?"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    disabled={isSubmitting}
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {review.length < 20 ? (
                      <span className="text-red-600">
                        Minimum 20 characters required ({review.length}/20)
                      </span>
                    ) : (
                      <span>{review.length}/500 characters</span>
                    )}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-900 dark:text-white mb-2 block"
                    >
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900 dark:text-white mb-2 block"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Optional - for verification only
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-900 dark:text-white mb-2 block"
                  >
                    Where are you from?
                  </label>
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g., Manchester City Centre, Deansgate, etc."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Optional - helps us serve your area better
                  </div>
                </div>

                {/* Photo Upload (Optional) */}
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    Add a Photo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Camera className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Upload a photo of your meal
                    </p>
                    <button
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                      disabled={isSubmitting}
                    >
                      Choose File
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>

                {/* Tips for Good Review */}
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Tips for a great review:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Mention specific items you enjoyed
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Share details about service and atmosphere
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Be honest and constructive
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-800 shrink-0">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !name.trim() ||
                  rating === 0 ||
                  review.length < 20
                }
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </>
        ) : (
          // Success State
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-8 text-center">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              <div className="pt-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Thank You!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Your review has been submitted successfully. We appreciate
                  your feedback and will use it to improve our service.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center p-6 border-t border-gray-200 dark:border-gray-800 shrink-0">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleClose();
                  setTimeout(() => {
                    toast.success("Thanks again! Come back soon!");
                  }, 500);
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium"
              >
                Order Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
