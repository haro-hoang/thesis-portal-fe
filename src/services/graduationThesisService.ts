import axios from 'axios';

const API_URL = 'http://localhost:5001/api/graduation-theses';

export const getTheses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getThesisById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createThesis = async (thesis: any) => {
  const response = await axios.post(API_URL, thesis);
  return response.data;
};

export const updateThesis = async (id: string, thesis: any) => {
  const response = await axios.put(`${API_URL}/${id}`, thesis);
  return response.data;
};

export const deleteThesis = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};