// src/redux/actions/userActions.js
import { toast } from 'react-toastify';
import api from '../../utils/api';
import {
    setUsers,
    setCurrentUser,
    updateUser,
    deleteUser,
    setUserStats,
    setUserActivities,
    setLoading,
    setError
} from '../slices/userSlice';


// Fetch all users
export const fetchUsers = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        dispatch(setLoading(true));
        const response = await api.get('/admin/users', config);
        console.log(response.data)
        dispatch(setUsers(response.data.data));
    } catch (error) {
        dispatch(setError(error.response?.data?.error || 'Error fetching users'));
        toast.error('Error fetching users');
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch user stats
export const fetchUserStats = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await api.get('/admin/users/stats', config);
        dispatch(setUserStats(response.data.data));
    } catch (error) {
        toast.error('Error fetching user statistics');
    }
};

// Fetch user activities
export const fetchUserActivities = (userId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await api.get(`/admin/users/${userId}/activities`, config);
        dispatch(setUserActivities(response.data.data));
    } catch (error) {
        toast.error('Error fetching user activities');
    }
};

// Update user role
export const updateUserRole = (userId, role) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        dispatch(setLoading(true));
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        dispatch(updateUser(response.data.data));
        toast.success('User role updated successfully');
    } catch (error) {
        toast.error('Error updating user role');
    } finally {
        dispatch(setLoading(false));
    }
};

// Deactivate user
export const deactivateUser = (userId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        dispatch(setLoading(true));
        await api.put(`/admin/users/${userId}/deactivate`, config);
        dispatch(deleteUser(userId));
        toast.success('User deactivated successfully');
    } catch (error) {
        toast.error('Error deactivating user');
    } finally {
        dispatch(setLoading(false));
    }
};

// Get user details with ratings
export const getUserDetails = (userId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        dispatch(setLoading(true));
        const response = await api.get(`/admin/users/${userId}`, config);
        dispatch(setCurrentUser(response.data.data));
    } catch (error) {
        toast.error('Error fetching user details');
    } finally {
        dispatch(setLoading(false));
    }
};