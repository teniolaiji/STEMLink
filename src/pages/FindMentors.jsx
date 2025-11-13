import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mentorAPI, studentAPI, mentorshipAPI, reviewAPI } from '../services/api';

function FindMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [requestedMentors, setRequestedMentors] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const data = await mentorAPI.getAllMentors(0, 20);
      setMentors(data.mentors || data);
    } catch (error) {
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (mentor) => {
    try {
      // Send the mentor's user ID, not the profile ID
      const mentorUserId = mentor.user?._id || mentor.userId?._id;
      
      if (!mentorUserId) {
        toast.error('Unable to identify mentor. Please try again.');
        return;
      }
      
      await mentorshipAPI.sendRequest(mentorUserId);
      
      // Add mentor to requested list
      setRequestedMentors(prev => new Set([...prev, mentorUserId]));
      
      toast.success('Mentorship request sent successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to send request';
      toast.error(errorMessage);
    }
  };

  const handleViewReviews = async (userId) => {
    try {
      const data = await reviewAPI.getUserReviews(userId);
      setReviews(data.reviews || []);
      setShowReviews(true);
    } catch (error) {
      toast.error('Failed to load reviews');
    }
  };

  const isMentorRequested = (mentor) => {
    const mentorUserId = mentor.user?._id || mentor.userId?._id;
    return requestedMentors.has(mentorUserId);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Mentor 🔍</h1>
          <p className="text-gray-600 mt-1">Connect with experienced STEM professionals</p>
        </div>

        {mentors.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl text-gray-600">No mentors available yet</p>
            <p className="text-sm text-gray-500 mt-2">Check back later for more mentors</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => {
              const isRequested = isMentorRequested(mentor);
              
              return (
                <div key={mentor._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
                        👨‍🏫
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">
                          {mentor.user?.firstName || mentor.userId?.firstName} {mentor.user?.lastName || mentor.userId?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{mentor.profession}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{mentor.bio}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Experience:</span>
                      <span className="ml-2">{mentor.yearsOfExperience} years</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Availability:</span>
                      <span className="ml-2">{mentor.availability}</span>
                    </div>
                  </div>

                  {mentor.stemFields && mentor.stemFields.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {mentor.stemFields.slice(0, 3).map((field, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {currentUser?.role === 'STUDENT' && (
                      <button
                        onClick={() => handleRequestMentorship(mentor)}
                        disabled={isRequested}
                        className={`flex-1 text-sm py-2 font-semibold rounded-lg transition-colors ${
                          isRequested
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                      >
                        {isRequested ? '✓ Request Sent' : 'Request Mentorship'}
                      </button>
                    )}
                    <button
                      onClick={() => handleViewReviews(mentor.user?._id || mentor.userId?._id)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      View Reviews
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reviews Modal */}
        {showReviews && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Reviews</h2>
                  <button
                    onClick={() => setShowReviews(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review, idx) => (
                      <div key={idx} className="border-b pb-4">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < review.rating ? '⭐' : '☆'}</span>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          By: {review.reviewerId?.firstName} {review.reviewerId?.lastName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindMentors;
