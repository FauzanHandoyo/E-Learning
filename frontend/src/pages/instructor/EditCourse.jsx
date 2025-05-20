import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // For title tips
  const [showTitleTips, setShowTitleTips] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        const course = courseResponse.data;
        
        // Check if the logged-in instructor is the owner of this course
        if (user?.id !== course.instructor_id) {
          setError('You do not have permission to edit this course');
          setLoading(false);
          return;
        }
        
        // Fetch categories
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);
        
        // Set form data
        setFormData({
          title: course.title || '',
          description: course.description || '',
          category_id: course.category_id || ''
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course details. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, user?.id]);

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

    try {
      setSaveLoading(true);
      setError('');

      const updatedData = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        instructor_id: user.id
      };

      await api.put(`/courses/${courseId}`, updatedData);
      
      // Redirect to instructor courses page
      navigate('/instructor/courses');
    } catch (err) {
      console.error('Error updating course:', err);
      setError(err.response?.data?.message || 'Failed to update course. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && error === 'You do not have permission to edit this course') {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 font-semibold mb-4">Access Denied</div>
        <p className="text-gray-700 mb-4">You do not have permission to edit this course.</p>
        <button 
          onClick={() => navigate('/instructor/courses')} 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
      
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
                onClick={() => setShowTitleTips(prev => !prev)}
              >
                <i className="fas fa-info-circle"></i> Tips
              </span>
            </label>
            
            {showTitleTips && (
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
              required
            />
          </div>
          
          {/* Category selection */}
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
              required
            />
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate('/instructor/courses')}
              className="px-6 py-2 mr-4 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={saveLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}