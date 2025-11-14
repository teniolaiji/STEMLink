import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [journey, setJourney] = useState(null); // ✅ ADDED

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchJourneyData(); // OPTIONAL: Call your journey API here if needed
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

  // OPTIONAL: replace with your real API call
  const fetchJourneyData = async () => {
    try {
      // setJourney(await dashboardAPI.getJourney());  
      setJourney({
        skills: [
          { name: "Math", progress: 60 },
          { name: "Physics", progress: 40 }
        ],
        goals: [
          { name: "Complete mentorship session", completed: false },
          { name: "Build STEM project", completed: true }
        ],
        outcomes: ["Improved confidence", "Better STEM understanding"]
      });
    } catch (err) {
      console.log(err);
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

        {/* Quick Actions for Students */}
        {user?.role === 'STUDENT' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/find-mentors" className="card hover:shadow-lg transition bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-600 mb-1">Find Mentors</p>
                  <p className="text-lg font-bold text-primary-900">Browse Now</p>
                </div>
                <div className="text-4xl">🔍</div>
              </div>
            </Link>

            <Link to="/my-mentorships" className="card hover:shadow-lg transition bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">My Mentorships</p>
                  <p className="text-lg font-bold text-purple-900">View All</p>
                </div>
                <div className="text-4xl">🤝</div>
              </div>
            </Link>

            <Link to="/student-profile" className="card hover:shadow-lg transition bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">My Profile</p>
                  <p className="text-lg font-bold text-green-900">Manage Profile</p>
                </div>
                <div className="text-4xl">👤</div>
              </div>
            </Link>
          </div>
        )}

        {/* Quick Actions - Mentor */}
        {user?.role === 'MENTOR' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link to="/my-mentorships" className="card hover:shadow-lg transition bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">My Mentorships</p>
                  <p className="text-lg font-bold text-purple-900">Manage Students</p>
                </div>
                <div className="text-4xl">🤝</div>
              </div>
            </Link>

            <Link to="/mentor-profile" className="card hover:shadow-lg transition bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">My Profile</p>
                  <p className="text-lg font-bold text-green-900">Manage Profile</p>
                </div>
                <div className="text-4xl">👨‍🏫</div>
              </div>
            </Link>
          </div>
        )}

        {/* Account Information */}
        <div className="card mb-8">
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
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-lg">{user.firstName} {user.lastName}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="text-lg">{user.email}</p>
                </div>

                {user.phoneNumber && (
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="text-lg">{user.phoneNumber}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Account ID</p>
                  <p className="text-lg font-mono">{user.id}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="text-lg">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-1">Account Type</p>
                  <p className="text-lg">
                    {user.role === 'MENTOR' ? '👨‍🏫 Mentor' :
                     user.role === 'ADMIN' ? '⚙️ Admin' : '🎓 Student'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ⭐ STEM Journey Tracker Section — NOW FIXED AND INSIDE RETURN */}
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
                      />
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

      </div>
    </div>
  );
}

export default Dashboard;
