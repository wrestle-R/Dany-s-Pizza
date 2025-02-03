import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useOwner } from "../../../context/ownerContext";

export default function AdminBooktable() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { owner } = useOwner();
  const navigate = useNavigate();
  
    useEffect(() => {
      if (!owner) {
        navigate('/owner-login');
        toast.error('Login as Owner to continue');
      }
    }, [owner, navigate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/events");
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!selectedEvent || !selectedDate) {
      toast.error("Please select an event and date");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/bookings/${selectedEvent}?date=${selectedDate}${selectedTime ? `&time=${selectedTime}` : ''}`
      );
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    
    if (!confirmCancel) return;

    try {
      await axios.delete(`http://localhost:8000/api/bookings/${bookingId}`);
      toast.success("Booking canceled successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error("Error canceling booking");
    }
  };

  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Event Bookings</h2>

      <div className="space-y-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <label className="block text-gray-700 font-medium mb-2">Select Event:</label>
          <select 
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <label className="block text-gray-700 font-medium mb-2">Select Date:</label>
          <select
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Date</option>
            {getUpcomingDates().map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <label className="block text-gray-700 font-medium mb-2">Select Time:</label>
          <select 
            value={selectedTime} 
            onChange={(e) => setSelectedTime(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Time</option>
            <option value="7:00 PM">7:00 PM</option>
            <option value="8:00 PM">8:00 PM</option>
            <option value="9:00 PM">9:00 PM</option>
            <option value="10:00 PM">10:00 PM</option>
          </select>
        </div>

        <button 
          onClick={fetchBookings}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Bookings'}
        </button>
      </div>

      {selectedEvent && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Booked Seats</h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center text-gray-500">No bookings for this event</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className="bg-gray-100 p-4 rounded-md flex justify-between items-center"
                >
                  <div className="flex-grow">
                    <div className="font-medium text-gray-700">
                      Seat {booking.seatNumber + 1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.customerName}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}