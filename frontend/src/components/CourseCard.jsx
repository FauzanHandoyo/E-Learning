import { Link } from 'react-router-dom';

const CourseCard = ({ course, progress }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
    >
      <div className="h-40 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <h3 className="absolute bottom-0 left-0 p-4 text-xl font-semibold text-white">
          {course.title}
        </h3>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
      
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Progress: {progress}%
        </p>
      </div>
      
      <Link
        to={`/courses/${course.id}`}
        className="block text-center bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
      >
        Continue Learning
      </Link>
    </motion.div>
  );
};

export default CourseCard;