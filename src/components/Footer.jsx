import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <footer className="bg-[#7F00FF] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section - only show for non-logged-in users */}
          {!user && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">STEMLink</h2>
              <p className="text-gray-200 mb-4">
                Connecting students with experienced mentors in STEM fields. Build your career, share your knowledge, and grow together in STEM.
              </p>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-200 hover:text-white">Home</Link></li>
              {user && (
                <>
                  <li><Link to="/my-mentorships" className="text-gray-200 hover:text-white">My Mentorships</Link></li>
                  <li><Link to="/dashboard" className="text-gray-200 hover:text-white">Dashboard</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-200 hover:text-white">FAQ</Link></li>
              <li><Link to="/contact-us" className="text-gray-200 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-400 mt-8 pt-4 text-center">
          <p className="text-gray-200 text-sm">© 2025 STEMLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
