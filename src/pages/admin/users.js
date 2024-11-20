// src/pages/admin/users.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/Layout/AdminLayout';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { 
    fetchUsers, 
    fetchUserStats, 
    updateUserRole, 
    deactivateUser,
    getUserDetails 
} from '../../redux/actions/userActions';
import { toast } from 'react-toastify';

// Loading component
const Loader = () => (
    <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

// Stats Card Component
const StatsCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-700">
            {value || 0}
        </p>
    </div>
);

// User Modal Component
const UserModal = ({ user, onClose }) => (

   
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full m-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">User Details</h2>
                <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="mt-1 text-gray-900">{user.role}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Join Date</h3>
                    <p className="mt-1 text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                    <p className="mt-1 text-gray-900">
                        {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                </div>
                {user.ratings && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Recent Ratings</h3>
                        <div className="mt-1 space-y-2">
                            {
                                
                            
                            user.ratings.map((rating, index) => (

                                <div key={index} className="text-sm text-gray-600" >
                                    {rating.question}:{rating.rating}
                                </div>
                                   
                             
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

const Users = () => {
    const dispatch = useDispatch();
    const { users, stats, loading, currentUser } = useSelector((state) => state.users);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchUsers()),
                    dispatch(fetchUserStats())
                ]);
            } catch (error) {
                toast.error('Error loading data');
            }
        };
        loadData();
    }, [dispatch]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await dispatch(updateUserRole(userId, newRole));
            toast.success('Role updated successfully');
        } catch (error) {
            toast.error('Error updating user role');
        }
    };

    const handleUserDeactivate = async (userId) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await dispatch(deactivateUser(userId));
                toast.success('User deactivated successfully');
            } catch (error) {
                toast.error('Error deactivating user');
            }
        }
    };

    const handleViewDetails = async (userId) => {
        try {
            await dispatch(getUserDetails(userId));
            setShowModal(true);
        } catch (error) {
            toast.error('Error fetching user details');
        }
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && users.length === 0) {
        return (
            <AdminLayout>
                <Loader />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatsCard title="Total Users" value={stats?.totalUsers} />
                <StatsCard title="Active Users" value={stats?.activeUsers} />
                <StatsCard title="Admin Users" value={stats?.adminUsers} />
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users by email..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="text-sm text-gray-900 border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={user.role}
                                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.lastLogin).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(user._id)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleUserDeactivate(user._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Deactivate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-4 text-gray-500">
                        No users found
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {showModal && currentUser && (
                <UserModal 
                    user={currentUser} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </AdminLayout>
    );
};

// Wrap with ProtectedRoute
export default function ProtectedUsersPage() {
    return (
        <ProtectedRoute>
            <Users />
        </ProtectedRoute>
    );
}