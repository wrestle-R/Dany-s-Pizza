import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCustomer } from '../../../context/customerContext';

export default function BookTable() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const { customer } = useCustomer();

  // Authentication check
  useEffect(() => {
    if (!customer) {
      navigate('/login');
      toast.error('Login as customer to continue');
      window.location.reload()
    }
  }, [customer, navigate]);

  // Fetch event and booked seats
  useEffect(() => {
    fetchEvent();
    fetchBookedSeats();
  }, [selectedDate, selectedTime]);

  // Calculate total price
  useEffect(() => {
    if (event && selectedSeats.length > 0) {
      setTotalPrice(selectedSeats.length * (event.price || 50));
    } else {
      setTotalPrice(0);
    }
  }, [selectedSeats, event]);

  // Fetch event details
  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/events`);
      setEvent(response.data.find((ev) => ev._id === eventId));
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to fetch event details");
    }
  };

  // Fetch booked seats
  const fetchBookedSeats = async () => {
    if (!selectedDate || !selectedTime) return;
    try {
      const response = await axios.get(`http://localhost:8000/api/bookings/${eventId}?date=${selectedDate}&time=${selectedTime}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Seat selection handler
  const handleSeatSelection = (seatNumber) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatNumber)
        ? prevSeats.filter((seat) => seat !== seatNumber)
        : [...prevSeats, seatNumber]
    );
  };

  // Open confirmation modal
  const openConfirmationModal = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time!");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat!");
      return;
    }

    if (!customerName || customerName.trim().length < 2) {
      toast.error("Please enter a valid name (min 2 characters)!");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    try {
      for (let seatNumber of selectedSeats) {
        await axios.post("http://localhost:8000/api/bookings", {
          eventId,
          customerName,
          seatNumber,
          date: selectedDate,
          time: selectedTime,
          customerId: customer._id,
        });
      }

      toast.success(`Successfully booked ${selectedSeats.length} seat(s)!`);
      fetchBookedSeats();
      setSelectedSeats([]);
      setCustomerName("");
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Error booking seats:", error);
      toast.error("Error booking seats. Please try again.");
    }
  };

  // Cancel booking
  const handleCancelBooking = async (seatNumber) => {
    try {
      const bookingToCancel = bookings.find(
        b => b.seatNumber === seatNumber && b.customerId === customer._id
      );

      if (!bookingToCancel) {
        toast.error("You can only cancel your own bookings");
        return;
      }

      const cancelConfirm = window.confirm(
        `Are you sure you want to cancel seat ${seatNumber + 1}? A refund of ₹${event?.price || 50} will be processed.`
      );

      if (cancelConfirm) {
        await axios.delete(`http://localhost:8000/api/bookings`, {
          data: { 
            eventId, 
            seatNumber, 
            customerId: customer._id, 
            date: selectedDate, 
            time: selectedTime 
          },
        });

        toast.success(`Seat ${seatNumber + 1} booking cancelled. Refund initiated.`);
        fetchBookedSeats();
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking. Please try again.");
    }
  };

  // Generate upcoming dates
  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Available time slots
  const timeSlots = ["7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 text-center">
          <h2 className="text-3xl font-bold">{event?.title}</h2>
          <p className="mt-2 text-blue-100">{event?.description}</p>
        </div>

        <div className="p-6 space-y-6">
          <input
            type="text"
            placeholder="Enter your full name (required)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            minLength={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Date</option>
            {getUpcomingDates().map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>

          <div className="grid grid-cols-6 gap-2 mt-4">
            {Array(30)
              .fill(0)
              .map((_, index) => {
                const isBooked = bookings.some((b) => b.seatNumber === index);
                const isUserBooked = bookings.some((b) => b.seatNumber === index && b.customerId === customer._id);
                return (
                  <button
                    key={index}
                    disabled={isBooked && !isUserBooked}
                    onClick={() => isUserBooked ? handleCancelBooking(index) : handleSeatSelection(index)}
                    className={`w-12 h-12 rounded-lg text-white font-bold transition duration-300 ${
                      isBooked
                        ? isUserBooked
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-red-500 cursor-not-allowed opacity-50"
                        : selectedSeats.includes(index)
                        ? "bg-green-500 transform scale-105"
                        : "bg-blue-500 hover:bg-blue-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
          </div>

          <button
            onClick={openConfirmationModal}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 active:scale-95"
          >
            Confirm Booking
          </button>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Your Booking</h2>
            <div className="space-y-4">
              <p><strong>Event:</strong> {event?.title}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Seats:</strong> {selectedSeats.map(seat => seat + 1).join(', ')}</p>
              <p><strong>Total Seats:</strong> {selectedSeats.length}</p>
              <p><strong>Price per Ticket:</strong> ₹{event?.price || 50}</p>
              <p className="text-xl font-bold text-blue-600">Total Price: ₹{totalPrice}</p>
            </div>
            <div className="flex justify-between mt-6">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}