import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Upload } from 'lucide-react';
import axios from 'axios';
import chefPhoto from '../../../../backend/chef-uploads/download (6).png'; // Imported default image
import { useNavigate } from 'react-router-dom';
import { useOwner } from "../../../context/ownerContext";


const OwnerChef = () => {
  const [chefData, setChefData] = useState({
    name: '',
    specialty: '',
    country: '',
    image: null,
  });
  const { owner } = useOwner();
  const navigate = useNavigate();

  useEffect(() => {
    if (!owner) {
      navigate('/owner-login');
      toast.error('Login as Owner to continue');
    }
  }, [owner, navigate]);
  const [chefs, setChefs] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchChefs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chef/');
      setChefs(response.data);
    } catch (error) {
      toast.error('Error fetching chefs');
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setChefData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!chefData.name || !chefData.specialty || !chefData.country || !chefData.image) {
      toast.error('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', chefData.name);
    formData.append('specialty', chefData.specialty);
    formData.append('country', chefData.country);
    formData.append('image', chefData.image);

    try {
      const response = await axios.post('http://localhost:8000/api/chef/', formData);
      toast.success('Chef added successfully');
      setChefData({
        name: '',
        specialty: '',
        country: '',
        image: null,
      });
      setPreviewUrl(null);
      fetchChefs();
    } catch (error) {
      toast.error('Error adding chef');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Add New Chef</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={chefData.name}
                onChange={(e) => setChefData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="Chef Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <input
                type="text"
                name="specialty"
                value={chefData.specialty}
                onChange={(e) => setChefData((prev) => ({ ...prev, specialty: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="Specialty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={chefData.country}
                onChange={(e) => setChefData((prev) => ({ ...prev, country: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <div className="mt-1 flex items-center">
                <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Chef
            </button>
          </form>
        </div>

        {/* Display Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Chefs List</h2>
          <div className="grid gap-6">
            {chefs.length > 0 ? (
              chefs.map((chef) => (
                <div key={chef._id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-24 h-24 relative bg-gray-100 rounded-md">
                    <img
                      src={chefPhoto} // Using imported chef photo for all chefs
                      alt={chef.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
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
      </div>
    </div>
  );
};

export default OwnerChef;
