import React, { useEffect, useState } from "react";
import useWorkerStore from "../store/WorkerStore.";
import toast from "react-hot-toast";
import {
    FiEdit2,
    FiSave,
    FiX,
    FiBriefcase,
    FiDollarSign,
    FiStar,
} from "react-icons/fi";
import Menu from "../components/menu"; // Assuming the Menu component is at this path
import { useAuthStore } from "../store/AuthStore.js";
import { useNavigate } from "react-router-dom";

const ViewMode = ({ worker, setIsEditing }) => {
    // If worker is null, show a loading/empty state
    if (!worker) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center text-gray-500">
                <p>Profile data not found. Please edit to add details.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Worker Profile
                    </h3>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <FiEdit2 /> Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm text-gray-500 flex items-center gap-1">
                            <FiBriefcase className="text-indigo-600" /> Category
                        </h4>
                        <p className="mt-1 text-lg font-medium text-gray-800">
                            {worker.category || "Not specified"}
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm text-gray-500 flex items-center gap-1">
                            <FiStar className="text-yellow-600" /> Experience
                        </h4>
                        <p className="mt-1 text-lg font-medium text-gray-800">
                            {worker.experience || 0} years
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm text-gray-500 flex items-center gap-1">
                            <FiDollarSign className="text-green-600" /> Hourly
                            Rate
                        </h4>
                        <p className="mt-1 text-lg font-medium text-gray-800">
                            ₹{worker.hourlyRate || 0}/hour
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        Skills
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {(worker.skills || []).length > 0 ? (
                            worker.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-700"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">
                                No skills added.
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                    <p className="mt-2 text-base text-gray-700">
                        {worker.bio || "No bio provided"}
                    </p>
                </div>
            </div>
        </div>
    );
};

const EditMode = ({
    formData,
    handleChange,
    handleSubmit,
    setIsEditing,
    categories,
}) => (
    <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
                Edit Profile
            </h3>
            <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
            >
                <FiX size={24} />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Skills (comma-separated)
                </label>
                <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Experience (years)
                </label>
                <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Hourly Rate (₹)
                </label>
                <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                    Bio
                </label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us about yourself..."
                />
            </div>
        </div>

        <div className="flex justify-end gap-4">
            <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                <FiSave /> Save Changes
            </button>
        </div>
    </form>
);

const WorkerProfile = () => {
    const { worker, updateWorkerProfile, getWorkerData } = useWorkerStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        category: "",
        skills: "",
        experience: 0,
        hourlyRate: 0,
        bio: "",
    });

    const { getUser, user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                await getUser();
                await getWorkerData();
            } catch (error) {
                navigate("/login");
            }
        };
        checkAuthAndFetchData();
    }, [getUser, getWorkerData, navigate]);

    useEffect(() => {
        if (worker) {
            setFormData({
                category: worker.category || "",
                skills: (worker.skills || []).join(", "),
                experience: worker.experience || 0,
                hourlyRate: worker.hourlyRate || 0,
                bio: worker.bio || "",
            });
        }
    }, [worker]);

    const categories = [
        "Plumber",
        "Electrician",
        "Cleaner",
        "Carpenter",
        "Painter",
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateWorkerProfile({
                ...formData,
                skills: formData.skills.split(",").map((s) => s.trim()),
            });
            await getWorkerData();
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* The Menu component is added here */}
            <Menu />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 ml-64 lg:px-8 py-8 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Profile
                        </h1>
                        <p className="text-gray-600">
                            Manage your personal and professional information
                        </p>
                    </div>
                </div>
                {isEditing ? (
                    <EditMode
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        setIsEditing={setIsEditing}
                        categories={categories}
                    />
                ) : (
                    <ViewMode worker={worker} setIsEditing={setIsEditing} />
                )}
            </div>
        </div>
    );
};

export default WorkerProfile;
