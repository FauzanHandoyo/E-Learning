// src/components/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// src/components/CourseCard.jsx
const CourseCard = ({ course, progress }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
      <p className="text-gray-600 mb-2">{course.description}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Progress: {progress}%
      </p>
    </div>
  );
};

export default CourseCard;