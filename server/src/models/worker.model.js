import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // Work category and skills
        category: {
            type: String,
            enum: [
                "Plumber",
                "Electrician",
                "Cleaner",
                "Carpenter",
                "Painter",
                "Other",
            ],
            required: true,
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
        hourlyRate: {
            type: Number,
            min: 0,
        },

        // Availability for booking
        availability: {
            type: Boolean,
            default: true,
        },

        // Document verification
        govtIDType: {
            type: String,
            enum: ["Aadhaar", "PAN", "Driving License", "Passport"],
        },
        govtIDNumber: {
            type: String,
        },
        documentUpload: {
            type: String, // URL or file path
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        // Ratings & Reviews
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

        // Optional bio and language
        bio: {
            type: String,
        },
        languagesSpoken: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Worker = mongoose.model("Worker", workerSchema);
export { Worker };
