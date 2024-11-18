// src/redux/slices/questionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    questions: [],
    currentQuestion: null,
    loading: false,
    error: null,
    stats: {
        totalQuestions: 0,
        activeQuestions: 0,
        totalRatings: 0,
        averageRating: 0
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    filters: {
        search: '',
        status: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    }
};

const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        // Set all questions
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },

        // Set current question
        setCurrentQuestion: (state, action) => {
            state.currentQuestion = action.payload;
        },

        // Add new question
        addQuestion: (state, action) => {
            state.questions.unshift(action.payload);
            state.stats.totalQuestions += 1;
            state.stats.activeQuestions += action.payload.active ? 1 : 0;
        },

        // Update existing question
        updateQuestion: (state, action) => {
            const index = state.questions.findIndex(q => q._id === action.payload._id);
            if (index !== -1) {
                // Update active questions count if status changed
                if (state.questions[index].active !== action.payload.active) {
                    state.stats.activeQuestions += action.payload.active ? 1 : -1;
                }
                state.questions[index] = action.payload;
            }
        },

        // Remove question
        removeQuestion: (state, action) => {
            const question = state.questions.find(q => q._id === action.payload);
            if (question) {
                state.questions = state.questions.filter(q => q._id !== action.payload);
                state.stats.totalQuestions -= 1;
                if (question.active) {
                    state.stats.activeQuestions -= 1;
                }
            }
        },

        // Update question stats
        setQuestionStats: (state, action) => {
            state.stats = action.payload;
        },

        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Set error state
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Update pagination
        setPagination: (state, action) => {
            state.pagination = {
                ...state.pagination,
                ...action.payload
            };
        },

        // Update filters
        setFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload
            };
        },

        // Reset filters
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },

        // Reset state
        resetState: () => initialState
    }
});

// Export actions
export const {
    setQuestions,
    setCurrentQuestion,
    addQuestion,
    updateQuestion,
    removeQuestion,
    setQuestionStats,
    setLoading,
    setError,
    clearError,
    setPagination,
    setFilters,
    resetFilters,
    resetState
} = questionSlice.actions;

// Export selectors
export const selectQuestions = (state) => state.questions.questions;
export const selectCurrentQuestion = (state) => state.questions.currentQuestion;
export const selectLoading = (state) => state.questions.loading;
export const selectError = (state) => state.questions.error;
export const selectStats = (state) => state.questions.stats;
export const selectPagination = (state) => state.questions.pagination;
export const selectFilters = (state) => state.questions.filters;

export default questionSlice.reducer;