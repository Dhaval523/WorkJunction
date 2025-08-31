import React, { useEffect, useMemo, useRef, useState } from "react";
import useWorkerStore from "../store/WorkerStore.";
import { useNavigate } from "react-router-dom";

const WebcamCapture = ({ onCapture, onError }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setHasPermission(true);
            } catch (err) {
                console.error("Camera access error:", err);
                setHasPermission(false);
                onError(
                    "Camera access denied. Please allow camera access and refresh."
                );
            }
        };
        startCamera();

        return () => {
            // Cleanup: stop all video streams when component unmounts
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, [onError]);

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            // Convert canvas to blob
            canvas.toBlob(
                (blob) => {
                    // Create a File object from the blob
                    const file = new File([blob], "selfie.jpg", {
                        type: "image/jpeg",
                    });
                    onCapture(file);
                },
                "image/jpeg",
                0.8
            );
        }
    };

    if (hasPermission === null) {
        return <div>Requesting camera permission...</div>;
    }

    if (hasPermission === false) {
        return (
            <div>
                Camera access denied. Please allow camera access and refresh.
            </div>
        );
    }

    return (
        <div className="relative">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
                style={{ maxWidth: "400px" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button
                onClick={capturePhoto}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Take Photo
            </button>
        </div>
    );
};

export default function WorkerVerificationFlow() {
    const navigate = useNavigate();
    // States
    const [step, setStep] = useState(0);
    const [policeStatus, setPoliceStatus] = useState("Pending");
    const [aadhaarStatus, setAadhaarStatus] = useState("Pending");
    const [tncAccepted, setTncAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [initialLoading, setInitialLoading] = useState(true);

    // Refs
    const policeFileRef = useRef(null);
    const aadhaarFileRef = useRef(null);

    // Get methods from WorkerStore
    const {
        acceptTnC,
        uploadAadharDoc,
        uploadPoliceVerification,
        getVerificationStatus,
        isLoading: storeLoading,
        getCurrentStage,
        uploadProfilePhoto,
    } = useWorkerStore();

    const steps = useMemo(
        () => [
            { title: "Terms & Conditions", key: "tnc" },
            { title: "Take Selfie", key: "selfie" },
            { title: "Police Verification PDF", key: "police" },
            { title: "Aadhaar / ID Upload", key: "aadhaar" },
            { title: "Admin Approval", key: "review" },
            { title: "Ready!", key: "done" },
        ],
        []
    );

    const [selfiePreview, setSelfiePreview] = useState(null);

    const handleSelfieCapture = async (file) => {
        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", file);

            await uploadProfilePhoto(file);
            setSelfiePreview(URL.createObjectURL(file));
            setSuccess("Selfie uploaded successfully");
            setTimeout(() => setStep(2), 1000);
        } catch (error) {
            setError("Failed to upload selfie. Please try again.");
            console.error("Selfie upload error:", error);
        } finally {
            setLoading(false);
        }
    };

    const progress = useMemo(
        () => ((step + 1) / steps.length) * 100,
        [step, steps.length]
    );

    // Validators
    function validatePdf(file) {
        if (!file) return "Please choose a PDF file.";
        if (file.type !== "application/pdf") return "Only PDF is allowed.";
        if (file.size > 5 * 1024 * 1024) return "Max size is 5MB.";
        return "";
    }

    function validateId(file) {
        if (!file) return "Please upload Aadhaar/ID (image or PDF).";
        const okTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
        ];
        if (!okTypes.includes(file.type)) return "Allowed: PDF/PNG/JPG/WEBP.";
        if (file.size > 5 * 1024 * 1024) return "Max size is 5MB.";
        return "";
    }

    // Action Handlers
    const handleAcceptTnc = async () => {
        try {
            setLoading(true);
            setError("");
            if (!tncAccepted) {
                return setError(
                    "Please accept the Terms & Conditions to continue."
                );
            }
            await acceptTnC();
            setSuccess("Terms accepted");
            setStep(1);
        } catch (e) {
            setError(e?.message || "Failed to accept terms");
        } finally {
            setLoading(false);
        }
    };

    const handlePoliceUpload = async () => {
        try {
            setLoading(true);
            setError("");
            const file = policeFileRef.current?.files?.[0] || null;
            const v = validatePdf(file);
            if (v) return setError(v);

            await uploadPoliceVerification(file);
            setSuccess("Police verification uploaded");
            setPoliceStatus("Pending");
            setStep(3);
        } catch (e) {
            setError(e?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAadhaarUpload = async () => {
        try {
            setLoading(true);
            setError("");
            const file = aadhaarFileRef.current?.files?.[0] || null;
            const v = validateId(file);
            if (v) return setError(v);

            await uploadAadharDoc(file);
            setSuccess("ID uploaded");
            setAadhaarStatus("Pending");
            setStep(4);
        } catch (e) {
            setError(e?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getInitialStage = async () => {
            try {
                setError("");
                const { currentStep, verificationStage, verification } =
                    await getCurrentStage();

                // Update step based on verification stage
                setStep(currentStep);

                // Update document statuses and handle selfie preview
                if (verification) {
                    setPoliceStatus(verification.policeStatus || "Pending");
                    setAadhaarStatus(verification.aadharStatus || "Pending");

                    // If selfie exists, set preview and move to next step
                    if (verification.selfieImage) {
                        setSelfiePreview(verification.selfieImage);
                    }

                    // Stage progression logic
                    if (verificationStage === "TNC_ACCEPTED") {
                        setStep(1); // Show selfie step
                    } else if (verificationStage === "PHOTO_UPLOADED") {
                        setStep(2); // Move to police verification
                    } else if (
                        verification.policeDocUrl &&
                        verification.aadharDocUrl
                    ) {
                        setStep(4); // Review stage
                    }

                    // Auto advance to final step if all documents are approved
                    if (
                        verification.isPoliceDocVerified &&
                        verification.isAadharDocVerified &&
                        verification.isSelfieVerified
                    ) {
                        setStep(5);
                        setSuccess("All documents have been approved!");
                    }
                }

                // Set TnC accepted if user has progressed beyond that stage
                if (verificationStage !== "TNC_PENDING") {
                    setTncAccepted(true);
                }
            } catch (error) {
                setError(
                    "Failed to fetch verification status. Please refresh the page."
                );
                console.error("Stage fetch error:", error);
            } finally {
                setInitialLoading(false);
            }
        };

        getInitialStage();
    }, [getCurrentStage]);

    // Modify the status polling effect
    useEffect(() => {
        if (step !== 3) return;

        const pollStatus = async () => {
            try {
                const { verification } = await getVerificationStatus();

                if (verification) {
                    setPoliceStatus(verification.policeStatus || "Pending");
                    setAadhaarStatus(verification.aadharStatus || "Pending");

                    // Auto advance if both approved
                    if (
                        verification.isPoliceDocVerified &&
                        verification.isAadharDocVerified
                    ) {
                        setSuccess("All documents approved ✔");
                        setTimeout(() => setStep(4), 1000);
                    }

                    // Show rejection message if any document is rejected
                    if (
                        verification.policeStatus === "Rejected" ||
                        verification.aadharStatus === "Rejected"
                    ) {
                        setError(
                            "One or more documents were rejected. Please check the status below."
                        );
                    }
                }
            } catch (error) {
                // Silent fail for polling
                console.error("Status polling error:", error);
            }
        };

        const pollInterval = setInterval(pollStatus, 4000);
        return () => clearInterval(pollInterval);
    }, [step, getVerificationStatus]);

    useEffect(() => {
        if (
            step === 3 &&
            policeStatus === "Approved" &&
            aadhaarStatus === "Approved"
        ) {
            setSuccess("All documents approved ✔");
            const t = setTimeout(() => setStep(4), 1000);
            return () => clearTimeout(t);
        }
    }, [step, policeStatus, aadhaarStatus]);

    const goDashboard = () => {
        navigate("/workerdashboard");
    };

    // UI Helper for status badges
    const badge = (status) => {
        const map = {
            Approved: "bg-green-100 text-green-700",
            Rejected: "bg-red-100 text-red-700",
            Pending: "bg-yellow-100 text-yellow-700",
        };
        return `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            map[status] || "bg-gray-100 text-gray-700"
        }`;
    };

    const Stepper = () => (
        <ol className="flex items-center w-full mb-6">
            {steps.map((s, i) => {
                const active = i === step;
                const done = i < step;
                const approved =
                    i === 3 &&
                    policeStatus === "Approved" &&
                    aadhaarStatus === "Approved";

                return (
                    <li key={s.key} className="flex-1 flex items-center">
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                                done || approved
                                    ? "bg-green-600 text-white border-green-600"
                                    : active
                                    ? "border-blue-600 text-blue-600"
                                    : "border-gray-300 text-gray-400"
                            }`}
                        >
                            {done || approved ? "✓" : i + 1}
                        </div>
                        <div className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                            {s.title}
                        </div>
                        {i !== steps.length - 1 && (
                            <div
                                className={`flex-1 h-px ${
                                    done ? "bg-green-600" : "bg-gray-200"
                                } mx-3`}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-slate-600 mt-4">
                        Loading verification status...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Worker Onboarding
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Complete these steps to get verified and start
                            accepting jobs.
                        </p>
                    </div>

                    {/* Stepper */}
                    <Stepper />

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                        <div
                            className="h-2 rounded-full bg-blue-600 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Step content */}
                    <div className="min-h-[220px]">
                        {step === 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3">
                                    Terms & Conditions
                                </h2>
                                <div className="border rounded-lg p-4 h-40 overflow-y-auto text-sm text-slate-600">
                                    <p className="mb-2 font-medium">
                                        Please read carefully:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>
                                            You agree to provide accurate
                                            identity and address proofs.
                                        </li>
                                        <li>
                                            No sharing of customer personal
                                            information.
                                        </li>
                                        <li>
                                            Work must comply with local safety
                                            laws and regulations.
                                        </li>
                                        <li>
                                            Payments and cancellations follow
                                            WorkJunction policies.
                                        </li>
                                        <li>
                                            Violation of terms may lead to
                                            permanent account suspension.
                                        </li>
                                    </ul>
                                </div>
                                <label className="flex items-center gap-2 mt-4 text-sm">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4"
                                        checked={tncAccepted}
                                        onChange={(e) =>
                                            setTncAccepted(e.target.checked)
                                        }
                                    />
                                    I have read and accept the Terms &
                                    Conditions
                                </label>
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={handleAcceptTnc}
                                        disabled={!tncAccepted || storeLoading}
                                        className={`px-4 py-2 rounded-lg text-white ${
                                            !tncAccepted || storeLoading
                                                ? "bg-gray-400"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    >
                                        {storeLoading
                                            ? "Processing..."
                                            : "Accept & Continue"}
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3">
                                    Take a Selfie
                                </h2>
                                <p className="text-sm text-slate-600 mb-4">
                                    Please take a clear photo of your face in
                                    good lighting. This will be used for
                                    verification purposes.
                                </p>

                                {selfiePreview ? (
                                    <div className="mb-4">
                                        <img
                                            src={selfiePreview}
                                            alt="Preview"
                                            className="w-full max-w-[400px] rounded-lg"
                                        />
                                        <button
                                            onClick={() =>
                                                setSelfiePreview(null)
                                            }
                                            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            Retake Photo
                                        </button>
                                    </div>
                                ) : (
                                    <WebcamCapture
                                        onCapture={handleSelfieCapture}
                                        onError={setError}
                                    />
                                )}

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => setStep(0)}
                                        className="px-4 py-2 rounded-lg border"
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3">
                                    Upload Police Verification (PDF)
                                </h2>
                                <p className="text-sm text-slate-600 mb-3">
                                    Accepted file: <b>PDF</b>, max 5MB.
                                </p>
                                <input
                                    ref={policeFileRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => setStep(0)}
                                        className="px-4 py-2 rounded-lg border"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePoliceUpload}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded-lg text-white ${
                                            loading
                                                ? "bg-gray-400"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    >
                                        {loading
                                            ? "Uploading..."
                                            : "Upload & Continue"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3">
                                    Upload Aadhaar / ID
                                </h2>
                                <p className="text-sm text-slate-600 mb-3">
                                    Accepted: PDF, PNG, JPG, WEBP (max 5MB).
                                </p>
                                <input
                                    ref={aadhaarFileRef}
                                    type="file"
                                    accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
                                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-4 py-2 rounded-lg border"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleAadhaarUpload}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded-lg text-white ${
                                            loading
                                                ? "bg-gray-400"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    >
                                        {loading
                                            ? "Uploading..."
                                            : "Upload & Continue"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3">
                                    Admin Review & Status
                                </h2>
                                <p className="text-sm text-slate-600 mb-4">
                                    We are reviewing your documents. You'll be
                                    notified once approved.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">
                                                Police Verification PDF
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Uploaded successfully • Awaiting
                                                admin decision
                                            </p>
                                        </div>
                                        <span className={badge(policeStatus)}>
                                            {policeStatus}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">
                                                Aadhaar / ID
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Uploaded successfully • Awaiting
                                                admin decision
                                            </p>
                                        </div>
                                        <span className={badge(aadhaarStatus)}>
                                            {aadhaarStatus}
                                        </span>
                                    </div>
                                </div>

                                {(policeStatus === "Rejected" ||
                                    aadhaarStatus === "Rejected") && (
                                    <div className="mt-4 p-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm">
                                        One or more documents were rejected.
                                        Please re-upload the correct
                                        document(s).
                                        <div className="mt-3 flex gap-2">
                                            {policeStatus === "Rejected" && (
                                                <button
                                                    onClick={() => setStep(1)}
                                                    className="px-3 py-2 rounded-lg border"
                                                >
                                                    Re-upload Police PDF
                                                </button>
                                            )}
                                            {aadhaarStatus === "Rejected" && (
                                                <button
                                                    onClick={() => setStep(2)}
                                                    className="px-3 py-2 rounded-lg border"
                                                >
                                                    Re-upload Aadhaar/ID
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {policeStatus === "Approved" &&
                                aadhaarStatus === "Approved" ? (
                                    <button
                                        onClick={() => setStep(4)}
                                        className="mt-6 w-full px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <div className="mt-6 text-center text-sm text-slate-500">
                                        Waiting for admin approval…
                                        (auto-refreshing)
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 5 && (
                            <div className="text-center">
                                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold mb-3">
                                    ✓
                                </div>
                                <h2 className="text-2xl font-semibold mb-2">
                                    You're Verified!
                                </h2>
                                <p className="text-slate-600 mb-6">
                                    Both Police Verification and Aadhaar have
                                    been approved. You can now access your
                                    worker dashboard and start accepting jobs.
                                </p>
                                <button
                                    onClick={goDashboard}
                                    className="px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer actions for linear navigation */}
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            className="px-4 py-2 rounded-lg border disabled:opacity-40"
                            disabled={step === 0 || step === 3 || step === 4}
                        >
                            Back
                        </button>
                        <div className="text-xs text-slate-500">
                            Progress: {Math.round(progress)}%
                        </div>
                        <button
                            onClick={() => setStep((s) => Math.min(4, s + 1))}
                            className="px-4 py-2 rounded-lg border disabled:opacity-40"
                            disabled={
                                step === 0 || // use Accept & Continue button instead
                                step === 1 || // use Upload button instead
                                step === 2 || // use Upload button instead
                                step === 3 || // auto-continue after approval
                                step === 4
                            }
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
