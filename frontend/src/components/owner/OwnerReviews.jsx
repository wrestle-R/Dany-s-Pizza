import { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, User, MapPin, ChefHat, MenuSquare, MessageCircle, Loader2 } from 'lucide-react';
import { useOwner } from '../../../context/ownerContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const OwnerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()
    const { owner } = useOwner();
  
useEffect(() => {
    if (!owner) {
      navigate('/owner-login');
      toast.error('Login as Owner to continue');
    }
  }, [owner, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/customer/reviews');
        setReviews(response.data);
      } catch (err) {
        setError('Error fetching reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${index < rating ? getRatingColor(rating) : 'text-gray-300'}`}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Customer Reviews</h1>
      
      {reviews.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No reviews available yet</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-800">{review.customerName}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <ChefHat className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600 w-24">Chef Rating:</span>
                  <div className="flex">{renderStars(review.chefRating)}</div>
                </div>

                <div className="flex items-center">
                  <MenuSquare className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600 w-24">Menu Rating:</span>
                  <div className="flex">{renderStars(review.menuRating)}</div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600 w-24">Location:</span>
                  <div className="flex">{renderStars(review.locationRating)}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-gray-600 text-sm line-clamp-3">{review.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerReviews;