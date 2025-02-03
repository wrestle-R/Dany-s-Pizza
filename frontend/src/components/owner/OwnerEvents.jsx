import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useOwner } from "../../../context/ownerContext";
import { toast } from 'react-toastify';

export default function OwnerEvents() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
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

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/events/");
      console.log("Fetched events:", response.data);

      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);

    try {
      await axios.post("http://localhost:8000/api/events/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchEvents();
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        price: "",
        image: null,
      });
      toast.success('Event added successfully!');
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error('Failed to add event');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Owner Events</h2>
        <button 
          onClick={() => navigate('/owner-booktable')}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          View Bookings
        </button>
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
      >
        <input 
          type="text" 
          name="title" 
          value={formData.title}
          placeholder="Event Title" 
          onChange={handleChange} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea 
          name="description" 
          value={formData.description}
          placeholder="Event Description" 
          onChange={handleChange} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
        />
        <input 
          type="number" 
          name="price" 
          value={formData.price}
          placeholder="Price (₹)" 
          onChange={handleChange} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white file:px-4 file:py-2 hover:file:bg-blue-600"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Add Event
        </button>
      </form>

      <h3 className="text-2xl font-semibold text-gray-700 mb-6">Events List</h3>
      
      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event._id} 
              className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <img 
                src={`http://localhost:8000/${event.image}`} 
                alt={event.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h4>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <p className="text-blue-600 font-semibold">₹{event.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}