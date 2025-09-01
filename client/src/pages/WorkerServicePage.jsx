import { useEffect, useState } from "react";
import { FiPlus, FiX, FiBriefcase, FiEdit2 } from "react-icons/fi";
import useWorkerStore from "../store/WorkerStore.";
import Menu from "../components/menu";

const ServiceCard = ({ service, onEdit }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-800">
                {service.name}
            </h3>
            <button
                onClick={() => onEdit(service)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
                <FiEdit2 size={18} />
            </button>
        </div>
        <p className="text-gray-600 text-sm mt-1">{service.description}</p>
        <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
                {service.category}
            </span>
            <div className="flex items-center text-indigo-600">
                ₹ <span className="font-semibold">{service.hourlyRate}/hr</span>
            </div>
        </div>
    </div>
);

const AddServiceForm = ({ onClose, onSubmit, workerSkills }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        hourlyRate: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <FiX size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Add New Service</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Service Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Category (Your Skills)
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select Skill</option>
                            {workerSkills.map((skill) => (
                                <option key={skill} value={skill}>
                                    {skill}
                                </option>
                            ))}
                        </select>
                        {workerSkills.length === 0 && (
                            <p className="mt-1 text-sm text-red-500">
                                Please add skills to your profile first
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            required
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Add Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditServiceForm = ({ service, onClose, onSubmit, workerSkills }) => {
    const [formData, setFormData] = useState({
        name: service.name,
        description: service.description,
        category: service.category,
        hourlyRate: service.hourlyRate,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(service._id, formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <FiX size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Edit Service</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Same form fields as AddServiceForm */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Service Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Category (Your Skills)
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select Skill</option>
                            {workerSkills.map((skill) => (
                                <option key={skill} value={skill}>
                                    {skill}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            required
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const WorkerServicesPage = () => {
    const {
        services,
        getWorkerServices,
        addService,
        isLoading,
        worker,
        editService,
        getWorkerData,
    } = useWorkerStore();
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!worker) {
                await getWorkerData();
            }
            await getWorkerServices();
        };
        fetchData().catch(console.error);
    }, [getWorkerServices, worker, getWorkerData]);

    const handleAddService = async (serviceData) => {
        try {
            if (worker?.skills?.length === 0) {
                toast.error("Please add skills to your profile first");
                return;
            }
            await addService(serviceData);
            setShowAddForm(false);
        } catch (error) {
            console.error("Failed to add service:", error);
        }
    };
    const [serviceToEdit, setServiceToEdit] = useState(null);

    const handleEditService = async (serviceId, serviceData) => {
        try {
            await editService(serviceId, serviceData);
            setServiceToEdit(null);
        } catch (error) {
            console.error("Failed to edit service:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Menu />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 ml-64 lg:px-8 py-8 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FiBriefcase className="text-indigo-600" />
                            My Services
                        </h1>
                        <p className="text-gray-600">
                            Manage your service offerings and pricing
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Available Services
                        </h2>
                        <button
                            onClick={() => {
                                if (!worker?.skills?.length) {
                                    toast.error(
                                        "Please add skills to your profile first"
                                    );
                                    return;
                                }
                                setShowAddForm(true);
                            }}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <FiPlus /> Add Service
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">
                                Loading services...
                            </p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-8">
                            <FiBriefcase className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-lg text-gray-500">
                                No services added yet
                            </p>
                            <p className="text-sm text-gray-400">
                                Add your first service to start receiving
                                bookings
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service) => (
                                <ServiceCard
                                    key={service._id}
                                    service={service}
                                    onEdit={setServiceToEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showAddForm && (
                <AddServiceForm
                    onClose={() => setShowAddForm(false)}
                    onSubmit={handleAddService}
                    workerSkills={worker?.skills || []}
                />
            )}
            {serviceToEdit && (
                <EditServiceForm
                    service={serviceToEdit}
                    onClose={() => setServiceToEdit(null)}
                    onSubmit={handleEditService}
                    workerSkills={worker?.skills || []}
                />
            )}
        </div>
    );
};

export default WorkerServicesPage;
