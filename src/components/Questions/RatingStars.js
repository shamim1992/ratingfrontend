import { useState } from 'react';

const RatingStars = ({ value, onChange, readOnly = false }) => {
    const [hover, setHover] = useState(0);
    
    return (
        <div className="flex items-center flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} p-0.5 focus:outline-none`}
                    onClick={() => !readOnly && onChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                >
                    <span className={`text-lg ${
                        (hover || value) >= star 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                    }`}>
                        ★
                    </span>
                </button>
            ))}
            {!readOnly && (
                <span className="ml-2 text-sm text-gray-600">
                    {hover || value || 0}/10
                </span>
            )}
        </div>
    );
};

export default RatingStars;