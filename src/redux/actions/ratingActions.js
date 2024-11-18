// src/redux/actions/ratingActions.js
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    setRatings,
    addRating,
    updateRating,
    deleteRating,
    setUserRatings,
    setStats,
    setLoading,
    setError
} from '../slices/ratingSlice';
import { ApiUrl } from '@/AppUrl';



// Get user's ratings
// export const fetchUserRatings = () => async (dispatch) => {
//     try {
//         const token = localStorage.getItem('token');

//         const config = {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         };
//         dispatch(setLoading(true));
//         const response = await axios.get(`${ApiUrl}/ratings/user`,config);
        
//         // Convert array to object for easier lookup
//         const ratingsObject = {};
//         response.data.data.forEach(rating => {
//             ratingsObject[rating.questionId] = rating.rating;
//         });
        
//         dispatch(setUserRatings(ratingsObject));
//     } catch (error) {
//         const message = error.response?.data?.error || 'Error fetching ratings';
//         dispatch(setError(message));
//         toast.error(message);
//     } finally {
//         dispatch(setLoading(false));
//     }
// };

export const fetchUserRatings = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No auth token found');
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        dispatch(setLoading(true));
        const response = await axios.get(`${ApiUrl}/ratings/user`, config);
        
        // Check if response has data property
        if (response.data.success) {
            dispatch(setRatings(response.data.data.ratings || []));
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching ratings:', error);
        const message = error.response?.data?.error || error.message || 'Error fetching ratings';
        dispatch(setError(message));
        toast.error(message);
    } finally {
        dispatch(setLoading(false));
    }
};

// Submit rating

// src/redux/actions/ratingActions.js
export const submitRating = ({ questionId, rating, userId }) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        dispatch(setLoading(true));
        
        // Log the request data
        console.log('Submitting rating:', { questionId, rating, userId });

        const response = await axios.post(`${ApiUrl}/ratings`, {
            questionId,
            rating,
            userId
        }, config);

        if (response.data.success) {
            dispatch(addRating({ questionId, rating }));
            toast.success('Rating submitted successfully');
            return true;
        } else {
            throw new Error(response.data.error || 'Failed to submit rating');
        }
    } catch (error) {
        console.error('Rating submission error:', error);
        const message = error.response?.data?.error || error.message || 'Error submitting rating';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};
// export const submitRating = (questionId, rating, userId) => async (dispatch) => {
//     try {
//         const token = localStorage.getItem('token');
     
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         };
//         dispatch(setLoading(true));
//         const response = await axios.post(`${ApiUrl}/ratings`, {
//             questionId,
//             rating,
//             userId,
//         }, config);
//         dispatch(addRating({ questionId, rating, userId }));
//         toast.success('Rating submitted successfully');
//     } catch (error) {
//         const message = error.response?.data?.error || 'Error submitting rating';
//         dispatch(setError(message));
//         toast.error(message);
//         throw error;
//     } finally {
//         dispatch(setLoading(false));
//     }
// };

// Update rating
export const updateRatingById = (questionId, rating) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await axios.put(`${ApiUrl}/ratings/${questionId}`, { rating });
        dispatch(updateRating({ questionId, rating }));
        toast.success('Rating updated successfully');
    } catch (error) {
        const message = error.response?.data?.error || 'Error updating rating';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Delete rating
export const deleteRatingById = (questionId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await axios.delete(`${ApiUrl}/ratings/${questionId}`);
        dispatch(deleteRating(questionId));
        toast.success('Rating deleted successfully');
    } catch (error) {
        const message = error.response?.data?.error || 'Error deleting rating';
        dispatch(setError(message));
        toast.error(message);
    } finally {
        dispatch(setLoading(false));
    }
};

// Get rating statistics
export const fetchRatingStats = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        dispatch(setLoading(true));
        const response = await axios.get(`${ApiUrl}/ratings/stats`, config);
        dispatch(setStats(response.data.data));
    } catch (error) {
        const message = error.response?.data?.error || 'Error fetching statistics';
        dispatch(setError(message));
        toast.error(message);
    } finally {
        dispatch(setLoading(false));
    }
};