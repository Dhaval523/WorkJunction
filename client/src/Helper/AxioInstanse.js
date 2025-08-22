import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // backend
  withCredentials: true,            // ✅ send cookies
});

export default axiosInstance;
