import { useEffect, useState } from "react";
import axios from "axios";
import { useCustomer } from '../../../context/customerContext';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const ShopWithCart = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const { customer } = useCustomer();


  const navigate = useNavigate();
    

  useEffect(() => {
    if (!customer) {
      navigate('/login');
      toast.error('Login as customer to continue');
    }
  }, [customer, navigate]);
  const fetchCart = async () => {
    if (customer) {
      try {
        const response = await axios.get(`http://localhost:8000/api/shop/cart?customerId=${customer.id}`);
        setCart(response.data.items);
      } catch (error) {
        toast.error("Failed to load cart");
      }
    }
  };

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

  useEffect(() => {
    fetchCart();
  }, [customer]);

  const handleAddToCart = async (itemId) => {
    try {
      await axios.post("http://localhost:8000/api/shop/cart/add", 
        { customerId: customer.id, shopItemId: itemId, quantity: 1 }
      );
      await fetchCart();
      toast.success("Item added to cart");
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.delete("http://localhost:8000/api/shop/cart/remove", 
        { data: { customerId: customer.id, itemId } }
      );
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      await axios.put("http://localhost:8000/api/shop/cart/update", 
        { customerId: customer.id, itemId, quantity }
      );
      await fetchCart();
      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading shop items...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="relative min-h-screen">
      {/* Shop Items Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Shop Items</h2>
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed top-16 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-20"
        >
          Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
        </button>

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
              <button
                onClick={() => handleAddToCart(item._id)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed top-0 right-0 bg-white shadow-lg w-80 h-full z-10 transition-transform transform translate-x-0 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-2xl hover:text-gray-700"
                aria-label="Close cart"
              >
                ×
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.shopItemId._id} className="flex flex-col border rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`http://localhost:8000/${item.shopItemId.image}`}
                        alt={item.shopItemId.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.shopItemId.title}</h3>
                        <p className="text-green-600">₹{item.shopItemId.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.shopItemId._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.shopItemId._id, item.quantity + 1)}
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.shopItemId._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Total:</span>
                    <span className="text-green-600 font-bold text-lg">
                      ₹{cart.reduce(
                        (total, item) => total + item.shopItemId.price * item.quantity,
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopWithCart;