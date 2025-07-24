import { create } from "zustand";
import axiosInstance from "../Helper/AxioInstanse";
const useAuthStore = create(( set , get) => ({
    user: null,
    isSignUp: false,
    isLogin: false,
  
    signUp: async (data) => {
      set({ isSignUp: true });
      try {
        const response = await axiosInstance.post("/api/auth/signUp", data);
        return response.data;
      } catch (error) {
        console.error("Signup failed:", error?.response?.data || error.message);
      } finally {
        set({ isSignUp: false });
      }
    },
  
    login: async (data) => {
      set({ isLogin: true });
      try {
        const response = await axiosInstance.post("/api/auth/login", data);
        set({ user: response.data.data });
        return response.data ;
      } catch (error) {
        set({ user: null });
        console.error("Login failed:", error?.response?.data || error.message);
        throw error;
      } finally {
        set({ isLogin: false });
      }
    },

    googleLogin : async() => {
        set({ isLogin: true });
      try {
        window.location.href = "http://localhost:5076/api/auth/google-login";
        
      } catch (error) {
        set({ user: null });
        console.error("Login failed:", error?.response?.data || error.message);
        throw error;
      } finally {
        set({ isLogin: false });
      }
    } ,

    googleSignUp : async(role) => {
      set({ isSignUp: true });
      try {
        window.location.href = `http://localhost:5076/api/auth/google-signup?role=${role}`;
        // hit me endpoint
        
      } catch (error) {
        set({ user: null });
        console.error("Sign Up failed:", error?.response?.data || error.message);
        throw error;
      } finally {
        set({ isSignUp: false });
      }
    } ,

    getUser : async () => {
      try {
        const response = await axiosInstance.get("/api/auth/me");
        console.log(response)
        set({ user: response.data.data });
      } catch (error) {
        set({ user: null });
        console.error("Fetching User failed:", error?.response?.data || error.message);
        throw error;
      }
    },

    logout : async () => {
      try {
        await axiosInstance.get("/api/auth/log-out");
        
      } catch (error) {
        console.error("Logout failed:", error?.response?.data || error.message);
        throw error;
      }
    }
}));

  
  export {
    useAuthStore
  }