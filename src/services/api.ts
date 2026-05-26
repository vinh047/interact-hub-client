import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 500000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    // 1. Kiểm tra xem API này có trả về header phân trang không
    const paginationHeader = response.headers["x-pagination"];
    
    // 2. Nếu CÓ, ta tự động bọc data và pagination thành một Object chuẩn
    if (paginationHeader) {
      return {
        data: response.data,
        pagination: JSON.parse(paginationHeader)
      };
    }
    
    // 3. Nếu KHÔNG (như Auth), vẫn trả về data nguyên bản như cũ, không làm chết code cũ!
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Hết phiên đăng nhập. Vui lòng đăng nhập lại.");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;