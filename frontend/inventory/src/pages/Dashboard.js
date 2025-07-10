import React from 'react';
import LogoBar from '../components/LogoBar';
import NavBar from '../components/NavBar';
import { UserProvider } from '../context/UserContext';

const Dashboard = () => {

  return (
    <div style={{width:'100%'}}>
      <UserProvider>
        <LogoBar />
        <NavBar />
      </UserProvider>
    </div>
  );
};

export default Dashboard;
