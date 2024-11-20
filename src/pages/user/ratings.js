import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserLayout from '../../components/Layout/UserLayout';
import { fetchUserRatings } from '../../redux/actions/ratingActions';
import { ImgUrl } from '@/AppUrl';

const RatingCard = ({ rating }) => {
    if (!rating?.questionId) return null;

    const formattedDate = new Date(rating.timestamp || rating.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base md:text-lg font-medium text-gray-900">
                            {rating.questionId?.title || 'Untitled Question'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
                    </div>
                    <div className="flex items-center">
                        {[...Array(10)].map((_, index) => (
                            <span
                                key={index}
                                className={`text-xl md:text-2xl ${
                                    index < (rating.rating || 0)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                            __html: rating.questionId?.description || 'No description available',
                        }}
                    />
                </div>
                {rating.questionId?.images?.length > 0 && (
                    <div className="mt-4">
                        <div className="grid grid-cols-2 gap-2">
                            {rating.questionId.images.slice(0, 2).map((image, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden">
                                    <img
                                        src={`${ImgUrl}${image}`}
                                        alt={`Question ${index + 1}`}
                                        className="w-full h-auto rounded-lg object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MyRatings = () => {
    const dispatch = useDispatch();
    const { ratings = [], loading } = useSelector((state) => state.ratings);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchUserRatings());
    }, [dispatch]);

    const filteredRatings = ratings.filter((rating) => {
        if (!rating?.questionId) return false;
        const titleMatch =
            rating.questionId.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const descriptionMatch =
            rating.questionId.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const matchesSearch = titleMatch || descriptionMatch;
        const matchesFilter = filter === 'all' || rating.rating === parseInt(filter);
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: ratings.length,
        average:
            ratings.length > 0
                ? ratings.reduce((acc, curr) => acc + (curr?.rating || 0), 0) / ratings.length
                : 0,
        distribution: ratings.reduce((acc, curr) => {
            if (curr?.rating) {
                acc[curr.rating] = (acc[curr.rating] || 0) + 1;
            }
            return acc;
        }, {}),
    };

    if (loading) {
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
            <div className="mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">My Ratings</h1>
                <p className="mt-2 text-sm text-gray-600">
                    You have rated {stats.total} cases with an average rating of{' '}
                    {stats.average.toFixed(1)} stars.
                </p>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block p-2 w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                    <option value="all">All Ratings</option>
                    <option value="10">10 Stars</option>
                    <option value="9">9 Stars</option>
                    <option value="8">8 Stars</option>
                    <option value="7">7 Stars</option>
                    <option value="6">6 Stars</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>

                <input
                    type="text"
                    placeholder="Search your ratings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block p-2 w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>

            <div className="space-y-6">
                {filteredRatings.length > 0 ? (
                    filteredRatings.map((rating) =>
                        rating?._id ? <RatingCard key={rating._id} rating={rating} /> : null
                    )
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">
                            {searchTerm || filter !== 'all'
                                ? 'No ratings found matching your criteria.'
                                : "You haven't rated any questions yet."}
                        </p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default MyRatings;
