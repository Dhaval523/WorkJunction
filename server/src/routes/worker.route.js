import express from "express";
import {
    getData,
    updateWorkerProfile,
    searchWorkers,
    inssertDummyData,
    addService,
    getWorkerServices,
    editService,
} from "../controllers/worker.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

// Protected routes
router.use(requireAuth);

router.get("/", getData);
router.patch("/profile", updateWorkerProfile);
router.get("/search", searchWorkers);
router.post("/insertWorkers", inssertDummyData);
router.post("/services", requireAuth, addService);
router.get("/services", requireAuth, getWorkerServices);
router.patch("/services/:serviceId", requireAuth, editService);

export default router;
