import { useState, useEffect } from "react";
import useWorkerStore from "../store/WorkerStore.";
import { motion } from "framer-motion";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

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

export default function UpdateWorkerProfile({ onClose }) {
    const { updateWorkerProfile, worker, getWorkerData, isLoading } =
        useWorkerStore();
    const [isEditMode, setIsEditMode] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [touchedFields, setTouchedFields] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        category: "",
        skills: "",
        experience: "",
        hourlyRate: "",
        bio: "",
        languagesSpoken: "",
    });

    useEffect(() => {
        const loadWorkerData = async () => {
            const data = await getWorkerData();
            if (data) {
                setFormData({
                    category: data.category || "",
                    skills: data.skills?.join(", ") || "",
                    experience: data.experience || "",
                    hourlyRate: data.hourlyRate || "",
                    bio: data.bio || "",
                    languagesSpoken: data.languagesSpoken?.join(", ") || "",
                });
            }
        };
        loadWorkerData();
    }, [getWorkerData]);

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
    const DisplayField = ({ label, value, icon }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500 mb-1">
                {label}
            </label>
            <div className="text-gray-900 border rounded-lg p-3 bg-gray-50">
                {icon && <span className="mr-2">{icon}</span>}
                {value || "Not specified"}
            </div>
        </div>
    );

    if (!isEditMode) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg p-6 relative max-w-2xl mx-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Worker Profile</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                        >
                            <FiEdit2 size={16} />
                            Edit Profile
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <DisplayField
                            label="Category"
                            value={formData.category}
                        />
                        <DisplayField
                            label="Experience"
                            value={`${formData.experience} years`}
                        />
                    </div>

                    <DisplayField label="Skills" value={formData.skills} />

                    <DisplayField
                        label="Languages"
                        value={formData.languagesSpoken}
                    />

                    <DisplayField
                        label="Hourly Rate"
                        value={`₹${formData.hourlyRate}/hr`}
                    />

                    <DisplayField label="Bio" value={formData.bio} />
                </div>
            </motion.div>
        );
    }
    const Field = ({
        label,
        name,
        type = "text",
        placeholder,
        icon,
        options,
    }) => {
        const value = formData[name];
        const error = fieldErrors[name];
        const isTextArea = type === "textarea";

        const commonClasses = `w-full px-3 py-2 rounded-lg border 
            ${error ? "border-red-500" : "border-gray-300"} 
            ${!isEditMode ? "bg-gray-50" : ""}
            ${
                isEditMode
                    ? "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    : ""
            }`;

        const renderField = () => {
            if (!isEditMode) {
                return (
                    <div className={commonClasses}>
                        {icon && <span className="mr-2">{icon}</span>}
                        {name === "hourlyRate" && "₹"}
                        {value || "Not specified"}
                        {name === "hourlyRate" && value && "/hr"}
                        {name === "experience" && value && " years"}
                    </div>
                );
            }

            if (type === "select") {
                return (
                    <select
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={commonClasses}
                        disabled={!isEditMode}
                    >
                        <option value="">Select {label}</option>
                        {options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );
            }

            if (isTextArea) {
                return (
                    <textarea
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={commonClasses}
                        rows="4"
                        placeholder={placeholder}
                        disabled={!isEditMode}
                    />
                );
            }

            return (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={commonClasses}
                    placeholder={placeholder}
                    disabled={!isEditMode}
                    {...(type === "number" && {
                        min: name === "hourlyRate" ? "100" : "0",
                        max: name === "hourlyRate" ? "10000" : "50",
                        step: name === "hourlyRate" ? "50" : "1",
                    })}
                />
            );
        };

        return (
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    {label} {isEditMode && "*"}
                </label>
                {renderField()}
                {error && isEditMode && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                {name === "bio" && (
                    <p
                        className={`text-xs ${
                            value.length > 500
                                ? "text-red-600"
                                : "text-gray-500"
                        }`}
                    >
                        {value.length}/500 characters
                    </p>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg p-6 relative max-w-2xl mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                    {isEditMode ? "Edit Profile" : "Worker Profile"}
                </h3>
                <div className="flex gap-2">
                    {!isEditMode ? (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                        >
                            <FiEdit2 size={16} />
                            Edit Profile
                        </button>
                    ) : null}
                    <button
                        onClick={
                            isEditMode ? () => setIsEditMode(false) : onClose
                        }
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FiX size={24} />
                    </button>
                </div>
            </div>

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
                <div className="grid grid-cols-2 gap-6">
                    <Field
                        label="Category"
                        name="category"
                        type="select"
                        options={categories}
                    />
                    <Field label="Experience" name="experience" type="number" />
                </div>

                <Field
                    label="Skills"
                    name="skills"
                    placeholder="e.g. Pipe Fitting, Bathroom Installation"
                />

                <Field
                    label="Languages Spoken"
                    name="languagesSpoken"
                    placeholder="e.g. English, Hindi, Gujarati"
                />

                <Field label="Hourly Rate" name="hourlyRate" type="number" />

                <Field
                    label="Bio"
                    name="bio"
                    type="textarea"
                    placeholder="Brief description about your work experience and expertise"
                />

                {isEditMode && (
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsEditMode(false)}
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
                )}
            </form>
        </motion.div>
    );
}
