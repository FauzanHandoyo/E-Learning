// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to E-Learning Platform</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Student</h2>
            <p className="mb-4">Start learning today with our curated courses</p>
            <Link 
              to="/login" 
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Login as Student
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Instructor</h2>
            <p className="mb-4">Share your knowledge with the world</p>
            <Link
              to="/login" 
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Login as Instructor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
}