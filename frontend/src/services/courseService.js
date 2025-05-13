import api from './api';

export const courseService = {
  createCourse: (courseData) => api.post('/courses', courseData),
  getCourses: () => api.get('/courses'),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`)
};


// Atau jika ingin menggunakan named exports
export const createCourse = (courseData) => api.post('/courses', courseData);
export const getCourses = () => api.get('/courses');