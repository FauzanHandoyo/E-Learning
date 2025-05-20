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
  const fileInputRef = useRef(null);
  
  // New state for instructor application
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
      
      setApplicationSuccess(response.data.message);
      
      // Update user in auth context and localStorage
      const updatedUser = response.data.user;
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.role = 'instructor';
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      
      // Update auth context
      setUser(prev => ({...prev, role: 'instructor'}));
      
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatar(base64String); // For UI preview
        
        // Store the base64 string for upload
        setFormData({
          ...formData,
          avatarBase64: base64String
        });
      };
      reader.readAsDataURL(file);
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
          // Upload the image to Cloudinary
          const uploadResponse = await api.post('/users/upload-avatar', {
            data: formData.avatarBase64
          });
          
          // Update local state with the new avatar URL
          setProfile({
            ...profile,
            avatar_url: uploadResponse.data.imageUrl
          });
        } catch (err) {
          console.error('Error uploading avatar:', err);
          setError('Failed to upload avatar. Please try again.');
          setLoading(false);
          return;
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

      const response = await api.put(`/users/${user.id}`, updateData);
      
      setProfile({
        ...profile,
        username: response.data.username,
        email: response.data.email
      });
      
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // Reset form fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatarBase64: null
      });
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
          <div className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 md:mb-0 md:mr-6 overflow-hidden">
            <img 
              src={avatar || profile.avatar_url}
              alt="Profile" 
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
                onClick={() => fileInputRef.current.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
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
            // Edit Profile Form
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Hidden file input for avatar */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructor Stats</h3>
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