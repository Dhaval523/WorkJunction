import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaHammer, FaUser } from "react-icons/fa";
import { FiMail, FiLock, FiPhone, FiUser as FiUserIcon } from 'react-icons/fi';
import { useAuthStore } from "../store/AuthStore";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from 'clsx';

// --- Reusable Components Styled to Match the Image ---

const Input = ({ label, type = 'text', name, placeholder, value, onChange, icon }) => (
    <div>
        <label className="block text-sm font-semibold text-zinc-600 mb-1.5">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                className="w-full pl-11 pr-4 py-3 bg-zinc-100 text-zinc-800 rounded-xl border-2 border-transparent focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition placeholder:text-zinc-400"
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
        primary: "text-zinc-900 bg-yellow-400 hover:bg-yellow-500",
        secondary: "text-white bg-zinc-800 hover:bg-zinc-700",
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


// --- Main Signup Page Component ---

const SignupPage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState(null);

    const { signUp, googleSignUp, sendOtp, getUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getUser();
                if (user) redirectBasedOnRole(user);
            } catch (err) { /* User not logged in */ }
        };
        checkAuth();
    }, [getUser]);

    const redirectBasedOnRole = (user) => {
        if (user?.role === "worker") navigate("/workerdashboard");
        else if (user?.role === "customer") navigate("/userdashboard");
        else if (user?.role === "admin") navigate("/admin/dashboard");
    };

    const handleGoogleSignup = async () => {
        if (!selectedRole) {
            setError("Please choose a role first.");
            return;
        }
        setError(null);
        await googleSignUp(selectedRole);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (isNaN(formData.phone) || formData.phone.length !== 10) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        const data = { fullName: formData.name, email: formData.email, password: formData.password, role: selectedRole, phone: formData.phone };
        const user = await signUp(data);
        if (user) {
            await sendOtp({ mobileNumber: user?.phone });
            navigate("/otp");
        } else {
            setError("Signup failed. An account with this email or phone may already exist.");
        }
    };
    
    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="min-h-screen w-full bg-zinc-100 text-zinc-800 font-sans flex items-center justify-center p-4">
            <motion.div 
                className="w-full max-w-lg bg-white border border-gray-200/80 rounded-2xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">WJ</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-zinc-900">WorkJunction</h1>
                        </div>
                        <p className="text-zinc-500">Create an account to get started.</p>
                    </div>

                    {/* Role Selection */}
                    <fieldset className="mb-8">
                        <legend className="block text-sm font-semibold text-zinc-600 mb-3 text-center">First, select your role</legend>
                        <div className="grid grid-cols-2 gap-4">
                            {['worker', 'customer'].map(role => (
                                <motion.div key={role} whileHover={{ y: -4 }}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole(role)}
                                        className={clsx(
                                            "w-full p-4 rounded-xl border-2 text-center transition-all duration-200 flex flex-col items-center gap-3",
                                            selectedRole === role
                                                ? "border-yellow-400 bg-yellow-50"
                                                : "border-zinc-200 bg-white hover:border-zinc-300"
                                        )}
                                    >
                                        <div className={`text-xl ${selectedRole === role ? 'text-yellow-500' : 'text-zinc-500'}`}>
                                            {role === 'worker' ? <FaHammer/> : <FaUser />}
                                        </div>
                                        <span className="font-semibold text-zinc-800 capitalize">I'm a {role}</span>
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </fieldset>

                    {/* Form Section */}
                    <AnimatePresence>
                        {selectedRole && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleFormChange} icon={<FiUserIcon />} />
                                    <Input label="Phone" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleFormChange} icon={<FiPhone />} />
                                    <Input label="Email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleFormChange} icon={<FiMail />} />
                                    <Input label="Password" name="password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleFormChange} icon={<FiLock />} />
                                    <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleFormChange} icon={<FiLock />} />

                                    <div className="pt-2">
                                        <Button type="submit">Create Account</Button>
                                    </div>
                                </form>
                                
                                {error && (
                                    <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
                                )}

                                <div className="flex items-center my-6">
                                    <div className="flex-1 border-t border-zinc-200"></div>
                                    <span className="px-3 text-zinc-400 text-sm font-medium">OR</span>
                                    <div className="flex-1 border-t border-zinc-200"></div>
                                </div>
                                
                                <Button onClick={handleGoogleSignup} variant="secondary">
                                    <FcGoogle size={22} /> Continue with Google
                                </Button>
                                
                                <p className="text-center text-sm text-zinc-500 mt-8">
                                    Already have an account?{" "}
                                    <Link to="/login" className="font-semibold text-zinc-800 hover:text-black hover:underline">
                                        Log In
                                    </Link>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;