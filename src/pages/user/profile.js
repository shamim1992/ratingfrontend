// src/pages/user/profile.js
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import UserLayout from '../../components/Layout/UserLayout';
import { updateProfile, changePassword } from '../../redux/actions/authActions';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);
    
    // Profile update state
    const [profileData, setProfileData] = useState({
        email: user?.email || '',
        name: user?.name || ''
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Loading states
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            await dispatch(updateProfile(profileData)).unwrap();
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setChangingPassword(true);
        try {
            await dispatch(changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })).unwrap();
            
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            toast.success('Password changed successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <UserLayout>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>

                {/* Profile Information */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={updatingProfile}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {updatingProfile ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white shadow rounded-lg">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={changingPassword}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {changingPassword ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Account Statistics */}
                <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(user?.createdAt).toLocaleDateString()}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(user?.lastLogin).toLocaleDateString()}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Role</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h2>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Total Ratings
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    {user?.totalRatings || 0}
                                </dd>
                            </div>
                            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Average Rating Given
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    {user?.averageRating?.toFixed(1) || '0.0'}
                                </dd>
                            </div>
                            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Completion Rate
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    {user?.completionRate?.toFixed(1) || '0'}%
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Account */}
                <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h2>
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Delete account
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>
                                            Once you delete your account, you will lose all your data and ratings. This action cannot be undone.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                                    // Implement delete account functionality
                                                    toast.info('Account deletion is not implemented yet');
                                                }
                                            }}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default ProfilePage;