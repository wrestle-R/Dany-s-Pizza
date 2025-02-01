  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { toast } from 'react-toastify';
  import { PlusCircle, MinusCircle, ShoppingCart, X, ChevronLeft, ChevronRight } from 'lucide-react';
  import { useCustomer } from '../../../context/customerContext';

  // MenuItem Component
  const MenuItem = ({ item, onAddToCart, onRemoveFromCart }) => (
    
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={`http://localhost:8000/api/${item.image}`}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate flex-1 pr-2">{item.name}</h3>
          <span className="text-blue-600 font-semibold">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(item.price)}
          </span>
        </div>
        <div className="flex gap-2 mb-3">
          {item.isPizza && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Pizza
            </span>
          )}
          {item.isVeg && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Vegetarian
            </span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(item._id)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );

  // Category Section Component
  const CategorySection = ({ title, items, onAddToCart, onRemoveFromCart }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <MenuItem 
            key={item._id} 
            item={item} 
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
        ))}
      </div>
    </div>
  );

  // Cart Sidebar Component
  const CartSidebar = ({ cart, onRemoveFromCart, onUpdateQuantity, formatPrice, isOpen, onClose }) => (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingCart size={24} />
            Your Cart
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {cart.items.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Your cart is empty
          </div>
        ) : (
          <>
            <ul className="space-y-4 flex-grow overflow-y-auto">
              {cart.items.map((item) => (
                <li key={item._id} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                          className="p-1 hover:bg-gray-200 rounded text-blue-600"
                        >
                          <MinusCircle size={18} />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded text-blue-600"
                        >
                          <PlusCircle size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveFromCart(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                      <div className="font-medium text-blue-600">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(cart.totalPrice)}</span>
              </div>
              <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
  const CartToggle = ({ itemCount, onClick, isOpen }) => (
    <button
      onClick={onClick}
      className={`fixed right-0 top-16 bg-blue-600 text-white py-2 px-4 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
    >
      <ShoppingCart size={20} />
      <span>Cart ({itemCount})</span>
      <ChevronLeft size={20} />
    </button>
  );

  // Main Component
  const CustomerMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const { customer } = useCustomer();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/cart/${customer.id}`);
        setCart(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching cart');
      }
    };

    const updateCartItemQuantity = async (menuItemId, quantity) => {
      try {
        if (quantity === 0) {
          await removeFromCart(menuItemId);
        } else {
          await axios.post('http://localhost:8000/api/cart/update-quantity', {
            customerId: customer.id,
            menuItemId,
            quantity
          });
          toast.success('Cart updated');
          fetchCart();
        }
      } catch (error) {
        toast.error('Error updating cart');
      }
    };

    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/owner/menu');
        setMenuItems(response.data);
      } catch (error) {
        toast.error('Error fetching menu items');
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (customer.id) {
        fetchMenuItems();
        fetchCart();
      }
    }, [customer.id]);

    const addToCart = async (menuItemId) => {
      try {
        await axios.post('http://localhost:8000/api/cart/add', {
          customerId: customer.id,
          menuItemId,
          quantity: 1,
        });
        toast.success('Item added to cart');
        fetchCart();
      } catch (error) {
        toast.error('Error adding item to cart');
      }
    };

    const removeFromCart = async (menuItemId) => {
      try {
        await axios.post('http://localhost:8000/api/cart/remove', {
          customerId: customer.id,
          menuItemId
        });
        toast.success('Item removed from cart');
        fetchCart();
      } catch (error) {
        toast.error('Error removing item from cart');
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(price);
    };

    // Categorize menu items
    const pizzaItems = menuItems.filter(item => item.isPizza);
    const nonPizzaItems = menuItems.filter(item => !item.isPizza);
    const vegItems = menuItems.filter(item => item.isVeg);

    return (
      <div className="max-w-7xl mx-auto p-6 pr-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Our Menu</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            <CategorySection
              title="Pizzas"
              items={pizzaItems}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
            />
            <CategorySection
              title="Non-Pizza Items"
              items={nonPizzaItems}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
            />
            <CategorySection
              title="Vegetarian Specials"
              items={vegItems}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
            />
          </div>
        )}

        <CartToggle 
          itemCount={cart.items.length}
          onClick={() => setIsCartOpen(true)}
          isOpen={isCartOpen}
        />

        <CartSidebar
          cart={cart}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateCartItemQuantity}
          formatPrice={formatPrice}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    );
  };

  export default CustomerMenu;