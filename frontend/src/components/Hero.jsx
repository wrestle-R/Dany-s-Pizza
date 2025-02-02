import React from 'react';
import { useOwner } from '../../context/ownerContext';
import { useCustomer } from '../../context/customerContext';
import OwnerHero from './owner/OwnerHero';
import Dashboard from './customer/Dashboard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { owner } = useOwner();
  const { customer } = useCustomer();
  const navigate = useNavigate();

  return (
    <div>
      {owner ? (
        <OwnerHero />
      ) : customer ? (
        <Dashboard />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-4xl font-bold mb-4">Welcome to Dany's Pizza</h1>
          <p className="text-lg text-gray-600 mb-6">Please log in to continue</p>
          <div className="flex space-x-4">
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
              onClick={() => navigate('/login')}
            >
              Customer Login
            </button>
            <button 
              className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
              onClick={() => navigate('/owner-login')}
            >
              Owner Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
