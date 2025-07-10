import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_BACKEND_API_URL;

export const fetchUserInfo = async (accessToken) => {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };
  
  export const loginWithEmail = async (email) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}/login`, { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };