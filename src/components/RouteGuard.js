// src/components/RouteGuard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const RouteGuard = ({ children }) => {
    const router = useRouter();
    const { user, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in, redirect to login page
                router.push('/login');
            } else if (router.pathname.startsWith('/admin') && user.role !== 'admin') {
                // Not an admin, redirect to user dashboard
                router.push('/user');
            } else if (router.pathname.startsWith('/user') && user.role === 'admin') {
                // Admin trying to access user pages, redirect to admin dashboard
                router.push('/admin');
            }
        }
    }, [loading, user, router.pathname]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Show nothing while checking authentication
    if (!user) {
        return null;
    }

    return children;
};

export default RouteGuard;