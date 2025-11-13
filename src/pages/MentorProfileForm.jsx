import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mentorshipAPI } from '../services/api';

function MentorProfileForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: '',
    expertise: '',
    yearsOfExperience: '',
    education: '',
    company: '',
    location: '',
    availability: 'PART_TIME',
    areasOfMentorship: [],
    otherArea: '',
    linkedInUrl: '',
    githubUrl: '',
    websiteUrl: '',
  });

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

  useEffect(() => {
    fetchMentorProfile();
  }, []);

  useEffect(() => {
    setShowOtherInput(formData.areasOfMentorship.includes('Other'));
  }, [formData.areasOfMentorship]);

  const fetchMentorProfile = async () => {
    try {
      const profile = await mentorshipAPI.getMentorProfile();
      if (profile) {
        setFormData({
          bio: profile.bio || '',
          expertise: profile.expertise || '',
          yearsOfExperience: profile.yearsOfExperience || '',
          education: profile.education || '',
          company: profile.company || '',
          location: profile.location || '',
          availability: profile.availability || 'PART_TIME',
          areasOfMentorship: profile.areasOfMentorship || [],
          otherArea: profile.otherArea || '',
          linkedInUrl: profile.linkedInUrl || '',
          githubUrl: profile.githubUrl || '',
          websiteUrl: profile.websiteUrl || '',
        });
      }
    } catch (error) {
      
      if (error.response?.status !== 404) {
        console.error('Error fetching mentor profile:', error);
      }
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAreaToggle = (area) => {
    const newAreas = formData.areasOfMentorship.includes(area)
      ? formData.areasOfMentorship.filter((a) => a !== area)
      : [...formData.areasOfMentorship, area];

    setFormData({
      ...formData,
      areasOfMentorship: newAreas,
    });

    // Update showOtherInput state
    setShowOtherInput(newAreas.includes('Other'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await mentorshipAPI.createOrUpdateProfile(formData);
      toast.success('Profile saved successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Profile</h1>
          <p className="text-gray-600 mt-2">
            Create or update your mentor profile to help students find you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio *
            </label>
            <textarea
              id="bio"
              name="bio"
              required
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="input-field"
              placeholder="Tell us about yourself, your background, and what motivates you as a mentor..."
              disabled={loading}
            />
          </div>

          {/* Expertise and Years of Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                Expertise *
              </label>
              <input
                id="expertise"
                name="expertise"
                type="text"
                required
                value={formData.expertise}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Full Stack Developer, Data Scientist"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                required
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="input-field"
                placeholder="5"
                disabled={loading}
              />
            </div>
          </div>

          {/* Education and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Education
              </label>
              <input
                id="education"
                name="education"
                type="text"
                value={formData.education}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., B.S. in Computer Science, University of..."
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Current Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="input-field"
                placeholder="Company name"
                disabled={loading}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="City, Country"
              disabled={loading}
            />
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
              Availability *
            </label>
            <select
              id="availability"
              name="availability"
              required
              value={formData.availability}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="PART_TIME">Part Time</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="ON_DEMAND">On Demand</option>
            </select>
          </div>

          {/* Areas of Mentorship */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas of Mentorship *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mentorshipAreas.map((area) => (
                <label
                  key={area}
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.areasOfMentorship.includes(area)
                      ? 'bg-primary-50 border-primary-500'
                      : 'bg-white border-gray-300 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.areasOfMentorship.includes(area)}
                    onChange={() => handleAreaToggle(area)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>

            {/* Other Area Input */}
            {showOtherInput && (
              <div className="mt-4">
                <label htmlFor="otherArea" className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify the exact field *
                </label>
                <input
                  id="otherArea"
                  name="otherArea"
                  type="text"
                  required={showOtherInput}
                  value={formData.otherArea}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Robotics, Quantum Computing, Environmental Science..."
                  disabled={loading}
                />
              </div>
            )}

            {formData.areasOfMentorship.length === 0 && (
              <p className="mt-2 text-sm text-red-600">Please select at least one area of mentorship</p>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Social Links (Optional)</h3>
            
            <div>
              <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                id="linkedInUrl"
                name="linkedInUrl"
                type="url"
                value={formData.linkedInUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://linkedin.com/in/yourprofile"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL
              </label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://github.com/yourusername"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://yourwebsite.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.areasOfMentorship.length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MentorProfileForm;


