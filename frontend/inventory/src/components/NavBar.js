import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import Home from './Home';
import { Records } from './Records';
import { Users } from './Users';
import { Equipments } from './Equipments';
import { NewRequestForm } from './NewRequestForm';
import NewEquipmentForm from './NewEquipmentForm';
import NewUserForm from './NewUserForm';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [activeComponent, setActiveComponent] = useState('Home');
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewEquipmentForm, setShowNewEquipmentForm] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token from localStorage
    navigate('/'); // Redirect to login page
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Home':
        return <Home />;
      case 'Equipments':
        return <Equipments />;
      case 'Records':
        return <Records />;
      case 'Users':
        return <Users />;
      default:
        return <Home />;
    }
  };

  const { user } = useUser();

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: 'rgb(55, 81, 126)' }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexGrow: 1,
            }}
          >
            <Button
              color="inherit"
              sx={{ fontSize: '16px', mx: 1 }}
              onClick={() => setActiveComponent('Home')}
            >
              Home
            </Button>
            <Button
              color="inherit"
              sx={{ fontSize: '16px', mx: 1 }}
              onClick={() => setActiveComponent('Equipments')}
            >
              Equipments
            </Button>
            <Button
              color="inherit"
              sx={{ fontSize: '16px', mx: 1 }}
              onClick={() => setActiveComponent('Records')}
            >
              Records
            </Button>
            {user?.role === 'FACULTY' && (
              <Button
                color="inherit"
                sx={{ fontSize: '16px', mx: 1 }}
                onClick={() => setActiveComponent('Users')}
              >
                Users
              </Button>
            )}
            {user?.role === 'STAFF' && (
              <Button
                color="inherit"
                sx={{ fontSize: '16px', mx: 1 }}
                onClick={() => setShowNewRequestForm(true)} // Open the NewRequestForm popup
              >
                New Request
              </Button>
            )}
            {user?.role === 'FACULTY' && (
              <Button
                color="inherit"
                sx={{ fontSize: '16px', mx: 1 }}
                onClick={() => setShowNewEquipmentForm(true)}
              >
                Add Equipment
              </Button>
            )}
            {user?.role === 'FACULTY' && (
              <Button
                color="inherit"
                sx={{ fontSize: '16px', mx: 1 }}
                onClick={() => setShowNewUserForm(true)}
              >
                Add User
              </Button>
            )}
            <Button
              color="inherit"
              sx={{ fontSize: '16px', mx: 1 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          padding: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh', // Adjust the height as needed to center the content
        }}
      >
        {renderComponent()}
      </Box>

      {showNewRequestForm && (
        <NewRequestForm isOpen={showNewRequestForm} togglePopup={() => setShowNewRequestForm(false)} />
      )}

      {showNewUserForm && (
        <NewUserForm isOpen={showNewUserForm} togglePopup={() => setShowNewUserForm(false)} />
      )}

      {showNewEquipmentForm && (
        <NewEquipmentForm isOpen={showNewEquipmentForm} togglePopup={() => setShowNewEquipmentForm(false)} />
      )}

    </div>
  );
};

export default NavBar;
