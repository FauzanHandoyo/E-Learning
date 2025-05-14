import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import register from '../assets/register.svg';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student', // Default role
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-green-700 p-12 justify-center items-center">
        <div className="max-w-lg relative">
          <div className="relative h-52 min-w-64 text-center">
            {[
              {
                title: "Welcome!",
                description: "Access courses and enjoy learning with our platform."
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
          <div className="mb-8">
            <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
              <img src={register} alt="Register" className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join our platform and start your learning journey</p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-8">
            <button type="button" className="flex items-center justify-center p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all w-full text-gray-800 hover:border-green-500">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.908 8.908 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" fill="#4285F4"/>
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
          
          <div className="relative flex items-center justify-center mb-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500 whitespace-nowrap">or continue with email</div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
              <div className="flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-800"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-800"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-800"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">I am a</label>
              <select
                name="role"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-800"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the <a href="#" className="text-green-600 hover:text-green-800">Terms of Service</a> and <a href="#" className="text-green-600 hover:text-green-800">Privacy Policy</a>
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-800 transition-all shadow-lg hover:shadow-xl mt-6"
            >
              Create account
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-800 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}