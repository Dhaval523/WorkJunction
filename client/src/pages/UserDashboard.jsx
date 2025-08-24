import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import {
    FaHammer,
    FaTools,
    FaPaintRoller,
    FaBolt,
    FaTruckMoving,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import WorkerCard from "../components/WorkerCard";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");

    const { getUser, user } = useAuthStore();

    const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUser();
            } catch (error) {
                navigate("/login");
                return;
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            if (user.role === "worker") {
                navigate("/workerdashboard");
            } else if (!user?.isMobileNumberVerified) {
                navigate("/otp");
            } else if (user.role !== "customer") {
                navigate("/login");
            }
        }
    }, [user, navigate]);

    const categories = [
        {
            id: "all",
            name: "All Services",
            icon: <FaTools className="text-xl" />,
        },
        {
            id: "carpenters",
            name: "Carpenters",
            icon: <FaHammer className="text-xl" />,
        },
        {
            id: "painters",
            name: "Painters",
            icon: <FaPaintRoller className="text-xl" />,
        },
        {
            id: "electricians",
            name: "Electricians",
            icon: <FaBolt className="text-xl" />,
        },
        {
            id: "movers",
            name: "Movers",
            icon: <FaTruckMoving className="text-xl" />,
        },
    ];

    const workers = [
        {
            id: 1,
            name: "Rajesh Kumar",
            profession: "Master Carpenter",
            experience: 5,
            description:
                "Specialized in custom furniture and home renovation with 100+ satisfied clients.",
            rate: 800,
            rating: 4.9,
            distance: 2.5,
            location: "Mumbai",
            availability: "Tomorrow",
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
            id: 2,
            name: "Vikram Singh",
            profession: "Electrical Engineer",
            experience: 7,
            description:
                "Expert in home wiring, switchboard repairs and smart home installations.",
            rate: 1000,
            rating: 4.8,
            distance: 3.2,
            location: "Thane",
            availability: "Today",
            image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        },
        {
            id: 3,
            name: "Amit Sharma",
            profession: "Painting Artist",
            experience: 4,
            description:
                "Professional wall painting, texture finishes and waterproofing solutions.",
            rate: 700,
            rating: 4.7,
            distance: 1.8,
            location: "Navi Mumbai",
            availability: "This Weekend",
            image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <section className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="relative z-10 p-12 md:p-16">
                            <div className="md:flex md:items-center md:justify-between">
                                <div className="md:w-1/2 mb-8 md:mb-0">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.2,
                                            duration: 0.8,
                                        }}
                                        className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                                    >
                                        Find{" "}
                                        <span className="text-yellow-300">
                                            Skilled Workers
                                        </span>{" "}
                                        Near You
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.8,
                                        }}
                                        className="text-lg text-indigo-100 mb-8"
                                    >
                                        Book verified professionals with just a
                                        few clicks. Quality service guaranteed.
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.6,
                                            duration: 0.8,
                                        }}
                                        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                                    >
                                        <div className="relative flex-grow">
                                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="What service do you need?"
                                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-indigo-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                            />
                                        </div>
                                        <button className="flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                                            Search Workers{" "}
                                            <FiArrowRight className="ml-2" />
                                        </button>
                                    </motion.div>
                                </div>
                                <div className="hidden md:block md:w-1/2">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay: 0.8,
                                            duration: 0.8,
                                        }}
                                        className="relative"
                                    >
                                        <div className="absolute -inset-4 bg-white/20 rounded-2xl transform rotate-6"></div>
                                        <img
                                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                                            alt="Skilled workers"
                                            className="relative rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Categories */}
                <section className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-gray-900 mb-8 text-center"
                    >
                        Popular{" "}
                        <span className="text-indigo-600">Services</span>
                    </motion.h2>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                    >
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                variants={itemVariants}
                                onClick={() => setActiveCategory(category.id)}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                                    activeCategory === category.id
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
                                        : "border-gray-200 hover:border-indigo-300 bg-white hover:shadow-md"
                                }`}
                            >
                                <div className="text-3xl mb-3 text-indigo-600">
                                    {category.icon}
                                </div>
                                <span className="text-sm font-medium text-center">
                                    {category.name}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                </section>

                {/* Top Workers */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold text-gray-900 mb-4 md:mb-0"
                        >
                            Featured{" "}
                            <span className="text-indigo-600">
                                Professionals
                            </span>
                        </motion.h2>
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            href="#"
                            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            View all professionals{" "}
                            <FiArrowRight className="ml-2" />
                        </motion.a>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {workers.map((worker) => (
                            <WorkerCard key={worker.id} worker={worker} />
                        ))}
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                                    <FaHammer className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    KaamWale
                                </span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Connecting skilled workers with customers since
                                2023.
                            </p>
                            <div className="flex space-x-4">
                                {[
                                    "Twitter",
                                    "Facebook",
                                    "Instagram",
                                    "LinkedIn",
                                ].map((social) => (
                                    <motion.a
                                        key={social}
                                        href="#"
                                        whileHover={{ y: -3 }}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {social}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {["Services", "Company", "Support", "Legal"].map(
                            (section, index) => (
                                <motion.div
                                    key={section}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                                        {section}
                                    </h5>
                                    <ul className="space-y-2">
                                        {Array(4)
                                            .fill()
                                            .map((_, i) => (
                                                <li key={i}>
                                                    <motion.a
                                                        href="#"
                                                        whileHover={{ x: 5 }}
                                                        className="text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        {section} Link {i + 1}
                                                    </motion.a>
                                                </li>
                                            ))}
                                    </ul>
                                </motion.div>
                            )
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm"
                    >
                        &copy; {new Date().getFullYear()} KaamWale. All rights
                        reserved.
                    </motion.div>
                </div>
            </footer>
        </div>
    );
};

export default UserDashboard;
