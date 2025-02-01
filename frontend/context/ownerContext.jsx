import React, { createContext, useState, useContext, useEffect } from 'react';

const OwnerContext = createContext();

const OwnerProvider = ({ children }) => {
  const [owner, setOwner] = useState(() => {
    // Load owner from localStorage if available
    const storedOwner = localStorage.getItem('owner');
    return storedOwner ? JSON.parse(storedOwner) : null;
  });

  useEffect(() => {
    if (owner) {
      localStorage.setItem('owner', JSON.stringify(owner)); // Save when logged in
    } else {
      localStorage.removeItem('owner'); // Remove when logged out
    }
  }, [owner]);

  // Logout function
  const ownerLogout = () => {
    setOwner(null);
    localStorage.removeItem('owner');
  };

  return (
    <OwnerContext.Provider value={{ owner, setOwner, ownerLogout }}>
      {children}
    </OwnerContext.Provider>
  );
};

// Custom hook to use the owner context
const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return context;
};

export { OwnerProvider, useOwner };
export default OwnerContext;
