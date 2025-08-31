import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import axiosInstance from "../Helper/AxioInstanse.js";

// --- FIX: Replaced react-icons with inline SVG components to remove dependency issues ---

const FiSearch = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const FiMapPin = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const FiDollarSign = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const FiX = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const FiSliders = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
);

const FiBriefcase = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const FiTool = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
);

const FiTrendingUp = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const FiMessageSquare = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const StarIcon = ({ className }) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


// --- FIX: Created a self-contained WorkerCard component to resolve import error ---
const WorkerCard = ({ worker }) => {
    if (!worker || !worker.user) {
        return <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">Worker data is unavailable.</div>;
    }

    const { user, category, rating, skills = [], hourlyRate } = worker;
    const { fullName, profileImage, address } = user;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
                <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={profileImage || `https://i.pravatar.cc/150?u=${user._id}`}
                    alt={fullName}
                />
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{fullName}</h3>
                    <p className="text-sm text-indigo-600 font-semibold">{category}</p>
                    <p className="text-xs text-gray-500">{address?.city}, {address?.state}</p>
                </div>
            </div>
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1 text-gray-600 font-bold">{rating.toFixed(1)}</span>
                    <span className="ml-2 text-gray-500 text-sm">({worker.totalJobs || 0} jobs)</span>
                </div>
                {hourlyRate && <span className="text-lg font-bold text-green-600">${hourlyRate}<span className="text-sm font-normal text-gray-500">/hr</span></span>}
            </div>
            <div className="flex flex-wrap gap-2">
                {skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                        {skill}
                    </span>
                ))}
                {skills.length > 3 && <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">+{skills.length - 3} more</span>}
            </div>
        </div>
    );
};


const SearchWorkers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const [filters, setFilters] = useState({
        location: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        skills: "",
        experience: "",
        languagesSpoken: "",
    });

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
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                        );
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
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    const resetFilters = () => {
        setFilters({
            location: "",
            category: "",
            minPrice: "",
            maxPrice: "",
            skills: "",
            experience: "",
            languagesSpoken: "",
        });
        setSearchQuery("");
    };

    const filterVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Find Skilled Professionals
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Connect with verified professionals. Search by name, city, or profession.
                    </p>
                </motion.div>

                <div className="mb-8 bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            <FiSliders className="h-5 w-5" />
                            <span>Filters</span>
                        </motion.button>
                         <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGetLocation}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors"
                          >
                            <FiMapPin className="h-5 w-5" />
                            <span>Use My Location</span>
                        </motion.button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {filters.location && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FiMapPin className="mr-1.5 h-4 w-4" /> {filters.location}
                                <button onClick={() => setFilters({ ...filters, location: "" })} className="ml-1 focus:outline-none"><FiX size={14} /></button>
                            </span>
                        )}
                        {filters.category && (
                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiBriefcase className="mr-1.5 h-4 w-4" /> {filters.category}
                                <button onClick={() => setFilters({ ...filters, category: "" })} className="ml-1 focus:outline-none"><FiX size={14} /></button>
                            </span>
                        )}
                        {(filters.minPrice || filters.maxPrice) && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <FiDollarSign className="mr-1.5 h-4 w-4" />
                                {filters.minPrice && `$${filters.minPrice}`}
                                {filters.minPrice && filters.maxPrice && " - "}
                                {filters.maxPrice && `$${filters.maxPrice}`}
                                <button onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })} className="ml-1 focus:outline-none"><FiX size={14} /></button>
                            </span>
                        )}
                        {filters.skills && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                <FiTool className="mr-1.5 h-4 w-4" /> {filters.skills}
                                <button onClick={() => setFilters({ ...filters, skills: "" })} className="ml-1 focus:outline-none"><FiX size={14} /></button>
                            </span>
                        )}
                        {filters.experience && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <FiTrendingUp className="mr-1.5 h-4 w-4" /> {filters.experience}+ years
                                <button onClick={() => setFilters({ ...filters, experience: "" })} className="ml-1 focus:outline-none"><FiX size={14} /></button>
                            </span>
                        )}
                        {Object.values(filters).some(v => v) && (
                            <button onClick={resetFilters} className="ml-2 text-sm text-indigo-600 hover:text-indigo-800">
                                Clear All
                            </button>
                        )}
                    </div>
                    
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                variants={filterVariants}
                                initial="hidden" animate="visible" exit="exit"
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t">
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1"><FiMapPin className="inline mr-1 h-4 w-4" /> City</label>
                                        <input type="text" id="location" name="location" placeholder="e.g., Mumbai"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.location} onChange={handleFilterChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1"><FiBriefcase className="inline mr-1 h-4 w-4" /> Profession</label>
                                        <select id="category" name="category"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.category} onChange={handleFilterChange}>
                                            <option value="">All Professions</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1"><FiDollarSign className="inline mr-1 h-4 w-4" /> Hourly Rate ($)</label>
                                        <div className="flex gap-2">
                                            <input type="number" name="minPrice" placeholder="Min"
                                                className="w-1/2 px-4 py-2 rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={filters.minPrice} onChange={handleFilterChange} min="0" />
                                            <input type="number" name="maxPrice" placeholder="Max"
                                                className="w-1/2 px-4 py-2 rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={filters.maxPrice} onChange={handleFilterChange} min="0" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1"><FiTool className="inline mr-1 h-4 w-4" /> Skills</label>
                                        <input type="text" id="skills" name="skills" placeholder="e.g., piping,wiring"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.skills} onChange={handleFilterChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1"><FiTrendingUp className="inline mr-1 h-4 w-4" /> Minimum Experience (years)</label>
                                        <input type="number" id="experience" name="experience" placeholder="e.g., 5" min="0"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.experience} onChange={handleFilterChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="languagesSpoken" className="block text-sm font-medium text-gray-700 mb-1"><FiMessageSquare className="inline mr-1 h-4 w-4" /> Languages</label>
                                        <input type="text" id="languagesSpoken" name="languagesSpoken" placeholder="e.g., English,Hindi"
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.languagesSpoken} onChange={handleFilterChange} />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6 pt-6 border-t">
                                    <button onClick={() => setIsFilterOpen(false)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Apply Filters</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg" role="alert">{error}</div>
                )}
                
                <div className="mb-6">
                    {loading ? (
                        <p className="text-gray-600">Searching professionals...</p>
                    ) : (
                        <p className="text-gray-600">
                            Found <span className="font-semibold text-indigo-600">{workers.length}</span> {workers.length === 1 ? "professional" : "professionals"}
                        </p>
                    )}
                </div>

                {!loading && workers.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {workers.map((worker, index) => (
                            <motion.div
                                key={worker._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <WorkerCard worker={worker} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : !loading ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                         <FiSearch className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                         <h3 className="text-xl font-medium text-gray-900">No professionals found</h3>
                         <p className="text-gray-500 mt-2 mb-6">Try adjusting your search criteria or filters.</p>
                         <button onClick={resetFilters} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Reset All Filters</button>
                    </div>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchWorkers;

