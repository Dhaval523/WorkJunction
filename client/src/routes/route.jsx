import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/Login';
import Register from '../pages/Register';
import UserDashboard from '../pages/UserDashboard';
import SearchWorker from '../pages/SearchWorker';
import BookingForm from '../pages/BookingForm';
import MyBookings from '../pages/MyBookings';
import WorkerDashboard from '../pages/WorkerDashboard';


const Routers = () => {
  return (
    <div>

    <Router>
      <Routes>
       
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/searchworker" element={<SearchWorker />} />
        <Route path="/bookingform" element={<BookingForm />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/workerdashboard" element={<WorkerDashboard />} />
      </Routes>
    </Router>
    </div>
  );
};

export default Routers;