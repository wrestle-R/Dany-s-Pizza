import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwner } from "../../../context/ownerContext";
import { toast } from 'react-toastify';

const OwnerHero = () => {
  const { owner } = useOwner();
  const navigate = useNavigate();

  useEffect(() => {
    if (!owner) {
      navigate('/owner-login');
      toast.error('Login as Owner to continue');
    }
  }, [owner, navigate]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-4">Welcome, {owner?.firstName}!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Chefs Card */}
        <div 
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:transform hover:scale-105 transition-transform" 
          onClick={() => navigate('/owner-chef')}
        >
          <div className="text-4xl text-blue-600 mb-4">
            <i className="fas fa-user-chef"></i>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Manage Chefs</h3>
          <p className="text-gray-500 text-center">View and manage your restaurant's chefs.</p>
        </div>

        {/* Menu Card */}
        <div 
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:transform hover:scale-105 transition-transform"
          onClick={() => navigate('/owner-menu')}
        >
          <div className="text-4xl text-green-600 mb-4">
            <i className="fas fa-utensils"></i>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Manage Menu</h3>
          <p className="text-gray-500 text-center">Edit your menu items, prices, and descriptions.</p>
        </div>

        {/* Events Card */}
        <div 
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:transform hover:scale-105 transition-transform"
          onClick={() => navigate('/events')}
        >
          <div className="text-4xl text-yellow-600 mb-4">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Plan Events</h3>
          <p className="text-gray-500 text-center">Host events and special promotions for your restaurant.</p>
        </div>

        {/* Shop Card */}
        <div 
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:transform hover:scale-105 transition-transform"
          onClick={() => navigate('/shop')}
        >
          <div className="text-4xl text-indigo-600 mb-4">
            <i className="fas fa-box"></i>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Manage the Pizza Shop</h3>
          <p className="text-gray-500 text-center">Track and manage your restaurant's shop.</p>
        </div>

        {/* Reviews Card */}
        <div 
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:transform hover:scale-105 transition-transform"
          onClick={() => navigate('/reviews')}
        >
          <div className="text-4xl text-purple-600 mb-4">
            <i className="fas fa-star"></i>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Customer Reviews</h3>
          <p className="text-gray-500 text-center">View feedback and ratings from your customers.</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerHero;
