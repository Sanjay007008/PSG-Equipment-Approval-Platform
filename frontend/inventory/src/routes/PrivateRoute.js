import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const { exp } = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (exp <= currentTime) {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            alert('Your session has expired. Please log in again.');
            navigate('/');
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          alert('Session validation error. Please log in again.');
          navigate('/');
        }
      } else {
        setIsAuthenticated(false);
        navigate('/');
      }
      setLoading(false);
    };

    // Initial token check
    checkTokenExpiration();

    // Periodic token check every minute
    const interval = setInterval(checkTokenExpiration, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
