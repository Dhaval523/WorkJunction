import { useState, useEffect } from "react";
import useWorkerStore from "../store/WorkerStore.";
import { motion } from "framer-motion";
import { FiSave, FiX } from "react-icons/fi";

const categories = [
    "Plumber",
    "Electrician",
    "Cleaner",
    "Carpenter",
    "Painter",
    "Other",
];

const validateField = (name, value) => {
    switch (name) {
        case "category":
            return !value ? "Category is required" : "";

        case "skills":
            if (!value) return "At least one skill is required";
            const skills = value.split(",").map((s) => s.trim());
            return skills.some((s) => s.length < 2)
                ? "Each skill must be at least 2 characters"
                : "";

        case "experience":
            const exp = Number(value);
            if (isNaN(exp) || exp < 0) return "Enter valid experience";
            if (exp > 50) return "Experience seems too high";
            return "";

        case "hourlyRate":
            const rate = Number(value);
            if (isNaN(rate) || rate < 100) return "Minimum rate is ₹100";
            if (rate > 10000) return "Maximum rate is ₹10,000";
            return "";

        case "bio":
            if (!value) return "Bio is required";
            if (value.length < 50) return "Bio must be at least 50 characters";
            if (value.length > 500) return "Bio cannot exceed 500 characters";
            return "";

        case "languagesSpoken":
            if (!value) return "At least one language is required";
            const langs = value.split(",").map((l) => l.trim());
            return langs.some((l) => l.length < 2)
                ? "Each language must be at least 2 characters"
                : "";

        default:
            return "";
    }
};

export default function UpdateProfileCard({ onClose }) {
    const { updateWorkerProfile, worker, isLoading } = useWorkerStore();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [touchedFields, setTouchedFields] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        category: worker?.category || "",
        skills: worker?.skills?.join(", ") || "",
        experience: worker?.experience || "",
        hourlyRate: worker?.hourlyRate || "",
        bio: worker?.bio || "",
        languagesSpoken: worker?.languagesSpoken?.join(", ") || "",
    });

    const validateForm = () => {
        const errors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) errors[key] = error;
        });
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Validate on change if field was touched
        if (touchedFields[name]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields((prev) => ({ ...prev, [name]: true }));
        setFieldErrors((prev) => ({
            ...prev,
            [name]: validateField(name, formData[name]),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate all fields
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setTouchedFields(
                Object.keys(formData).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]: true,
                    }),
                    {}
                )
            );
            return;
        }

        try {
            const processedData = {
                ...formData,
                skills: formData.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                languagesSpoken: formData.languagesSpoken
                    .split(",")
                    .map((l) => l.trim())
                    .filter(Boolean),
                experience: Number(formData.experience),
                hourlyRate: Number(formData.hourlyRate),
            };

            await updateWorkerProfile(processedData);
            setSuccess("Profile updated successfully!");
            setTimeout(onClose, 2000);
        } catch (error) {
            setError(
                error?.response?.data?.message || "Failed to update profile"
            );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <FiX size={24} />
            </button>

            <h3 className="text-xl font-semibold mb-6">Update Work Profile</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 rounded-lg border ${
                            fieldErrors.category
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.category && (
                        <p className="mt-1 text-sm text-red-600">
                            {fieldErrors.category}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills (comma separated) *
                    </label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 rounded-lg border ${
                            fieldErrors.skills
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="e.g. Pipe Fitting, Bathroom Installation"
                    />
                    {fieldErrors.skills && (
                        <p className="mt-1 text-sm text-red-600">
                            {fieldErrors.skills}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Experience (years) *
                        </label>
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 rounded-lg border ${
                                fieldErrors.experience
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                            min="0"
                            max="50"
                        />
                        {fieldErrors.experience && (
                            <p className="mt-1 text-sm text-red-600">
                                {fieldErrors.experience}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hourly Rate (₹) *
                        </label>
                        <input
                            type="number"
                            name="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 rounded-lg border ${
                                fieldErrors.hourlyRate
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                            min="100"
                            max="10000"
                            step="50"
                        />
                        {fieldErrors.hourlyRate && (
                            <p className="mt-1 text-sm text-red-600">
                                {fieldErrors.hourlyRate}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio *
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 rounded-lg border ${
                            fieldErrors.bio
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        rows="4"
                        placeholder="Brief description about your work experience and expertise"
                    />
                    <div className="flex justify-between mt-1">
                        {fieldErrors.bio && (
                            <p className="text-sm text-red-600">
                                {fieldErrors.bio}
                            </p>
                        )}
                        <p
                            className={`text-xs ${
                                formData.bio.length > 500
                                    ? "text-red-600"
                                    : "text-gray-500"
                            }`}
                        >
                            {formData.bio.length}/500 characters
                        </p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Languages Spoken (comma separated) *
                    </label>
                    <input
                        type="text"
                        name="languagesSpoken"
                        value={formData.languagesSpoken}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 rounded-lg border ${
                            fieldErrors.languagesSpoken
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="e.g. English, Hindi, Gujarati"
                    />
                    {fieldErrors.languagesSpoken && (
                        <p className="mt-1 text-sm text-red-600">
                            {fieldErrors.languagesSpoken}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white ${
                            isLoading
                                ? "bg-gray-400"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        <FiSave size={18} />
                        {isLoading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
