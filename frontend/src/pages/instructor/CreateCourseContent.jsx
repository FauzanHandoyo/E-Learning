import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CreateCourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // For adding new content
  const [newContent, setNewContent] = useState({
    title: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data);
        
        // Fetch existing course content
        const contentResponse = await api.get(`/course-contents/course/${courseId}`);
        setContents(contentResponse.data);
        
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContent({
      ...newContent,
      [name]: value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        setSelectedFile(null);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB.');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percentCompleted);
        }
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newContent.title.trim()) {
      setError('Please enter a title for the content');
      return;
    }
    
    if (!selectedFile) {
      setError('Please select a PDF file to upload');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      // Convert file to base64
      const base64PDF = await convertToBase64(selectedFile);
      
      // Create content
      const response = await api.post('/course-contents', {
        course_id: courseId,
        title: newContent.title,
        content_url: base64PDF
      });
      
      // Add new content to the list
      setContents([...contents, response.data]);
      
      // Reset form
      setNewContent({ title: '' });
      setSelectedFile(null);
      fileInputRef.current.value = '';
      
      setSuccess('Content uploaded successfully!');
      setUploadProgress(0);
    } catch (err) {
      console.error('Error uploading content:', err);
      setError(err.response?.data?.message || 'Failed to upload content. Please try again.');
    }
  };
  
  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }
    
    try {
      await api.delete(`/course-contents/${contentId}`);
      
      // Update the contents list
      setContents(contents.filter(content => content.id !== contentId));
      
      setSuccess('Content deleted successfully!');
    } catch (err) {
      console.error('Error deleting content:', err);
      setError('Failed to delete content. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/instructor/courses" className="text-blue-500 hover:underline">
          &larr; Back to My Courses
        </Link>
        <h1 className="text-2xl font-bold mt-2">Manage Course Content</h1>
        {course && <p className="text-gray-600">{course.title}</p>}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Add New Material</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-1 font-medium">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newContent.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 font-medium">PDF File *</label>
              <div className="border border-gray-300 rounded p-4 text-center">
                {selectedFile ? (
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-gray-500 text-sm">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        fileInputRef.current.value = '';
                      }}
                      className="text-red-600 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Select PDF
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />
              </div>
            </div>
            
            {uploadProgress > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!selectedFile}
            >
              {uploadProgress > 0 ? 'Uploading...' : 'Upload Material'}
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Course Materials</h2>
          
          {contents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No materials have been added yet</p>
          ) : (
            <div className="divide-y">
              {contents.map((content) => (
                <div key={content.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{content.title}</h3>
                    <p className="text-sm text-gray-500">
                      Added on {new Date(content.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={content.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteContent(content.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}