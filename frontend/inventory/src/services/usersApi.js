import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_BACKEND_API_URL;

const token = localStorage.getItem('authToken');

// Function to add a new user
export const addUser = async (formData) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/user`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to fetch users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
