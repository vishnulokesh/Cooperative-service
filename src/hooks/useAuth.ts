import { useState, useEffect } from 'react';

// Placeholder custom hook
export const useAuth = () => {
  const [user] = useState(null);
  
  useEffect(() => {
    // Auth logic will go here
  }, []);

  return { user };
};
