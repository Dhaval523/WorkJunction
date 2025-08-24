import { uploadToCloudinary } from "../config/cloudinary.js";
import { Worker, Verification } from "../models/worker.model.js";

const updateVerificationStage = async (req, res) => {
    try {
        const { workerId } = req.params;
        const { stage } = req.body;

        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        worker.verificationStage = stage;
        await worker.save();

        return res.status(200).json({
            success: true,
            message: "Verification stage updated successfully",
            worker,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating verification stage",
            error: error.message,
        });
    }
};

const acceptTnC = async (req, res) => {
    try {
        const userId = req.user._id;

        const worker = await Worker.findOne({ user: userId });
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        worker.verificationStage = "TNC_ACCEPTED";
        await worker.save();

        return res.status(200).json({
            success: true,
            message: "Terms and conditions accepted",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error accepting terms and conditions",
            error: error.message,
        });
    }
};

const uploadAadharDoc = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const userId = req.user._id;

        const fileUrl = await uploadToCloudinary(
            req.file.buffer,
            "aadhar_documents"
        );

        const worker = await Worker.findOne({ user: userId });
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        worker.verification.aadharDocUrl = fileUrl;
        worker.verificationStage = "AADHAR_DOC_SUBMITTED";
        await worker.save();

        return res.status(200).json({
            success: true,
            message: "Aadhar document uploaded successfully",
            fileUrl,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading Aadhar document",
            error: error.message,
        });
    }
};

const uploadPoliceVerification = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const userId = req.user._id;

        const fileUrl = await uploadToCloudinary(
            req.file.buffer,
            "police_verification"
        );

        const worker = await Worker.findOne({ user: userId });
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        worker.verification.policeDocUrl = fileUrl;
        worker.verificationStage = "POLICE_DOC_SUBMITTED";
        await worker.save();

        return res.status(200).json({
            success: true,
            message: "Police verification document uploaded successfully",
            fileUrl,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading police verification",
            error: error.message,
        });
    }
};

const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const userId = req.user._id;

        const fileUrl = await uploadToCloudinary(
            req.file.buffer,
            "profile_photos"
        );

        const worker = await Worker.findOne({ user: userId });
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        worker.verificationStage = "PHOTO_UPLOADED";
        await worker.save();

        return res.status(200).json({
            success: true,
            message: "Profile photo uploaded successfully",
            fileUrl,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading profile photo",
            error: error.message,
        });
    }
};

const reviewWorkerVerification = async (req, res) => {
    try {
        const { workerId } = req.params;
        const { status, rejectedReason } = req.body;

        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        worker.verificationStage = status;
        worker.verification.isPoliceDocVerified = status === "APPROVED";
        worker.verification.isAadharDocVerified = status === "APPROVED";

        await Verification.create({
            worker: workerId,
            stage: status,
            reviewedBy: req.user._id,
            reviewedAt: new Date(),
            rejectedReason: status === "REJECTED" ? rejectedReason : undefined,
        });

        await worker.save();

        return res.status(200).json({
            success: true,
            message: `Worker verification ${status.toLowerCase()}`,
            worker,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error reviewing worker verification",
            error: error.message,
        });
    }
};

const getVerificationStatus = async (req, res) => {
    try {
        const userId = req.user._id;

        const worker = await Worker.findOne({ user: userId })
            .select("verificationStage verification")
            .lean();

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found",
            });
        }

        return res.status(200).json({
            success: true,
            verificationStatus: worker,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching verification status",
            error: error.message,
        });
    }
};

const getCurrentStage = async (req, res) => {
    try {
        const userId = req.user._id;

        const worker = await Worker.findOne({ user: userId })
            .select('verificationStage verification')
            .lean();

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found"
            });
        }

        // Map verification stage to step number
        const stageToStep = {
            "TNC_PENDING": 0,
            "TNC_ACCEPTED": 1,
            "POLICE_DOC_SUBMITTED": 2,
            "AADHAR_DOC_SUBMITTED": 2,
            "PHOTO_UPLOADED": 2,
            "UNDER_REVIEW": 3,
            "APPROVED": 4,
            "REJECTED": 3
        };

        return res.status(200).json({
            success: true,
            currentStep: stageToStep[worker.verificationStage] || 0,
            verificationStage: worker.verificationStage,
            verification: worker.verification
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching current stage",
            error: error.message
        });
    }
};

export {
    updateVerificationStage,
    acceptTnC,
    uploadAadharDoc,
    uploadPoliceVerification,
    uploadProfilePhoto,
    reviewWorkerVerification,
    getVerificationStatus,
    getCurrentStage
};
