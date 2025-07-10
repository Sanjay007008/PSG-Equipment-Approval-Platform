import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import psg_logo from '../assets/images/psg_logo.jpg';
import { useUser } from '../context/UserContext';

const LogoImage = styled('img')({
  width: '6em',
  height: '6em',
  marginRight: '16px',
});

const LogoBar = () => {
  const { user } = useUser();

  return (
    <AppBar position="static" style={{ backgroundColor: 'rgb(55, 81, 126)', height: '8em', padding: '1em' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LogoImage src={psg_logo} alt="Logo" />
        <Box display="flex" flexDirection="column" alignItems="center" flexGrow={1}>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontSize: '2rem', textAlign: 'center' }} // Center text alignment
          >
            PSG College of Technology
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontSize: '1.5rem', textAlign: 'center' }} // Center text alignment
            style={{ padding: '0.5em' }}
          >
            CIRD Equipment Management System
          </Typography>
        </Box>
        { user &&
        <Box display="flex" flexDirection="column" alignItems="flex-end" style={{ textAlign: 'right' }}>
          <Typography variant="body1" component="div" sx={{ fontSize: '1.25rem' }}>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" component="div" sx={{ fontSize: '1.25rem' }}>
            {user?.email}
          </Typography>
          <Typography variant="body2" component="div" sx={{ fontSize: '1.25rem' }}>
            {user?.role}
          </Typography>
        </Box>
        }
      </Toolbar>
    </AppBar>
  );
};

export default LogoBar;
