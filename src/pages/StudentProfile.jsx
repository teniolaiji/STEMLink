import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { studentAPI } from '../services/api';

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    dateOfBirth: '',
    province: '',
    district: '',
    educationLevel: 'HIGH_SCHOOL',
    schoolName: '',
    communityType: 'URBAN',
    stemInterests: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await studentAPI.getMyProfile();
      setProfile(data);
      setHasProfile(true);
      if (data) {
        setFormData({
          bio: data.bio || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          province: data.address?.province || '',
          district: data.address?.district || '',
          educationLevel: data.educationLevel || 'HIGH_SCHOOL',
          schoolName: data.schoolName || '',
          communityType: data.communityType || 'URBAN',
          stemInterests: data.stemInterests?.join(', ') || '',
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
        dateOfBirth: formData.dateOfBirth,
        address: {
          province: formData.province,
          district: formData.district,
        },
        educationLevel: formData.educationLevel,
        schoolName: formData.schoolName,
        communityType: formData.communityType,
        stemInterests: formData.stemInterests.split(',').map(s => s.trim()).filter(s => s),
      };

      if (hasProfile) {
        await studentAPI.updateProfile(payload);
        toast.success('Profile updated successfully!');
      } else {
        await studentAPI.createProfile(payload);
        toast.success('Profile created successfully!');
        setHasProfile(true);
      }

      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save profile';
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
            <h1 className="text-3xl font-bold text-gray-900">Student Profile 🎓</h1>
            {!hasProfile && !isEditing && (
              <p className="text-gray-600 mt-1">Create your profile to get started</p>
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
                  placeholder="Tell us about yourself..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education Level *
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="input-field"
                  >
                    <option value="PRIMARY">Primary</option>
                    <option value="HIGH_SCHOOL">High School</option>
                    <option value="BACHELORS">Bachelors</option>
                    <option value="MASTERS">Masters</option>
                    <option value="PHD">PhD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name *
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="input-field"
                  placeholder="Your school name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Province *
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Kigali"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Gasabo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Type *
                </label>
                <select
                  value={formData.communityType}
                  onChange={(e) => setFormData({ ...formData, communityType: e.target.value })}
                  className="input-field"
                >
                  <option value="URBAN">Urban</option>
                  <option value="RURAL">Rural</option>
                  <option value="SUBURBAN">Suburban</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  STEM Interests (comma-separated) *
                </label>
                <input
                  type="text"
                  value={formData.stemInterests}
                  onChange={(e) => setFormData({ ...formData, stemInterests: e.target.value })}
                  className="input-field"
                  placeholder="Robotics, Physics, Mathematics"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple interests with commas</p>
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
                  <p className="text-sm font-medium text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-gray-900">
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Education Level</p>
                  <p className="text-gray-900">{profile.educationLevel}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">School</p>
                <p className="text-gray-900">{profile.schoolName}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                  <p className="text-gray-900">
                    {profile.address?.district}, {profile.address?.province}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Community Type</p>
                  <p className="text-gray-900">{profile.communityType}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">STEM Interests</p>
                <div className="flex flex-wrap gap-2">
                  {profile.stemInterests?.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profile Yet</h3>
            <p className="text-gray-600 mb-6">Create your profile to get started with STEMLink</p>
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

export default StudentProfile;
