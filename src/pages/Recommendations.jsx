import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mentorshipAPI, reviewAPI } from '../services/api';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [requestedMentors, setRequestedMentors] = useState(new Set());

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await mentorshipAPI.getRecommendations();
      console.log('Recommendations response:', data);
      setRecommendations(data.recommendations || data || []);
    } catch (error) {
      console.error('Recommendations error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to load recommendations';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (mentor) => {
    try {
      const mentorUserId = mentor.user?._id;
      
      if (!mentorUserId) {
        toast.error('Unable to identify mentor. Please try again.');
        return;
      }
      
      await mentorshipAPI.sendRequest(mentorUserId);
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
    return requestedMentors.has(mentor.user?._id);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Finding your perfect mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Matched Mentors 🤖✨</h1>
          <p className="text-gray-600 mt-1">Personalized mentor recommendations based on your profile and interests</p>
        </div>

        {recommendations.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">No recommendations available yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Make sure your profile is complete to get personalized recommendations
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((mentor, index) => {
              const isRequested = isMentorRequested(mentor);
              
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
                      👨‍🏫
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {mentor.user?.firstName} {mentor.user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{mentor.profession}</p>
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
                    {mentor.educationBackground && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Education:</span>
                        <span className="ml-2 line-clamp-1">{mentor.educationBackground}</span>
                      </div>
                    )}
                  </div>

                  {mentor.stemFields && mentor.stemFields.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {mentor.stemFields.slice(0, 3).map((field, idx) => (
                          <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            {field}
                          </span>
                        ))}
                        {mentor.stemFields.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{mentor.stemFields.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {mentor.expertiseAreas && mentor.expertiseAreas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Expertise Areas:</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertiseAreas.slice(0, 2).map((area, idx) => (
                          <span key={idx} className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestMentorship(mentor)}
                      disabled={isRequested}
                      className={`flex-1 text-sm py-2 font-semibold rounded-lg transition-colors ${
                        isRequested ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'btn-primary'
                      }`}
                    >
                      {isRequested ? '✓ Request Sent' : 'Request Mentorship'}
                    </button>
                    <button
                      onClick={() => handleViewReviews(mentor.user?._id)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Reviews
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
                  <button onClick={() => setShowReviews(false)} className="text-gray-500 hover:text-gray-700">
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
                          <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
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

export default Recommendations;