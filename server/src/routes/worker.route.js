import express from "express";
import {
    getData,
    updateWorkerProfile,
} from "../controllers/worker.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

// Protected routes
router.use(requireAuth);

router.get("/", getData);
router.patch("/profile", updateWorkerProfile);

export default router;
