import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🎓</div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting students with experienced mentors. Build your career, share your knowledge, and grow in the world of STEM.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">STEMLink</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Empowering girls in Rwanda through STEM mentorship connections
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Get Started →
            </Link>
            <Link
              to="/login"
              className="bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold px-8 py-4 rounded-lg transition-colors duration-200 inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose STEMLink?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="text-5xl mb-4 text-center">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                Expert Mentorship
              </h3>
              <p className="text-gray-600 text-center">
                Connect with experienced STEM professionals who are passionate about guiding the next generation
              </p>
            </div>

            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="text-5xl mb-4 text-center">🤝</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                Build Your Network
              </h3>
              <p className="text-gray-600 text-center">
                Join a growing community of like-minded individuals and expand your STEM connections
              </p>
            </div>

            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="text-5xl mb-4 text-center">🚀</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                Achieve Your Dreams
              </h3>
              <p className="text-gray-600 text-center">
                Get personalized guidance and support to reach your academic and career goals in STEM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-primary-100 text-lg">Active Students</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <p className="text-primary-100 text-lg">Expert Mentors</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <p className="text-primary-100 text-lg">Mentorship Sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your STEM Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join STEMLink today and connect with mentors who can help you succeed
          </p>
          <Link
            to="/register"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
