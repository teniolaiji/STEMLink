import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mentorshipAPI, reviewAPI } from '../services/api';

function MyMentorships() {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
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
    setLoading(true);
    try {
      const data = await mentorshipAPI.getMyMentorships(filter, 0, 20);
      console.log('Mentorships response:', data);
      
      // Handle different possible response structures
      const mentorshipsData = data.relationships || data.mentorships || data || [];
      setMentorships(Array.isArray(mentorshipsData) ? mentorshipsData : []);
    } catch (error) {
      console.error('Mentorships error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to load mentorships';
      toast.error(errorMessage);
      setMentorships([]); // Set empty array on error
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
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to accept request';
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
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to end mentorship';
      toast.error(errorMessage);
    }
  };

  const handleOpenReviewModal = (mentorship) => {
    setSelectedMentorship(mentorship);
    setShowReviewModal(true);
  };

  const handleOpenDetailsModal = (person) => {
    setSelectedPerson(person);
    setShowDetailsModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const revieweeId = currentUser.role === 'STUDENT' 
        ? selectedMentorship.mentor._id 
        : selectedMentorship.student._id;

      await reviewAPI.addReview({
        revieweeId,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment,
      });

      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to submit review';
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
        {/* <div className="mb-6">
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
            <button
              onClick={() => setFilter('CANCELLED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'CANCELLED'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div> */}

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
            {mentorships.map((mentorship) => {
              const person = currentUser.role === 'STUDENT' ? mentorship.mentor : mentorship.student;
              
              return (
                <div key={mentorship._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
                          {currentUser.role === 'STUDENT' ? '👨‍🏫' : '🎓'}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900">
                            {person?.firstName} {person?.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{person?.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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
                            {new Date(mentorship.startDate || mentorship.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenDetailsModal(person)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        📋 View Details
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 ml-4">
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
              );
            })}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedPerson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {currentUser.role === 'STUDENT' ? 'Mentor Details' : 'Student Details'}
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-4xl">
                      {currentUser.role === 'STUDENT' ? '👨‍🏫' : '🎓'}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedPerson.firstName} {selectedPerson.lastName}
                      </h3>
                      <p className="text-gray-600">{selectedPerson.role}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="text-gray-900">{selectedPerson.email}</p>
                      </div>
                      {selectedPerson.phoneNumber && (
                        <div>
                          <span className="text-sm text-gray-500">Phone:</span>
                          <p className="text-gray-900">{selectedPerson.phoneNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Account Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Preferred Language:</span>
                        <p className="text-gray-900">{selectedPerson.preferredLanguage}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Member Since:</span>
                        <p className="text-gray-900">
                          {new Date(selectedPerson.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Account Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedPerson.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedPerson.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
