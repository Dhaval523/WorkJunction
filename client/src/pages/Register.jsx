import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaHammer, FaUser } from "react-icons/fa";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { signUp, googleSignUp } = useAuthStore();
    const navigate = useNavigate();

    const handleGoogleSignup = async () => {
        // Google OAuth implementation
        await googleSignUp(selectedRole);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password confirmation (assuming you have confirmPassword in formData)
        if (isNaN(formData.phone) || formData.phone.length !== 10) {
            alert("Invalid phone number!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const data = {
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
            role: selectedRole,
            phone: formData.phone,
        };

        const res = await signUp(data);
        
     

        console.log(res);
        
        if (res) {
            navigate("/verification");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
                <div className="bg-indigo-600 py-6 px-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Work Junction
                    </h1>
                    <p className="text-indigo-100 mt-2">
                        Find skilled workers or get hired
                    </p>
                </div>

                <div className="p-8">
                    {/* Role Selection */}
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            onClick={() => setSelectedRole("worker")}
                            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                                selectedRole === "worker"
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-gray-200 hover:border-indigo-300"
                            }`}
                        >
                            <div className="bg-indigo-100 p-3 rounded-full mb-2">
                                <FaHammer className="text-indigo-600 text-xl" />
                            </div>
                            <span className="font-medium">I'm a Worker</span>
                            <span className="text-xs text-gray-500 mt-1">
                                Offer my services
                            </span>
                        </button>

                        <button
                            onClick={() => setSelectedRole("customer")}
                            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                                selectedRole === "customer"
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-gray-200 hover:border-indigo-300"
                            }`}
                        >
                            <div className="bg-indigo-100 p-3 rounded-full mb-2">
                                <FaUser className="text-indigo-600 text-xl" />
                            </div>
                            <span className="font-medium">I'm a Customer</span>
                            <span className="text-xs text-gray-500 mt-1">
                                Find skilled workers
                            </span>
                        </button>
                    </div>

                    {/* Signup Form */}
                    {selectedRole && (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone No:
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                    />
                                </div>

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
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                                >
                                    Sign Up as{" "}
                                    {selectedRole === "worker"
                                        ? "Worker"
                                        : "Customer"}
                                </button>
                            </form>

                            <div className="flex items-center my-6">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-3 text-gray-500">or</span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            <button
                                onClick={handleGoogleSignup}
                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-300 shadow-sm"
                            >
                                <FcGoogle className="text-xl" />
                                Continue with Google
                            </button>

                            <p className="text-center text-sm text-gray-600 mt-6">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-indigo-600 hover:underline"
                                >
                                    Log in
                                </a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
