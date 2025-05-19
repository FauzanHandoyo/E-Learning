import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoading(true);
        // Use the correct API endpoint - changed from /users/${user.id}/instructor-courses to /courses/instructor
        const response = await api.get('/courses/instructor');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error f etching instructor courses:', err);
        setError('Failed to load your courses. Please try again.');
        setLoading(false);
      }
    };

    if (user && user.role === 'instructor') {
      fetchInstructorCourses();
    }
  }, [user]);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 font-semibold mb-2">Error</div>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link 
          to="/instructor/create-course" 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Create New Course
        </Link>
      </div>
      
      {courses.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Courses Created Yet</h2>
          <p className="text-gray-600 mb-6">Start sharing your knowledge by creating your first course.</p>
          <Link 
            to="/instructor/create-course"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 inline-block"
          >
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <motion.div 
              key={course.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-40 bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <h3 className="absolute bottom-0 left-0 text-white font-semibold text-xl p-4">
                  {course.title}
                </h3>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {course.students_count || 0} student{course.students_count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    ${course.price || 0}
                  </span>
                </div>
                
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {course.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/instructor/courses/${course.id}/edit`}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit Course
                  </Link>
                  
                  <Link 
                    to={`/instructor/courses/${course.id}/content`}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Manage Content
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}