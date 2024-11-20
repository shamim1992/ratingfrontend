// src/pages/user/index.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserLayout from '../../components/Layout/UserLayout';
import { fetchUserRatings } from '../../redux/actions/ratingActions';
import { fetchQuestions } from '../../redux/actions/questionActions';
import { useRouter } from 'next/router';
import Link from 'next/link';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="text-2xl">{icon}</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{value}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);

const RecentRatings = ({ ratings }) => (
    <div className="bg-white shadow rounded-lg">
        <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Ratings</h3>
            <div className="mt-5">
                <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                        {ratings.map((rating) => (
                            <li key={rating._id} className="py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {rating.questionId.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(rating.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <span
                                                key={index}
                                                className={`text-${index < rating.rating ? 'yellow' : 'gray'
                                                    }-400`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const UnratedQuestions = ({ questions, onRate }) => (
    <div className="bg-white shadow rounded-lg">
        <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Cases to Rate</h3>
            <div className="mt-5">
                <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                        {questions.map((question) => (
                            <li key={question._id} className="py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {question.title}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate" dangerouslySetInnerHTML={{ __html: question.description }}>

                                        </p>
                                    </div>
                                    <div>
                                        {/* <button
                                            onClick={() => onRate(question._id)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Rate Now
                                        </button> */}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const UserDashboard = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { ratings, loading: ratingsLoading } = useSelector((state) => state.ratings);
    console.log(ratings)
    const { questions, loading: questionsLoading } = useSelector((state) => state.questions);

    useEffect(() => {
        dispatch(fetchUserRatings());
        dispatch(fetchQuestions());
    }, [dispatch]);

    const handleRate = (questionId) => {
        router.push(`/user/questions/${questionId}`);
    };

    const unratedQuestions = questions.filter(
        question => !ratings.some(rating => rating.questionId._id === question._id)
    );

    if (ratingsLoading || questionsLoading) {
        return (
            <UserLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            {/* Stats Overview */}
            <div className='flex flex-col md:flex-row justify-around gap-3 items-center'>
                <div className="sm:text-center bg-white shadow rounded-lg p-10 lg:text-left card">
                    <h1 className="mb-4 text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md">
                        <span className="block xl:inline">Heres an exciting opportunity for you to contribute—rate the clinical </span>{' '}
                        <span className="block  xl:inline">case images selected for presentation!</span>
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
                    <p className='text-md tracking-tight font-extrabold text-gray-900 sm:text-sm md:text-md'>Want to participate in the rating process
                    </p>
                    <div className='mt-6 md:mt-2 mx-auto'><Link href={'/user/questions'} className='text-white px-4 py-2 bg-blue-500 rounded-2xl hover:bg-orange-500'>Start Now</Link></div>

                </div>
                <div className="flex-1 flex flex-col justify-around w-full gap-2">
                    <StatCard
                        title="Total Ratings"
                        value={ratings.filter(rating => rating.userId === user?._id).length}
                        icon="⭐"
                    />
                    <StatCard
                        title="Cases Left"
                        value={unratedQuestions.length}
                        icon="❓"
                    />
                    <StatCard
                        title="Average Rating"
                        value={(ratings
                            .filter(rating => rating.userId === user?._id)
                            .reduce((acc, curr) => acc + curr.rating, 0) /
                            ratings.filter(rating => rating.userId === user?._id).length || 0
                        ).toFixed(1)}
                        icon="📊"
                    />
                </div>

            </div>


            {/* Main Content */}
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <RecentRatings ratings={ratings.slice(0, 10)} />
                <UnratedQuestions
                    questions={unratedQuestions.slice(0, 10)}
                    onRate={handleRate}
                />
            </div>
        </UserLayout>
    );
};

export default UserDashboard;