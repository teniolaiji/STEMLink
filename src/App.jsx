import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import './App.css';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import FindMentors from './pages/FindMentors';
import StudentProfile from './pages/StudentProfile';
import MentorProfile from './pages/MentorProfile';
import MyMentorships from './pages/MyMentorships';
import Recommendations from './pages/Recommendations';
// import AdminPanel from './pages/AdminPanel';

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsLoggedIn(!!token);
    setUserRole(user.role || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              STEMLink
            </Link>
            {isLoggedIn && (
              <>
                {/* Student Navigation */}
                {userRole === 'STUDENT' && (
                  <>
                    <Link 
                      to="/recommendations" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      🤖 AI Recommendations
                    </Link>
                    <Link 
                      to="/find-mentors" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      🔍 Find Mentors
                    </Link>
                    <Link 
                      to="/my-mentorships" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      🤝 My Mentorships
                    </Link>
                    <Link 
                      to="/student-profile" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      👤 My Profile
                    </Link>
                  </>
                )}

                {/* Mentor Navigation */}
                {userRole === 'MENTOR' && (
                  <>
                    <Link 
                      to="/my-mentorships" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      🤝 My Mentorships
                    </Link>
                    <Link 
                      to="/mentor-profile" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      👤 My Profile
                    </Link>
                  </>
                )}

                {/* Admin Navigation */}
                {userRole === 'ADMIN' && (
                  <>
                    <Link 
                      to="/admin-panel" 
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      ⚙️ Admin Panel
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navigation />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/find-mentors" element={<FindMentors />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/mentor-profile" element={<MentorProfile />} />
          <Route path="/my-mentorships" element={<MyMentorships />} />
          {/* <Route path="/admin-panel" element={<AdminPanel />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
