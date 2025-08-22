import { useState } from "react";
import { motion } from "framer-motion";
import { BsPhone } from "react-icons/bs";

const OtpCard = ({ onVerify, phone }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            prev?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join("");
        onVerify(otpString);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md z-10">
            <div className="relative">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-8 px-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <BsPhone className="text-white text-3xl" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        Verify Your Phone
                    </h1>
                    <p className="text-blue-100 mt-2">
                        Enter the 6-digit code sent to {phone}
                    </p>
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                    <div className="w-10 h-10 bg-white rotate-45"></div>
                </div>
            </div>

            <div className="p-8 pt-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                        disabled={otp.some((digit) => !digit)}
                    >
                        Verify Number
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 mb-2">
                        Time remaining:{" "}
                        <span className="font-medium text-indigo-600">
                            02:59
                        </span>
                    </p>
                    <button
                        className="text-sm text-indigo-600 hover:underline font-medium disabled:text-gray-400"
                        disabled
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpCard;
