import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../../context/customerContext';
import { useOwner } from '../../context/ownerContext';
import { 
  Menu, X, User, LogOut, Store, Coffee, Star, Info, Calendar, ChefHat 
} from 'lucide-react';

const Navbar = () => {
  const { customer, customerLogout } = useCustomer();
  const { owner, ownerLogout } = useOwner();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (customer) customerLogout();
    if (owner) ownerLogout();
    setIsMobileMenuOpen(false);
  };

  // Common structure for both Customer & Owner links
  const commonNavLinks = [
    { name: 'Chefs', path: '/chefs', ownerPath: '/owner-chef', icon: <ChefHat className="w-5 h-5" /> },
    { name: 'Menu', path: '/menu', ownerPath: '/owner-menu', icon: <Coffee className="w-5 h-5" /> },
    { name: 'Events', path: '/events', ownerPath: '/events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Shop', path: '/shop', ownerPath: '/owner-shop', icon: <Store className="w-5 h-5" /> },
    { name: 'Reviews', path: '/reviews', ownerPath: '/owner-reviews', icon: <Star className="w-5 h-5" /> },
  ];

  return (
    <nav className="relative bg-gradient-to-r from-blue-950 to-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to={owner ? "/owner-hero" : customer ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300">
              Dany's Pizza
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Show navigation only if logged in */}
            {(customer || owner) && (
              <div className="flex items-center space-x-6">
                {commonNavLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={owner ? link.ownerPath : link.path} 
                    className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* User Authentication Section */}
            {customer || owner ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-200">{owner ? 'Owner' : 'Customer'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-white transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/register" className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-medium transition-all duration-200">
                  Register
                </Link>
                <Link to="/login" className="px-4 py-2 rounded-lg border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-blue-900 font-medium transition-all duration-200">
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            {/* Show navigation only if logged in */}
            {(customer || owner) && (
              <div className="space-y-2 pb-4">
                {commonNavLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={owner ? link.ownerPath : link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-yellow-400 rounded-lg transition-colors duration-200"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Logout button for logged-in users */}
            {(customer || owner) && (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 mt-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-white transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
