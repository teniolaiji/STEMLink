import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { journeyTrackerAPI } from '../services/api';

function JourneyTracker({ studentId = null }) {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);

  useEffect(() => {
    fetchJourneyData();
  }, [studentId]);

  const fetchJourneyData = async () => {
    try {
      setLoading(true);
      const data = await journeyTrackerAPI.getJourney(studentId);
      setJourney(data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Journey doesn't exist yet
        setJourney(null);
      } else {
        console.error('Failed to fetch journey:', error);
        toast.error('Failed to load journey tracker');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJourney = async () => {
    try {
      const data = await journeyTrackerAPI.createJourney();
      setJourney(data);
      toast.success('Journey tracker created!');
    } catch (error) {
      console.error('Failed to create journey:', error);
      toast.error(error.response?.data?.message || 'Failed to create journey tracker');
    }
  };

  const handleToggleGoal = async (goalId, currentStatus) => {
    try {
      const updated = await journeyTrackerAPI.updateGoal(goalId, {
        completed: !currentStatus
      });
      setJourney(updated);
      toast.success(currentStatus ? 'Goal marked incomplete' : 'Goal completed! 🎉');
    } catch (error) {
      console.error('Failed to update goal:', error);
      toast.error('Failed to update goal');
    }
  };

  if (loading) {
    return (
      <div className="card bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="card bg-white border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🌟 STEM Journey Tracker</h2>
        <p className="text-gray-600 mb-6">
          Track your progress, set goals, and celebrate your achievements in STEM!
        </p>
        <button
          onClick={handleCreateJourney}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Start Your Journey 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🌟 Your STEM Journey Tracker</h2>
          <span className="text-sm text-gray-500">
            Started {new Date(journey.startDate).toLocaleDateString()}
          </span>
        </div>

        {/* Skills Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">📚 Skills Progress</h3>
            <button
              onClick={() => setShowSkillModal(true)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              + Add Skill
            </button>
          </div>
          
          {journey.skills && journey.skills.length > 0 ? (
            <div className="space-y-4">
              {journey.skills.map((skill, index) => (
                <SkillProgressBar
                  key={index}
                  skill={skill}
                  onUpdate={fetchJourneyData}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No skills added yet</p>
          )}
        </div>

        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🎯 Mentorship Goals</h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              + Add Goal
            </button>
          </div>
          
          {journey.goals && journey.goals.length > 0 ? (
            <ul className="space-y-2">
              {journey.goals.map((goal) => (
                <li
                  key={goal._id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <button
                    onClick={() => handleToggleGoal(goal._id, goal.completed)}
                    className="mt-0.5 text-xl"
                  >
                    {goal.completed ? '✅' : '⬜'}
                  </button>
                  <div className="flex-1">
                    <p className={`${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {goal.name}
                    </p>
                    {goal.description && (
                      <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                    )}
                    {goal.targetDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">No goals set yet</p>
          )}
        </div>

        {/* Milestones Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Milestones</h3>
          {journey.milestones && journey.milestones.length > 0 ? (
            <div className="space-y-3">
              {journey.milestones.map((milestone, index) => (
                <div key={index} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="font-medium text-gray-800">{milestone.title}</p>
                  {milestone.description && (
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(milestone.achievedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No milestones achieved yet</p>
          )}
        </div>

        {/* Outcomes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">💡 Outcomes & Learnings</h3>
            <button
              onClick={() => setShowOutcomeModal(true)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              + Add Outcome
            </button>
          </div>
          
          {journey.outcomes && journey.outcomes.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {journey.outcomes.map((outcome, idx) => (
                <li key={idx}>{outcome}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">No outcomes recorded yet</p>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSkillModal && (
        <AddSkillModal
          onClose={() => setShowSkillModal(false)}
          onSuccess={fetchJourneyData}
        />
      )}
      
      {showGoalModal && (
        <AddGoalModal
          onClose={() => setShowGoalModal(false)}
          onSuccess={fetchJourneyData}
        />
      )}
      
      {showOutcomeModal && (
        <AddOutcomeModal
          onClose={() => setShowOutcomeModal(false)}
          onSuccess={fetchJourneyData}
        />
      )}
    </div>
  );
}

// Skill Progress Bar Component
function SkillProgressBar({ skill, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(skill.progress);

  const handleUpdate = async () => {
    try {
      await journeyTrackerAPI.updateSkill({
        name: skill.name,
        progress: progress,
        category: skill.category
      });
      setIsEditing(false);
      onUpdate();
      toast.success('Skill updated!');
    } catch (error) {
      toast.error('Failed to update skill');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-700">{skill.name}</span>
          {skill.category && (
            <span className="ml-2 text-xs text-gray-500">({skill.category})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-purple-600">{progress}%</span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {isEditing ? '✕' : '✏️'}
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            className="flex-1"
          />
          <button
            onClick={handleUpdate}
            className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
            style={{ width: `${skill.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Add Skill Modal
function AddSkillModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    progress: 0,
    category: 'Technical'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await journeyTrackerAPI.updateSkill(formData);
      toast.success('Skill added!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add skill');
    }
  };

  return (
    <Modal onClose={onClose} title="Add New Skill">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Technical">Technical</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Subject Knowledge">Subject Knowledge</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Progress: {formData.progress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Add Skill
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Add Goal Modal
function AddGoalModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await journeyTrackerAPI.addGoal(formData);
      toast.success('Goal added!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to add goal');
    }
  };

  return (
    <Modal onClose={onClose} title="Add New Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Complete Python course"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Date
          </label>
          <input
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Add Goal
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Add Outcome Modal
function AddOutcomeModal({ onClose, onSuccess }) {
  const [outcome, setOutcome] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await journeyTrackerAPI.addOutcome(outcome);
      toast.success('Outcome added!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to add outcome');
    }
  };

  return (
    <Modal onClose={onClose} title="Add Outcome">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Outcome *
          </label>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows="3"
            placeholder="What have you learned or achieved?"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Add Outcome
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Modal Component
function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default JourneyTracker;