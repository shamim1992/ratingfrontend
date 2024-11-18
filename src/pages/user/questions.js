// src/pages/user/questions.js
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserLayout from '../../components/Layout/UserLayout';
import QuestionCard from '../../components/Questions/QuestionCard';
import { fetchQuestions } from '../../redux/actions/questionActions';
import { submitRating } from '../../redux/actions/ratingActions';

// Loading component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

// Search Input component
const SearchInput = ({ value, onChange }) => (
    <input
        type="text"
        className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-2"
        placeholder="Search questions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
    />
);

const QuestionsPage = () => {
    const dispatch = useDispatch();
    const { questions, loading } = useSelector((state) => state.questions);
    const { ratings } = useSelector((state) => state.ratings);
    const { user } = useSelector((state) => state.auth); // Get user from auth state
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchQuestions());
    }, [dispatch]);

    // In your user questions page
const handleRate = async (questionId, rating) => {
    try {
        if (!user?._id) {
            toast.error('Please login to rate');
            return false;
        }

        const result = await dispatch(submitRating({
            questionId,
            rating,
            userId: user._id
        }));

        return result;
    } catch (error) {
        console.error('Rating error:', error);
        return false;
    }
};

    // const handleRate = async (questionId, rating) => {
    //     try {
    //         if (!user || !user._id) {
    //             throw new Error('User not authenticated');
    //         }

    //         // Include userId in the rating submission
    //         await dispatch(submitRating({ 
    //             questionId, 
    //             rating, 
    //             userId: user._id 
    //         }));
    //         return true;
    //     } catch (error) {
    //         console.error('Rating error:', error);
    //         throw error;
    //     }
    // };

    const filteredQuestions = questions.filter(question =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getUserRating = (questionId) => {
        const rating = ratings.find(r => r.questionId === questionId);
        return rating ? rating.rating : null;
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
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Rate Cases
                    </h1>
                    <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm">
                        <SearchInput 
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                    </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                    {questions.length - ratings.length} Cases left to rate
                </p>
            </div>

            {/* Questions Grid */}
            <div className="space-y-6">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map(question => (
                        <QuestionCard
                            key={question._id}
                            question={question}
                            onRate={handleRate}
                            userRating={getUserRating(question._id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? 'No questions found matching your search.' : 'No questions available.'}
                        </p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default QuestionsPage;