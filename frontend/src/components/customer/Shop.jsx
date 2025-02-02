import { useEffect, useState } from "react";
import axios from "axios";
import { useCustomer } from '../../../context/customerContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShopItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { customer } = useCustomer();
  const navigate = useNavigate();


  useEffect(() => {
    if (!customer) {
      navigate('/login');
      toast.error('Login as customer to continue');
    }
  }, [customer, navigate]);


  useEffect(() => {
    axios
      .get("http://localhost:8000/api/shop")
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shop items:", error);
        setError("Failed to load shop items.");
        setLoading(false);
      });
  }, []);



  if (loading) return <p>Loading shop items...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shop Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item._id} className="border rounded-lg p-4 shadow-lg">
            <img
              src={`http://localhost:8000/${item.image}`}
              alt={item.title}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-green-600 font-bold">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopItems;
