import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function CourseView() {
  const { courseId } = useParams();
  
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data);
        
        // Fetch course contents
        const contentsResponse = await api.get(`/course-contents/course/${courseId}`);
        setContents(contentsResponse.data);
        
        // Select first content by default if available
        if (contentsResponse.data.length > 0) {
          setSelectedContent(contentsResponse.data[0]);
        }
      } catch (err) {
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <Link to="/main" className="text-blue-500 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/main" className="text-blue-500 hover:underline">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2">{course?.title}</h1>
      </div>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Course Content Sidebar */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-4 pb-2 border-b">Course Content</h2>
          
          {contents.length === 0 ? (
            <p className="text-gray-500">No content available</p>
          ) : (
            <ul className="space-y-2">
              {contents.map((content) => (
                <li key={content.id}>
                  <button
                    onClick={() => setSelectedContent(content)}
                    className={`w-full text-left p-2 rounded ${
                      selectedContent?.id === content.id 
                        ? 'bg-blue-100 font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {content.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Content Display Area */}
        <div className="md:col-span-3 bg-white p-4 rounded shadow">
          {selectedContent ? (
            <div className="pdf-container">
              <div className="bg-gray-100 p-3 mb-4 flex justify-between items-center">
                <h3 className="font-medium">{selectedContent.title}</h3>
                <a 
                  href={selectedContent.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Open in New Tab
                </a>
              </div>
              
              {/* Direct iframe for PDF display */}
              <div className="border rounded">
                <iframe
                  src={selectedContent.content_url}
                  title={selectedContent.title || 'PDF Document'}
                  className="w-full h-[600px]"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">
                {contents.length > 0 
                  ? 'Select a lesson from the sidebar' 
                  : 'No content available for this course'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}