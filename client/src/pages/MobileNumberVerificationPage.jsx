// Example usage in a verification page
import { motion } from "framer-motion";
import OtpCard from "../components/OtpCard";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

const VerificationPage = () => {
    const { user, verifyOtp } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background animations */}
            <motion.div
                className="absolute top-20 left-20 w-16 h-16 bg-indigo-200 rounded-full opacity-20"
                animate={{
                    y: [0, 20, 0],
                    x: [0, 10, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-40 right-32 w-24 h-24 bg-blue-200 rounded-full opacity-20"
                animate={{
                    y: [0, -30, 0],
                    x: [0, -15, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <OtpCard
                phone={user.phone}
                onVerify={async (otp) => {
                    try {
                        const result = await verifyOtp({
                            otp,
                            mobileNumber: user.phone,
                        });
                        if (!result) return;
                        if (user?.role == "customer") {
                            navigate("/userdashboard");
                        } else {
                            navigate("/verification");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }}
            />
        </div>
    );
};

export default VerificationPage;
