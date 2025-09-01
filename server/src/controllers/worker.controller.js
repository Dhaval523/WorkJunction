import { Worker } from "../models/worker.model.js";
import { Service } from "../models/service.model.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const updateWorkerProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { skills, experience, bio, languagesSpoken } = req.body;

        // Find worker by userId
        let worker = await Worker.findOne({ user: userId });

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        // Update fields
        const updates = {
            skills: skills || worker.skills,
            experience: experience || worker.experience,
            bio: bio || worker.bio,
            languagesSpoken: languagesSpoken || worker.languagesSpoken,
        };

        // Update worker
        worker = await Worker.findOneAndUpdate(
            { user: userId },
            { $set: updates },
            { new: true }
        ).select("-__v");

        return res.status(200).json({
            success: true,
            message: "Worker profile updated successfully",
            worker,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating worker profile",
            error: error.message,
        });
    }
};

const getData = async (req, res) => {
    try {
        const userId = req.user._id;
        const worker = await Worker.findOne({ user: userId });
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        res.status(200).json(worker);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const searchWorkers = async (req, res) => {
    try {
        const {
            name,
            city,
            category,
            skills,
            experience,
            minPrice,
            maxPrice,
            languagesSpoken,
        } = req.query;

        let filter = {};
        if (category) filter.category = category;
        if (skills) filter.skills = { $in: skills.split(",") };
        if (experience) filter.experience = { $gte: Number(experience) };

        // This part remains the same
        if (minPrice || maxPrice) {
            filter.hourlyRate = {};
            if (minPrice) filter.hourlyRate.$gte = Number(minPrice);
            if (maxPrice) filter.hourlyRate.$lte = Number(maxPrice);
        }

        if (languagesSpoken)
            filter.languagesSpoken = { $in: languagesSpoken.split(",") };

        // First find workers with worker-based filters
        let workers = await Worker.find(filter)
            .populate({
                path: "user",
                // 👇 --- The changes are here --- 👇
                match: {
                    // Match 'fullName' instead of 'name'
                    ...(name
                        ? { fullName: { $regex: name, $options: "i" } }
                        : {}),
                    // Use dot notation for the nested 'city' field
                    ...(city
                        ? { "address.city": { $regex: city, $options: "i" } }
                        : {}),
                },
                // 👆 --- End of changes --- 👆
                select: "-__v -password",
            })
            .select("-__v");

        // This filtering logic is still correct and necessary
        workers = workers.filter((worker) => worker.user !== null);

        res.status(200).json(workers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const inssertDummyData = async () => {
    try {
        const dummyWorkers = [
            {
                user: new ObjectId("68b4409c021713a25a9e515d"), // Rajesh Patel
                category: "Electrician",
                skills: ["Wiring", "Fan Installation", "AC Repair"],
                experience: 4,
                hourlyRate: 250,
                availability: true,
                isWorkerVerified: true,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police1.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar1.pdf",
                    isPoliceDocVerified: true,
                    isAadharDocVerified: true,
                },
                verificationStage: "APPROVED",
                rating: 4.5,
                totalJobs: 38,
                bio: "Experienced electrician with 4 years of residential and commercial wiring expertise.",
                languagesSpoken: ["Gujarati", "Hindi", "English"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e515e"), // Amit Sharma
                category: "Plumber",
                skills: [
                    "Pipe Fitting",
                    "Leak Repair",
                    "Water Tank Installation",
                ],
                experience: 6,
                hourlyRate: 200,
                availability: true,
                isWorkerVerified: false,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police2.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar2.pdf",
                    isPoliceDocVerified: false,
                    isAadharDocVerified: true,
                },
                verificationStage: "UNDER_REVIEW",
                rating: 4.0,
                totalJobs: 25,
                bio: "Plumber with 6 years of expertise in residential and commercial projects.",
                languagesSpoken: ["Hindi", "Gujarati"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e515f"), // Priya Desai
                category: "Cleaner",
                skills: ["Home Cleaning", "Office Cleaning", "Deep Cleaning"],
                experience: 3,
                hourlyRate: 150,
                availability: true,
                isWorkerVerified: true,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police3.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar3.pdf",
                    isPoliceDocVerified: true,
                    isAadharDocVerified: true,
                },
                verificationStage: "APPROVED",
                rating: 4.7,
                totalJobs: 52,
                bio: "Professional cleaner specializing in residential and commercial cleaning services.",
                languagesSpoken: ["Gujarati", "English"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e5160"), // Vikas Joshi
                category: "Carpenter",
                skills: [
                    "Furniture Repair",
                    "Wood Polishing",
                    "Custom Furniture",
                ],
                experience: 5,
                hourlyRate: 300,
                availability: true,
                isWorkerVerified: false,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police4.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar4.pdf",
                    isPoliceDocVerified: false,
                    isAadharDocVerified: true,
                },
                verificationStage: "TNC_ACCEPTED",
                rating: 4.1,
                totalJobs: 29,
                bio: "Carpenter with 5 years of experience in home and office furniture.",
                languagesSpoken: ["Hindi", "Gujarati"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e5161"), // Meena Shah
                category: "Painter",
                skills: [
                    "Interior Painting",
                    "Exterior Painting",
                    "Wall Design",
                ],
                experience: 7,
                hourlyRate: 350,
                availability: true,
                isWorkerVerified: true,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police5.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar5.pdf",
                    isPoliceDocVerified: true,
                    isAadharDocVerified: true,
                },
                verificationStage: "APPROVED",
                rating: 4.6,
                totalJobs: 64,
                bio: "Professional painter with expertise in interior and exterior projects.",
                languagesSpoken: ["Gujarati", "English"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e5162"), // Suresh Iyer
                category: "Electrician",
                skills: [
                    "Wiring",
                    "Switchboard Installation",
                    "Inverter Setup",
                ],
                experience: 8,
                hourlyRate: 280,
                availability: true,
                isWorkerVerified: false,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police6.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar6.pdf",
                    isPoliceDocVerified: false,
                    isAadharDocVerified: false,
                },
                verificationStage: "REJECTED",
                rating: 3.9,
                totalJobs: 19,
                bio: "Electrician with experience in domestic and industrial work.",
                languagesSpoken: ["Hindi", "Tamil", "English"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e5163"), // Anjali Mehta
                category: "Cleaner",
                skills: ["Kitchen Cleaning", "Bathroom Cleaning", "Dusting"],
                experience: 4,
                hourlyRate: 120,
                availability: true,
                isWorkerVerified: true,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police7.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar7.pdf",
                    isPoliceDocVerified: true,
                    isAadharDocVerified: true,
                },
                verificationStage: "APPROVED",
                rating: 4.8,
                totalJobs: 70,
                bio: "Cleaner specialized in deep cleaning services for homes and offices.",
                languagesSpoken: ["Gujarati", "Hindi"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e5164"), // Kiran Solanki
                category: "Carpenter",
                skills: ["Wood Cutting", "Polishing", "Custom Furniture"],
                experience: 5,
                hourlyRate: 220,
                availability: true,
                isWorkerVerified: false,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police8.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar8.pdf",
                    isPoliceDocVerified: false,
                    isAadharDocVerified: true,
                },
                verificationStage: "UNDER_REVIEW",
                rating: 4.0,
                totalJobs: 31,
                bio: "Carpenter with knowledge of modern and traditional furniture.",
                languagesSpoken: ["Hindi", "Gujarati"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e5165"), // Neha Trivedi
                category: "Painter",
                skills: ["Wall Painting", "Texture Design", "Polishing"],
                experience: 3,
                hourlyRate: 200,
                availability: true,
                isWorkerVerified: true,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police9.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar9.pdf",
                    isPoliceDocVerified: true,
                    isAadharDocVerified: true,
                },
                verificationStage: "APPROVED",
                rating: 4.4,
                totalJobs: 40,
                bio: "Painter focusing on decorative wall designs and residential projects.",
                languagesSpoken: ["Gujarati", "English"],
            },
            {
                user: new ObjectId("68b4409c021713a25a9e5166"), // Rakesh Chauhan
                category: "Plumber",
                skills: [
                    "Leak Repair",
                    "Water Tank Fitting",
                    "Bathroom Fittings",
                ],
                experience: 6,
                hourlyRate: 180,
                availability: true,
                isWorkerVerified: false,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police10.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar10.pdf",
                    isPoliceDocVerified: false,
                    isAadharDocVerified: false,
                },
                verificationStage: "TNC_PENDING",
                rating: 3.8,
                totalJobs: 21,
                bio: "Skilled plumber with experience in household and commercial plumbing.",
                languagesSpoken: ["Hindi", "Gujarati"],
            },
            {
                user: new ObjectId("64f08c6d0b3f2e4b6d9c2a1b"), // Pooja Nair
                category: "Cleaner",
                skills: ["House Cleaning", "Deep Cleaning", "Kitchen Cleaning"],
                experience: 5,
                hourlyRate: 160,
                availability: true,
                isWorkerVerified: true,
                verification: {
                    policeDocUrl: "https://dummy.com/docs/police11.pdf",
                    aadharDocUrl: "https://dummy.com/docs/aadhar11.pdf",
                    isPoliceDocVerified: true,
                    isAadharDocVerified: true,
                },
                verificationStage: "APPROVED",
                rating: 4.6,
                totalJobs: 56,
                bio: "House cleaner specializing in deep and detailed cleaning work.",
                languagesSpoken: ["Malayalam", "Hindi", "English"],
            },
            // {
            //     user: new ObjectId("64f08c6d0b3f2e4b6d9c2a1c"), // Deepak Soni
            //     category: "Electrician",
            //     skills: ["Fan Repair", "AC Installation", "Wiring"],
            //     experience: 7,
            //     hourlyRate: 270,
            //     availability: true,
            //     isWorkerVerified: false,
            //     verification: {
            //         policeDocUrl: "https://dummy.com/docs/police12.pdf",
            //         aadharDocUrl: "https://dummy.com/docs/aadhar12.pdf",
            //         isPoliceDocVerified: false,
            //         isAadharDocVerified: true
            //     },
            //     verificationStage: "UNDER_REVIEW",
            //     rating: 4.1,
            //     totalJobs: 33,
            //     bio: "Electrician with expertise in installation and repair.",
            //     languagesSpoken: ["Gujarati", "Hindi"]
            // },
            // {
            //     user: new  ObjectId("64f08c6d0b3f2e4b6d9c2a1d"), // Ritika Pandey
            //     category: "Painter",
            //     skills: ["Exterior Painting", "Color Mixing", "Texture Design"],
            //     experience: 4,
            //     hourlyRate: 220,
            //     availability: true,
            //     isWorkerVerified: true,
            //     verification: {
            //         policeDocUrl: "https://dummy.com/docs/police13.pdf",
            //         aadharDocUrl: "https://dummy.com/docs/aadhar13.pdf",
            //         isPoliceDocVerified: true,
            //         isAadharDocVerified: true
            //     },
            //     verificationStage: "APPROVED",
            //     rating: 4.7,
            //     totalJobs: 62,
            //     bio: "Painter with creative design and texture expertise.",
            //     languagesSpoken: ["Hindi", "English"]
            // },
            // {
            //     user: new ObjectId("64f08c6d0b3f2e4b6d9c2a1e"), // Harshad Rana
            //     category: "Carpenter",
            //     skills: ["Custom Woodwork", "Repairs", "Polishing"],
            //     experience: 8,
            //     hourlyRate: 320,
            //     availability: true,
            //     isWorkerVerified: false,
            //     verification: {
            //         policeDocUrl: "https://dummy.com/docs/police14.pdf",
            //         aadharDocUrl: "https://dummy.com/docs/aadhar14.pdf",
            //         isPoliceDocVerified: false,
            //         isAadharDocVerified: false
            //     },
            //     verificationStage: "TNC_ACCEPTED",
            //     rating: 3.9,
            //     totalJobs: 28,
            //     bio: "Carpenter with expertise in residential furniture and fittings.",
            //     languagesSpoken: ["Gujarati", "Hindi"]
            // },
            // {
            //     user: ObjectId("64f08c6d0b3f2e4b6d9c2a1f"), // Komal Jha
            //     category: "Cleaner",
            //     skills: ["Office Cleaning", "Deep Cleaning", "House Cleaning"],
            //     experience: 2,
            //     hourlyRate: 140,
            //     availability: true,
            //     isWorkerVerified: true,
            //     verification: {
            //         policeDocUrl: "https://dummy.com/docs/police15.pdf",
            //         aadharDocUrl: "https://dummy.com/docs/aadhar15.pdf",
            //         isPoliceDocVerified: true,
            //         isAadharDocVerified: true
            //     },
            //     verificationStage: "APPROVED",
            //     rating: 4.5,
            //     totalJobs: 22,
            //     bio: "Cleaner with 2 years of experience in residential cleaning.",
            //     languagesSpoken: ["Hindi", "English"]
            // }
        ];
        await Worker.insertMany(dummyWorkers);
        console.log("Dummy workers inserted");
    } catch (error) {
        console.error("Error inserting dummy workers:", error);
    }
};

const addService = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, description, category, hourlyRate } = req.body;

        // Find worker by userId
        const worker = await Worker.findOne({ user: userId });
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        const service = await Service.create({
            workerId: worker._id,
            name,
            description,
            category,
            hourlyRate,
        });

        return res.status(201).json({
            success: true,
            message: "Service added successfully",
            service,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error adding service",
            error: error.message,
        });
    }
};

const getWorkerServices = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find worker by userId
        const worker = await Worker.findOne({ user: userId });
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        // Get all services for this worker
        const services = await Service.find({ workerId: worker._id });

        return res.status(200).json({
            success: true,
            services,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error.message,
        });
    }
};

const editService = async (req, res) => {
    try {
        const userId = req.user._id;
        const { serviceId } = req.params;
        const { name, description, category, hourlyRate } = req.body;

        // Find worker by userId
        const worker = await Worker.findOne({ user: userId });
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        // Find and update service
        const service = await Service.findOneAndUpdate(
            { _id: serviceId, workerId: worker._id },
            { name, description, category, hourlyRate },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found or unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating service",
            error: error.message,
        });
    }
};
export {
    // ...existing exports...
    updateWorkerProfile,
    getData,
    inssertDummyData,
    searchWorkers,
    addService,
    getWorkerServices,
    editService,
};
