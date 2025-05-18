import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

export default function MainDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all courses
        const coursesResponse = await api.get('/courses');
        setCourses(coursesResponse.data);
        
        // If user is logged in, fetch their enrolled courses
        if (user) {
          try {
            // Fetch enrolled course IDs to determine which courses to show "Continue" vs "Enroll"
            const enrolledResponse = await api.get('/users/enrolled');
            // Extract just the course IDs from the enrolled courses
            const enrolledIds = enrolledResponse.data.map(course => course.id || course.course_id);
            setEnrolledCourseIds(enrolledIds);
          } catch (enrollError) {
            console.error('Error fetching enrolled courses:', enrollError);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);
  
  const handleEnrollSuccess = (courseId) => {
    // Add the new course ID to the enrolled courses list
    setEnrolledCourseIds(prev => [...prev, courseId]);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  
  // Filter out courses that the user is already enrolled in
  const availableCourses = courses.filter(course => !enrolledCourseIds.includes(course.id));
  
  if (availableCourses.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-2">No new courses available</h2>
          <p className="text-gray-600 mb-4">You've enrolled in all available courses!</p>
          <button 
            onClick={() => navigate('/enrolled')} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            View My Enrolled Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCourses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course}
            isEnrolled={false}
            onEnrollSuccess={handleEnrollSuccess}
          />
        ))}
      </div>
    </div>
  );
}