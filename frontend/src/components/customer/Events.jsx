import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCustomer } from '../../../context/customerContext';

export default function Events() {
  const [events, setEvents] = useState([]);
  const { customer } = useCustomer();
  const navigate = useNavigate()

  useEffect(() => {
    if (!customer) {
      navigate('/login');
      toast.error('Login as customer to continue');
    }
  }, [customer, navigate]);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div 
            key={event._id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <img 
              src={`http://localhost:8000/${event.image}`} 
              alt={event.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold text-lg">₹{event.price}</span>
                <a href={`/booktable/${event._id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                    Book Seats
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No events available at the moment</p>
      )}
    </div>
  );
}