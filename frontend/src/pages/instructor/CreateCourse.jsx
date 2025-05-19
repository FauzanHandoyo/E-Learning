import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CreateCourse() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '' // Add category_id field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]); // State for categories
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Course title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Course description is required');
      return;
    }

    if (!formData.price.trim() || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      setError('Please enter a valid price');
      return;
    }

    if (!formData.category_id) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create course with the current user as instructor
      const courseData = {
        ...formData,
        instructor_id: user.id,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id)
      };

      await api.post('/courses', courseData);
      
      // Redirect to instructor courses page
      navigate('/instructor/courses');
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function for providing category selection tips
  const [showCategoryTips, setShowCategoryTips] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Course Title*
              <span 
                className="ml-1 text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => setShowCategoryTips(prev => !prev)}
              >
                <i className="fas fa-info-circle"></i> Tips
              </span>
            </label>
            
            {showCategoryTips && (
              <div className="mb-3 p-3 bg-blue-50 text-sm rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-1">Tips for a great course title:</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Keep it clear and concise (50-60 characters)</li>
                  <li>Include keywords related to the subject</li>
                  <li>Highlight the specific skills students will learn</li>
                  <li>Avoid all caps or excessive punctuation</li>
                  <li>Example: "Complete JavaScript: From Fundamentals to Advanced Concepts"</li>
                </ul>
              </div>
            )}
            
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Complete Web Development Bootcamp"
              required
            />
          </div>
          
          {/* Add category selection */}
          <div className="mb-6">
            <label htmlFor="category_id" className="block text-gray-700 font-medium mb-2">
              Category*
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Course Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your course content and what students will learn"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
              Price ($)*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 49.99"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate('/instructor/courses')}
              className="px-6 py-2 mr-4 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}