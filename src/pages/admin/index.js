// src/pages/admin/index.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '../../components/Layout/AdminLayout';
import { fetchQuestions } from '../../redux/actions/questionActions';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.questions);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Questions</h3>
          <p className="text-3xl font-bold text-gray-700">{questions.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Active Questions</h3>
          <p className="text-3xl font-bold text-gray-700">
            {questions.filter(q => q.active).length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Ratings</h3>
          <p className="text-3xl font-bold text-gray-700">
            {questions.reduce((acc, q) => acc + q.totalRatings, 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
          <p className="text-3xl font-bold text-gray-700">
            {(questions.reduce((acc, q) => acc + q.averageRating, 0) / questions.length || 0).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Cases</h2>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ratings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.slice(0, 5).map((question) => (
                  <tr key={question._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: question.description.substring(0, 50)} }>
                     
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(question.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        question.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {question.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {question.totalRatings} ({question.averageRating.toFixed(1)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;