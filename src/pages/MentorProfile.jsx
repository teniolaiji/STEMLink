import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mentorAPI } from '../services/api';

function MentorProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    profession: '',
    dateOfBirth: '',
    expertiseAreas: '',
    yearsOfExperience: '',
    educationBackground: '',
    availability: 'WEEKDAYS',
    stemFields: '',
    maxMentees: 5,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await mentorAPI.getMyProfile();
      setProfile(data);
      setHasProfile(true);
      
      if (data) {
        setFormData({
          bio: data.bio || '',
          profession: data.profession || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          expertiseAreas: data.expertiseAreas?.join(', ') || '',
          yearsOfExperience: data.yearsOfExperience || '',
          educationBackground: data.educationBackground || '',
          availability: data.availability || 'WEEKDAYS',
          stemFields: data.stemFields?.join(', ') || '',
          maxMentees: data.maxMentees || 5,
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No profile exists, show create form
        setHasProfile(false);
        setIsEditing(true);
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        bio: formData.bio,
        profession: formData.profession,
        dateOfBirth: formData.dateOfBirth,
        expertiseAreas: formData.expertiseAreas.split(',').map(s => s.trim()).filter(s => s),
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        educationBackground: formData.educationBackground,
        availability: formData.availability,
        stemFields: formData.stemFields.split(',').map(s => s.trim()).filter(s => s),
        maxMentees: parseInt(formData.maxMentees),
      };

      if (hasProfile) {
        await mentorAPI.updateProfile(payload);
        toast.success('Profile updated successfully!');
      } else {
        await mentorAPI.createProfile(payload);
        toast.success('Profile created successfully!');
        setHasProfile(true);
      }

      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to save profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentor Profile 👨‍🏫</h1>
            {!hasProfile && !isEditing && (
              <p className="text-gray-600 mt-1">Create your profile to start mentoring</p>
            )}
            {profile && profile.user && (
              <p className="text-gray-600 mt-1">
                {profile.user.firstName} {profile.user.lastName} • {profile.user.email}
              </p>
            )}
          </div>
          {profile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {hasProfile ? 'Edit Your Profile' : 'Create Your Profile'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Tell students about yourself..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession *
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Background *
                </label>
                <input
                  type="text"
                  value={formData.educationBackground}
                  onChange={(e) => setFormData({ ...formData, educationBackground: e.target.value })}
                  className="input-field"
                  placeholder="e.g., MSc Computer Science, MIT"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    className="input-field"
                    placeholder="5"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Mentees *
                  </label>
                  <input
                    type="number"
                    value={formData.maxMentees}
                    onChange={(e) => setFormData({ ...formData, maxMentees: e.target.value })}
                    className="input-field"
                    placeholder="5"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability *
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="input-field"
                >
                  <option value="WEEKDAYS">Weekdays</option>
                  <option value="WEEKENDS">Weekends</option>
                  <option value="EVENINGS">Evenings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise Areas (comma-separated) *
                </label>
                <input
                  type="text"
                  value={formData.expertiseAreas}
                  onChange={(e) => setFormData({ ...formData, expertiseAreas: e.target.value })}
                  className="input-field"
                  placeholder="Web Development, AI, Machine Learning"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  STEM Fields (comma-separated) *
                </label>
                <input
                  type="text"
                  value={formData.stemFields}
                  onChange={(e) => setFormData({ ...formData, stemFields: e.target.value })}
                  className="input-field"
                  placeholder="Computer Science, Mathematics"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple fields with commas</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Profile'}
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : profile ? (
          <div className="card">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
                <p className="text-gray-900">{profile.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Profession</p>
                  <p className="text-gray-900">{profile.profession}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
                  <p className="text-gray-900">{profile.yearsOfExperience} years</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Education</p>
                <p className="text-gray-900">{profile.educationBackground}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Availability</p>
                  <p className="text-gray-900">{profile.availability}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Max Mentees</p>
                  <p className="text-gray-900">{profile.maxMentees}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Expertise Areas</p>
                <div className="flex flex-wrap gap-2">
                  {profile.expertiseAreas?.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">STEM Fields</p>
                <div className="flex flex-wrap gap-2">
                  {profile.stemFields?.map((field, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profile Yet</h3>
            <p className="text-gray-600 mb-6">Create your mentor profile to start helping students</p>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Create Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorProfile;
