import { User } from "../models/user.model.js";
import { removeToken, setToken } from "../utils/utils.js";
import twilio from "twilio";
import dotenv from "dotenv";
import { Worker } from "../models/worker.model.js";
dotenv.config();

// 📝 Signup Controller
export const signup = async (req, res) => {
    try {
        const { fullName, email, password, phone, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res
                .status(400)
                .json({ message: "Phone number already registered" });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            phone,
            role,
        });

        if (user.role == "worker") {
            await Worker.create({
                user: user._id,
            });
        }
        // Token
        setToken(user, res);

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                fullName,
                email: user.email,
                role: user.role,
                isMobileVerified: user.isMobileNumberVerified,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔐 Signin Controller
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists and select password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Token
        setToken(user, res);

        res.status(200).json({
            message: "Signin successful",
            user: {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role,
                isMobileVerified: user.isMobileNumberVerified,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = (req, res) => {
    removeToken(res);
    res.status(200).json({ message: "Logged out successfully" });
};

export const sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;
    try {
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        const verification = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_ID)
            .verifications.create({
                to: `+91${mobileNumber}`,
                channel: "sms",
            });
        console.log(verification.sid);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Failed to send otp:", error);
        res.status(500).json({ message: "Failed to send otp" });
    }
};

export const verifyOtp = async (req, res) => {
    const { mobileNumber, otp } = req.body;
    try {
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        const verifiedResponse = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks.create({
                to: `+91${mobileNumber}`,
                code: otp,
            });
        console.log(verifiedResponse.status);
        if (verifiedResponse.status !== "approved") {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const user = await User.findOne({ phone: mobileNumber });
        user.isMobileNumberVerified = true;
        await user.save();
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Failed to verify otp:", error);
        res.status(500).json({ message: "Failed to verify otp" });
    }
};

export const getUserData = async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        res.status(500).json({ user: null });
    }
};
