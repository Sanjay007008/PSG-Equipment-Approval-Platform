// App.js
import React , {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';

const App = () => {

  useEffect(() => {
    // Add event listener to delete token on tab close
    const removeTokenOnTabClose = () => {
      window.addEventListener('beforeunload', () => {
        localStorage.removeItem('authToken'); // Remove the token
      });
    };

    removeTokenOnTabClose();

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', removeTokenOnTabClose);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={Dashboard} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
