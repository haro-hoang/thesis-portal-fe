import { apiClient } from '../apiClient';
import { ThesisEvaluation } from './types';

export const getThesisEvaluation = async (thesisId: string): Promise<ThesisEvaluation | null> => {
  const response = await apiClient.get(`/thesis-evaluations?thesisId=${thesisId}`);
  // Return the first evaluation found or null if none exist
  return response.data.length > 0 ? response.data[0] : null;
};

export const createThesisEvaluation = async (data: Omit<ThesisEvaluation, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await apiClient.post('/thesis-evaluations', data);
  return response.data;
};

export const updateThesisEvaluation = async (id: string, data: Partial<ThesisEvaluation>) => {
  const response = await apiClient.put(`/thesis-evaluations/${id}`, data);
  return response.data;
};
