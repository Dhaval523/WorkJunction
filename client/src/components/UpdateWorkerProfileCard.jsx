import React, { useEffect, useState } from "react";
import useWorkerStore from "../store/WorkerStore.";
import toast from "react-hot-toast";
import {
    FiEdit2,
    FiSave,
    FiX,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiStar,
    FiPlus,
} from "react-icons/fi";
import Menu from "../components/menu"; // Assuming the Menu component is at this path
import { useAuthStore } from "../store/AuthStore.js";
import { useNavigate } from "react-router-dom";

const PersonalDetailsSection = ({ user }) => {
    return (
        <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">
                Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <FiUser className="mt-1 text-indigo-600" />
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900">
                                {user?.fullName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <FiMail className="mt-1 text-indigo-600" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <FiPhone className="mt-1 text-indigo-600" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">
                                {user?.phone || "Not provided"}
                            </p>
                            {user?.isMobileNumberVerified && (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="text-green-500">✓</span>{" "}
                                    Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {user?.address && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                            <FiMapPin className="mt-1 text-indigo-600" />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium text-gray-900">
                                    {[
                                        user.address.street,
                                        user.address.city,
                                        user.address.state,
                                        user.address.zipCode,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ViewMode = ({ worker, setIsEditing }) => {
    const { user } = useAuthStore(); // Add this line to get user data
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
                <PersonalDetailsSection user={user} />

                {/* Add a divider */}
                <div className="border-t border-gray-200 my-6"></div>

                <h4 className="text-sm font-medium text-gray-500 mb-4">
                    Professional Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm text-gray-500 flex items-center gap-1">
                            <FiStar className="text-yellow-600" /> Experience
                        </h4>
                        <p className="mt-1 text-lg font-medium text-gray-800">
                            {worker.experience || 0} years
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm text-gray-500">
                            Languages Spoken
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {(worker.languagesSpoken || []).length > 0 ? (
                                worker.languagesSpoken.map(
                                    (language, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {language}
                                        </span>
                                    )
                                )
                            ) : (
                                <span className="text-gray-500">
                                    No languages specified
                                </span>
                            )}
                        </div>
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
    setFormData,
    handleChange,
    handleSubmit,
    setIsEditing,
    categories,
}) => {
    const [newSkill, setNewSkill] = useState("");

    const handleAddSkill = () => {
        if (newSkill && !formData.skills.includes(newSkill)) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill],
            }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }));
    };

    return (
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
                        Skills
                    </label>
                    <div className="mt-1 flex gap-2 flex-wrap">
                        <select
                            onChange={(e) => {
                                const selectedSkill = e.target.value;
                                if (
                                    selectedSkill &&
                                    !formData.skills.includes(selectedSkill)
                                ) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        skills: [...prev.skills, selectedSkill],
                                    }));
                                }
                            }}
                            className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">
                                Select a common profession...
                            </option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Or add a new skill"
                                className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="flex-shrink-0 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
                            >
                                <FiPlus size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="text-gray-500 hover:text-gray-700 ml-1"
                                >
                                    <FiX size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
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
                        Languages Spoken (comma-separated)
                    </label>
                    <input
                        type="text"
                        name="languagesSpoken"
                        value={formData.languagesSpoken}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g. English, Hindi, Gujarati"
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
};

const WorkerProfile = () => {
    const { worker, updateWorkerProfile, getWorkerData } = useWorkerStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        skills: [],
        experience: 0,
        bio: "",
        languagesSpoken: "",
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
                skills: worker.skills || [],
                experience: worker.experience || 0,
                bio: worker.bio || "",
                languagesSpoken: (worker.languagesSpoken || []).join(", "),
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
                languagesSpoken: formData.languagesSpoken
                    .split(",")
                    .map((l) => l.trim()),
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
                        setFormData={setFormData}
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
