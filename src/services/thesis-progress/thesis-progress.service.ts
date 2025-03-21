import { apiClient } from '../apiClient';
import { ThesisProgressLog } from './types';

export const getThesisProgressLogs = async (thesisId: string) => {
  const response = await apiClient.get(`/thesis-progress-logs?thesisId=${thesisId}`);
  return response.data;
};

export const createProgressLog = async (data: Omit<ThesisProgressLog, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await apiClient.post(`/thesis-progress-logs`, data);
  return response.data;
};

export const updateProgressLog = async (id: string, data: Partial<ThesisProgressLog>) => {
  const response = await apiClient.put(`/thesis-progress-logs/${id}`, data);
  return response.data;
};

export const deleteProgressLog = async (id: string) => {
  const response = await apiClient.delete(`/thesis-progress-logs/${id}`);
  return response.data;
};
