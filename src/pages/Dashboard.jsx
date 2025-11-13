import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      
      // Redirect based on role
      if (data.role === 'ADMIN') {
        navigate('/admin-panel');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load user data';
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
        </div>

        {/* Quick Actions - Student */}
        {user?.role === 'STUDENT' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/find-mentors" className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-600 mb-1">Find Mentors</p>
                  <p className="text-lg font-bold text-primary-900">Browse Now</p>
                </div>
                <div className="text-4xl">🔍</div>
              </div>
              <p className="text-xs text-primary-700 mt-2">
                Discover experienced STEM professionals
              </p>
            </Link>

            <Link to="/my-mentorships" className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">My Mentorships</p>
                  <p className="text-lg font-bold text-purple-900">View All</p>
                </div>
                <div className="text-4xl">🤝</div>
              </div>
              <p className="text-xs text-purple-700 mt-2">
                Manage your connections
              </p>
            </Link>

            <Link to="/student-profile" className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">My Profile</p>
                  <p className="text-lg font-bold text-green-900">Manage Profile</p>
                </div>
                <div className="text-4xl">👤</div>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Update your details
              </p>
            </Link>
          </div>
        )}

        {/* Quick Actions - Mentor */}
        {user?.role === 'MENTOR' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link to="/my-mentorships" className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">My Mentorships</p>
                  <p className="text-lg font-bold text-purple-900">Manage Students</p>
                </div>
                <div className="text-4xl">🤝</div>
              </div>
              <p className="text-xs text-purple-700 mt-2">
                View requests and active mentorships
              </p>
            </Link>

            <Link to="/mentor-profile" className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">My Profile</p>
                  <p className="text-lg font-bold text-green-900">Manage Profile</p>
                </div>
                <div className="text-4xl">👨‍🏫</div>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Update your details
              </p>
            </Link>
          </div>
        )}

        {/* Account Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              user?.role === 'MENTOR' 
                ? 'bg-purple-100 text-purple-800' 
                : user?.role === 'ADMIN'
                ? 'bg-red-100 text-red-800'
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
                  <p className="text-lg text-gray-900 font-mono text-sm">{user.id}</p>
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
                    {user.role === 'MENTOR' ? '👨‍🏫 Mentor' : user.role === 'ADMIN' ? '⚙️ Admin' : '🎓 Student'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
