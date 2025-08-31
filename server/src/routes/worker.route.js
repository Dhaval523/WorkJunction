import express from "express";
import {
    getData,
    updateWorkerProfile,
    searchWorkers,
    inssertDummyData
} from "../controllers/worker.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

// Protected routes
// router.use(requireAuth);

router.get("/", getData);
router.patch("/profile", updateWorkerProfile);
router.get("/search", searchWorkers);
router.post("/insertWorkers",inssertDummyData);


export default router;
