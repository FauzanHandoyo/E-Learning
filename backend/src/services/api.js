import axios from 'axios';

// Debugging: Tampilkan environment variables untuk verifikasi
console.log('Environment Variables:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});
// Validasi environment variable
const baseURL = process.env.REACT_APP_API_URL;

if (!baseURL) {
  throw new Error('REACT_APP_API_URL environment variable is not defined');
}



// Buat instance axios
const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Menambahkan token ke header setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Menangani error respon, termasuk refresh token saat 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cek apakah error 401 dan belum di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        // Minta token baru
        const response = await apiClient.post('/api/auth/refresh', { refreshToken });

        // Simpan token baru ke localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // Ulangi request awal
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Jika refresh token gagal, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor: Menyederhanakan pesan error sebelum dilempar ke komponen
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

// API Services Terstruktur
export default {
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    register: (userData) => apiClient.post('/api/auth/register', userData),
    refreshToken: (refreshToken) => apiClient.post('/api/auth/refresh', { refreshToken }),
  },
  courses: {
    getCourses: () => apiClient.get('/api/courses'),
    getCourseById: (id) => apiClient.get(`/api/courses/${id}`),
    createCourse: (courseData) => apiClient.post('/api/courses', courseData),
    getEnrolledCourses: () => apiClient.get('/api/courses/enrolled'),
    getInstructorCourses: () => apiClient.get('/api/courses/instructor'),
    updateCourse: (id, courseData) => apiClient.put(`/api/courses/${id}`, courseData),
  },
  enrollments: {
    enrollCourse: (courseId) => apiClient.post('/api/enrollments', { courseId }),
    getEnrollmentProgress: (enrollmentId) => apiClient.get(`/api/enrollments/${enrollmentId}`),
    updateProgress: (enrollmentId, progress) =>
      apiClient.patch(`/api/enrollments/${enrollmentId}`, { progress }),
  },
};