import { motion } from "framer-motion";
import {
    FiHome,
    FiUser,
    FiStar,
    FiMessageSquare,
    FiBell,
    FiSettings,
    FiLogOut,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
    { id: "home", icon: <FiHome />, label: "Home", link: "/workerdashboard" },
    {
        id: "profile",
        icon: <FiUser />,
        label: "Profile",
        link: "/worker/profile",
    },
    {
        id: "reviews",
        icon: <FiStar />,
        label: "Reviews",
        link: "/workerdashboard",
    },
    {
        id: "chat",
        icon: <FiMessageSquare />,
        label: "Chat",
        link: "/workerdashboard",
    },
    {
        id: "notifications",
        icon: <FiBell />,
        label: "Notifications",
        link: "/workerdashboard",
    },
    {
        id: "settings",
        icon: <FiSettings />,
        label: "Settings",
        link: "/workerdashboard",
    },
];

const Menu = ({ activeTab, setActiveTab, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-screen w-64 bg-white shadow-lg fixed left-0 top-0"
        >
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-indigo-600">
                    KaamWale Pro
                </h2>
                <p className="text-sm text-gray-500">Worker Dashboard</p>
            </div>

            {/* Menu Items */}
            <nav className="p-4">
                {menuItems.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            navigate(item.link);
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 ${
                            location.pathname == item.link
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">
                            {item.label}
                        </span>
                    </motion.button>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                    <FiLogOut className="text-lg" />
                    <span className="text-sm font-medium">Log Out</span>
                </motion.button>
            </div>
        </div>
    );
};

export default Menu;
