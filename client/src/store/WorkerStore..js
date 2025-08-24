import { create } from "zustand";
import axiosInstance from "../Helper/AxioInstanse";
import toast from "react-hot-toast";

const useWorkerStore = create((set) => ({
    worker: null,
    isLoading: false,
    verificationStatus: null,

    getWorkerData: async () => {
        try {
            const response = await axiosInstance.get("/api/workers");
            set({ worker: response.data });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch worker data:", error);
            toast.error("Failed to fetch worker data");
            return null;
        }
    },

    acceptTnC: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post(
                "/api/workers/accept-tnc"
            );
            set({ worker: response.data.worker });
            return response.data;
        } catch (error) {
            console.error(
                "TnC acceptance failed:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    uploadAadharDoc: async (file) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.post(
                "/api/workers/upload-aadhar",
                formData
            );
            set({ worker: { ...response.data.worker } });
            return response.data;
        } catch (error) {
            console.error(
                "Aadhar upload failed:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    uploadPoliceVerification: async (file) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.post(
                "/api/workers/upload-police-verification",
                formData
            );
            set({ worker: { ...response.data.worker } });
            return response.data;
        } catch (error) {
            console.error(
                "Police verification upload failed:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getVerificationStatus: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(
                "/api/workers/verification-status"
            );
            set({ verificationStatus: response.data.verificationStatus });
            return response.data;
        } catch (error) {
            console.error(
                "Status check failed:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    getCurrentStage: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(
                "/api/workers/current-stage"
            );
            return response.data;
        } catch (error) {
            console.error(
                "Failed to fetch current stage:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    updateWorkerProfile: async (profileData) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.patch(
                "/api/workers/profile",
                profileData
            );
            set({ worker: response.data.worker });
            return response.data;
        } catch (error) {
            console.error(
                "Profile update failed:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useWorkerStore;
