import axios from 'axios';

interface PaginationParams {
    page: number;
    pageSize: number;
    search?: string;
}

const API_URL = 'http://localhost:5001/teachers';

export const getTeachers = async (params: PaginationParams) => {
    const response = await axios.get(API_URL, {
        params: {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search
        },
    });
    return {
        data: response.data.data,
        total: response.data.metadata.total,
    };
};