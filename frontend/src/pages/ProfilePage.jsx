import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    role: '',
    created_at: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatarBase64: null
  });
  const [avatar, setAvatar] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const [fileSize, setFileSize] = useState(null);
  
  // State for instructor application
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState('');
  const [applicationError, setApplicationError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          // Get user profile data
          const userResponse = await api.get(`/users/${user.id}`);
          console.log('Profile data received:', userResponse.data);
          
          setProfile({
            ...userResponse.data
          });
          
          setFormData({
            username: userResponse.data.username,
            email: userResponse.data.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            avatarBase64: null
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);
  
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
  
  // Handle instructor application
  const handleApplyInstructor = async (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setApplicationError('You must accept the terms to become an instructor');
      return;
    }
    
    try {
      setIsApplying(true);
      setApplicationError('');
      setApplicationSuccess('');
      
      const response = await api.post('/instructors/apply', { termsAccepted });
      
      setApplicationSuccess(response.data.message || 'Application submitted successfully!');
      
      // Update user in auth context and localStorage
      const updatedUser = response.data.user;
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.role = 'instructor';
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      
      // Update auth context if setUser is available
      if (typeof setUser === 'function') {
        setUser(prev => ({...prev, role: 'instructor'}));
      }
      
      // Reload after a delay to show updated role
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setApplicationError(error.response?.data?.message || 'Failed to process your application.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Calculate and display file size
      const size = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${size} MB`);
      
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
        // Show compression is happening
        setUploadingAvatar(true);
        
        // Compress the image
        const compressedBase64 = await compressImage(file);
        
        // Update UI preview
        setAvatar(compressedBase64);
        
        // Store the compressed base64 string for upload
        setFormData(prev => ({
          ...prev,
          avatarBase64: compressedBase64
        }));
        
        // Clear any previous errors
        setError('');
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process image. Please try again.');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUpdateSuccess(false);

    // Password validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      setLoading(false);
      return;
    }

    try {
      // If there's a new avatar image, upload it first
      if (formData.avatarBase64) {
        try {
          setUploadingAvatar(true);
          console.log('Uploading avatar to Cloudinary...');
          
          // Upload the image to Cloudinary
          const uploadResponse = await api.post('/users/upload-avatar', {
            data: formData.avatarBase64
          });
          
          console.log('Upload successful:', uploadResponse.data);
          
          // Update local state with the new avatar URL
          setProfile(prev => ({
            ...prev,
            avatar_url: uploadResponse.data.imageUrl
          }));
          
          // Update the avatar in localStorage
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser) {
            storedUser.avatar_url = uploadResponse.data.imageUrl;
            localStorage.setItem('user', JSON.stringify(storedUser));
          }
          
          // Update auth context with new avatar - safe approach
          if (typeof setUser === 'function') {
            setUser(prevUser => ({
              ...prevUser,
              avatar_url: uploadResponse.data.imageUrl
            }));
          } else {
            console.warn('setUser is not available as a function');
          }
          
        } catch (err) {
          console.error('Error uploading avatar:', err);
          setError('Failed to upload avatar. Please try again.');
          setLoading(false);
          return;
        } finally {
          setUploadingAvatar(false);
        }
      }

      // Now update the rest of the profile data
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      console.log('Updating profile data...');
      const response = await api.put(`/users/${user.id}`, updateData);
      console.log('Profile update response:', response.data);
      
      // Update profile state
      setProfile(prev => ({
        ...prev,
        username: response.data.username,
        email: response.data.email
      }));
      
      // Update auth context - only if setUser is available
      if (typeof setUser === 'function') {
        setUser(prevUser => ({
          ...prevUser,
          username: response.data.username,
          email: response.data.email
        }));
      }
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.username = response.data.username;
        storedUser.email = response.data.email;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // Reset form fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatarBase64: null
      }));
      
      // Clear file size display
      setFileSize(null);
      
      // Clear preview avatar to show the updated one from the server
      setAvatar(null);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    } 
  };

  if (loading && !profile.username) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Profile updated successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 flex flex-col md:flex-row items-center">
          <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-6 overflow-hidden border-4 border-white shadow-md">
            {avatar || profile.avatar_url ? (
              <img 
                src={avatar || profile.avatar_url}
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {isEditing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition-colors border-2 border-white"
                onClick={() => fileInputRef.current.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                )}
              </button>
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
            <p className="text-blue-100">{profile.email}</p>
            <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-medium mt-2">
              {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
            </span>
          </div>
          <div className="ml-auto mt-4 md:mt-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition duration-200"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {fileSize && (
                <p className="text-sm text-gray-500 mb-4">
                  Selected image size: {fileSize} {' '}
                  {uploadingAvatar ? '(Compressing...)' : '(Compressed)'}
                </p>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Change Password</h3>
                
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition duration-200 disabled:bg-gray-400"
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium">{profile.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium capitalize">{profile.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {user?.role === 'instructor' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Instructor Stats</h3>
                      <button
                        onClick={async () => {
                          try {
                            setLoading(true);
                            const userResponse = await api.get(`/users/${user.id}`);
                            setProfile(prev => ({
                              ...prev,
                              courses_count: userResponse.data.courses_count || 0,
                              students_count: userResponse.data.students_count || 0
                            }));
                          } catch (err) {
                            console.error('Error refreshing stats:', err);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Total Courses</p>
                        <p className="text-3xl font-bold">{profile.courses_count || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Total Students</p>
                        <p className="text-3xl font-bold">{profile.students_count || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {user?.role === 'student' && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Apply to be an Instructor</h3>
                  <p className="text-gray-600 mb-4">
                    Share your knowledge with others by becoming an instructor.
                  </p>
                  
                  {applicationSuccess ? (
                    <div className="p-3 bg-green-50 text-green-700 rounded-md mb-4">
                      {applicationSuccess}
                    </div>
                  ) : (
                    <form onSubmit={handleApplyInstructor}>
                      <div className="mb-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            I agree to the instructor terms and conditions. I will create high-quality 
                            educational content and follow all platform guidelines.
                          </span>
                        </label>
                      </div>
                      
                      {applicationError && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md mb-4">
                          {applicationError}
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isApplying || !termsAccepted}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition duration-200 disabled:bg-green-300"
                      >
                        {isApplying ? 'Processing...' : 'Apply Now'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}