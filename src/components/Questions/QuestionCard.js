import { useState } from 'react';
import { toast } from 'react-toastify';
import { ImgUrl } from '@/AppUrl';
import RatingStars from './RatingStars';

const QuestionCard = ({ question, onRate, userRating, userId }) => {
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [isRated, setIsRated] = useState(false);

    const handleSubmit = async () => {
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            const result = await onRate(question._id, rating, userId);
            if (result) {
                setIsRated(true);
                
            }
        } catch (error) {
            toast.error('Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    if (isRated || userRating) {
        return null; // Don't render the card if it's been rated
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {question.title}
                </h3>

                <div className="text-gray-600 mb-4" 
                    dangerouslySetInnerHTML={{ __html: question.description }} 
                />

                {question.images && question.images.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                            {question.images.map((image, index) => (
                                <div key={index} className="relative h-full rounded-lg overflow-hidden">
                                    <img
                                        src={`${ImgUrl}${image}`}
                                        alt={`Question image ${index + 1}`}
                                        className=" shadow-md h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Rate this Case:</p>
                            <RatingStars
                                value={rating}
                                onChange={setRating}
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !rating}
                            className="max-w-lg inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : 'Submit Rating'}
                        </button>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Total Ratings: {question.totalRatings || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;