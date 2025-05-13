import { useEffect, useState } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Gunakan API yang sudah direstrukturisasi
        const response = await api.courses.getEnrolledCourses();
        setCourses(response.data); // Akses response.data
        
      } catch (err) {
        // Handle error lebih spesifik
        setError(err.response?.data?.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="text-gray-500">No courses enrolled yet</div>
        ) : (
          courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course}
              progress={course.progress}
            />
          ))
        )}
      </div>
    </div>
  );
}