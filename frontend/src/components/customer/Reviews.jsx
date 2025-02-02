import { useState,useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { useCustomer } from '../../../context/customerContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ReviewForm = () => {
  const { customer } = useCustomer();
  const [formData, setFormData] = useState({
    chefRating: 0,
    menuRating: 0,
    locationRating: 0,
    description: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    

  useEffect(() => {
    if (!customer) {
      navigate('/login');
      toast.error('Login as customer to continue');
    }
  }, [customer, navigate]);

  const RatingStars = ({ value, onChange, name, label }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-7 h-7 cursor-pointer transition-all duration-200 hover:scale-110 ${
                star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
              }`}
              onClick={() => onChange(name, star)}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {value ? `${value} out of 5` : 'Select rating'}
          </span>
        </div>
      </div>
    );
  };

  const handleRatingChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!customer || !customer.id || !customer.firstName) {
      setMessage('Customer data is missing. Please log in.');
      return;
    }
  
    setLoading(true);
  
    try {
      const { data } = await axios.post(
        'http://localhost:8000/api/customer/reviews',
        {
          customerId: customer.id,
          customerName: customer.firstName,
          ...formData,
          timestamp: new Date().toISOString(),
        },
        {
          withCredentials: true,
        }
      );
  
      console.log('API Response:', data);  // Debugging the response object
  
      // Check the message in the API response
      if (data.message === 'Review submitted successfully') {
        setMessage('Review submitted successfully!');
      } else {
        setMessage('Failed to submit review. Please try again later.');
      }
  
      // Reset form data
      setFormData({
        chefRating: 0,
        menuRating: 0,
        locationRating: 0,
        description: '',
      });
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Error submitting review. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Share Your Experience</h1>
        <p className="text-gray-600 text-lg">Help us improve by sharing your feedback</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 mb-8">
          <RatingStars
            value={formData.chefRating}
            onChange={handleRatingChange}
            name="chefRating"
            label="Rate our Chef's Culinary Excellence"
          />

          <RatingStars
            value={formData.menuRating}
            onChange={handleRatingChange}
            name="menuRating"
            label="Rate our Menu Selection & Quality"
          />

          <RatingStars
            value={formData.locationRating}
            onChange={handleRatingChange}
            name="locationRating"
            label="Rate our Location & Ambiance"
          />

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tell us about your dining experience
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full p-4 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Share the highlights of your visit, what you enjoyed most, and any suggestions for improvement..."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-200
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              Submitting...
            </span>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>

      {message && (
        <div
          className={`mt-6 p-4 rounded-lg border animate-fade-in ${
            message.includes('success')
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <h3 className="font-semibold text-lg mb-1">
            {message.includes('success') ? 'Thank you for your feedback!' : 'Error'}
          </h3>
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
