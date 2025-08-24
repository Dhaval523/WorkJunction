import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSearch,
    FiMapPin,
    FiDollarSign,
    FiCalendar,
    FiX,
    FiSliders,
} from "react-icons/fi";
import WorkerCard from "../components/WorkerCard"; // Reuse the WorkerCard component from earlier

const SearchWorkers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        location: "",
        minPrice: "",
        maxPrice: "",
        date: "",
    });

    const [workers, setWorkers] = useState([
        {
            id: 1,
            name: "Rajesh Kumar",
            profession: "Carpenter",
            experience: 5,
            description:
                "Specialized in furniture making and home carpentry solutions.",
            rate: 600,
            rating: 4.9,
            location: "Mumbai",
            availableDate: "2023-06-15",
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
            id: 2,
            name: "Vikram Singh",
            profession: "Electrician",
            experience: 7,
            description:
                "Expert in home wiring, switchboard repairs and electrical installations.",
            rate: 800,
            rating: 4.8,
            location: "Thane",
            availableDate: "2023-06-14",
            image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        },
        {
            id: 3,
            name: "Amit Sharma",
            profession: "Painter",
            experience: 4,
            description:
                "Professional wall painting, texture finishes and waterproofing solutions.",
            rate: 500,
            rating: 4.7,
            location: "Navi Mumbai",
            availableDate: "2023-06-16",
            image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        },
        {
            id: 4,
            name: "Sanjay Patel",
            profession: "Plumber",
            experience: 6,
            description:
                "Expert in pipe fitting, bathroom installations and leak repairs.",
            rate: 550,
            rating: 4.6,
            location: "Mumbai",
            availableDate: "2023-06-15",
            image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        },
    ]);

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
            minPrice: "",
            maxPrice: "",
            date: "",
        });
    };

    const filteredWorkers = workers.filter((worker) => {
        // Search query filter
        const matchesSearch =
            worker.profession
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            worker.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Location filter
        const matchesLocation =
            !filters.location ||
            worker.location
                .toLowerCase()
                .includes(filters.location.toLowerCase());

        // Price filter
        const matchesMinPrice =
            !filters.minPrice || worker.rate >= Number(filters.minPrice);
        const matchesMaxPrice =
            !filters.maxPrice || worker.rate <= Number(filters.maxPrice);

        // Date filter
        const matchesDate =
            !filters.date || worker.availableDate === filters.date;

        return (
            matchesSearch &&
            matchesLocation &&
            matchesMinPrice &&
            matchesMaxPrice &&
            matchesDate
        );
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Find Skilled Workers
                    </h1>
                    <p className="text-gray-600">
                        Search and book verified professionals for your needs
                    </p>
                </motion.div>

                {/* Search Bar and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by profession or name..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <FiSliders className="text-gray-600" />
                            <span>Filters</span>
                        </motion.button>
                    </div>

                    {/* Filter Panel */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow-md p-6 mb-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Location Filter */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FiMapPin className="mr-2" />{" "}
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="City or area"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            value={filters.location}
                                            onChange={handleFilterChange}
                                        />
                                    </div>

                                    {/* Price Range Filter */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FiDollarSign className="mr-2" />{" "}
                                            Price Range
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                name="minPrice"
                                                placeholder="Min"
                                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                value={filters.minPrice}
                                                onChange={handleFilterChange}
                                            />
                                            <input
                                                type="number"
                                                name="maxPrice"
                                                placeholder="Max"
                                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                value={filters.maxPrice}
                                                onChange={handleFilterChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Date Filter */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FiCalendar className="mr-2" />{" "}
                                            Available Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            value={filters.date}
                                            onChange={handleFilterChange}
                                        />
                                    </div>

                                    {/* Filter Actions */}
                                    <div className="flex items-end gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={resetFilters}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                            Reset
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                setIsFilterOpen(false)
                                            }
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                        >
                                            Apply Filters
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Filters */}
                    {(filters.location ||
                        filters.minPrice ||
                        filters.maxPrice ||
                        filters.date) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap gap-2 mb-4"
                        >
                            {filters.location && (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                >
                                    <FiMapPin className="mr-1" />{" "}
                                    {filters.location}
                                    <button
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                location: "",
                                            }))
                                        }
                                        className="ml-2 text-indigo-400 hover:text-indigo-700"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </motion.div>
                            )}
                            {(filters.minPrice || filters.maxPrice) && (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                >
                                    <FiDollarSign className="mr-1" />
                                    {filters.minPrice && `₹${filters.minPrice}`}
                                    {filters.minPrice &&
                                        filters.maxPrice &&
                                        " - "}
                                    {filters.maxPrice && `₹${filters.maxPrice}`}
                                    <button
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                minPrice: "",
                                                maxPrice: "",
                                            }))
                                        }
                                        className="ml-2 text-indigo-400 hover:text-indigo-700"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </motion.div>
                            )}
                            {filters.date && (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                >
                                    <FiCalendar className="mr-1" />{" "}
                                    {new Date(
                                        filters.date
                                    ).toLocaleDateString()}
                                    <button
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                date: "",
                                            }))
                                        }
                                        className="ml-2 text-indigo-400 hover:text-indigo-700"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6"
                >
                    <p className="text-gray-600">
                        Showing{" "}
                        <span className="font-semibold">
                            {filteredWorkers.length}
                        </span>{" "}
                        {filteredWorkers.length === 1 ? "worker" : "workers"}
                        {searchQuery && ` for "${searchQuery}"`}
                    </p>
                </motion.div>

                {/* Workers Grid */}
                {filteredWorkers.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredWorkers.map((worker, index) => (
                            <motion.div
                                key={worker.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <WorkerCard worker={worker} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-sm p-12 text-center"
                    >
                        <div className="mx-auto max-w-md">
                            <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No workers found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Try adjusting your search or filter criteria to
                                find what you're looking for.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Reset all filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SearchWorkers;
