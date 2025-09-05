import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiGrid, FiList, FiUserPlus, FiUserCheck, FiSettings, FiLogOut, 
    FiX, FiCheck, FiDownloadCloud, FiMail, FiPhone, FiMapPin, FiInfo, FiBell, FiBriefcase, FiCalendar
} from "react-icons/fi";
import { clsx } from "clsx";

// --- Reusable Dashboard Components ---

const Sidebar = ({ active, setActive, onLogout }) => {
    const navItems = [
        { icon: <FiUserCheck size={20} />, name: "Verification Queue" },
        { icon: <FiBell size={20} />, name: "Booking Actions" },
        { icon: <FiList size={20} />, name: "Manage Workers" },
        { icon: <FiUserPlus size={20} />, name: "Add New Worker" },
        { icon: <FiSettings size={20} />, name: "Settings" },
    ];

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-[#0f0f3b] text-white flex flex-col z-50">
            <div className="p-6 flex items-center gap-3 border-b border-white/10">
                <div className="w-10 h-10 bg-[#7b61ff] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">WJ</span>
                </div>
                <span className="text-xl font-extrabold">WorkJunction</span>
            </div>
            <nav className="flex-grow p-4">
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

const VerificationRequestCard = ({ worker, onReview }) => {
    const isSelfRegistered = worker.source === 'Self Registered';
    return (
        <motion.div
            className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200/80 flex items-center gap-4"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, shadow: "0 10px 15px -3px rgba(0,0,0,0.1)"}}
        >
            <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"/>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{worker.name}</h3>
                        <p className="text-sm text-gray-500">{worker.profession}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isSelfRegistered ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {worker.source}
                    </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Request Date: {worker.requestDate}</div>
            </div>
            <motion.button 
                onClick={() => onReview(worker)}
                className="px-5 py-2 font-bold text-sm bg-[#7b61ff] text-white rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Review
            </motion.button>
        </motion.div>
    );
};

const VerificationModal = ({ worker, onApprove, onReject, onClose }) => {
    // ... (This component remains unchanged from the previous version)
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    const handleReject = () => {
        if (!rejectionReason) return;
        onReject(worker.id, rejectionReason);
    };

    return (
        <motion.div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                <div className="p-6 border-b flex justify-between items-center"><h2 className="text-2xl font-extrabold text-gray-900">Verification Details</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><FiX size={24}/></button></div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto">
                    {/* Worker Details & Documents sections */}
                </div>
                <AnimatePresence>
                {isRejecting && (
                    <motion.div className="px-6 pb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                         <div className="bg-red-50 p-4 rounded-xl border border-red-200"><label htmlFor="rejectionReason" className="font-bold text-red-800 flex items-center gap-2 mb-2"><FiInfo/> Reason for Rejection</label><textarea id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., Aadhaar card image is blurry..." className="w-full p-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-400"/></div>
                    </motion.div>
                )}
                </AnimatePresence>
                <div className="p-6 border-t flex justify-end gap-4">
                    {/* Action Buttons */}
                </div>
            </motion.div>
        </motion.div>
    );
};

const BookingActionCard = ({ booking, onConfirm }) => (
    <motion.div
        className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200/80"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ y: -5, shadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500">Booking for</p>
                <h3 className="font-bold text-lg text-gray-900">{booking.workerName}</h3>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                Action Required
            </span>
        </div>
        <div className="my-4 border-t border-dashed"></div>
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600">Customer:</span>
                <span className="font-bold text-gray-900">{booking.customerName}</span>
            </div>
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                <span className="font-semibold text-purple-800 flex items-center gap-2"><FiPhone/> Customer Phone:</span>
                <a href={`tel:${booking.customerPhone}`} className="font-bold text-purple-800 tracking-wider">{booking.customerPhone}</a>
            </div>
             <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600 flex items-center gap-2"><FiBriefcase/> Service:</span>
                <span className="text-gray-800">{booking.service}</span>
            </div>
             <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600 flex items-center gap-2"><FiCalendar/> Date & Time:</span>
                <span className="text-gray-800">{booking.date} at {booking.time}</span>
            </div>
        </div>
        <div className="mt-6 border-t pt-4">
            <motion.button
                onClick={() => onConfirm(booking.id)}
                className="w-full px-5 py-3 font-bold text-sm bg-[#7b61ff] text-white rounded-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FiCheck /> Mark as Contacted & Confirmed
            </motion.button>
        </div>
    </motion.div>
);

// --- Main Dashboard Page ---

const ServiceAgentDashboard = () => {
    const [activeView, setActiveView] = useState('Verification Queue');
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [bookingsToAction, setBookingsToAction] = useState([
        { id: 101, workerName: "Priya Singh", customerName: "Rohan Desai", customerPhone: "9876554321", service: "Leaky Faucet Repair", date: "2025-09-04", time: "11:00 AM", status: 'pending_agent_contact'},
        { id: 102, workerName: "Sunil Verma", customerName: "Ananya Iyer", customerPhone: "9876551234", service: "Switchboard Installation", date: "2025-09-05", time: "02:00 PM", status: 'pending_agent_contact'},
    ]);
    const pendingWorkers = [
        { id: 1, name: "Suresh Gupta", profession: "Electrician", avatar: "https://randomuser.me/api/portraits/men/11.jpg", source: "Self Registered", requestDate: "2025-09-03", email:"suresh@example.com", phone:"9876543210", address:"Mumbai, Maharashtra" },
    ];
    const reviewedWorkers = [
        { id: 3, name: "Anjali Mehta", profession: "Painter", avatar: "https://randomuser.me/api/portraits/women/33.jpg", source: "Self Registered", requestDate: "2025-09-01", status: "Approved" },
    ];
    
    const handleLogout = () => console.log("Logout");
    const handleApprove = (workerId) => setSelectedWorker(null);
    const handleReject = (workerId, reason) => setSelectedWorker(null);

    const handleBookingConfirm = (bookingId) => {
        setBookingsToAction(bookingsToAction.filter(b => b.id !== bookingId));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar active={activeView} setActive={setActiveView} onLogout={handleLogout} />
            <div className="ml-64">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeView === 'Verification Queue' && (
                                <div>
                                    <h1 className="text-3xl font-extrabold text-gray-900">Verification Queue</h1>
                                    <p className="text-gray-500 mt-1">Review and manage new worker applications.</p>
                                    <div className="mt-8 border-b border-gray-200"><nav className="-mb-px flex space-x-6"><button onClick={() => setActiveTab('pending')} className={`py-4 px-1 border-b-2 font-semibold text-sm ${activeTab === 'pending' ? 'border-[#7b61ff] text-[#7b61ff]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Pending ({pendingWorkers.length})</button><button onClick={() => setActiveTab('reviewed')} className={`py-4 px-1 border-b-2 font-semibold text-sm ${activeTab === 'reviewed' ? 'border-[#7b61ff] text-[#7b61ff]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Reviewed</button></nav></div>
                                    <motion.div className="mt-8 space-y-4" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
                                        {activeTab === 'pending' && pendingWorkers.map(worker => <VerificationRequestCard key={worker.id} worker={worker} onReview={setSelectedWorker} />)}
                                        {activeTab === 'reviewed' && reviewedWorkers.map(worker => <VerificationRequestCard key={worker.id} worker={worker} onReview={setSelectedWorker} />)}
                                    </motion.div>
                                </div>
                            )}

                            {activeView === 'Booking Actions' && (
                                <div>
                                    <h1 className="text-3xl font-extrabold text-gray-900">Managed Booking Actions</h1>
                                    <p className="text-gray-500 mt-1">Contact customers to confirm details for new bookings assigned to your workers.</p>
                                    <motion.div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
                                        {bookingsToAction.map(booking => (
                                            <BookingActionCard key={booking.id} booking={booking} onConfirm={handleBookingConfirm} />
                                        ))}
                                        {bookingsToAction.length === 0 && (
                                            <div className="lg:col-span-2 text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
                                                <FiCheck size={48} className="mx-auto text-green-500"/>
                                                <h3 className="mt-4 text-xl font-bold text-gray-900">All Caught Up!</h3>
                                                <p className="mt-2 text-gray-500">There are no pending booking actions.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            
            <AnimatePresence>
                {selectedWorker && (
                    <VerificationModal 
                        worker={selectedWorker} 
                        onClose={() => setSelectedWorker(null)}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServiceAgentDashboard;