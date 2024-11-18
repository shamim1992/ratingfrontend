// src/redux/actions/authActions.js
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { 
    setCredentials, 
    setLoading, 
    setError, 
    clearError,
    logout as logoutAction
} from '../slices/authSlice';

// Helper functions for localStorage
const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
    }
};

const getFromStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? (key === 'user' ? JSON.parse(item) : item) : null;
    } catch (error) {
        console.error(`Error getting ${key} from localStorage:`, error);
        return null;
    }
};

// Helper function to save both user and token
const saveAuthData = (user, token) => {
    saveToStorage('user', user);
    saveToStorage('token', token);
};

// Helper function to clear auth data
const clearAuthData = () => {
    removeFromStorage('user');
    removeFromStorage('token');
};

// Initialize auth from localStorage
export const initializeAuth = () => (dispatch) => {
    try {
        const token = getFromStorage('token');
        const user = getFromStorage('user');

        if (token && user) {
            dispatch(setCredentials({ user, token }));
        }
    } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
    }
};

// Check auth status
export const checkAuthStatus = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const token = getFromStorage('token');
        const savedUser = getFromStorage('user');

        if (!token || !savedUser) {
            clearAuthData();
            dispatch(logoutAction());
            return false;
        }

        // Verify token and get fresh user data
        const response = await api.get('/auth/profile');
        const user = response.data.data;

        // Update storage with fresh user data
        saveAuthData(user, token);
        dispatch(setCredentials({ user, token }));
        
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
        dispatch(logoutAction());
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

// Login
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data.data;

        // Save to storage
        saveAuthData(user, token);
        
        // Update Redux state
        dispatch(setCredentials({ user, token }));
        
        toast.success('Login successful');
        return { success: true, user };
    } catch (error) {
        const message = error.response?.data?.error || 'Login failed';
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Register
export const register = (userData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await api.post('/auth/register', userData);
        const { user, token } = response.data.data;

        // Save to storage
        saveAuthData(user, token);
        
        // Update Redux state
        dispatch(setCredentials({ user, token }));
        
        toast.success('Registration successful');
        return { success: true, user };
    } catch (error) {
        const message = error.response?.data?.error || 'Registration failed';
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Logout
export const logoutUser = () => (dispatch) => {
    try {
        clearAuthData();
        dispatch(logoutAction());
        toast.success('Logged out successfully');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout');
        return { success: false, error: 'Logout failed' };
    }
};

// Update profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await api.put('/auth/profile', userData);
        const updatedUser = response.data.data;
        const token = getFromStorage('token');

        // Update storage with new user data
        saveAuthData(updatedUser, token);
        
        dispatch(setCredentials({ user: updatedUser, token }));
        toast.success('Profile updated successfully');
        return { success: true, user: updatedUser };
    } catch (error) {
        const message = error.response?.data?.error || 'Profile update failed';
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Change password
export const changePassword = (passwordData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        await api.put('/auth/change-password', passwordData);
        toast.success('Password changed successfully');
        return { success: true };
    } catch (error) {
        const message = error.response?.data?.error || 'Password change failed';
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        await api.post('/auth/forgot-password', { email });
        toast.success('Password reset link sent to your email');
        return { success: true };
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to send reset link';
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Reset password
export const resetPassword = (token, newPassword) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        await api.post(`/auth/reset-password/${token}`, { password: newPassword });
        toast.success('Password reset successful');
        return { success: true };
    } catch (error) {
        const message = error.response?.data?.error || 'Password reset failed';
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Verify email
export const verifyEmail = (token) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await api.post(`/auth/verify-email/${token}`);
        toast.success('Email verified successfully');
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.error || 'Email verification failed';
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Resend verification email
export const resendVerification = (email) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        await api.post('/auth/resend-verification', { email });
        toast.success('Verification email sent');
        return { success: true };
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to send verification email';
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
    } finally {
        dispatch(setLoading(false));
    }
};

// Refresh token
export const refreshToken = () => async (dispatch) => {
    try {
        const response = await api.post('/auth/refresh-token');
        const { token } = response.data;
        const currentUser = getFromStorage('user');

        if (currentUser) {
            saveAuthData(currentUser, token);
            return { success: true, token };
        } else {
            throw new Error('No user data found');
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        clearAuthData();
        dispatch(logoutAction());
        return { success: false, error: 'Token refresh failed' };
    }
};

export const validateSession = () => (dispatch) => {
    const token = getFromStorage('token');
    const user = getFromStorage('user');

    if (!token || !user) {
        dispatch(logoutAction());
        return false;
    }
    return true;
};