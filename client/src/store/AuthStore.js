import { create } from "zustand";
import axiosInstance from "../Helper/AxioInstanse";
import toast from "react-hot-toast";
const useAuthStore = create((set, get) => ({
    user: null,
    isSignUp: false,
    isLogin: false,

    signUp: async (data) => {
        set({ isSignUp: true });
        try {
            const response = await axiosInstance.post(
                "/api/auth/sign-up",
                data
            );
            set({ user: response.data.user });
            return response?.data?.user;
        } catch (error) {
            console.error(
                "Signup failed:",
                error?.response?.data || error.message
            );
            return null;
        } finally {
            set({ isSignUp: false });
        }
    },

    login: async (data) => {
        set({ isLogin: true });
        try {
            const response = await axiosInstance.post(
                "/api/auth/sign-in",
                data
            );
            set({ user: response.data.user });
            toast.success("Login Successful");
            return response?.data?.user;
        } catch (error) {
            set({ user: null });
            console.error(
                "Login failed:",
                error?.response?.data || error.message
            );
            toast.error(error?.response?.data?.message);
            return null;
        } finally {
            set({ isLogin: false });
        }
    },

    googleLogin: async () => {
        set({ isLogin: true });
        try {
            window.location.href =
                "http://localhost:5076/api/auth/google-login";
        } catch (error) {
            set({ user: null });
            console.error(
                "Login failed:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isLogin: false });
        }
    },

    googleSignUp: async (role) => {
        set({ isSignUp: true });
        try {
            window.location.href = `http://localhost:5076/api/auth/google-signup?role=${role}`;
            // hit me endpoint
        } catch (error) {
            set({ user: null });
            console.error(
                "Sign Up failed:",
                error?.response?.data || error.message
            );
            throw error;
        } finally {
            set({ isSignUp: false });
        }
    },

    getUser: async () => {
        try {
            const response = await axiosInstance.get("/api/auth/user");
            set({ user: response.data.user });
        } catch (error) {
            set({ user: null });
            console.error(
                "Fetching User failed:",
                error?.response?.data || error.message
            );
            throw error;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/api/auth/log-out");
        } catch (error) {
            console.error(
                "Logout failed:",
                error?.response?.data || error.message
            );
            throw error;
        }
    },

    sendOtp: async ({ mobileNumber }) => {
        try {
            const response = await axiosInstance.post("/api/auth/send-otp", {
                mobileNumber,
            });
            toast.success(response.data.message);
        } catch (error) {
            console.error(
                "Failes to send otp",
                error?.response?.data || error.message
            );
            throw error;
        }
    },

    verifyOtp: async ({ otp, mobileNumber }) => {
        try {
            const response = await axiosInstance.post("/api/auth/verify-otp", {
                otp,
                mobileNumber,
            });
            toast.success(response.data.message);
        } catch (error) {
            console.error(
                "Failed to verify otp",
                error?.response?.data || error.message
            );
            toast.error(error?.response?.data?.message);
        }
    },
}));

export { useAuthStore };
