import { User } from "../models/user.model.js";
import { removeToken, setToken } from "../utils/utils.js";
import twilio from "twilio";
import dotenv from "dotenv";
import { Worker } from "../models/worker.model.js";
import axios from "axios";
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
                isMobileNumberVerified: user.isMobileNumberVerified,
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
                isMobileNumberVerified: user.isMobileNumberVerified,
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
    const options = {
      method: 'POST',
      url: 'https://sms-verify3.p.rapidapi.com/send-numeric-verify',
      headers: {
        'content-type': 'application/json',
        'X-Rapidapi-Key': process.env.RAPIDAPI_KEY,
        'X-Rapidapi-Host': 'sms-verify3.p.rapidapi.com'
      },
      data: { target : `+91${mobileNumber}` }
    };

    const response = await axios.request(options);
    const { verify_code, status } = response.data;

    if (status !== "success") {
      return res.status(400).json({ message: "Failed to send OTP" });
    }

    // Store OTP in DB (with expiry of 5 mins)
    const user = await User.findOneAndUpdate(
      { phone: mobileNumber },
      { otp: verify_code, otpExpires: Date.now() + 5 * 60 * 1000 },
      { new: true, upsert: true }
    );

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
export const verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phone: mobileNumber });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired, please request again" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified
    user.isMobileNumberVerified = true;
    user.otp = null; // clear OTP
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};


export const getUserData = async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        res.status(500).json({ user: null });
    }
};
