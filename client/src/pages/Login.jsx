import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login, user, googleLogin, getUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUser();
                if (user) {
                    redirectBasedOnRole(user);
                }
            } catch (error) {
                // Handle silently - user needs to login
            }
        };
        checkAuth();
    }, [user]);

    // Handle role-based navigation
    const redirectBasedOnRole = (user) => {
        if (user?.role === "worker") {
            navigate("/workerdashboard");
        } else if (user?.role === "customer") {
            navigate("/userdashboard");
        }
    };

    const handleGoogleLogin = async () => {
        await googleLogin();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await login(formData);
        if (user) {
            if (user?.role == "worker") {
                navigate("/workerdashboard");
            } else {
                navigate("/userdashboard");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                className="absolute top-20 left-20 w-16 h-16 bg-indigo-200 rounded-full opacity-20"
                animate={{
                    y: [0, 20, 0],
                    x: [0, 10, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-40 right-32 w-24 h-24 bg-blue-200 rounded-full opacity-20"
                animate={{
                    y: [0, -30, 0],
                    x: [0, -15, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md z-10">
                <div className="relative">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-8 px-8 text-center">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome Back
                        </h1>
                        <p className="text-blue-100 mt-2">
                            Log in to your KaamWale account
                        </p>
                    </div>
                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                        <div className="w-10 h-10 bg-white rotate-45"></div>
                    </div>
                </div>

                <div className="p-8 pt-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="/forgot-password"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-300 shadow-sm"
                    >
                        <FcGoogle className="text-xl" />
                        Continue with Google
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <a
                            href="/signup"
                            className="text-indigo-600 hover:underline"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
