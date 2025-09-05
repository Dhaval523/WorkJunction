import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiKey } from 'react-icons/fi';
import { motion } from "framer-motion";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate, Link } from "react-router-dom";
import { clsx } from 'clsx';

// --- Reusable Components Styled for the "airportr" Theme ---

const Input = ({ label, type = 'text', name, placeholder, value, onChange, icon }) => (
    <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                className="w-full pl-11 pr-4 py-3 bg-white/10 text-white rounded-xl border-2 border-white/20 focus:ring-2 focus:ring-[#7b61ff]/50 focus:border-[#7b61ff] transition placeholder:text-gray-400"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
            />
        </div>
    </div>
);

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseClasses = "w-full px-6 py-3.5 font-bold rounded-xl text-base transition-all flex items-center justify-center gap-2.5";
    const variants = {
        primary: "text-white bg-[#7b61ff] hover:bg-[#6a50e0]",
        secondary: "text-white bg-white/10 border-2 border-white/20 hover:bg-white/20",
    };
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={clsx(baseClasses, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};


// --- Main Login Page Component ---

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);

    const { login, googleLogin, getUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getUser();
                if (user) redirectBasedOnRole(user);
            } catch (error) {
                // User is not logged in, which is expected.
            }
        };
        checkAuth();
    }, [getUser, navigate]);

    const redirectBasedOnRole = (user) => {
        if (user?.role === "worker" ) {
            navigate("/workerdashboard");
        } else if (user?.role === "customer") {
            navigate("/userdashboard");
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        await googleLogin();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const user = await login(formData);
            if (user) {
                redirectBasedOnRole(user);
            }
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        }
    };

    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="min-h-screen w-full bg-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00c6ff]/20 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-[#7b61ff]/20 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
            
            <div className="relative flex items-center">
                 {/* 3D Visual Element */}
                <motion.div 
                    className="hidden lg:block relative -mr-16 z-20"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut"}}
                >
                    <div className="w-40 h-40 bg-gradient-to-br from-[#00c6ff] to-[#7b61ff] rounded-3xl shadow-2xl flex items-center justify-center transform rotate-12">
                        <FiKey size={64} className="text-white/80" />
                    </div>
                </motion.div>

                <motion.div 
                    className="w-full max-w-md bg-[#0f0f3b] text-white border border-white/10 rounded-3xl shadow-2xl overflow-hidden transform rotate-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="p-8 md:p-10 transform -rotate-1">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-[#7b61ff] font-bold text-xl">WJ</span>
                                </div>
                                <h1 className="text-3xl font-extrabold text-white">WorkJunction</h1>
                            </div>
                            <p className="text-gray-300">Welcome back! Log in to continue.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input label="Email Address" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleFormChange} icon={<FiMail />} />
                            <Input label="Password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleFormChange} icon={<FiLock />} />
                            
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-500 bg-white/20 text-[#7b61ff] focus:ring-[#7b61ff]"
                                    />
                                    <label htmlFor="remember-me" className="text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="font-semibold text-gray-300 hover:text-white hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="pt-2">
                                <Button type="submit">Log In</Button>
                            </div>
                        </form>
                        
                        {error && (
                            <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
                        )}

                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-white/20"></div>
                            <span className="px-3 text-gray-400 text-sm font-medium">OR</span>
                            <div className="flex-1 border-t border-white/20"></div>
                        </div>
                        
                        <Button onClick={handleGoogleLogin} variant="secondary">
                            <FcGoogle size={22} /> Continue with Google
                        </Button>
                        
                        <p className="text-center text-sm text-gray-300 mt-8">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-semibold text-white hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;