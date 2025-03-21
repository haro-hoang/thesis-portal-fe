import axios from 'axios';

// Tạo một instance của axios với URL cơ sở và các cấu hình mặc định
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor cho request để tự động thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response để xử lý các lỗi từ API
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi không được xác thực (401)
    if (error.response && error.response.status === 401) {
      // Xóa token trong localStorage
      localStorage.removeItem('token');
      // Chuyển hướng về trang đăng nhập
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
); 