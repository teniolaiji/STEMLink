import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please login to access dashboard');
      navigate('/login');
      return;
    }

    try {
      const data = await authAPI.getAccount();
      setUser(data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load user data';
      toast.error(errorMessage);
      
      // If unauthorized, token will be cleared by interceptor
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600 mb-1">Profile Status</p>
                <p className="text-2xl font-bold text-primary-900">
                  {user?.emailVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
              <div className="text-4xl">{user?.emailVerified ? '✅' : '⏳'}</div>
            </div>
            {!user?.emailVerified && (
              <p className="text-xs text-primary-700 mt-2">
                Please verify your email to unlock all features
              </p>
            )}
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Connections</p>
                <p className="text-2xl font-bold text-purple-900">0</p>
              </div>
              <div className="text-4xl">🤝</div>
            </div>
            <p className="text-xs text-purple-700 mt-2">
              Start connecting with mentors
            </p>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Sessions</p>
                <p className="text-2xl font-bold text-green-900">0</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              No upcoming sessions scheduled
            </p>
          </div>
        </div>

        {/* Account Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              user?.role === 'MENTOR' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user?.role}
            </span>
          </div>
          
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                  <p className="text-lg text-gray-900 font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                  <p className="text-lg text-gray-900">{user.email}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.emailVerified ? '✓ Verified' : '⚠ Not Verified'}
                    </span>
                  </div>
                </div>

                {user.phoneNumber && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                    <p className="text-lg text-gray-900">{user.phoneNumber}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Account ID</p>
                  <p className="text-lg text-gray-900 font-mono">{user.id}</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Member Since</p>
                  <p className="text-lg text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Account Type</p>
                  <p className="text-lg text-gray-900">
                    {user.role === 'MENTOR' ? '👨‍🏫 Mentor' : '🎓 Student'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="btn-primary text-sm py-3">
              🔍 Find Mentors
            </button>
            <button className="bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-sm">
              💬 Messages
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-sm">
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* STEM Journey Tracker */}
<div className="mt-8 card bg-white border border-gray-200 p-6">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">🌟 Your STEM Journey Tracker</h2>

  {journey ? (
    <div className="space-y-6">
      {/* Skills Progress */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills Progress</h3>
        {journey.skills?.map((skill) => (
          <div key={skill.name} className="mb-3">
            <p className="text-sm text-gray-600 mb-1">{skill.name}</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-purple-600"
                style={{ width: `${skill.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Mentorship Goals</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {journey.goals?.map((goal, idx) => (
            <li key={idx}>
              {goal.completed ? '✅' : '🔲'} {goal.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Outcomes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Outcomes</h3>
        <ul className="list-decimal list-inside text-gray-600 space-y-1">
          {journey.outcomes?.map((outcome, idx) => (
            <li key={idx}>{outcome}</li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <p className="text-gray-500">Loading your STEM journey data...</p>
  )}
</div>

export default Dashboard;

