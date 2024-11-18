// src/components/Questions/RatingStars.js
import { useState } from 'react';

const RatingStars = ({ value, onChange, readOnly = false }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} p-1 focus:outline-none`}
                    onClick={() => !readOnly && onChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                >
                    <span className={`text-2xl ${
                        (hover || value) >= star 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                    }`}>
                        ★
                    </span>
                </button>
            ))}
        </div>
    );
};

export default RatingStars;