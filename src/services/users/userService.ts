import axios from 'axios';
import { CreateUserDto, UpdateUserDto, User } from './@/types/user';

interface PaginationParams {
    page: number;
    pageSize: number;
}

const API_URL = 'http://localhost:5001/user';

// Get all users with pagination
export const getUsers = async (params: PaginationParams) => {
    const response = await axios.get(API_URL, {
        params: {
            page: params.page,
            pageSize: params.pageSize,
        },
    });
    return {
        data: response.data.items,
        total: response.data.total,
    };
};

// Get a user by id
export const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Create a new user
export const createUser = async (userData: CreateUserDto): Promise<User> => {
    const response = await axios.post(API_URL, userData);
    return response.data;
};

// Update an existing user
export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
    const response = await axios.patch(`${API_URL}/${id}`, userData);
    return response.data;
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

export const updateToggleStatus = async (id: string, status: boolean): Promise<User> => {
    const response = await axios.patch(`${API_URL}/${id}/toggle-status`, { status });
    return response.data;
};