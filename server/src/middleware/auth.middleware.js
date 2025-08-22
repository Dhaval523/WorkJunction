import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    
    const token = req.cookies.token; 
    console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    req.user = await User.findById(payload.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
