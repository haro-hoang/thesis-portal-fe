import axios from 'axios';
import { CreateGraduationThesisDto, GraduationThesis, UpdateGraduationThesisDto } from './@/types/graduation-thesis';

interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
}

const API_URL = 'http://localhost:5001/graduation-theses';

export const getTheses = async (params: PaginationParams) => {
  const response = await axios.get(API_URL, {
    params: {
      page: params.page,
      limit: params.pageSize,
      search: params.search
    },
  });
  return {
    data: response.data.data,
    total: response.data.metadata.total,
  };
};

export const getThesisById = async (id: string): Promise<GraduationThesis> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createThesis = async (data: CreateGraduationThesisDto): Promise<GraduationThesis> => {
  console.log('new', data);
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateThesis = async (id: string, data: UpdateGraduationThesisDto): Promise<GraduationThesis> => {
  console.log('edit', data);
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteThesis = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};