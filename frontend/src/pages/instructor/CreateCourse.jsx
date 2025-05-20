import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CreateCourse() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '0', // Default to zero
    category_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // For title tips
  const [showTitleTips, setShowTitleTips] = useState(false);
  
  // For course image
  const [courseImage, setCourseImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

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
  
  // Image compression function
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions (max 800px width/height while maintaining aspect ratio)
          let width = img.width;
          let height = img.height;
          const maxSize = 800;
          
          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed image as base64 string (0.7 quality for better compression)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };
  
  // Handle file upload for course image
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      try {
        setUploadingImage(true);
        
        // Compress the image
        const compressedBase64 = await compressImage(file);
        
        // Update UI preview
        setCourseImage(compressedBase64);
        setError('');
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process image. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    }
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
        price: 0, // Always set price to 0
        category_id: parseInt(formData.category_id)
      };

      const response = await api.post('/courses', courseData);
      const createdCourse = response.data.course;
      
      // If we have an image, upload it
      if (courseImage) {
        try {
          await api.post('/courses/upload-image', {
            courseId: createdCourse.id,
            data: courseImage
          });
        } catch (imageError) {
          console.error('Error uploading course image:', imageError);
          // We'll continue even if image upload fails
        }
      }
      
      // Redirect to instructor courses page
      navigate('/instructor/courses');
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          {/* Course Image Upload */}
          <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Course Image
          </label>
          <div className="border border-gray-300 rounded-lg p-6 text-center">
            {courseImage ? (
              <div className="relative">
                <img 
                  src={courseImage} 
                  alt="Course preview" 
                  className="max-h-48 mx-auto rounded-lg"
                />
                <div className="mt-4">
                  <button 
                    type="button"
                    onClick={() => setCourseImage(null)}
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8">
                {uploadingImage ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    <p className="mb-4 text-gray-500">Click to upload course image</p>
                    <p className="text-xs text-gray-400 mb-4">(Recommended: 800x400px)</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                      Choose File
                    </button>
                  </>
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          {fileSize && (
            <p className="text-xs text-gray-500 mt-1">
              Selected image size: {fileSize} {' '}
              {uploadingImage ? '(Compressing...)' : ''}
            </p>
          )}
        </div>

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
              placeholder="e.g., Complete Web Development Bootcamp"
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
              placeholder="Describe your course content and what students will learn"
              required
            />
          </div>
          
          {/* Price field removed from UI but kept in form data */}
          
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