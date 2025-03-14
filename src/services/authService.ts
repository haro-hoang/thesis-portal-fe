import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const loginWithAzure = async (code: string) => {
    const response = await axios.post(`${API_URL}/azure-login`, { code });
    return response.data;
};

export const getProfile = async (token: string) => {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };