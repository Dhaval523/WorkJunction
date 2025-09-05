import { create } from "zustand";
import axiosInstance from "../Helper/AxioInstanse";
import toast from "react-hot-toast";

const useWorkerStore = create((set, get) => ({
    worker: null,
    isLoading: false,
    verificationStatus: null,
    services: [],

    getWorkerServices: async () => {
        set({ isLoading: true });
        try {
            const worker = get().worker;
            if (!worker) {
                await get().getWorkerData();
            }
            const response = await axiosInstance.get("/api/workers/services");
            set({ services: response.data.services });
            return response.data.services;
        } catch (error) {
            console.error("Failed to fetch services:", error);
            toast.error("Failed to fetch services");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    addService: async (serviceData) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post(
                "/api/workers/services",
                serviceData
            );
            set((state) => ({
                services: [...state.services, response.data.service],
            }));
            toast.success("Service added successfully");
            return response.data.service;
        } catch (error) {
            console.error("Failed to add service:", error);
            toast.error("Failed to add service");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    editService: async (serviceId, serviceData) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.patch(
                `/api/workers/services/${serviceId}`,
                serviceData
            );

            set((state) => ({
                services: state.services.map((service) =>
                    service._id === serviceId ? response.data.service : service
                ),
            }));

            toast.success("Service updated successfully");
            return response.data.service;
        } catch (error) {
            console.error("Failed to update service:", error);
            toast.error("Failed to update service");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

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
    uploadProfilePhoto: async (file) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.post(
                "/api/workers/upload-profile-photo",
                formData
            );
            set({ worker: { ...response.data.worker } });
            return response.data;
        } catch (error) {
            console.error(
                "Profile photo upload failed:",
                error?.response?.data || error.message
            );
            toast.error("Failed to upload profile photo");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useWorkerStore;
