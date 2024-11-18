import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingComponent = ({ questionId, onRate, initialRating, disabled }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    if (rating === 0 || disabled || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onRate(questionId, rating);
    } catch (error) {
      console.error('Rating submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="p-1 focus:outline-none disabled:opacity-50"
            onMouseEnter={() => !disabled && setHoveredRating(star)}
            onMouseLeave={() => !disabled && setHoveredRating(0)}
            onClick={() => !disabled && setRating(star)}
            disabled={disabled}
          >
            <Star
              size={24}
              className={`${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      
      <button
        onClick={handleRatingSubmit}
        disabled={rating === 0 || disabled || isSubmitting}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors
          ${
            disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : rating === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }
        `}
      >
        {disabled 
          ? 'Already Rated' 
          : isSubmitting 
          ? 'Submitting...' 
          : 'Submit Rating'}
      </button>
    </div>
  );
};

export default RatingComponent;