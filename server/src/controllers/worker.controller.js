import { uploadToCloudinary } from "../config/cloudinary.js";
import { Worker } from "../models/worker.model.js";
import { User } from "../models/user.model.js";

const uploadPoliceVerification = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload buffer to Cloudinary
    const fileUrl = await uploadToCloudinary(req.file.buffer, "policeDocs");

    // Update worker (using logged-in user)
    const worker = await User.findById(req.user._id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    worker.policeDocument = fileUrl;
    await worker.save();

    res.status(200).json({ message: "File uploaded successfully", fileUrl });
  } catch (error) {
    console.error("Error uploading police verification document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { uploadPoliceVerification };
