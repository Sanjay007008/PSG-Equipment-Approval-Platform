import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_BACKEND_API_URL;

// Fetch all transactions
export const fetchTransactions = async () => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.get(`${API_ENDPOINT}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Fetch pending approvals
export const fetchPendingApprovals = async () => {
  const token = localStorage.getItem('authToken');
  console.log("Token    :",token);
  try {
    const response = await axios.get(`${API_ENDPOINT}/transactions/pending-approval`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    throw error;
  }
};

// Approve a transaction
export const approveTransaction = async (transactionId) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.put(`${API_ENDPOINT}/transaction/approve/${transactionId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error approving transaction:', error);
    throw error;
  }
};

// Download request form
export const downloadRequestForm = async (transactionId) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.get(`${API_ENDPOINT}/request-form/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading request form:', error);
    throw error;
  }
};

// Reject a transaction
export const rejectTransaction = async (transactionId) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.put(`${API_ENDPOINT}/transaction/reject/${transactionId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error rejecting transaction:', error);
    throw error;
  }
};

export const submitTransaction = async (formData) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.post(`${API_ENDPOINT}/transaction`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message); // Throw the error for handling
  }
};

export const fetchLiveTransactions = async () => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.get(`${API_ENDPOINT}/transactions/live`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};

