import { useState, useEffect } from 'react';
import { signupApi } from '../services/api';
import { validateEmail, validatePhone, validatePassword } from '../utils/validation';

function SignUpForm() {
  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    userPhoneNumber: '',
    userAddress: '',
    role: 'CUSTOMER',
    yearsOfExperience: '',
    serviceDepartment: '',
    specialization: '',
    availabilityStatus: '',
    hourlyRate: '',
    userImageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Check for image URL from uploader when component loads
  useEffect(() => {
    const checkForStoredImageUrl = () => {
      const storedUrl = localStorage.getItem('signupImageUrl');
      const timestamp = localStorage.getItem('signupImageUrlTimestamp');
      
      // Only use the URL if it's less than 5 minutes old
      if (storedUrl && timestamp) {
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (parseInt(timestamp) > fiveMinutesAgo) {
          setFormData(prev => ({
            ...prev,
            userImageUrl: storedUrl
          }));
          setMessage('✅ Profile image URL loaded from uploader!');
          
          // Clear the stored URL
          localStorage.removeItem('signupImageUrl');
          localStorage.removeItem('signupImageUrlTimestamp');
        }
      }
    };

    checkForStoredImageUrl();
  }, []);

  // Restore form data when component loads (if returning from uploader)
  useEffect(() => {
    const storedFormData = localStorage.getItem('signupFormData');
    const timestamp = localStorage.getItem('signupFormTimestamp');
    
    if (storedFormData && timestamp) {
      const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
      if (parseInt(timestamp) > tenMinutesAgo) {
        setFormData(JSON.parse(storedFormData));
        setMessage('✅ Form data restored successfully!');
        localStorage.removeItem('signupFormData');
        localStorage.removeItem('signupFormTimestamp');
      }
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Redirect to image uploader
const redirectToImageUploader = () => {
  // Store current form data in localStorage to restore later
  localStorage.setItem('signupFormData', JSON.stringify(formData));
  localStorage.setItem('signupFormTimestamp', Date.now().toString());
  
  // Redirect to uploader on port 5500
  window.location.href = 'http://127.0.0.1:5500/uploader.html?from=signup';
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Basic validation
    if (!validateEmail(formData.userEmail)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.userPhoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.userPassword)) {
      setError('Password must be between 8 and 12 characters');
      setLoading(false);
      return;
    }

    try {
      // Default images based on role (fallback if no image URL provided)
      const defaultImages = {
        CUSTOMER: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        SERVICE_MANAGER: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        MECHANIC: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=150&h=150&fit=crop&crop=face',
        CALL_CENTRE_AGENT: 'https://images.unsplash.com/photo-1551836026-d5c2e314c6d6?w=150&h=150&fit=crop&crop=face',
        ADMIN: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };

      // Use provided image URL or fallback to default
      const imageUrl = formData.userImageUrl || defaultImages[formData.role] || defaultImages.CUSTOMER;
      const imageStatus = formData.userImageUrl ? 'Using uploaded profile image' : 'Using default profile image';

      // Prepare final data
      const submitData = {
        ...formData,
        userImageUrl: imageUrl,
        // Convert string numbers to actual numbers
        ...(formData.yearsOfExperience && { yearsOfExperience: parseInt(formData.yearsOfExperience) }),
        ...(formData.hourlyRate && { hourlyRate: parseFloat(formData.hourlyRate) })
      };

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] == null) {
          delete submitData[key];
        }
      });

      console.log('Submitting data with image URL:', imageUrl);

      // Submit to signup service
      const response = await signupApi.registerUser(submitData);
      
      setMessage(`Registration successful! User ID: ${response.id} - ${imageStatus}`);
      
      // Clear any stored form data
      localStorage.removeItem('signupFormData');
      localStorage.removeItem('signupFormTimestamp');
      
      // Redirect based on role
      setTimeout(() => {
        redirectToDashboard(formData.role);
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      
      // Check error type and show appropriate message
      if (err.message.includes('Duplicate') || err.message.includes('409')) {
        setError('User already exists with this email or phone number');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Signup service is temporarily unavailable. Please try again in a few moments.');
      } else {
        setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect to appropriate dashboard
  const redirectToDashboard = (role) => {
    const dashboards = {
      CUSTOMER: 'http://localhost:3000', // Customer app
      SERVICE_MANAGER: 'http://localhost:5173', // Service Manager app
      MECHANIC: 'http://localhost:3002', // Mechanic app
      CALL_CENTRE_AGENT: 'http://localhost:3003', // Call Center app
      ADMIN: 'http://localhost:3004' // Admin app
    };

    window.location.href = dashboards[role] || 'http://localhost:3000';
  };

  // Role-specific fields
  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'SERVICE_MANAGER':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="1"
                max="25"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter years of experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Department</label>
              <input
                type="text"
                name="serviceDepartment"
                value={formData.serviceDepartment}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter service department"
              />
            </div>
          </div>
        );

      case 'MECHANIC':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="1"
                max="25"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter years of experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Specialization</option>
                <option value="ENGINE">Engine</option>
                <option value="TRANSMISSION">Transmission</option>
                <option value="BRAKES">Brakes</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="SUSPENSION">Suspension</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter hourly rate"
              />
            </div>
          </div>
        );

      case 'CALL_CENTRE_AGENT':
      case 'ADMIN':
      case 'CUSTOMER':
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Automotive Service Center
          </h1>
          <p className="text-gray-600 text-lg">
            Create Your Account
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  name="userPassword"
                  value={formData.userPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password (8-12 chars)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  name="userPhoneNumber"
                  value={formData.userPhoneNumber}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter 10-digit phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address *</label>
              <textarea
                name="userAddress"
                value={formData.userAddress}
                onChange={handleInputChange}
                required
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full address"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SERVICE_MANAGER">Service Manager</option>
                <option value="MECHANIC">Mechanic</option>
                <option value="CALL_CENTRE_AGENT">Call Center Agent</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Role Specific Fields */}
            {renderRoleSpecificFields()}

            {/* Image URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image URL <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="url"
                  name="userImageUrl"
                  value={formData.userImageUrl}
                  onChange={handleInputChange}
                  className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Paste your image URL here or upload an image"
                />
                <button
                  type="button"
                  onClick={redirectToImageUploader}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  📁 Upload Image
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Click "Upload Image" to upload a profile picture. We'll generate a URL for you to paste here.
              </p>
              {formData.userImageUrl && (
                <div className="mt-2">
                  <div className="text-sm text-green-600">✅ Image URL loaded!</div>
                  <div className="mt-2 text-center">
                    <img 
                      src={formData.userImageUrl} 
                      alt="Profile preview" 
                      className="inline-block h-20 w-20 rounded-full object-cover border-2 border-green-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Already have an account? 
            <a href="/login" className="text-blue-600 hover:text-blue-500 ml-1">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;