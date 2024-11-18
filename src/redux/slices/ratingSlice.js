// src/redux/slices/ratingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    ratings: [],
    userRatings: {},
    loading: false,
    error: null,
    stats: {
        totalRatings: 0,
        averageRating: 0
    }
};

const ratingSlice = createSlice({
    name: 'ratings',
    initialState,
    reducers: {
        setRatings: (state, action) => {
            state.ratings = action.payload;
        },
        addRating: (state, action) => {
            const { questionId, rating } = action.payload;
            state.userRatings[questionId] = rating;
        },
        updateRating: (state, action) => {
            const { questionId, rating } = action.payload;
            state.userRatings[questionId] = rating;
        },
        deleteRating: (state, action) => {
            delete state.userRatings[action.payload];
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