// src/pages/admin/analytics.js
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '../../components/Layout/AdminLayout';
import { fetchQuestions } from '../../redux/actions/questionActions';
import { fetchUserStats } from '../../redux/actions/userActions';
import { fetchRatingStats } from '../../redux/actions/ratingActions';

// Card Component
const StatCard = ({ title, value, icon, bgColor = 'bg-white' }) => (
    <div className={`${bgColor} rounded-lg shadow-sm p-6`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className="text-3xl">{icon}</div>
        </div>
    </div>
);

// Rating Distribution Component
const RatingDistribution = ({ ratings }) => {
    const maxCount = ratings ? Math.max(...Object.values(ratings)) : 0;
    
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
            <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratings?.[rating] || 0;
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    
                    return (
                        <div key={rating} className="flex items-center">
                            <span className="w-12 text-sm text-gray-600">{rating} ★</span>
                            <div className="flex-1 mx-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-yellow-400 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <span className="w-20 text-sm text-gray-600">
                                {count} ({((count / (maxCount || 1)) * 100).toFixed(1)}%)
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Recent Activity Component
const RecentActivity = ({ activities }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {activities && activities.length > 0 ? (
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center border-b pb-4 last:border-0">
                        <div className="bg-blue-100 rounded-full p-2 mr-4">
                            {activity.type === 'rating' ? '⭐' : '❓'}
                        </div>
                        <div>
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-500">No recent activity</div>
        )}
    </div>
);

// Main Analytics Component
const Analytics = () => {
    const dispatch = useDispatch();
    const { questions, loading: questionsLoading } = useSelector((state) => state.questions);
    const { stats: userStats, loading: usersLoading } = useSelector((state) => state.users);
    const { stats: ratingStats, loading: ratingsLoading } = useSelector((state) => state.ratings);

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchQuestions()),
                    dispatch(fetchUserStats()),
                    dispatch(fetchRatingStats())
                ]);
            } catch (error) {
                console.error('Error loading analytics data:', error);
            }
        };
        loadData();
    }, [dispatch]);

    // Memoized calculations
    const calculatedStats = useMemo(() => {
        const totalQuestions = questions?.length || 0;
        const activeQuestions = questions?.filter(q => q.active)?.length || 0;
        const totalRatings = questions?.reduce((acc, q) => acc + (q.totalRatings || 0), 0) || 0;
        const averageRating = totalQuestions > 0
            ? questions.reduce((acc, q) => acc + (q.averageRating || 0), 0) / totalQuestions
            : 0;

        return {
            totalQuestions,
            activeQuestions,
            totalRatings,
            averageRating
        };
    }, [questions]);

    // Memoized top rated questions
    const topRatedQuestions = useMemo(() => {
        if (!questions || !questions.length) return [];
        return [...questions]
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            .slice(0, 5);
    }, [questions]);

    const loading = questionsLoading || usersLoading || ratingsLoading;

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </AdminLayout>
        );
    }

    const todaysQuestions = questions?.filter(q => 
        new Date(q.createdAt).toDateString() === new Date().toDateString()
    ).length || 0;

    const completionRate = calculatedStats.totalQuestions > 0
        ? (questions.filter(q => q.totalRatings > 0).length / calculatedStats.totalQuestions) * 100
        : 0;

    return (
        <AdminLayout>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={userStats?.totalUsers || 0}
                    icon="👥"
                />
                <StatCard
                    title="Total Cases"
                    value={calculatedStats.totalQuestions}
                    icon="❓"
                />
                <StatCard
                    title="Average Rating"
                    value={calculatedStats.averageRating.toFixed(1)}
                    icon="⭐"
                />
                <StatCard
                    title="Active Cases"
                    value={calculatedStats.activeQuestions}
                    icon="✓"
                />
            </div>

            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <RatingDistribution ratings={ratingStats?.ratings} />
                
                {/* Top Rated Questions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Rated Cases</h3>
                    <div className="space-y-4">
                        {topRatedQuestions.map((question) => (
                            <div key={question._id} className="flex justify-between items-center border-b pb-2">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 truncate" dangerouslySetInnerHTML={{__html: question.description.substring(0, 50)}}>
                                      
                                    </p>
                                </div>
                                <div className="ml-4 flex items-center">
                                    <span className="text-yellow-400 mr-1">★</span>
                                    <span className="text-sm text-gray-600">
                                        {question.averageRating?.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {topRatedQuestions.length === 0 && (
                            <div className="text-center text-gray-500">
                                No rated questions available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-8">
                <RecentActivity 
                    activities={[
                        {
                            type: 'rating',
                            description: 'New rating submitted for Question #123',
                            timestamp: new Date()
                        },
                        {
                            type: 'question',
                            description: 'New question added to the platform',
                            timestamp: new Date(Date.now() - 86400000)
                        }
                    ]}
                />
            </div>

            {/* User Activity Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">User Activity</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active Users Today</span>
                            <span className="font-semibold">{userStats?.activeToday || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">New Users This Week</span>
                            <span className="font-semibold">{userStats?.newThisWeek || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Ratings Today</span>
                            <span className="font-semibold">{ratingStats?.todayCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Cases Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Cases Added Today</span>
                            <span className="font-semibold">{todaysQuestions}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active Cases</span>
                            <span className="font-semibold">{calculatedStats.activeQuestions}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Completion Rate</span>
                            <span className="font-semibold">
                                {completionRate.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Rating Statistics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Ratings</span>
                            <span className="font-semibold">{ratingStats?.totalRatings || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Average Rating</span>
                            <span className="font-semibold">{calculatedStats.averageRating.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">5★ Ratings</span>
                            <span className="font-semibold">{ratingStats?.ratings?.[5] || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Analytics;