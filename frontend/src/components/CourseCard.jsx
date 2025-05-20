import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const CourseCard = ({ course, isEnrolled = false, onEnrollSuccess, progress = 0 }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  
  const instructorName = course.instructor_name || "Instructor";

  const handleEnrollClick = async () => {
    try {
      setIsEnrolling(true);
      setEnrollError('');
      
      const courseId = course.id || course.course_id;
      await api.post('/enrollments', { course_id: courseId });
      
      if (onEnrollSuccess) {
        onEnrollSuccess(courseId);
      }
      
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setEnrollError('Failed to enroll. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="h-40 bg-gray-200 relative">
        {course.image_url ? (
          <img 
            src={course.image_url} 
            alt={course.title || course.course_title} 
            className="w-full h-full object-cover"
          />
        ) : (
          // Default gradient background if no image
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <h3 className="absolute bottom-0 left-0 p-4 text-xl font-semibold text-white">
          {course.title || course.course_title}
        </h3>
        {course.category_name && (
          <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {course.category_name}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
        
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
      </div>
    </motion.div>
  );
};

export default CourseCard;