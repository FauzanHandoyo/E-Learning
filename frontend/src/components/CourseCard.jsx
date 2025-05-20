import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const CourseCard = ({ course, isEnrolled = false, onEnrollSuccess, progress = 0 }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  
  // Extract data regardless of whether it's coming from courses or enrollments
  const courseId = course.id || course.course_id;
  const courseTitle = course.title || course.course_title;
  const courseDescription = course.description || course.course_description;
  const courseImage = course.image_url;
  const categoryName = course.category_name;
  const instructorName = course.instructor_name || "Instructor";

  const handleEnrollClick = async () => {
    try {
      setIsEnrolling(true);
      setEnrollError('');
      
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
        {courseImage ? (
          <img 
            src={courseImage} 
            alt={courseTitle} 
            className="w-full h-full object-cover"
          />
        ) : (
          // Default gradient background if no image
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <h3 className="absolute bottom-0 left-0 p-4 text-xl font-semibold text-white">
          {courseTitle}
        </h3>
        {/* Keep the small badge but we'll add another category display below */}
        {categoryName && (
          <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {categoryName}
          </span>
        )}
      </div>
      
      <div className="p-4">
        {/* Add category with icon here for more visibility */}
        {categoryName && (
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-blue-600 font-medium">{categoryName}</span>
          </div>
        )}
        
        <p className="text-gray-600 mb-2 line-clamp-2">{courseDescription}</p>
        
        {instructorName && (
          <p className="text-sm text-gray-500 mb-4">
            By: {instructorName}
          </p>
        )}
        
        {isEnrolled ? (
          // For enrolled courses, just show the Continue Learning button
          <Link
            to={`/courses/${courseId}`}
            className="block text-center bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors mt-2"
          >
            Continue Learning
          </Link>
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