import { useState, useEffect } from 'react';
import api from '../services/api';
import { createCourse } from '../services/courseService'; // Pastikan ini sesuai dengan struktur folder Anda


export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 
  // Menggunakan useEffect untuk memuat kursus saat komponen dimuat:
useEffect(() => {
    const loadCourses = async () => {
      try {
        // Gunakan API yang sudah direstrukturisasi
        const response = await api.courses.getInstructorCourses();
        setCourses(response.data); // Tambahkan .data
      } catch (err) {
        setError(err.message || 'Failed to load courses'); // Handle error lebih baik
      }
    };
    loadCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCourse = await createCourse(formData);
      setCourses([...courses, newCourse]);
      setFormData({ title: '', description: '', price: 0 });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Course</h2>
        <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded-lg shadow-md">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Course Title"
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-4">
            <textarea
              placeholder="Course Description"
              className="w-full p-2 border rounded"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
            />
          </div>
          
          <div className="mb-4">
            <input
              type="number"
              placeholder="Price"
              className="w-full p-2 border rounded"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="text-gray-500">No courses created yet</div>
          ) : (
            courses.map(course => (
              <div key={course.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-2">{course.description}</p>
                <p className="font-bold">${course.price.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}