import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Base URL diatur di sini
  timeout: 10000, // ⏱️ Timeout 10 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor untuk request (misalnya, menambahkan token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor untuk response (error handling global)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, silakan login ulang.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
