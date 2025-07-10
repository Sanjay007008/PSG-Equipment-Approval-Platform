import React from 'react';
import LogoBar from '../components/LogoBar';
import GoogleLoginComponent from '../components/GoogleLogin';
import { UserProvider } from '../context/UserContext';
import { Box } from '@mui/material';

const LoginPage = () => {
  return (
    <UserProvider>
      <LogoBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '20px'
        }}
      >
        <Box sx={{ marginTop: '20px' }}>
          <GoogleLoginComponent />
        </Box>
      </Box>
    </UserProvider>
  );
};

export default LoginPage;
