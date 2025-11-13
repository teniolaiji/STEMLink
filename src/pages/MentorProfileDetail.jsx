import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mentorshipAPI } from '../services/api';

function MentorProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    fetchMentorProfile();
    checkRequestStatus();
  }, [id]);

  const fetchMentorProfile = async () => {
    try {
      setLoading(true);
      const data = await mentorshipAPI.getMentorById(id);
      setMentor(data);
    } catch (error) {
      console.error('Error fetching mentor profile:', error);
      toast.error('Failed to load mentor profile');
      navigate('/recommended-mentors');
    } finally {
      setLoading(false);
    }
  };

  const checkRequestStatus = async () => {
    try {
      setCheckingStatus(true);
      const data = await mentorshipAPI.getRequestStatus(id);
      setRequestStatus(data.status || data.requestStatus || null);
    } catch (error) {
      // If no request exists, that's okay
      if (error.response?.status !== 404) {
        console.error('Error checking request status:', error);
      }
      setRequestStatus(null);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleRequestMentorship = () => {
    setShowRequestModal(true);
    setRequestMessage('');
  };

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSendingRequest(true);
    try {
      await mentorshipAPI.sendRequest(id, requestMessage);
      toast.success('Mentorship request sent successfully!');
      setShowRequestModal(false);
      setRequestMessage('');
      setRequestStatus('PENDING');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary-600 hover:text-primary-700 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-5xl">
                👨‍🏫
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mentor.firstName} {mentor.lastName}
              </h1>
              {mentor.expertise && (
                <p className="text-xl text-primary-600 font-medium mb-4">
                  {mentor.expertise}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {mentor.company && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Company:</span>
                    <span>{mentor.company}</span>
                  </div>
                )}
                {mentor.location && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Location:</span>
                    <span>{mentor.location}</span>
                  </div>
                )}
                {mentor.yearsOfExperience && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Experience:</span>
                    <span>{mentor.yearsOfExperience} years</span>
                  </div>
                )}
                {mentor.availability && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Availability:</span>
                    <span className="capitalize">
                      {mentor.availability.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Request Status or Button */}
              {checkingStatus ? (
                <div className="text-sm text-gray-500">Checking request status...</div>
              ) : requestStatus === 'PENDING' ? (
                <button
                  disabled
                  className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                >
                  Request Pending
                </button>
              ) : requestStatus === 'ACCEPTED' ? (
                <button
                  disabled
                  className="bg-green-100 text-green-800 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                >
                  Request Accepted
                </button>
              ) : requestStatus === 'DECLINED' ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleRequestMentorship}
                    className="btn-primary"
                  >
                    Request Again
                  </button>
                  <span className="text-sm text-red-600 self-center">
                    Previous request was declined
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleRequestMentorship}
                  className="btn-primary"
                >
                  Request Mentorship
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {mentor.bio && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
          </div>
        )}

        {/* Areas of Mentorship */}
        {mentor.areasOfMentorship && mentor.areasOfMentorship.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Areas of Mentorship</h2>
            <div className="flex flex-wrap gap-2">
              {mentor.areasOfMentorship.map((area, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {mentor.education && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
            <p className="text-gray-700">{mentor.education}</p>
          </div>
        )}

        {/* Social Links */}
        {(mentor.linkedInUrl || mentor.githubUrl || mentor.websiteUrl) && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect</h2>
            <div className="flex flex-wrap gap-4">
              {mentor.linkedInUrl && (
                <a
                  href={mentor.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
              )}
              {mentor.githubUrl && (
                <a
                  href={mentor.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              )}
              {mentor.websiteUrl && (
                <a
                  href={mentor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  <span>Website</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">
                Request Mentorship from {mentor.firstName} {mentor.lastName}
              </h2>
              <div className="mb-4">
                <label htmlFor="requestMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="requestMessage"
                  rows={4}
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="input-field"
                  placeholder="Tell the mentor why you'd like to connect and what you hope to learn..."
                  disabled={sendingRequest}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestMessage('');
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={sendingRequest}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={sendingRequest || !requestMessage.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingRequest ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorProfileDetail;


