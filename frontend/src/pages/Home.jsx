import { Link } from 'react-router-dom';
import { BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6 animate-fadeIn">
          Welcome to <span className="text-blue-600">E-Learning</span> Platform
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fadeIn delay-100">
          Start your learning journey or share your knowledge with the world
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp delay-200">
            <BookOpenIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Student</h2>
            <p className="text-gray-600 mb-6">Start learning today with our curated courses</p>
            <Link 
              to="/login" 
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login as Student
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp delay-300">
            <UserGroupIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Instructor</h2>
            <p className="text-gray-600 mb-6">Share your knowledge with the world</p>
            <Link
              to="/login" 
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Login as Instructor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}