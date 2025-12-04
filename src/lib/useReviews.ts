import { useState } from "react";
import { ReviewData } from "@/components/ReviewModal";

export const useReviews = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = async (reviewData: ReviewData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would:
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reviewData)
      // });
      
      // if (!response.ok) throw new Error('Failed to submit review');
      
      // Add to local state (in real app, you'd get the full response)
      setReviews(prev => [reviewData, ...prev]);
      
      return Promise.resolve();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app:
      // const response = await fetch('/api/reviews');
      // const data = await response.json();
      // setReviews(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reviews,
    isLoading,
    error,
    submitReview,
    fetchReviews
  };
};