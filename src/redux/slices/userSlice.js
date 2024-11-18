// src/redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    stats: {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0
    },
    userActivities: []
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        addUser: (state, action) => {
            state.users.unshift(action.payload);
        },
        updateUser: (state, action) => {
            const index = state.users.findIndex(u => u._id === action.payload._id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter(u => u._id !== action.payload);
        },
        setUserStats: (state, action) => {
            state.stats = action.payload;
        },
        setUserActivities: (state, action) => {
            state.userActivities = action.payload;
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
    setUsers,
    setCurrentUser,
    addUser,
    updateUser,
    deleteUser,
    setUserStats,
    setUserActivities,
    setLoading,
    setError
} = userSlice.actions;

export default userSlice.reducer;