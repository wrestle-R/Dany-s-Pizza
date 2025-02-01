import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useOwner } from '../../context/ownerContext'; // Adjust the import path as needed
import { toast, ToastContainer } from 'react-toastify'; // Corrected import for ToastContainer

export default function OwnerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setOwner } = useOwner();

  // Show toast for error messages
  const showToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000, // Toast disappears after 5 seconds
      hideProgressBar: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please fill in both fields.');
      showToast('Please fill in both fields.');
      return;
    }

    try {
      const response = await axios.post('/api/owner/login', { email, password });

      if (response.data.error) {
        setErrorMessage(response.data.error);
        showToast(response.data.error);
        return;
      }

      if (response.data.owner) {
        // Update context and localStorage in one go
        setOwner(response.data.owner);
        navigate('/owner-hero');
      } else {
        console.error("Owner data missing in response.");
        setErrorMessage("Login failed. Please try again.");
        showToast("Login failed. Please try again.");
      }

    } catch (error) {
      setErrorMessage('Connection error. Please try again.');
      showToast('Connection error. Please try again.');
      console.error('Login failed:', error.response?.data || error);
    }
  };

  // Fetch the owner from localStorage whenever the component mounts
  useEffect(() => {
    const storedOwner = localStorage.getItem("owner");
    if (storedOwner) {
      setOwner(JSON.parse(storedOwner));
    }
  }, []); // Empty dependency array means it runs once when the component mounts

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to manage your restaurant</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your password"
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

            

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to platform?
                </span>
              </div>
            </div>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold" onClick={() => navigate('/owner-register')}>
                Request Restaurant Owner Access
              </button>
              <p className="mt-4 text-sm text-gray-600">
                Need help? Contact support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
