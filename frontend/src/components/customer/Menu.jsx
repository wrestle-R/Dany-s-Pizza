import React, { useState, useEffect } from 'react';
import { Coffee, Pizza, Salad } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCustomer } from '../../../context/customerContext';  // Import the useCustomer hook

const Menu = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  
  const { customer } = useCustomer();  // Access the customer data from context
  console.log(customer)
  
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/menu');
      setItems(response.data);
    } catch (error) {
      toast.error('Error fetching menu items');
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pizza') return item.isPizza;
    if (filter === 'non-pizza') return !item.isPizza;
    if (filter === 'veg') return item.isVeg;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md mb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  filter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
                }`}
              >
                <Coffee className="w-5 h-5" />
                <span>All Items</span>
              </button>
              <button
                onClick={() => setFilter('pizza')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  filter === 'pizza' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
                }`}
              >
                <Pizza className="w-5 h-5" />
                <span>Pizza</span>
              </button>
              <button
                onClick={() => setFilter('non-pizza')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  filter === 'non-pizza' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
                }`}
              >
                <Coffee className="w-5 h-5" />
                <span>Non-Pizza</span>
              </button>
              <button
                onClick={() => setFilter('veg')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  filter === 'veg' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
                }`}
              >
                <Salad className="w-5 h-5" />
                <span>Vegetarian</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <span className="text-blue-600 font-semibold">₹{item.price}</span>
                </div>
                <div className="flex gap-2 mb-3">
                  {item.isPizza && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Pizza
                    </span>
                  )}
                  {item.isVeg && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Vegetarian
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
