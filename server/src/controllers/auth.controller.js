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
            data: { target: `+91${mobileNumber}` }
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

export const insertDummyData = async () => {
    try {
        const dummyWorkers = [

            {
                fullName: "Rajesh Patel",
                email: "rajesh122.patel@example.com",
                password: "password123",
                phone: "8624001011",
                role: "worker",
                address: { city: "Surat", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/men/1.jpg"
            },
            {
                fullName: "Amit Sharma",
                email: "amit12.sharma@example.com",
                password: "password123",
                phone: "8624001002",
                role: "worker",
                address: { city: "Vadodara", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/men/2.jpg"
            },
            {
                fullName: "Priya Desai",
                email: "priya1.desai@example.com",
                password: "password123",
                phone: "8624001003",
                role: "worker",
                address: { city: "Surat", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/women/3.jpg"
            },
            {
                fullName: "Vikas Joshi",
                email: "vikas.joshi@example.com",
                password: "password123",
                phone: "8624001004",
                role: "worker",
                address: { city: "Vadodara", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/men/4.jpg"
            },
            {
                fullName: "Meena Shah",
                email: "meena.shah@example.com",
                password: "password123",
                phone: "8624001005",
                role: "worker",
                address: { city: "Surat", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/women/5.jpg"
            },
            {
                fullName: "Suresh Iyer",
                email: "suresh1.iyer@example.com",
                password: "password123",
                phone: "8624001006",
                role: "worker",
                address: { city: "Vadodara", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/men/6.jpg"
            },
            {
                fullName: "Anjali Mehta",
                email: "anjali1.mehta@example.com",
                password: "password123",
                phone: "8624001007",
                role: "worker",
                address: { city: "Surat", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/women/7.jpg"
            },
            {
                fullName: "Kiran Solanki",
                email: "kiran1.solanki@example.com",
                password: "password123",
                phone: "8624001008",
                role: "worker",
                address: { city: "Vadodara", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/men/8.jpg"
            },
            {
                fullName: "Neha Trivedi",
                email: "neha.trivedi@example.com",
                password: "password123",
                phone: "8624001009",
                role: "worker",
                address: { city: "Surat", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/women/9.jpg"
            },
            {
                fullName: "Rakesh Chauhan",
                email: "rakesh.chauhan@example.com",
                password: "password123",
                phone: "8624001010",
                role: "worker",
                address: { city: "Vadodara", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/men/10.jpg"
            },
            {
                fullName: "Pooja Nair",
                email: "pooja1.nair@example.com",
                password: "password123",
                phone: "8624001011",
                role: "worker",
                address: { city: "Surat", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/women/11.jpg"
            },
            {
                fullName: "Deepak Soni",
                email: "deepak1.soni@example.com",
                password: "password123",
                phone: "8624001012",
                role: "worker",
                address: { city: "Vadodara", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/men/12.jpg"
            },
            {
                fullName: "Ritika Pandey",
                email: "ritik1a.pandey@example.com",
                password: "password123",
                phone: "8624001013",
                role: "worker",
                address: { city: "Surat", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/women/13.jpg"
            },
            {
                fullName: "Harshad Rana",
                email: "harshad.rana@example.com",
                password: "password123",
                phone: "8624001014",
                role: "worker",
                address: { city: "Vadodara", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/men/14.jpg"
            },
            {
                fullName: "Komal Jha",
                email: "komal1.jha@example.com",
                password: "password123",
                phone: "8624001015",
                role: "worker",
                address: { city: "Surat", state: "Gujarat" },
                profileImage: "https://randomuser.me/api/portraits/women/15.jpg"
            }
        ];

        await User.insertMany(dummyWorkers);
        console.log("Dummy workers inserted");
    } catch (error) {
        console.error("Error inserting dummy workers:", error);
    }

};

export const getUserData = async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        res.status(500).json({ user: null });
    }
};
