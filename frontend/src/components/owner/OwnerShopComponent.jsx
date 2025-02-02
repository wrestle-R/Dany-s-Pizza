import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOwner } from '../../../context/ownerContext';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function ShopComponent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });

  const navigate = useNavigate();
  const { owner } = useOwner();

  useEffect(() => {
    if (!owner) {
      navigate('/owner-login');
      toast.error('Login as Owner to continue');
    }
  }, [owner, navigate]);

  const [shopItems, setShopItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/shop");
      setShopItems(response.data);
    } catch (error) {
      console.error("Error fetching shop items:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.image) {
      setErrorMessage("Please upload an image.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);

    try {
      await axios.post("http://localhost:8000/api/shop", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ title: "", description: "", price: "", image: null });
      fetchShopItems();
    } catch (error) {
      console.error("Error adding shop item:", error);
      setErrorMessage("Failed to add item. Please try again.");
    }
  };

  // Delete shop item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/shop/${id}`);
      toast.success("Item deleted successfully");
      fetchShopItems();
    } catch (error) {
      toast.error("Failed to delete item");
      console.error("Error deleting shop item:", error);
    }
  };

  // Edit shop item
  const handleEdit = async (id) => {
    const itemToEdit = shopItems.find(item => item._id === id);
    if (!itemToEdit) return;

    setFormData({
      title: itemToEdit.title,
      description: itemToEdit.description,
      price: itemToEdit.price,
      image: null,
    });

    // Handle form submission for editing
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.image) data.append("image", formData.image);

    try {
      await axios.put(`http://localhost:8000/api/shop/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Item updated successfully");
      fetchShopItems();
    } catch (error) {
      toast.error("Failed to update item");
      console.error("Error updating shop item:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Shop Item</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Add Item
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-6">Shop Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {shopItems.map((item) => (
          <div key={item._id} className="border p-4 rounded-lg">
            <img src={`http://localhost:8000/${item.image}`} alt={item.title} className="w-full h-40 object-cover" />
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p>{item.description}</p>
            <p className="text-green-600 font-bold">₹{item.price}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(item._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
