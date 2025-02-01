import React, { createContext, useState, useContext, useEffect } from 'react';

const CustomerContext = createContext();

const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    // Load customer from localStorage if available
    const storedCustomer = localStorage.getItem('customer');
    return storedCustomer ? JSON.parse(storedCustomer) : null;
  });

  useEffect(() => {
    if (customer) {
      localStorage.setItem('customer', JSON.stringify(customer)); // Save when logged in
    } else {
      localStorage.removeItem('customer'); // Remove when logged out
    }
  }, [customer]);

  // ✅ Logout function (defined inside the provider)
  const customerLogout = () => {
    console.log(customer)
    setCustomer(null);
    console.log(customer)

    localStorage.removeItem('customer');
  };

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, customerLogout }}>
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the customer context
const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export { CustomerProvider, useCustomer };
export default CustomerContext;
