import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        ref: "User",
    },
    workerId: {
        type: String,
        required: true,
        ref: "Worker",
    },
    serviceId: {
        type: String,
        required: true,
        ref: "Service",
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "declined", "cancelled", "completed"],
        default: "pending",
    },
});

// Create and export the Mongoose Model
const Booking = mongoose.model("Booking", BookingSchema);

export { Booking };
