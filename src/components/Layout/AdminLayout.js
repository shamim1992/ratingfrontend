// src/components/Layout/AdminLayout.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/actions/authActions';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const menuItems = [
        { title: 'Dashboard', path: '/admin', icon: '📊' },
        { title: 'Cases', path: '/admin/questions', icon: '❓' },
        { title: 'Users', path: '/admin/users', icon: '👥' },
        { title: 'Analytics', path: '/admin/analytics', icon: '📈' }
    ];

    const handleLogout = () => {
        dispatch(logoutUser());
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {isSidebarOpen ? '✕' : '☰'}
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar and Main Content */}
            <div className="flex pt-16">
                {/* Sidebar */}
                <aside
                    className={`fixed left-0 h-full bg-white shadow-md transition-all duration-300 z-20 ${
                        isSidebarOpen ? 'w-64' : 'w-20'
                    }`}
                >
                    <nav className="mt-5 px-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-4 py-3 mb-2 rounded-lg ${
                                    router.pathname === item.path
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {isSidebarOpen && (
                                    <span className="ml-3">{item.title}</span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 p-6 min-h-screen transition-all duration-300 ${
                        isSidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;