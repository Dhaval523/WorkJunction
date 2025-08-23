// import { Router } from "express";
// import { uploadPoliceVerification } from "../controllers/worker.controller.js";
// import { requireAuth } from "../middleware/auth.middleware.js";

// const router = Router();

// router.post("/upload-police-verification",requireAuth ,upload.single("file") ,uploadPoliceVerification);

// export default router;

import express from "express";
import upload from "../middleware/multer.js"; // Assuming you have a multer config file
import {
    updateVerificationStage,
    acceptTnC,
    uploadAadharDoc,
    uploadPoliceVerification,
    uploadProfilePhoto,
    reviewWorkerVerification,
    getVerificationStatus,
} from "../controllers/worker.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

// Protected routes
router.use(requireAuth);

// Worker verification routes
router.post("/accept-tnc", acceptTnC);
router.post("/upload-aadhar", upload.single("file"), uploadAadharDoc);
router.post(
    "/upload-police-verification",
    upload.single("file"),
    uploadPoliceVerification
);
router.post("/upload-profile-photo", upload.single("file"), uploadProfilePhoto);
router.get("/verification-status", getVerificationStatus);

// // Admin routes
// router.patch('/verify/:workerId', authorizeRoles('admin'), reviewWorkerVerification);
// router.patch('/stage/:workerId', authorizeRoles('admin'), updateVerificationStage);

export default router;
