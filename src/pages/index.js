// src/pages/index.js
import { useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

// Hero Section Component
const Hero = () => (
    <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                    <div className="sm:text-center lg:text-left">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block xl:inline">Rate and Review</span>{' '}
                            <span className="block text-blue-600 xl:inline">Cases</span>
                        </h1>
                        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            Join our community of users who help improve cases through ratings and feedback. Your input makes a difference!
                        </p>
                        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                            <div className="rounded-md shadow">
                                <Link href="/register" 
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                >
                                    Get Started
                                </Link>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                <Link href="/login"
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
                className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                src="https://www.iraconbengaluru24.com/assets/gallery/15.jpg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Rating platform"
            />
        </div>
    </div>
);

// Features Section
const Features = () => (
    <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
                <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    A better way to rate cases
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                    Our platform provides a comprehensive system for rating and reviewing questions.
                </p>
            </div>

            <div className="mt-10">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    {[
                        {
                            title: 'Easy Rating System',
                            description: 'Simple and intuitive 5-star rating system to provide quick feedback.',
                            icon: '⭐'
                        },
                        {
                            title: 'Detailed Analytics',
                            description: 'Get insights into ratings and trends with comprehensive analytics.',
                            icon: '📊'
                        },
                        {
                            title: 'User Dashboard',
                            description: 'Track your ratings and contributions through a personalized dashboard.',
                            icon: '📱'
                        },
                        {
                            title: 'Community Feedback',
                            description: 'Join a community of users providing valuable feedback.',
                            icon: '👥'
                        }
                    ].map((feature) => (
                        <div key={feature.title} className="relative">
                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                {feature.icon}
                            </div>
                            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                            <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Stats Section
const Stats = () => (
    <div className="bg-blue-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    Trusted by users worldwide
                </h2>
                <p className="mt-3 text-xl text-blue-200 sm:mt-4">
                    Our platform helps improve questions through community feedback
                </p>
            </div>
            <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
                {[
                    { label: 'Active Users', value: '10k+' },
                    { label: 'Questions Rated', value: '50k+' },
                    { label: 'Average Rating', value: '4.8/5' }
                ].map((stat) => (
                    <div key={stat.label} className="flex flex-col">
                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                            {stat.label}
                        </dt>
                        <dd className="order-1 text-5xl font-extrabold text-white">
                            {stat.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    </div>
);

// Footer Component
const Footer = () => (
    <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
                {['About', 'Blog', 'Contact', 'Terms', 'Privacy'].map((item) => (
                    <a
                        key={item}
                        href="#"
                        className="text-gray-400 hover:text-gray-500"
                    >
                        {item}
                    </a>
                ))}
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
                <p className="text-center text-base text-gray-400">
                    &copy; {new Date().getFullYear()} Rating Platform. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
);

// Main Home Page Component
const HomePage = () => {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            router.push(user.role === 'admin' ? '/admin' : '/user');
        }
    }, [user, router]);

    return (
        <div className="min-h-screen bg-white">
            <header className="relative bg-white">
                <div className="w-full mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                        <div className="flex justify-start lg:w-0 lg:flex-1">
                            <a href="#" className="text-2xl font-bold text-blue-600">
                                IRACON
                            </a>
                        </div>
                        <div className="flex items-center justify-end md:flex-1 lg:w-0">
                            <Link href="/login"
                                className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                            >
                                Sign in
                            </Link>
                            <Link href="/register"
                                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <Hero />
                <Features />
                <Stats />
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;