import { User } from "../models/user.model.js";
import { removeToken, setToken } from "../utils/utils.js";

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

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            phone,
            role,
        });
   
        // Token
        const token = setToken(user, res);

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                fullName,
                email: user.email,
                role: user.role,
            },
            token
            
    
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
                isVerified: user.isVerified,
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
