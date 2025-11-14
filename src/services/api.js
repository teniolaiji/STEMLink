import axios from 'axios';

// Base API URL
const API_BASE_URL = 'https://stemlink-backend.onrender.com/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // User Registration
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // User Login
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    const data = response.data;
    
    // Store token from jwt_token field
    if (data.jwt_token) {
      localStorage.setItem('token', data.jwt_token);
    }
    
    if (data.user) {
      const user = {
        id: data.user._id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber,
        role: data.user.role,
        createdAt: data.user.createdAt,
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return data;
  },

  // Email Verification
  verifyEmail: async (verificationCode) => {
    const response = await apiClient.post('/auth/user-email-verification/verify', {
      verificationCode,
    });
    return response.data;
  },

  // Get Account Information (Protected)
  getAccount: async () => {
    const response = await apiClient.get('/auth/account');
    const data = response.data;
    
    const userData = data.user || data;
    
    if (userData._id) {
      return {
        id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        emailVerified: userData.isRegisterComplete,
        createdAt: userData.createdAt,
      };
    }
    
    return userData;
  },
};

// Mentor Profile API calls
export const mentorAPI = {
  // Create mentor profile
  createProfile: async (profileData) => {
    const response = await apiClient.post('/mentors/profile', profileData);
    return response.data;
  },

  // Get own mentor profile
  getMyProfile: async () => {
    const response = await apiClient.get('/mentors/profile');
    const data = response.data;
    
    return data.profile || data;
  },

  // Update mentor profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/mentors/profile', profileData);
    return response.data;
  },

  // Get all mentors (paginated)
  getAllMentors: async (skip = 0, limit = 10) => {
    const response = await apiClient.get('/mentors/get-all', {
      params: { skip, limit },
    });
    return response.data;
  },

  // Get mentor by ID
  getMentorById: async (id) => {
    const response = await apiClient.get(`/mentors/${id}`);
    return response.data;
  },
};

// Student Profile API calls
export const studentAPI = {
  // Create student profile
  createProfile: async (profileData) => {
    const response = await apiClient.post('/students/profile', profileData);
    return response.data;
  },

  // Get own student profile
  getMyProfile: async () => {
    const response = await apiClient.get('/students/profile');
    const data = response.data;
    
    // Return the nested profile object
    return data.profile || data;
  },

  // Update student profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/students/profile', profileData);
    return response.data;
  },

  // Get all students (Admin only)
  getAllStudents: async (skip = 0, limit = 10) => {
    const response = await apiClient.get('/students/get-all', {
      params: { skip, limit },
    });
    return response.data;
  },
};

// Mentorship Relationship API calls
export const mentorshipAPI = {
  // Send mentorship request (Student to Mentor)
  sendRequest: async (mentorId) => {
    const response = await apiClient.post('/mentorships/send-request', {
      mentorId,
    });
    return response.data;
  },

  // Accept mentorship request (Mentor)
  acceptRequest: async (mentorshipId) => {
    const response = await apiClient.post('/mentorships/accept-mentorship-request', {
      mentorshipId,
    });
    return response.data;
  },

  // End mentorship
  endMentorship: async (id) => {
    const response = await apiClient.post(`/mentorships/${id}/end`);
    return response.data;
  },

  // Get my mentorships
  getMyMentorships: async (status = '', skip = 0, limit = 10) => {
    const response = await apiClient.get('/mentorships/my-mentorships', {
      params: { status, skip, limit },
    });
    return response.data;
  },
};

// Review System API calls
export const reviewAPI = {
  // Add a new review
  addReview: async (reviewData) => {
    const response = await apiClient.post('/reviews/addd-new', reviewData);
    return response.data;
  },

  // Get reviews for a user
  getUserReviews: async (userId) => {
    const response = await apiClient.get(`/reviews/user/${userId}`);
    return response.data;
  },

  // Get reviews added by me
  getMyReviews: async () => {
    const response = await apiClient.get('/reviews/added-by-me');
    return response.data;
  },
};

export default apiClient;
