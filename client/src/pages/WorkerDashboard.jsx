import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiCalendar,
    FiClock,
    FiDollarSign,
    FiUser,
    FiCheck,
    FiX,
    FiAlertCircle,
    FiBriefcase,
    FiSettings,
    FiStar,
    FiZap,
} from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { FiMapPin } from "react-icons/fi";
import Menu from "../components/menu";
import { useAuthStore } from "../store/AuthStore.js";
import { useNavigate } from "react-router-dom";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const WorkerDashboard = () => {
    const [worker, setWorker] = useState({
        name: "Rajesh Kumar",
        profession: "Carpenter",
        rating: 4.9,
        totalJobs: 127,
        earnings: 234500,
        availability: true,
        upcomingJobs: 3,
    });

    const [bookings, setBookings] = useState([
        {
            id: 1,
            client: "Amit Patel",
            date: "2023-06-15",
            time: "10:00",
            duration: 4,
            address: "12th Main, Andheri West",
            status: "confirmed",
            amount: 2400,
        },
        {
            id: 2,
            client: "Neha Sharma",
            date: "2023-06-16",
            time: "14:00",
            duration: 2,
            address: "Lokhandwala Complex",
            status: "pending",
            amount: 1200,
        },
        {
            id: 3,
            client: "Rahul Mehta",
            date: "2023-06-17",
            time: "09:00",
            duration: 6,
            address: "Bandra Kurla Complex",
            status: "completed",
            amount: 3600,
        },
    ]);

    const [availability, setAvailability] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const { getUser, user, logout } = useAuthStore();

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
            if (user.role === "customer") {
                navigate("/userdashboard");
            } else if (user.role !== "worker") {
                navigate("/login");
            }
        }
    }, [user, navigate]);

    // Chart data
    const earningsData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Earnings (₹)",
                data: [45000, 39000, 42000, 48000, 51000, 47000],
                backgroundColor: "#4F46E5",
                borderRadius: 4,
            },
        ],
    };

    const statusConfig = {
        pending: {
            color: "bg-yellow-100 text-yellow-800",
            icon: <FiAlertCircle />,
        },
        confirmed: { color: "bg-green-100 text-green-800", icon: <FiCheck /> },
        completed: {
            color: "bg-blue-100 text-blue-800",
            icon: <FiBriefcase />,
        },
        cancelled: { color: "bg-gray-100 text-gray-800", icon: <FiX /> },
    };

    const handleBookingAction = (bookingId, action) => {
        setBookings(
            bookings.map((booking) =>
                booking.id === bookingId
                    ? { ...booking, status: action }
                    : booking
            )
        );
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <Menu onLogout={handleLogout} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 ml-64 lg:px-8 py-8">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {worker.name}
                        </h1>
                        <p className="text-gray-600">
                            Here's your work overview
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex items-center">
                            <span
                                className={`h-3 w-3 rounded-full mr-2 ${
                                    availability ? "bg-green-500" : "bg-red-500"
                                }`}
                            ></span>
                            <span className="text-sm">
                                {availability ? "Available" : "Not Available"}
                            </span>
                        </div>
                        <button
                            onClick={() => setAvailability(!availability)}
                            className={`px-4 py-2 rounded-lg ${
                                availability
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                        >
                            {availability
                                ? "Mark Unavailable"
                                : "Mark Available"}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Earnings
                                </p>
                                <p className="text-2xl font-bold">
                                    ₹{worker.earnings.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <FiDollarSign className="text-indigo-600 text-xl" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Completed Jobs
                                </p>
                                <p className="text-2xl font-bold">
                                    {worker.totalJobs}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FiCheck className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Average Rating
                                </p>
                                <div className="flex items-center">
                                    <FiStar className="text-yellow-400 mr-1" />
                                    <span className="text-2xl font-bold">
                                        {worker.rating}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <FiStar className="text-yellow-600 text-xl" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Upcoming Jobs
                                </p>
                                <p className="text-2xl font-bold">
                                    {worker.upcomingJobs}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FiClock className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {/* Earnings Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                            <h3 className="text-lg font-semibold mb-4">
                                Earnings Overview
                            </h3>
                            <Bar
                                data={earningsData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: "top" },
                                    },
                                }}
                            />
                        </div>

                        {/* Bookings List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">
                                        Recent Bookings
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setActiveTab("overview")
                                            }
                                            className={`px-4 py-2 rounded-lg ${
                                                activeTab === "overview"
                                                    ? "bg-indigo-100 text-indigo-700"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab("pending")
                                            }
                                            className={`px-4 py-2 rounded-lg ${
                                                activeTab === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            Pending
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {bookings
                                        .filter(
                                            (b) =>
                                                activeTab === "overview" ||
                                                b.status === activeTab
                                        )
                                        .map((booking) => (
                                            <motion.div
                                                key={booking.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <span
                                                            className={`${
                                                                statusConfig[
                                                                    booking
                                                                        .status
                                                                ].color
                                                            } px-2 py-1 rounded-full text-sm flex items-center gap-1`}
                                                        >
                                                            {
                                                                statusConfig[
                                                                    booking
                                                                        .status
                                                                ].icon
                                                            }
                                                            {booking.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                booking.status.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold">
                                                        ₹{booking.amount}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <FiUser className="mr-2" />
                                                        {booking.client}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FiCalendar className="mr-2" />
                                                        {new Date(
                                                            booking.date
                                                        ).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FiClock className="mr-2" />
                                                        {booking.time} (
                                                        {booking.duration} hrs)
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FiMapPin className="mr-2" />
                                                        {booking.address}
                                                    </div>
                                                </div>

                                                {booking.status ===
                                                    "pending" && (
                                                    <div className="flex gap-2 mt-4">
                                                        <button
                                                            onClick={() =>
                                                                handleBookingAction(
                                                                    booking.id,
                                                                    "confirmed"
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleBookingAction(
                                                                    booking.id,
                                                                    "cancelled"
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Availability Calendar */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">
                                Schedule
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                                    <span className="font-medium">Today</span>
                                    <span className="text-indigo-600">
                                        Available
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span>Tomorrow</span>
                                    <span className="text-gray-500">
                                        No bookings
                                    </span>
                                </div>
                                {/* Add calendar component here */}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50">
                                    <FiZap className="text-indigo-600 mr-2" />
                                    Create Emergency Availability
                                </button>
                                <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50">
                                    <FiSettings className="text-indigo-600 mr-2" />
                                    Update Work Profile
                                </button>
                                <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50">
                                    <FiBriefcase className="text-indigo-600 mr-2" />
                                    Add New Service
                                </button>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">
                                Performance
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span>Response Rate</span>
                                        <span>95%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div className="h-2 bg-green-500 rounded-full w-11/12"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span>Completion Rate</span>
                                        <span>98%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div className="h-2 bg-blue-500 rounded-full w-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
