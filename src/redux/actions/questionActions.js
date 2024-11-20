// src/redux/actions/questionActions.js
import { toast } from 'react-toastify';
import api from '../../utils/api';
import {
    setQuestions,
    setCurrentQuestion,
    addQuestion,
    updateQuestion,
    removeQuestion,
    setQuestionStats,
    setLoading,
    setError,
    clearError,
    setPagination
} from '../slices/questionSlice';

// Fetch all questions with filters and pagination
export const fetchQuestions = (filters = {}, page = 1, limit = 10) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        // Build query params
        const params = new URLSearchParams({
            page,
            limit,
            ...filters
        });

        const response = await api.get(`/questions?${params}`);
        const { questions, currentPage, totalPages, totalItems } = response.data.data;

        dispatch(setQuestions(questions));
        dispatch(setPagination({
            currentPage,
            totalPages,
            totalItems,
            itemsPerPage: limit
        }));

        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Error fetching questions';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch single question
export const fetchQuestionById = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await api.get(`/questions/${id}`);
        dispatch(setCurrentQuestion(response.data.data));

        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Error fetching question';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Create new question
export const createQuestion = (formData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        // Validate file sizes
        const files = formData.getAll('images');
        for (let file of files) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                throw new Error('Image size must be less than 5MB');
            }
        }

        const response = await api.post('/questions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        dispatch(addQuestion(response.data.data));
      
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message || 'Error creating question';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Update question
export const updateQuestionById = (id, formData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        // Validate file sizes if there are new images
        const files = formData.getAll('images');
        for (let file of files) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                throw new Error('Image size must be less than 5MB');
            }
        }

        const response = await api.put(`/questions/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        dispatch(updateQuestion(response.data.data));
        toast.success('Question updated successfully');
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message || 'Error updating question';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Delete question
export const deleteQuestionById = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        await api.delete(`/questions/${id}`);
        dispatch(removeQuestion(id));
      
        return true;
    } catch (error) {
        const message = error.response?.data?.error || 'Error deleting question';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Update question status (active/inactive)
export const updateQuestionStatus = (id, status) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await api.patch(`/questions/${id}/status`, { active: status });
        dispatch(updateQuestion(response.data.data));
        toast.success('Question status updated successfully');
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Error updating question status';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch question statistics
export const fetchQuestionStats = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await api.get('/questions/stats');
        dispatch(setQuestionStats(response.data.data));
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Error fetching question statistics';
        dispatch(setError(message));
        toast.error(message);
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};