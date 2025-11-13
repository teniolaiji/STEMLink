import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mentorshipAPI } from '../services/api';

const MentorshipRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentMentees, setCurrentMentees] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // "accept" or "decline"
  const [loading, setLoading] = useState(true);

  // Fetch pending requests and current mentees on mount
  useEffect(() => {
    fetchPendingRequests();
    fetchCurrentMentees();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const data = await mentorshipAPI.getPendingRequests();
      setPendingRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
      toast.error('Failed to load pending requests');
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentMentees = async () => {
    try {
      const data = await mentorshipAPI.getCurrentMentees();
      setCurrentMentees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching current mentees:', err);
      // Don't show error toast for this, as it's not critical
      setCurrentMentees([]);
    }
  };

  // Open confirmation modal
  const handleActionClick = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setShowModal(true);
  };

  // Confirm action
  const confirmAction = async () => {
    if (!selectedRequest) return;

    try {
      if (actionType === 'accept') {
        await mentorshipAPI.acceptRequest(selectedRequest.id);
        toast.success('Mentorship request accepted successfully!');
      } else {
        await mentorshipAPI.declineRequest(selectedRequest.id);
        toast.success('Mentorship request declined');
      }

      // Update UI
      setPendingRequests((prev) =>
        prev.filter((req) => req.id !== selectedRequest.id)
      );
      fetchCurrentMentees(); // Refresh mentees list

      setShowModal(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error processing request:', err);
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Pending Mentorship Requests
        </h1>

        {/* Pending Requests */}
        <div className="grid gap-4 mb-12">
          {pendingRequests.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-600">No pending requests</p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg text-gray-900">
                    {req.studentName || 
                     (req.student?.firstName && req.student?.lastName 
                       ? `${req.student.firstName} ${req.student.lastName}` 
                       : req.student?.firstName || req.student?.lastName || 'Unknown Student')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {req.studentEmail || req.student?.email || ''}
                  </p>
                  {req.message && (
                    <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded">
                      {req.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleActionClick(req, 'accept')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleActionClick(req, 'decline')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Confirmation Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">
                Confirm {actionType === 'accept' ? 'Acceptance' : 'Decline'}
              </h2>
              <p className="mb-4 text-gray-700">
                Are you sure you want to{' '}
                {actionType === 'accept' ? 'accept' : 'decline'} the request from{' '}
                <span className="font-semibold">
                  {selectedRequest.studentName || 
                   (selectedRequest.student?.firstName && selectedRequest.student?.lastName
                     ? `${selectedRequest.student.firstName} ${selectedRequest.student.lastName}`
                     : selectedRequest.student?.firstName || selectedRequest.student?.lastName || 'this student')}
                </span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-lg text-white ${
                    actionType === 'accept'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionType === 'accept' ? 'Accept' : 'Decline'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Mentees */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Current Mentees
          </h2>
          {currentMentees.length === 0 ? (
            <div className="card text-center py-8">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-gray-600">No mentees yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentMentees.map((mentee) => (
                <div
                  key={mentee.id}
                  className="card flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-900">
                      {mentee.name || 
                       (mentee.firstName && mentee.lastName
                         ? `${mentee.firstName} ${mentee.lastName}`
                         : mentee.firstName || mentee.lastName || 'Unknown')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mentee.email || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorshipRequests;

