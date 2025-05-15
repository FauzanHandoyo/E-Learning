import { Link } from 'react-router-dom';
import { BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-100 via-white to-green-100">
      {/* Navigation Bar
      <div className="fixed top-0 left-0 w-full bg-white bg-opacity-90 shadow-md z-10">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">E-Learning</Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>
            <Link to="/courses" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Courses</Link>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Login</Link>
            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">Register</Link>
          </div>
        </div>
      </div> */}
      
      {/* Decorative gradient circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-2xl -z-10 animate-pulse"></div>
      
      {/* Main Content */}
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="mb-12 w-full px-4 mt-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 animate-fadeIn text-center drop-shadow-lg">
            Welcome to <span className="text-blue-600">E-Learning</span> Platform
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mb-8 text-center animate-fadeIn delay-100">
            Start your learning journey or share your knowledge with the world
          </p>
        </div>
        <div className="flex flex-col md:flex-row w-full h-auto">
          <div className="bg-white bg-opacity-90 p-10 flex-1 shadow-2xl hover:shadow-blue-200 transition-all duration-300 hover:-translate-y-1 animate-fadeInUp delay-200 flex flex-col items-center border-t border-b border-blue-100">
            <BookOpenIcon className="h-16 w-16 text-blue-500 mb-6 drop-shadow-md animate-bounce" />
            <h2 className="text-3xl font-bold mb-3 text-blue-700">Student</h2>
            <p className="text-gray-600 mb-8 text-center">Start learning today with our curated courses and interactive materials.</p>
            <Link 
              to="/login" 
              className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow hover:from-blue-600 hover:to-blue-800 hover:text-white hover:scale-105 transition-all duration-200"
            >
              Login as Student
            </Link>
          </div>
          <div className="bg-white bg-opacity-90 p-10 flex-1 shadow-2xl hover:shadow-green-200 transition-all duration-300 hover:-translate-y-1 animate-fadeInUp delay-300 flex flex-col items-center border-t border-b border-green-100">
            <UserGroupIcon className="h-16 w-16 text-green-500 mb-6 drop-shadow-md animate-bounce" />
            <h2 className="text-3xl font-bold mb-3 text-green-700">Instructor</h2>
            <p className="text-gray-600 mb-8 text-center">Share your expertise and inspire learners around the globe.</p>
            <Link
              to="/login" 
              className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow hover:from-green-600 hover:to-green-800 hover:text-white hover:scale-105 transition-all duration-200"
            >
              Login as Instructor
            </Link>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-90 p-10 flex-1 shadow-2xl hover:shadow-blue-200 transition-all duration-300 hover:-translate-y-1 animate-fadeInUp delay-200 flex flex-col items-center border-t border-b border-blue-100">
            <UserGroupIcon className="h-16 w-16 text-green-500 mb-6 drop-shadow-md animate-bounce" />
            <h2 className="text-3xl font-bold mb-3 text-gray-700">Don't Have An Account</h2>
            <p className="text-gray-600 mb-8 text-center">Create your account today and unlock the full potential of our platform.</p>
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-green-700 hover:text-white hover:scale-105 transition-all duration-200"
            >
              Register Now
            </Link>
        </div>

        <footer className="w-full bg-white bg-opacity-90 shadow-md py-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">© 2025 E-Learning. All rights reserved.</p>
          <p className="text-gray-600">Made by Group 10</p>
        </div>
      </footer>
      
      </div>
    </div>
  );
}