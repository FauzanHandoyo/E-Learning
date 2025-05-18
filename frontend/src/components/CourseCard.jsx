import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseCard = ({ course, progress = 0, isEnrolled = false, onEnrollSuccess }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const { user } = useAuth();

  const handleEnrollClick = async (e) => {
    e.preventDefault();
    
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    try {
      setIsEnrolling(true);
      setEnrollError('');
      
      await api.post('/enrollments', {
        user_id: user.id,
        course_id: course.id
      });
      
      // Call the callback if provided
      if (onEnrollSuccess) {
        onEnrollSuccess(course.id);
      }
      
      // Redirect to the enrolled courses page
      window.location.href = '/enrolled';
    } catch (error) {
      console.error('Enrollment error:', error);
      setEnrollError('Failed to enroll. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Get instructor name from the course data provided by the backend
  const instructorName = course.instructor_name;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
    >
      <div className="h-40 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <h3 className="absolute bottom-0 left-0 p-4 text-xl font-semibold text-white">
          {course.title || course.course_title}
        </h3>
      </div>
      
      <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
      
      {/* Show instructor name if available */}
      {instructorName && (
        <p className="text-sm text-gray-500 mb-4">
          By: {instructorName}
        </p>
      )}
      
      {isEnrolled ? (
        // Show progress for enrolled courses
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progress || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Progress: {progress || 0}%
          </p>
          
          <Link
            to={`/courses/${course.id || course.course_id}`}
            className="block text-center bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Continue Learning
          </Link>
        </div>
      ) : (
        <div className="mt-auto">
          {enrollError && <p className="text-red-500 text-sm mb-2">{enrollError}</p>}
          
          <button
            onClick={handleEnrollClick}
            disabled={isEnrolling}
            className="w-full text-center bg-green-100 text-green-600 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
          >
            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CourseCard;