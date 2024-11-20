import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/actions/authActions';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import logoImg from '../../../public/logo.png'

const UserLayout = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { title: 'Dashboard', path: '/user', icon: '🏠' },
        { title: 'Rate Cases', path: '/user/questions', icon: '❓' },
        { title: 'My Ratings', path: '/user/ratings', icon: '⭐' },
        { title: 'Profile', path: '/user/profile', icon: '👤' }
    ];

    const handleLogout = () => {
        dispatch(logoutUser());
        router.push('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Desktop Navigation */}
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl md:text-2xl font-bold text-blue-600">
                                    <Image src={logoImg} alt={'logo'} className="py-2 h-16 w-24" />
                                </span>
                            </div>
                            <nav className="hidden md:flex space-x-8 ml-10">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${router.pathname === item.path
                                                ? 'border-blue-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden md:flex items-center">
                            <div className="flex items-center">
                                <span className="text-gray-700 mr-4 truncate max-w-[200px]">{user?.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-expanded="false"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="block h-6 w-6" />
                                ) : (
                                    <Menu className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                    <div className="pt-2 pb-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${router.pathname === item.path
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.title}
                            </Link>
                        ))}
                        <div className="px-4 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 text-sm truncate max-w-[200px]">{user?.email}</span>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className=" mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            <footer className="bg-white border-t">
                <div className=" mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center text-xs space-x-6 order-2">
                        Contact: +91 95350 56289
                    </div>
                    <div className="mt-8 md:mt-0 order-1">
                        <p className="text-center text-xs text-gray-400">
                            Copyright  &copy; {new Date().getFullYear()} - Developed by ChanRe Health Care and Research Assist.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;