import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/dashboard'); // Sesuaikan dengan routing yang benar
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen w-screen flex">
      {/* Left side - decorative background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 to-indigo-600 p-12 justify-center items-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-white mb-6">Welcome Back!</h1>
          <p className="text-white text-xl mb-8">
            Access your courses and continue your learning journey with our platform.
          </p>
          <div className="flex space-x-4">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-white animate-pulse delay-100"></div>
            <div className="h-2 w-2 rounded-full bg-white animate-pulse delay-200"></div>
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 lg:px-16 xl:px-24 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-gray-600 mb-8">Please enter your credentials to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              Sign in to your account
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}