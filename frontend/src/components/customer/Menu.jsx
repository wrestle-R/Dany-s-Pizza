import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/owner/menu/');
      setMenuItems(response.data);
    } catch (error) {
      toast.error('Error fetching menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Function to get the complete image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('blob:')) return imagePath;
    // Remove 'uploads/' from the beginning of the path since it's included in both the route and the stored path
    const cleanPath = imagePath.replace('uploads/', '');
    return `http://localhost:8000/api/uploads/${cleanPath}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Menu</h1>

      {isLoading ? (
        <p>Loading menu...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden h-[420px] flex flex-col">
              <div className="h-48 overflow-hidden">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate flex-1 pr-2">{item.name}</h3>
                  <span className="text-blue-600 font-semibold whitespace-nowrap">
                    {formatPrice(item.price)}
                  </span>
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

                <div className="flex-grow overflow-auto">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
