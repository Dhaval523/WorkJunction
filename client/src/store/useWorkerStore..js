import { create } from "zustand";
import axiosInstance from "../Helper/AxioInstanse";
import Cookies from "js-cookie";

const useWorkerStore = create((set) => ({
    worker: null,
    isLoading: false,
    uploadPoliceVerification: async (file) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("file", file);

            // Get token from cookies
            const token = localStorage.getItem("token");
            console.log("Token from cookies:", token);

            const response = await axiosInstance.post(
                "/api/workers/upload-police-verification",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`, // Include token in Authorization header
                    },
                }
            );


            return response.data;
        } catch (error) {
            console.error(
                "Upload failed:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useWorkerStore;
