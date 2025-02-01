import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../../../context/customerContext';
import {FlickeringGrid} from '../ui/flickering-grid';
import {toast} from 'react-hot-toast'

const Dashboard = () => {
  const { customer } = useCustomer();
  const navigate = useNavigate();
console.log(customer)

  useEffect(() => {
    if (!customer) {
      navigate('/login');
      toast.error('Login as customer to continue');
    }
  }, [customer, navigate]);

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
      <FlickeringGrid
                className="relative inset-0 z-0 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
                squareSize={6}
                gridGap={6}
                color="#5e34eb"
                maxOpacity={0.5}
                flickerChance={0.05}
              />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {customer && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome back, {customer.firstName}!
              </h1>
              <p className="text-lg text-gray-600">
                We're glad to see you again. How can we help you today?
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Your Profile
                </div>
                <p className="text-gray-600">
                  View and manage your personal information
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Services
                </div>
                <p className="text-gray-600">
                  Browse our available services
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Support
                </div>
                <p className="text-gray-600">
                  Get help from our support team
                </p>
              </div>
            </div>

            {/* Featured Section */}
            <div className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-white">
              <h2 className="text-2xl font-bold mb-4">
                Discover What's New
              </h2>
              <p className="text-lg opacity-90">
                Check out our latest features and updates designed to enhance your experience.
              </p>
              <button className="mt-6 bg-white text-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-300">
                Learn More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;