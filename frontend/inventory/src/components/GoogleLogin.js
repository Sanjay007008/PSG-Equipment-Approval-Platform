import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import google_logo from '../assets/images/google_logo.png';
import { fetchUserInfo, loginWithEmail } from '../services/loginApi';

// Inline styles for the button
const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px',
  padding: '10px 20px',
  backgroundColor: '#4285F4', // Google Blue
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  width: '100%',
  maxWidth: '300px',
  justifyContent: 'center',
};

// Inline styles for the Google logo
const logoStyle = {
  width: '20px',
  height: '20px',
  marginRight: '10px',
};

const GoogleLoginComponent = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        // Use the access token to fetch the user's profile information
        const { access_token } = tokenResponse;
        const userInfo = await fetchUserInfo(access_token);

        const email = userInfo.email;

        try {
          // Send the email to your backend API
          const result = await loginWithEmail(email);
          
          if (result.token) {
            localStorage.setItem('authToken', result.token);
            navigate('/dashboard');
          } else {
            console.error('Authentication failed');
          }

        } catch (error) {
          console.error('Login error', error);
        }

      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },
  });

  return (
    <button style={buttonStyle} onClick={() => login()}>
      <img
        src={google_logo}
        alt="Google logo"
        style={logoStyle}
      />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginComponent;
