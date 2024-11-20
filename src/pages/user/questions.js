import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserLayout from '../../components/Layout/UserLayout';
import QuestionCard from '../../components/Questions/QuestionCard';
import { fetchQuestions } from '../../redux/actions/questionActions';
import { fetchUserRatings, submitRating } from '../../redux/actions/ratingActions';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

const SearchInput = ({ value, onChange }) => (
    <input
        type="text"
        className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-2"
        placeholder="Search questions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
    />
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 1; // Number of page buttons to show
        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex justify-center items-center mt-8 space-x-2">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
                {getPageNumbers().map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg border ${
                            currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronsRight className="w-5 h-5" />
            </button>
        </div>
    );
};

const QuestionsPage = () => {
    const dispatch = useDispatch();
    const { questions, loading } = useSelector((state) => state.questions);
    const { ratings } = useSelector((state) => state.ratings);
    const { user } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [localRatings, setLocalRatings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 10;

    useEffect(() => {
        dispatch(fetchQuestions());
        dispatch(fetchUserRatings());
    }, [dispatch]);

    useEffect(() => {
        setLocalRatings(ratings);
    }, [ratings]);

    useEffect(() => {
        setCurrentPage(1); // Reset page to 1 when search term changes
    }, [searchTerm]);

    const handleRate = async (questionId, rating) => {
        try {
            if (!user?._id) {
                toast.error('Please login to rate');
                return false;
            }

            const result = await dispatch(
                submitRating({
                    questionId,
                    rating,
                    userId: user._id,
                })
            );

            if (result) {
                toast.success('Rating submitted successfully!');
                await dispatch(fetchQuestions()); 
                await dispatch(fetchUserRatings()); 
            }

            return result;
        } catch (error) {
            console.error('Rating error:', error);
            toast.error('Failed to submit rating. Please try again.');
            return false;
        }
    };

    const nonRatedQuestions = questions.filter(
        (question) =>
            !localRatings.some((rating) => rating.questionId?._id === question._id)
    );

    const filteredQuestions = nonRatedQuestions.filter((question) =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const paginatedQuestions = filteredQuestions.slice(
        startIndex,
        startIndex + questionsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <UserLayout>
                <LoadingSpinner />
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Unrated Cases
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {nonRatedQuestions.length} cases left to rate
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm w-full sm:w-64">
                        <SearchInput value={searchTerm} onChange={setSearchTerm} />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {filteredQuestions.length > 0 ? (
                    <>
                        {paginatedQuestions.map((question) => (
                            <QuestionCard
                                key={question._id}
                                question={question}
                                onRate={handleRate}
                                userRating={null}
                                userId={user?._id}
                            />
                        ))}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">
                            {searchTerm
                                ? 'No unrated questions found matching your search.'
                                : 'You have rated all available questions!'}
                        </p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default QuestionsPage;
