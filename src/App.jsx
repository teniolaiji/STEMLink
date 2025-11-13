import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MentorProfileForm from './pages/MentorProfileForm';
import MentorshipRequests from './pages/MentorshipRequests';
import RecommendedMentors from './pages/RecommendedMentors';
import MentorListing from './pages/MentorListing';
import MentorProfileDetail from './pages/MentorProfileDetail';
import NotFound from './pages/NotFound';
import FindMentors from './pages/FindMentors';
import StudentProfile from './pages/StudentProfile';
import MentorProfile from './pages/MentorProfile';
import MyMentorships from './pages/MyMentorships';
import EmailVerification from './pages/EmailVerification';
// import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mentor-profile" element={<MentorProfileForm />} />
            <Route path="/mentorship-requests" element={<MentorshipRequests />} />
            <Route path="/recommended-mentors" element={<RecommendedMentors />} />
            <Route path="/mentors" element={<MentorListing />} />
            <Route path="/mentor/:id" element={<MentorProfileDetail />} />
            <Route path="/find-mentors" element={<FindMentors />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="/my-mentorships" element={<MyMentorships />} />
            {/* <Route path="/admin-panel" element={<AdminPanel />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

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
