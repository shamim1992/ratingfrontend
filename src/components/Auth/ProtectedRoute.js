// src/components/Auth/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus } from '../../redux/actions/authActions';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        const verifyAuth = async () => {
            const isAuthenticated = await dispatch(checkAuthStatus());
            if (!isAuthenticated) {
                router.push('/login');
            }
        };

        verifyAuth();
    }, [dispatch, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Don't render children until auth is verified
    if (!user) {
        return null;
    }

    return children;
};

export default ProtectedRoute;