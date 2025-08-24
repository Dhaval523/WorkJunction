import { Worker } from "../models/worker.model.js";

const updateWorkerProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            category,
            skills,
            experience,
            hourlyRate,
            bio,
            languagesSpoken,
        } = req.body;

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
            category: category || worker.category,
            skills: skills || worker.skills,
            experience: experience || worker.experience,
            hourlyRate: hourlyRate || worker.hourlyRate,
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

// Add to exports
export {
    // ...existing exports...
    updateWorkerProfile,
    getData,
};
