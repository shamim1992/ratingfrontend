// src/redux/slices/ratingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    ratings: [],
    userRatings: {}, // Tracks ratings by the user for quick lookup
    loading: false,
    error: null,
    stats: {
        totalRatings: 0, // Total number of ratings
        averageRating: 0 // Average rating across all cases
    }
};

const ratingSlice = createSlice({
    name: 'ratings',
    initialState,
    reducers: {
        setRatings: (state, action) => {
            state.ratings = action.payload;
            // Update stats when ratings are set
            state.stats.totalRatings = action.payload.length;
            const totalSum = action.payload.reduce((sum, rating) => sum + (rating.rating || 0), 0);
            state.stats.averageRating = action.payload.length > 0 ? (totalSum / action.payload.length).toFixed(2) : 0;
        },
        addRating: (state, action) => {
            const { questionId, rating } = action.payload;
            state.userRatings[questionId] = rating;
            state.ratings.push({ questionId, rating });

            // Update stats dynamically
            state.stats.totalRatings += 1;
            const totalSum = state.stats.averageRating * (state.stats.totalRatings - 1) + rating;
            state.stats.averageRating = (totalSum / state.stats.totalRatings).toFixed(2);
        },
        updateRating: (state, action) => {
            const { questionId, rating } = action.payload;

            // Find the existing rating and update it
            const existingRatingIndex = state.ratings.findIndex(r => r.questionId === questionId);
            if (existingRatingIndex !== -1) {
                const oldRating = state.ratings[existingRatingIndex].rating;

                // Update stats by replacing the old rating
                const totalSum = state.stats.averageRating * state.stats.totalRatings - oldRating + rating;
                state.stats.averageRating = (totalSum / state.stats.totalRatings).toFixed(2);

                // Update the rating
                state.ratings[existingRatingIndex].rating = rating;
                state.userRatings[questionId] = rating;
            }
        },
        deleteRating: (state, action) => {
            const questionId = action.payload;

            // Remove rating from userRatings and ratings array
            const existingRatingIndex = state.ratings.findIndex(r => r.questionId === questionId);
            if (existingRatingIndex !== -1) {
                const oldRating = state.ratings[existingRatingIndex].rating;

                // Update stats by removing the old rating
                const totalSum = state.stats.averageRating * state.stats.totalRatings - oldRating;
                state.stats.totalRatings -= 1;
                state.stats.averageRating = state.stats.totalRatings > 0
                    ? (totalSum / state.stats.totalRatings).toFixed(2)
                    : 0;

                state.ratings.splice(existingRatingIndex, 1);
                delete state.userRatings[questionId];
            }
        },
        setUserRatings: (state, action) => {
            state.userRatings = action.payload;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    setRatings,
    addRating,
    updateRating,
    deleteRating,
    setUserRatings,
    setStats,
    setLoading,
    setError
} = ratingSlice.actions;

export default ratingSlice.reducer;
