import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        experience: {
            type: Number,
            min: 0,
            default: 0,
        },
        availability: {
            type: Boolean,
            default: true,
        },
        isWorkerVerified: {
            type: Boolean,
            default: false,
        },
        verification: {
            policeDocUrl: {
                type: String,
                default: null,
            },
            aadharDocUrl: {
                type: String,
                default: null,
            },
            isPoliceDocVerified: {
                type: Boolean,
                default: false,
            },
            isAadharDocVerified: {
                type: Boolean,
                default: false,
            },
        },
        verificationStage: {
            type: String,
            enum: [
                "TNC_PENDING",
                "TNC_ACCEPTED",
                "AADHAR_DOC_SUBMITTED",
                "PHOTO_UPLOADED",
                "POLICE_DOC_SUBMITTED",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED",
            ],
            default: "TNC_PENDING",
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        totalJobs: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],

        bio: {
            type: String,
        },
        languagesSpoken: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

// Detailed verification schema
const verificationSchema = new mongoose.Schema(
    {
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Worker",
            required: true,
        },
        stage: {
            type: String,
            enum: [
                "TNC_PENDING",
                "TNC_ACCEPTED",
                "POLICE_DOC_SUBMITTED",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED",
            ],
            default: "TNC_PENDING",
        },
        policeDocument: {
            type: String, // file path / S3 URL
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Admin
        },
        reviewedAt: {
            type: Date,
        },
        rejectedReason: {
            type: String,
        },
    },
    { timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);
const Verification = mongoose.model("Verification", verificationSchema);

export { Worker, Verification };
