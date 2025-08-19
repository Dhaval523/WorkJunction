import { Router } from "express";
import { logout, signin, signup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/sign-in", signin);
router.post("/sign-up", signup);
router.post("/logout", logout);

export default router;
