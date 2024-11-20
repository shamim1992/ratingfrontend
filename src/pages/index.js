// src/pages/index.js
import { useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import logoImg from '../../public/logo.png'
import Image from 'next/image';

// Hero Section Component
const Hero = () => (
    <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                    <div className="sm:text-center lg:text-left ">
                        <h1 className="mb-4 text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md">
                            <span className="block xl:inline">Heres an exciting opportunity for you to contribute—rate the clinical </span>{' '}
                            <span className="block text-blue-600 xl:inline">case images selected for presentation!</span>
                        </h1>
                        <p className="text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md">
                        Please evaluate each case based on the following factors:
                        </p>
                        <div className='mb-4 text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md'>
                            <ul>
                                <li>Uniqueness</li>
                                <li>Reliability</li>
                                <li>Clarity</li>
                                <li>Relevance</li>
                            </ul>
                        </div>
                        <p className='mb-4 text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md'>Rate each case on a scale of 1 to 10, considering these factors</p>
                        <p className='mb-4 text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md'>Please rate every images.</p>
                        <p className='mb-4 text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md'>You can pass in between and when you login again, it will show the next images from where you left.</p>
                        <p className='text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md'>To participate in the rating process: Click on the Sign Up or Get Started button and register</p>
                        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                            <div className="rounded-md shadow">
                                <Link href="/register" 
                                    className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-2 md:text-lg md:px-10"
                                >
                                    Get Started
                                </Link>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                <Link href="/login"
                                    className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-2 md:text-lg md:px-10"
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

// Footer Component
const Footer = () => (
    <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center text-xs space-x-6 md:order-2">
               Contact: +91 95350 56289
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
                <p className="text-center text-xs text-gray-400">
                  Copyright  &copy; {new Date().getFullYear()} - Developed by ChanRe Health Care and Research Assist.
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
                    <div className="flex justify-between items-center border-b-2 border-gray-100 py-2 md:justify-start md:space-x-10">
                        <div className="flex justify-start lg:w-0 lg:flex-1">
                            <a href="#" className="text-2xl font-bold text-blue-600">
                            <Image src={logoImg} alt={'logo'} className=" h-16 w-24"/>
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
              
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;