import { Router } from "express";
import { uploadPoliceVerification } from "../controllers/worker.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js"; // Assuming you have a multer config file

const router = Router();

router.post("/upload-police-verification",requireAuth ,upload.single("file") ,uploadPoliceVerification);

export default router;