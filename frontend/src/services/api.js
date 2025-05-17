import axios from 'axios';

// Use environment variable for the base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Fallback to localhost for development
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (userData) => api.post('/users/login', userData),
  logout: () => api.post('/users/logout'),
  getCurrentUser: () => api.get('/users/me'),
};

// Course API calls
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

export const fetchEnrolledCourses = async () => {
  try {
    // Use the configured api instance instead of axios directly
    const response = await api.get('/users/enrolled');
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    throw error;
  }
};

export default api;