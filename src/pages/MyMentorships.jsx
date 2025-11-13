import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mentorshipAPI, reviewAPI } from '../services/api';

function MyMentorships() {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchMentorships();
  }, [filter]);

  const fetchMentorships = async () => {
    try {
      const data = await mentorshipAPI.getMyMentorships(filter, 0, 20);
      setMentorships(data.mentorships || data);
    } catch (error) {
      toast.error('Failed to load mentorships');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (mentorshipId) => {
    try {
      await mentorshipAPI.acceptRequest(mentorshipId);
      toast.success('Mentorship request accepted!');
      fetchMentorships();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to accept request';
      toast.error(errorMessage);
    }
  };

  const handleEndMentorship = async (mentorshipId) => {
    if (!window.confirm('Are you sure you want to end this mentorship?')) return;

    try {
      await mentorshipAPI.endMentorship(mentorshipId);
      toast.success('Mentorship ended successfully');
      fetchMentorships();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to end mentorship';
      toast.error(errorMessage);
    }
  };

  const handleOpenReviewModal = (mentorship) => {
    setSelectedMentorship(mentorship);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const revieweeId = currentUser.role === 'STUDENT' 
        ? selectedMentorship.mentorId._id 
        : selectedMentorship.studentId._id;

      await reviewAPI.addReview({
        revieweeId,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment,
      });

      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to submit review';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading mentorships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Mentorships 🤝</h1>
          <p className="text-gray-600 mt-1">Manage your mentorship connections</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'PENDING'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'ACTIVE'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'COMPLETED'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {mentorships.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600">No mentorships found</p>
            <p className="text-sm text-gray-500 mt-2">
              {filter ? 'Try changing the filter' : 'Start connecting with mentors'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {mentorships.map((mentorship) => (
              <div key={mentorship._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
                        {currentUser.role === 'STUDENT' ? '👨‍🏫' : '🎓'}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">
                          {currentUser.role === 'STUDENT'
                            ? `${mentorship.mentorId?.userId?.firstName} ${mentorship.mentorId?.userId?.lastName}`
                            : `${mentorship.studentId?.userId?.firstName} ${mentorship.studentId?.userId?.lastName}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {currentUser.role === 'STUDENT'
                            ? mentorship.mentorId?.profession
                            : mentorship.studentId?.schoolName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            mentorship.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : mentorship.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : mentorship.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {mentorship.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Started:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(mentorship.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {mentorship.status === 'PENDING' && currentUser.role === 'MENTOR' && (
                      <button
                        onClick={() => handleAcceptRequest(mentorship._id)}
                        className="btn-primary text-sm"
                      >
                        Accept
                      </button>
                    )}

                    {mentorship.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => handleEndMentorship(mentorship._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          End
                        </button>
                        <button
                          onClick={() => handleOpenReviewModal(mentorship)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Review
                        </button>
                      </>
                    )}

                    {mentorship.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleOpenReviewModal(mentorship)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Add Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Submit Review</h2>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={reviewData.rating}
                      onChange={(e) =>
                        setReviewData({ ...reviewData, rating: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Good</option>
                      <option value="3">⭐⭐⭐ Average</option>
                      <option value="2">⭐⭐ Below Average</option>
                      <option value="1">⭐ Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData({ ...reviewData, comment: e.target.value })
                      }
                      className="input-field"
                      rows="4"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>

                  <button type="submit" className="w-full btn-primary">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyMentorships;
