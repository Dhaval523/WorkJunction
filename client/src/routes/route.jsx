import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import SearchWorker from "../pages/SearchWorker";
import BookingForm from "../pages/BookingForm";
import MyBookings from "../pages/MyBookings";
import WorkerDashboard from "../pages/WorkerDashboard";
import AdminPanel from "../pages/AdminPage";
import WorkerVerification from "../pages/WorkerVerifaction";
import VerificationPage from "../pages/MobileNumberVerificationPage";
import UpdateWorkerProfileCard from "../components/UpdateWorkerProfileCard";
import WorkerServicesPage from "../pages/WorkerServicePage";

const Routers = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/userdashboard" element={<UserDashboard />} />
                    <Route path="/searchworker" element={<SearchWorker />} />
                    <Route path="/bookingform" element={<BookingForm />} />
                    <Route path="/mybookings" element={<MyBookings />} />
                    <Route path="/Admin" element={<AdminPanel />} />
                    <Route
                        path="/verification"
                        element={<WorkerVerification />}
                    />
                    <Route
                        path="/workerdashboard"
                        element={<WorkerDashboard />}
                    />
                    <Route path="/otp" element={<VerificationPage />} />
                    <Route
                        path="/worker/profile"
                        element={<UpdateWorkerProfileCard />}
                    />
                    <Route
                        path="/worker/service"
                        element={<WorkerServicesPage />}
                    />
                </Routes>
            </Router>
        </div>
    );
};

export default Routers;
