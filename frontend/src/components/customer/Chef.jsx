import React, { useState, useEffect } from 'react';
import axios from 'axios';
import chefPhoto from '../../../../backend/chef-uploads/download (6).png'; // Imported default image
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../../../context/customerContext';
import { toast } from 'react-toastify';


const CustomerChefList = () => {
  const [chefs, setChefs] = useState([]);
      const { customer } = useCustomer();
    
  const fetchChefs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chef/');
      setChefs(response.data);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    }
  };

  const navigate = useNavigate();
    

  useEffect(() => {
    if (!customer) {
      navigate('/login');
      toast.error('Login as customer to continue');
    }
  }, [customer, navigate]);

  useEffect(() => {
    fetchChefs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Our Chefs</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {chefs.length > 0 ? (
          chefs.map((chef) => (
            <div key={chef._id} className="flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-md">
              <div className="w-32 h-32 relative bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={chefPhoto} // Displaying the default chef photo
                  alt={chef.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{chef.name}</h3>
                <p className="text-gray-600">Specialty: {chef.specialty}</p>
                <p className="text-gray-600">Country: {chef.country}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No chefs found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerChefList;
