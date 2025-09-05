import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../Helper/AxioInstanse.js";

// --- Self-Contained SVG Icons ---
const FiSearch = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> );
const FiMapPin = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const FiDollarSign = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> );
const FiX = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
const FiSliders = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg> );
const FiBriefcase = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> );
const FiTool = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> );
const FiTrendingUp = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> );
const FiMessageSquare = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> );
const StarIcon = ({ className }) => ( <svg viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> );

// --- Themed WorkerCard Component ---
const WorkerCard = ({ worker }) => {
    if (!worker || !worker.user) {
        return <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500">Worker data is unavailable.</div>;
    }
    const { user, category, rating, skills = [], hourlyRate } = worker;
    const { fullName, profileImage, address } = user;

    return (
        <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 transition-shadow hover:shadow-xl flex flex-col"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -5 }}
        >
            <div className="flex items-center space-x-4 mb-4">
                <img className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md" src={profileImage || `https://i.pravatar.cc/150?u=${user._id}`} alt={fullName} />
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{fullName}</h3>
                    <p className="text-sm text-[#7b61ff] font-semibold">{category}</p>
                </div>
            </div>
            <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold">{rating.toFixed(1)}</span>
                </div>
                {hourlyRate && <span className="text-lg font-bold text-gray-800">${hourlyRate}<span className="text-sm font-normal text-gray-500">/hr</span></span>}
            </div>
            <div className="flex-grow">
                <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">{skill}</span>
                    ))}
                     {skills.length > 3 && <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">+{skills.length - 3} more</span>}
                </div>
            </div>
            <button className="w-full mt-6 px-6 py-3 font-bold rounded-xl text-base text-white bg-[#7b61ff] hover:bg-[#6a50e0] transition-colors">
                View Profile
            </button>
        </motion.div>
    );
};

const SearchWorkers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ location: "", category: "", minPrice: "", maxPrice: "", skills: "", experience: "", languagesSpoken: "" });
    const [workers, setWorkers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get("/api/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError("Failed to load professions. Please try again.");
            }
        };
        fetchCategories();
    }, []);
    
    const handleGetLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                        const data = await res.json();
                        const city = data.address.city || data.address.town || data.address.village || "";
                        setFilters((prev) => ({ ...prev, location: city }));
                    } catch (err) {
                        console.error("Error fetching city:", err);
                        setError("Unable to retrieve your location. Please enter manually.");
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setError("Location access denied. Please enter your city manually.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    const fetchWorkers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            if (searchQuery) params.append('name', searchQuery);
            if (filters.location) params.append('city', filters.location);
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.skills) params.append('skills', filters.skills);
            if (filters.experience) params.append('experience', filters.experience);
            if (filters.languagesSpoken) params.append('languagesSpoken', filters.languagesSpoken);
            const queryString = params.toString();
            const response = await axiosInstance.get(`/api/workers/search${queryString ? `?${queryString}` : ""}`);
            setWorkers(response.data);
        } catch (error) {
            console.error("Error fetching workers:", error);
            setError("Failed to load workers. Please adjust your filters and try again.");
            setWorkers([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(fetchWorkers, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchWorkers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };
    
    const resetFilters = () => {
        setFilters({ location: "", category: "", minPrice: "", maxPrice: "", skills: "", experience: "", languagesSpoken: "" });
        setSearchQuery("");
    };

    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute -top-60 -left-40 w-[400px] h-[400px] bg-[#00c6ff]/20 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#7b61ff]/20 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">Find Your Expert</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Instantly connect with our global network of verified professionals.
                    </p>
                </motion.div>

                <div className="mb-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by name, skill, or profession..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#7b61ff]/50 focus:border-[#7b61ff]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-xl shadow-sm hover:bg-gray-100 border-2 border-gray-200 font-bold transition-colors">
                            <FiSliders className="h-5 w-5" />
                            <span>Filters</span>
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#7b61ff] text-white rounded-xl shadow-lg shadow-[#7b61ff]/20 hover:bg-[#6a50e0] font-bold transition-colors">
                            <span>Search</span>
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                                    <input type="text" name="location" placeholder="City or State" value={filters.location} onChange={handleFilterChange} className="px-4 py-2 rounded-lg bg-gray-100 border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#7b61ff]"/>
                                    <select name="category" value={filters.category} onChange={handleFilterChange} className="px-4 py-2 rounded-lg bg-gray-100 border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#7b61ff]">
                                        <option value="">All Professions</option>
                                        {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                                    </select>
                                    <div className="flex gap-2">
                                        <input type="number" name="minPrice" placeholder="Min Price ($/hr)" value={filters.minPrice} onChange={handleFilterChange} className="w-1/2 px-4 py-2 rounded-lg bg-gray-100 border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#7b61ff]"/>
                                        <input type="number" name="maxPrice" placeholder="Max Price ($/hr)" value={filters.maxPrice} onChange={handleFilterChange} className="w-1/2 px-4 py-2 rounded-lg bg-gray-100 border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#7b61ff]"/>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600 font-semibold">
                        {loading ? "Searching professionals..." : `Found ${workers.length} professionals`}
                    </p>
                    {Object.values(filters).some(v => v) && <button onClick={resetFilters} className="text-sm text-[#7b61ff] hover:underline font-semibold">Clear All Filters</button>}
                </div>

                {!loading && workers.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                        initial="hidden"
                        animate="visible"
                    >
                        {workers.map((worker) => (
                            <WorkerCard key={worker._id} worker={worker} />
                        ))}
                    </motion.div>
                ) : !loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                        <FiSearch className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No Professionals Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search criteria or clearing your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-200">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="h-16 bg-gray-200 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchWorkers;