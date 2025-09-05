import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiArrowRight, FiMapPin, FiStar } from "react-icons/fi";
import {
    FaHammer,
    FaTools,
    FaPaintRoller,
    FaBolt,
    FaTruckMoving,
} from "react-icons/fa";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate, Link } from "react-router-dom";
import { clsx } from 'clsx';

// --- Reusable Dashboard Components ---

const Navbar = ({ user }) => {
    // A simplified navbar for the dashboard view
    return (
        <nav className="sticky top-0 z-50 bg-[#F0F4F8]/90 backdrop-blur-lg shadow-sm"> {/* Light gray/blue background */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#170043] rounded-lg flex items-center justify-center"> {/* Dark blue logo background */}
                            <span className="text-white font-bold text-xl">WJ</span>
                        </div>
                        <span className="text-2xl font-extrabold text-[#170043]">WorkJunction</span> {/* Dark blue text */}
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block font-semibold text-gray-700">Hello, {user?.fullName?.split(' ')[0]}</span>
                        <img src={user?.avatar || `https://avatar.vercel.sh/${user?.email}.svg`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-200" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

const WorkerCard = ({ worker }) => {
    return (
        <motion.div 
            className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden flex flex-col"
            variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <img src={worker.image} alt={worker.name} className="h-48 w-full object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start gap-4">
                    <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full border-2 border-white mt-[-40px] bg-gray-200 shadow-md" />
                    <div>
                        <h3 className="text-xl font-bold text-[#170043]">{worker.name}</h3> {/* Dark blue text */}
                        <p className="font-semibold text-[#6F4CFF]">{worker.profession}</p> {/* Light purple text */}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 my-4">
                    <div className="flex items-center gap-1">
                        <FiStar className="text-[#6F4CFF]" /> {/* Light purple star */}
                        <span className="font-bold text-[#170043]">{worker.rating}</span> {/* Dark blue text */}
                    </div>
                    <span>•</span>
                    <span>{worker.experience} yrs exp.</span>
                </div>
                <p className="text-gray-600 text-sm flex-grow mb-6">{worker.description}</p>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-auto px-6 py-3 font-bold text-white bg-[#6F4CFF] rounded-xl text-base transition-all hover:bg-[#5D33FF]" 
                >
                    View Profile
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- Main Dashboard Page Component ---

const UserDashboard = () => {
    const [userCity, setUserCity] = useState(null);
    const [activeCategory, setActiveCategory] = useState("all");

    const { getUser, user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await getUser();
                if (currentUser.role === "worker") navigate("/workerdashboard");
                else if (!currentUser?.isMobileNumberVerified) navigate("/otp");
                else if (currentUser.role !== "customer") navigate("/login");
            } catch (error) {
                navigate("/login");
            }
        };
        checkAuth();
    }, [getUser, navigate]);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                    );
                    const data = await res.json();
                    setUserCity(data.address.city || data.address.town || data.address.village || "Unknown");
                } catch (err) {
                    console.error("Error fetching city:", err);
                    setUserCity("Unknown");
                }
            }, (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location. Please check permissions.");
            });
        } else {
            console.log("Geolocation not supported");
            alert("Geolocation is not supported by your browser.");
        }
    };

    const categories = [
        { id: "all", name: "All Services", icon: <FaTools /> },
        { id: "carpenters", name: "Carpenters", icon: <FaHammer /> },
        { id: "painters", name: "Painters", icon: <FaPaintRoller /> },
        { id: "electricians", name: "Electricians", icon: <FaBolt /> },
        { id: "movers", name: "Movers", icon: <FaTruckMoving /> },
    ];

    const workers = [
        { id: 1, name: "Rajesh Kumar", profession: "Master Carpenter", experience: 5, description: "Specialized in custom furniture and home renovation with 100+ satisfied clients.", rate: 800, rating: 4.9, location: "Vadodara", image: "https://images.unsplash.com/photo-1595844730298-b9602188c09c?q=80&w=2574&auto=format&fit=crop", avatar: "https://randomuser.me/api/portraits/men/32.jpg", category: "carpenters" },
        { id: 2, name: "Vikram Singh", profession: "Electrical Engineer", experience: 7, description: "Expert in home wiring, switchboard repairs and smart home installations.", rate: 1000, rating: 4.8, location: "Vadodara", image: "https://images.unsplash.com/photo-1497405022895-3f2d2b12b598?q=80&w=2574&auto=format&fit=crop", avatar: "https://randomuser.me/api/portraits/men/44.jpg", category: "electricians" },
        { id: 3, name: "Amit Sharma", profession: "Painting Artist", experience: 4, description: "Professional wall painting, texture finishes and waterproofing solutions.", rate: 700, rating: 4.7, location: "Vadodara", image: "https://images.unsplash.com/photo-1542122194-6331233a4959?q=80&w=2574&auto=format&fit=crop", avatar: "https://randomuser.me/api/portraits/men/67.jpg", category: "painters" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };

    const filteredWorkers = workers.filter(w => activeCategory === "all" || w.category === activeCategory);

    return (
        <div className="min-h-screen bg-[#F0F4F8]"> 
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Search Section */}
                <section className="mb-16 text-center">
                    <motion.h1 
                        className="text-4xl sm:text-5xl font-extrabold text-[#170043] tracking-tighter" 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Find & Hire <span className="text-[#6F4CFF]"> {/* Light purple text */}
                            Trusted Professionals
                        </span>
                    </motion.h1>
                    <motion.p 
                        className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Search for any service you need, and we'll connect you with the best pros in your area.
                    </motion.p>
                    <motion.div 
                        className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 p-2 bg-white rounded-2xl shadow-lg border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative w-full">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="What service are you looking for?"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 text-[#170043] rounded-xl border-2 border-transparent focus:ring-2 focus:ring-[#6F4CFF]/50 focus:border-[#6F4CFF] transition"
                            /> 
                        </div>
                        <button className="w-full sm:w-auto flex-shrink-0 px-6 py-3.5 font-bold text-white bg-[#6F4CFF] rounded-xl transition-all hover:bg-[#5D33FF]"> {/* Light purple button, hover to light blue */}
                            Search
                        </button>
                    </motion.div>
                </section>

                {/* Categories Filter */}
                <section className="mb-16">
                    <div className="flex justify-center items-center flex-wrap gap-4">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={clsx(
                                    "px-5 py-3 font-semibold rounded-xl text-base transition-all flex items-center gap-2.5",
                                    activeCategory === category.id
                                        ? "bg-[#170043] text-white shadow-md" // Dark blue active category
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                )}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category.icon} {category.name}
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Workers Grid */}
                <section>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredWorkers.map((worker) => (
                                <WorkerCard key={worker.id} worker={worker} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    
                    {filteredWorkers.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-600">No professionals found for the selected category.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default UserDashboard