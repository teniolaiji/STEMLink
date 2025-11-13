import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mentorshipAPI } from '../services/api';

function RecommendedMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [sortBy, setSortBy] = useState('matchScore'); // 'matchScore' or 'name'
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendedMentors();
  }, []);

  const fetchRequestStatuses = async (mentorsList) => {
    try {
      const requests = await mentorshipAPI.getStudentRequests();
      // Create a map of mentorId -> status
      const statusMap = {};
      if (Array.isArray(requests)) {
        requests.forEach(request => {
          if (request.mentorId || request.mentor?.id) {
            statusMap[request.mentorId || request.mentor.id] = request.status || request.requestStatus;
          }
        });
      }
      // Update mentors with request status
      return mentorsList.map(mentor => ({
        ...mentor,
        requestStatus: statusMap[mentor.id] || null
      }));
    } catch (error) {
      // Silently fail - not critical, return original list
      console.error('Error fetching request statuses:', error);
      return mentorsList;
    }
  };

  const fetchRecommendedMentors = async () => {
    try {
      setLoading(true);
      const data = await mentorshipAPI.getRecommendedMentors();
      // Handle both array and object with data property
      let mentorsList = Array.isArray(data) ? data : (data?.mentors || data?.data || []);
      // Fetch request statuses and update mentors
      mentorsList = await fetchRequestStatuses(mentorsList);
      setMentors(mentorsList);
    } catch (error) {
      console.error('Error fetching recommended mentors:', error);
      // If recommended endpoint fails, try getting all mentors
      try {
        const data = await mentorshipAPI.getAllMentors();
        let mentorsList = Array.isArray(data) ? data : (data?.mentors || data?.data || []);
        // Fetch request statuses and update mentors
        mentorsList = await fetchRequestStatuses(mentorsList);
        setMentors(mentorsList);
      } catch (err) {
        toast.error('Failed to load mentors. Please try again later.');
        setMentors([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sort mentors by match score or name
  const sortedMentors = [...mentors].sort((a, b) => {
    if (sortBy === 'matchScore') {
      const scoreA = a.matchScore || a.matchingScore || 0;
      const scoreB = b.matchScore || b.matchingScore || 0;
      return scoreB - scoreA; // Descending order
    } else {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    }
  });

  const handleRequestMentorship = (mentor) => {
    setSelectedMentor(mentor);
    setRequestMessage('');
    setShowRequestModal(true);
  };

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSendingRequest(true);
    try {
      await mentorshipAPI.sendRequest(selectedMentor.id, requestMessage);
      toast.success('Mentorship request sent successfully!');
      setShowRequestModal(false);
      // Update mentor's request status
      setMentors(prevMentors =>
        prevMentors.map(mentor =>
          mentor.id === selectedMentor.id
            ? { ...mentor, requestStatus: 'PENDING' }
            : mentor
        )
      );
      setSelectedMentor(null);
      setRequestMessage('');
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
          <p className="mt-4 text-gray-600 font-medium">Loading recommended mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recommended Mentors</h1>
              <p className="text-gray-600 mt-2">
                Connect with experienced mentors who can guide you in your STEM journey
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-sm w-auto"
              >
                <option value="matchScore">Match Score</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {mentors.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No mentors found</h2>
            <p className="text-gray-600">
              There are no mentors available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMentors.map((mentor) => {
              const matchScore = mentor.matchScore || mentor.matchingScore || 0;
              const matchCriteria = mentor.matchCriteria || mentor.matchingCriteria || [];
              
              return (
              <div key={mentor.id} className="card hover:shadow-lg transition-shadow relative">
                {/* Match Score Badge */}
                {(matchScore > 0 || matchCriteria.length > 0) && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg">
                      {matchScore}%
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4 pr-20">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    {mentor.expertise && (
                      <p className="text-sm text-primary-600 font-medium mt-1">
                        {mentor.expertise}
                      </p>
                    )}
                  </div>
                  <div className="text-3xl">👨‍🏫</div>
                </div>

                {/* Match Criteria */}
                {matchCriteria.length > 0 && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs font-semibold text-green-800 mb-2">Why you matched:</p>
                    <ul className="space-y-1">
                      {matchCriteria.map((criteria, index) => (
                        <li key={index} className="text-xs text-green-700 flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {mentor.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {mentor.bio}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {mentor.yearsOfExperience && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Experience: </span>
                      <span className="ml-1">{mentor.yearsOfExperience} years</span>
                    </div>
                  )}
                  {mentor.company && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Company: </span>
                      <span className="ml-1">{mentor.company}</span>
                    </div>
                  )}
                  {mentor.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Location: </span>
                      <span className="ml-1">{mentor.location}</span>
                    </div>
                  )}
                  {mentor.availability && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Availability: </span>
                      <span className="ml-1 capitalize">
                        {mentor.availability.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  )}
                </div>

                {mentor.areasOfMentorship && mentor.areasOfMentorship.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.areasOfMentorship.slice(0, 3).map((area, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                      {mentor.areasOfMentorship.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{mentor.areasOfMentorship.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  {mentor.requestStatus === 'PENDING' ? (
                    <button
                      disabled
                      className="flex-1 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      Request Pending
                    </button>
                  ) : mentor.requestStatus === 'ACCEPTED' ? (
                    <button
                      disabled
                      className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      Request Accepted
                    </button>
                  ) : mentor.requestStatus === 'DECLINED' ? (
                    <button
                      onClick={() => handleRequestMentorship(mentor)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Request Again
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRequestMentorship(mentor)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Request Mentorship
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/mentor/${mentor.id}`)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    View Profile
                  </button>
                </div>

                {(mentor.linkedInUrl || mentor.githubUrl || mentor.websiteUrl) && (
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    {mentor.linkedInUrl && (
                      <a
                        href={mentor.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        LinkedIn
                      </a>
                    )}
                    {mentor.githubUrl && (
                      <a
                        href={mentor.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        GitHub
                      </a>
                    )}
                    {mentor.websiteUrl && (
                      <a
                        href={mentor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
            })}
          </div>
        )}

        {/* Request Modal */}
        {showRequestModal && selectedMentor && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">
                Request Mentorship from {selectedMentor.firstName} {selectedMentor.lastName}
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
                    setSelectedMentor(null);
                    setRequestMessage('');
                  }}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
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

export default RecommendedMentors;

