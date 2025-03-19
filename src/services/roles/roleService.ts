import axios from 'axios';
import { CreateRoleDto, Role, UpdateRoleDto } from './@/types/role';

const API_URL = 'http://localhost:5001/role';
interface PaginationParams {
    page: number;
    pageSize: number;
}

// Get all roles
export const getRoles = async ({ page, pageSize }: PaginationParams) => {
    const response = await axios.get(API_URL, {
        params: {
            page,
            pageSize: pageSize
        }
    });
    return {
        data: response.data.items,
        total: response.data.total
    };
};

// Get role by id
export const getRoleById = async (id: string): Promise<Role> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Create a new role
export const createRole = async (role: CreateRoleDto): Promise<Role> => {
    const response = await axios.post(API_URL, role);
    return response.data;
};

// Create multiple roles
export const createManyRoles = async (roles: CreateRoleDto[]): Promise<Role[]> => {
    const response = await axios.post(`${API_URL}/bulk`, roles);
    return response.data;
};

// Update a role
export const updateRole = async (id: string, role: UpdateRoleDto): Promise<Role> => {
    const response = await axios.patch(`${API_URL}/${id}`, role);
    return response.data;
};

// Delete a role
export const deleteRole = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};