import { Router } from "express";
import {
    getUserData,
    logout,
    sendOtp,
    signin,
    signup,
    verifyOtp,
    insertDummyData

} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", signin);
router.post("/sign-up", signup);
router.post("/logout", logout);
router.post("/send-otp", requireAuth, sendOtp);
router.post("/verify-otp", requireAuth, verifyOtp);
router.get("/user", requireAuth, getUserData);
router.post("/insert", insertDummyData); 

export default router;
