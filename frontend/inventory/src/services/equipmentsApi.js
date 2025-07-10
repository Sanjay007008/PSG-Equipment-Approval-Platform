import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_BACKEND_API_URL;

export const fetchAvailableEquipment = async () => {
  const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${API_ENDPOINT}/equipments/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Return the data
    } catch (error) {
      throw new Error(error.response?.data || error.message); // Throw the error for handling
    }
  };

  export const submitEquipment = async (formData) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/equipment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };

  export const fetchEquipments = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${API_ENDPOINT}/equipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };