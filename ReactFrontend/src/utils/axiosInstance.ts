import axios from "axios";

// สร้าง instance ของ axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_NEST_BACKEND_API_URL, // URL ของ backend
  // timeout: 10000, // ตั้ง timeout (ตัวเลือก)
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Interceptor สำหรับใส่ Authorization Header
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // ดึง token จาก Local Storage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; // ใส่ token ใน header
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
