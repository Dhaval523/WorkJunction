import axios from "axios";

const axiosInstance = axios.create({
<<<<<<< HEAD
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
=======
  baseURL: "http://localhost:3000", // backend
  withCredentials: true,            // ✅ send cookies
>>>>>>> 8e47109c94d1ba857991aaec1a720c0c8407c7d9
});

export default axiosInstance;
