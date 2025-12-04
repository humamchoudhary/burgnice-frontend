import { useState } from "react";
import { Star, Camera, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewData) => Promise<void>;
}

export interface ReviewData {
  name: string;
  rating: number;
  review: string;
  email?: string;
  location?: string;
  image?: string;
}

export const ReviewModal = ({ isOpen, onClose, onSubmit }: ReviewModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        review,
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
                Share Your Experience
              </DialogTitle>
              <p className="text-muted-foreground mt-2">
                Tell us about your Burg N Ice experience
              </p>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Rating Section */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-3 block">
                  How would you rate your experience? *
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-10 w-10 md:h-12 md:w-12 transition-all duration-200 ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-500 text-amber-500 scale-110"
                            : "text-muted fill-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <Label htmlFor="review" className="text-sm font-medium text-foreground mb-2 block">
                  Your Review *
                </Label>
                <Textarea
                  id="review"
                  placeholder="What did you love about your experience? What could we improve?"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  {review.length < 20 ? (
                    <span className="text-destructive">
                      Minimum 20 characters required ({review.length}/20)
                    </span>
                  ) : (
                    <span>
                      {review.length}/500 characters
                    </span>
                  )}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Optional - for verification only
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-foreground mb-2 block">
                  Where are you from?
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Manchester City Centre, Deansgate, etc."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Optional - helps us serve your area better
                </div>
              </div>

              {/* Photo Upload (Optional) */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Add a Photo (Optional)
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a photo of your meal
                  </p>
                  <Button variant="outline" size="sm" disabled={isSubmitting}>
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>

              {/* Tips for Good Review */}
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h4 className="font-medium text-foreground mb-2">Tips for a great review:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !name.trim() || rating === 0 || review.length < 20}
                className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </>
        ) : (
          // Success State
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Thank You!
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your review has been submitted successfully. We appreciate your feedback and will use it to improve our service.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleClose}
                className="rounded-full"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  setTimeout(() => {
                    toast.success("Thanks again! Come back soon!");
                  }, 500);
                }}
                className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary"
              >
                Order Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};