import axios from 'axios';
import { Student } from './@/types/student';

interface PaginationParams {
    page: number;
    pageSize: number;
    search?: string;
}

const API_URL = 'http://localhost:5001/students';

// Get all students with pagination
export const getStudents = async (params: PaginationParams) => {
    const response = await axios.get(API_URL, {
        params: {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search
        },
    });
    return {
        data: response.data.items,
        total: response.data.total,
    };
};

// Get a student by id
export const getStudentById = async (id: string): Promise<Student> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Optionally, if you need create, update, delete methods in the future:

// Create a new student
export const createStudent = async (studentData: Partial<Student>): Promise<Student> => {
    const response = await axios.post(API_URL, studentData);
    return response.data;
};

// Update an existing student
export const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
    const response = await axios.patch(`${API_URL}/${id}`, studentData);
    return response.data;
};

// Delete a student
export const deleteStudent = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

export const searchStudents = async (query: string) => {
    const response = await axios.get(`${API_URL}/search`, {
      params: { search: query }
    });
    return response.data;
  };