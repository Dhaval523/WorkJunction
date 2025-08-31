import mongoose from "mongoose";

// Define the Service Schema
const ServiceSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    hourlyRate: {
        type: Number,
        required: true,
    },
});

// Create and export the Mongoose Model
const Service = mongoose.model("Service", ServiceSchema);

export { Service };
