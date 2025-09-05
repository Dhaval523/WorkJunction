import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiCalendar, FiClock, FiDollarSign, FiUser, FiCheck, FiX, FiAlertCircle,
    FiBriefcase, FiSettings, FiStar, FiZap, FiLogOut, FiGrid, FiList
} from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { useAuthStore } from "../store/AuthStore.js";
import { useNavigate } from "react-router-dom";
import useWorkerStore from "../store/WorkerStore..js";
import { clsx } from "clsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Reusable Dashboard Components ---

const Menu = ({ onLogout }) => {
    const navItems = [
        { icon: <FiGrid size={20} />, name: "Overview" },
        { icon: <FiList size={20} />, name: "Bookings" },
        { icon: <FiDollarSign size={20} />, name: "Earnings" },
        { icon: <FiUser size={20} />, name: "Profile" },
        { icon: <FiSettings size={20} />, name: "Settings" },
    ];
    const [active, setActive] = useState("Overview");

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-[#0f0f3b] text-white flex flex-col z-40">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7b61ff] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">WJ</span>
                </div>
                <span className="text-xl font-extrabold">WorkJunction</span>
            </div>
            <nav className="flex-grow px-4">
                {navItems.map(item => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={() => setActive(item.name)}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors",
                            active === item.name
                                ? "bg-[#7b61ff] text-white"
                                : "text-gray-400 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        {item.icon}
                        <span className="font-semibold">{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <FiLogOut size={20} />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </aside>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <motion.div 
        className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        whileHover={{ y: -5 }}
    >
        <div className={`absolute top-4 right-4 p-3 rounded-xl text-white ${color}`}>
            {icon}
        </div>
        <p className="text-gray-500">{label}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </motion.div>
);

const ToggleSwitch = ({ enabled, setEnabled }) => (
    <div
        onClick={() => setEnabled(!enabled)}
        className={clsx(
            "w-14 h-8 rounded-full p-1 flex items-center cursor-pointer transition-colors",
            enabled ? "bg-[#7b61ff]" : "bg-gray-300"
        )}
    >
        <motion.div
            layout
            className="w-6 h-6 bg-white rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
    </div>
);


// --- Main Worker Dashboard Component ---

const WorkerDashboard = () => {
    const [bookings, setBookings] = useState([
        { id: 1, client: "Amit Patel", date: "2025-09-04", time: "10:00", address: "12th Main, Andheri West", status: "confirmed", amount: 2400 },
        { id: 2, client: "Neha Sharma", date: "2025-09-05", time: "14:00", address: "Lokhandwala Complex", status: "pending", amount: 1200 },
        { id: 3, client: "Rahul Mehta", date: "2025-09-02", time: "09:00", address: "Bandra Kurla Complex", status: "completed", amount: 3600 },
    ]);
    const [availability, setAvailability] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const { getUser, user, logout } = useAuthStore();
    const { getWorkerData, worker } = useWorkerStore();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // ... (Your existing auth logic remains the same)
        setLoading(false); // Simplified for this example
    }, [user, navigate, getWorkerData]);

    const earningsData = {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        datasets: [{
            label: "Earnings (₹)",
            data: [42000, 48000, 51000, 55000, 53000, 60000],
            backgroundColor: "#7b61ff",
            borderRadius: 8,
            barThickness: 20,
        }],
    };
    
    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: "#e5e7eb" } } }
    };

    const statusConfig = {
        pending: { color: "bg-yellow-100 text-yellow-800", icon: <FiAlertCircle /> },
        confirmed: { color: "bg-green-100 text-green-800", icon: <FiCheck /> },
        completed: { color: "bg-blue-100 text-blue-800", icon: <FiBriefcase /> },
        cancelled: { color: "bg-gray-200 text-gray-800", icon: <FiX /> },
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <Menu onLogout={handleLogout} />

            <div className="ml-64">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Dashboard Header */}
                    <motion.div 
                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">Welcome back, Rajesh</h1>
                            <p className="text-gray-500 mt-1">Here's your work overview for today.</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <span className="font-semibold text-gray-700">{availability ? "Available for work" : "Not available"}</span>
                            <ToggleSwitch enabled={availability} setEnabled={setAvailability} />
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } },
                            hidden: {},
                        }}
                    >
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <StatCard icon={<FiDollarSign size={24} />} label="Total Earnings" value={`₹2,34,500`} color="bg-[#7b61ff]" />
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <StatCard icon={<FiCheck size={24} />} label="Completed Jobs" value="127" color="bg-green-500" />
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <StatCard icon={<FiStar size={24} />} label="Average Rating" value="4.9" color="bg-yellow-500" />
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <StatCard icon={<FiCalendar size={24} />} label="Upcoming Jobs" value="3" color="bg-sky-500" />
                        </motion.div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Bookings & Chart */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-xl font-bold mb-4">Earnings Overview</h3>
                                <Bar data={earningsData} options={chartOptions} />
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
                                <div className="space-y-4">
                                    {bookings.map(booking => (
                                        <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                                            <div>
                                                <p className="font-bold">{booking.client}</p>
                                                <p className="text-sm text-gray-500">{booking.address}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={clsx("px-3 py-1 text-sm font-semibold rounded-full capitalize", statusConfig[booking.status].color)}>
                                                    {booking.status}
                                                </span>
                                                {booking.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700"><FiCheck/></button>
                                                        <button className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700"><FiX/></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Quick Actions */}
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left font-semibold flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors"><FiZap className="text-[#7b61ff]"/> Create Emergency Slot</button>
                                    <button className="w-full text-left font-semibold flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors"><FiSettings className="text-[#7b61ff]"/> Update Work Profile</button>
                                    <button className="w-full text-left font-semibold flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors"><FiBriefcase className="text-[#7b61ff]"/> Add New Service</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WorkerDashboard;