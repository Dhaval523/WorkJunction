import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use HTTPS in production
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const setToken = (user, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.cookie("token", token, cookieOptions);
    return token;
    
};

export const removeToken = (res) => {
    res.clearCookie("token", cookieOptions);
};
