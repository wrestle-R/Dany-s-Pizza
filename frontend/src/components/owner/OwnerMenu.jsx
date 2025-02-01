import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

const MenuForm = () => {
  const initialFormState = {
    name: '',
    price: '',
    image: null,
    isPizza: false,
    description: '',
    isVeg: false
  };

  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editItem, setEditItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/owner/menu/');
      setMenuItems(response.data);
    } catch (error) {
      toast.error('Error fetching menu items');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files[0]) {
      setSelectedFile(files[0]);
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(files[0]);
      setFormData(prev => ({
        ...prev,
        image: previewUrl
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = editItem 
      ? `http://localhost:8000/api/owner/menu/${editItem._id}`
      : 'http://localhost:8000/api/owner/menu/';
    
    try {
      // Create FormData object to send multipart/form-data
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('price', formData.price);
      submitFormData.append('isPizza', formData.isPizza);
      submitFormData.append('description', formData.description);
      submitFormData.append('isVeg', formData.isVeg);
      
      // Only append image if a new file is selected
      if (selectedFile) {
        submitFormData.append('image', selectedFile);
      } else if (editItem && formData.image) {
        // If editing and no new image selected, keep the existing image path
        submitFormData.append('image', formData.image);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios[editItem ? 'put' : 'post'](
        endpoint, 
        submitFormData,
        config
      );

      setMenuItems(prev => editItem 
        ? prev.map(item => item._id === response.data._id ? response.data : item)
        : [...prev, response.data]
      );

      toast.success(`Item ${editItem ? 'updated' : 'added'} successfully!`);
      resetForm();
    } catch (error) {
      toast.error(`Error ${editItem ? 'updating' : 'adding'} item`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:8000/api/owner/menu/${id}`);
        setMenuItems(prev => prev.filter(item => item._id !== id));
        toast.success('Item deleted successfully!');
      } catch (error) {
        toast.error('Error deleting item');
      }
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      image: item.image,
      isPizza: item.isPizza,
      description: item.description,
      isVeg: item.isVeg
    });
    setSelectedFile(null); // Reset selected file when editing
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditItem(null);
    setSelectedFile(null);
    // Clean up any object URLs to prevent memory leaks
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
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
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-semibold mb-6">
          {editItem ? 'Edit Menu Item' : 'Add Menu Item'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Item Name"
              className="p-2 border rounded-md"
              required
            />
            
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price (₹)"
              className="p-2 border rounded-md"
              required
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded-md"
            rows="2"
            required
          />

          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleChange}
              name="image"
              className="p-2"
              accept="image/*"
            />
            
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPizza"
                  checked={formData.isPizza}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Is Pizza</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={formData.isVeg}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Is Veg</span>
              </label>
            </div>
          </div>

          {formData.image && (
            <img
              src={getImageUrl(formData.image)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md"
            />
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {isLoading ? 'Processing...' : editItem ? 'Update Item' : 'Add Item'}
            </button>
            {editItem && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

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

              <div className="flex space-x-2 mt-4 pt-2 border-t">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 flex items-center justify-center"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuForm;