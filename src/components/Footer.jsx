import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <footer className="bg-[#7F00FF] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quicklinks Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quicklinks</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-gray-200 transition-colors"
                >
                  Home
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-gray-200 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-mentorships"
                      className="hover:text-gray-200 transition-colors"
                    >
                      My Mentorships
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-gray-200 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-gray-200 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-sm">
            © 2025 STEMLink. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
