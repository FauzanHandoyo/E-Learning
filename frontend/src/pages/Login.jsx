import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import login from '../assets/login.svg';

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
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 to-indigo-600 p-12 justify-center items-center">
        <div className="max-w-lg relative">
          <div className="relative h-52 min-w-64 text-center">
            {[
              {
                title: "Welcome Back!",
                description: "Access your courses and continue your learning journey with our platform."
              },
              {
                title: "Learn Anywhere",
                description: "Study at your own pace with our flexible learning platform."
              },
              {
                title: "Join Community",
                description: "Connect with other learners and share your knowledge."
              }
            ].map((slide, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${
                  currentSlide === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
              >
                <h1 className="text-4xl font-bold text-white mb-4">{slide.title}</h1>
                <p className="text-white text-lg mb-6">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>
          <div className="flex space-x-4 mt-4">
            {[0, 1, 2].map((dot, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 w-1.5 rounded-full ml-11 transition-all duration-500 ${
                  currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 lg:px-16 xl:px-24 bg-white">
        <div className="w-full max-w-md">
          <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
            <img src={login} alt="Login" className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Log In</h2>
          <p className="text-gray-600 mb-8">Please enter your credentials to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-800"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2.5 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              Log in to your account
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
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
