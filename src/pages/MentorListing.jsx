import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mentorshipAPI } from '../services/api';

function MentorListing() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMentors, setTotalMentors] = useState(0);
  const mentorsPerPage = 12;

  const navigate = useNavigate();

  const mentorshipAreas = [
    'Artificial Intelligence',
    'Civil Engineering',
    'Cloud Computing',
    'Cybersecurity',
    'Data Science',
    'DevOps',
    'Machine Learning',
    'Mechanical Engineering',
    'Mobile Development',
    'Other',
    'Product Management',
    'Software Engineering',
    'Web Development'
  ];

  const availabilityOptions = [
    { value: '', label: 'All' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'ON_DEMAND', label: 'On Demand' },
  ];

  useEffect(() => {
    fetchMentors();
  }, [currentPage, searchQuery, selectedArea, selectedAvailability]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: mentorsPerPage,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedArea && { area: selectedArea }),
        ...(selectedAvailability && { availability: selectedAvailability }),
      };

      const data = await mentorshipAPI.getAllMentors(params);
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setMentors(data);
        setTotalPages(1);
        setTotalMentors(data.length);
      } else {
        setMentors(data.mentors || data.data || []);
        setTotalPages(data.totalPages || data.total_pages || 1);
        setTotalMentors(data.total || data.total_count || data.mentors?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to load mentors. Please try again later.');
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMentors();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchMentors();
  };

  const handleViewProfile = (mentorId) => {
    navigate(`/mentor/${mentorId}`);
  };

  if (loading && mentors.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Browse Mentors</h1>
          <p className="text-gray-600 mt-2">
            Explore our network of experienced mentors
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Mentors
              </label>
              <div className="flex gap-2">
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Search by name, expertise, company..."
                />
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Area of Mentorship
                </label>
                <select
                  id="area"
                  value={selectedArea}
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    handleFilterChange();
                  }}
                  className="input-field"
                >
                  <option value="">All Areas</option>
                  {mentorshipAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  value={selectedAvailability}
                  onChange={(e) => {
                    setSelectedAvailability(e.target.value);
                    handleFilterChange();
                  }}
                  className="input-field"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedArea || selectedAvailability) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    Search: {searchQuery}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        handleFilterChange();
                      }}
                      className="ml-2 hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedArea && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    Area: {selectedArea}
                    <button
                      onClick={() => {
                        setSelectedArea('');
                        handleFilterChange();
                      }}
                      className="ml-2 hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedAvailability && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    Availability: {availabilityOptions.find(o => o.value === selectedAvailability)?.label}
                    <button
                      onClick={() => {
                        setSelectedAvailability('');
                        handleFilterChange();
                      }}
                      className="ml-2 hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedArea('');
                    setSelectedAvailability('');
                    handleFilterChange();
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {mentors.length} of {totalMentors} mentors
        </div>

        {/* Mentors Grid */}
        {mentors.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No mentors found</h2>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more mentors.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
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

                  <div className="pt-4 border-t">
                    <button
                      onClick={() => handleViewProfile(mentor.id)}
                      className="w-full btn-primary text-sm"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MentorListing;


