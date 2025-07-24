import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiMessageSquare, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

const BookingForm = ({ worker }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '2', // Default 2 hours
    address: '',
    specialInstructions: '',
    emergency: false,
   
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

  // Calculate total price based on worker's rate and duration
  const totalPrice = 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to send booking request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Create booking request object
      const bookingRequest = {
        workerId: worker.id,
        workerName: worker.name,
        workerProfession: worker.profession,
        workerAvatar: worker.avatar,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        address: formData.address,
        specialInstructions: formData.specialInstructions,
        emergency: formData.emergency,
        totalPrice: totalPrice,
        status: 'pending', // pending, confirmed, rejected, completed
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (simulating backend)
      const existingBookings = JSON.parse(localStorage.getItem('bookingRequests') || '[]');
      localStorage.setItem('bookingRequests', JSON.stringify([...existingBookings, bookingRequest]));

      // Create notification for user
      const userNotification = {
        id: Date.now(),
        type: 'booking',
        title: 'Booking Request Sent',
        message: `Your booking request to ${worker.name} has been sent. Waiting for confirmation.`,
        read: false,
        createdAt: new Date().toISOString(),
        meta: {
          workerId: worker.id,
          bookingId: Date.now() // Simulated booking ID
        }
      };

      // Save notification
      const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      localStorage.setItem('notifications', JSON.stringify([...existingNotifications, userNotification]));

      setIsSuccess(true);
      setNotification(userNotification);
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/bookings');
      }, 2500);
    } catch (error) {
      console.error('Booking failed:', error);
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Worker Summary */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-8 flex items-center"
      >
        <img 
          src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
          alt="worker avatar" 
          className="h-16 w-16 rounded-full border-2 border-white shadow-md mr-4"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rajesh Kumar</h2>
          <p className="text-indigo-600 font-medium">Carpenter</p>
          <div className="flex items-center mt-1">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.9</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-600">5 years experience</span>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-gray-500">Rate</p>
                <p className="text-2xl font-bold text-gray-900">₹ 1000 <span className="text-sm font-normal text-gray-500">/hr</span></p>
        </div>
      </motion.div>

      {/* Booking Form */}
      <AnimatePresence>
        {!isSuccess ? (
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Details</h3>

            <div className="space-y-6">
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiCalendar className="mr-2 text-indigo-500" /> Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiClock className="mr-2 text-indigo-500" /> Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiClock className="mr-2 text-indigo-500" /> Duration (hours)
                </label>
                <select
                  name="duration"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.duration}
                  onChange={handleChange}
                >
                  {[2, 4, 6, 8].map(hours => (
                    <option key={hours} value={hours}>{hours} hours</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiMapPin className="mr-2 text-indigo-500" /> Service Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter full address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiMessageSquare className="mr-2 text-indigo-500" /> Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Any specific requirements or details..."
                  value={formData.specialInstructions}
                  onChange={handleChange}
                />
              </div>

              {/* Emergency Service */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emergency"
                  name="emergency"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={formData.emergency}
                  onChange={handleChange}
                />
                <label htmlFor="emergency" className="ml-2 block text-sm text-gray-700">
                  This is an emergency service (50% extra charge)
                </label>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-medium">₹ 1000/hr</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formData.duration} hours</span>
                </div>
                {formData.emergency && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Emergency Fee (50%):</span>
                    <span className="font-medium">₹ 500</span>
                  </div>
                )}
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-bold">Total:</span>
                  <span className="text-indigo-600 font-bold">
                    ₹{formData.emergency ? totalPrice * 1.5 : totalPrice}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white shadow-md ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
                </motion.button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <FiCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Request Sent Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your booking request has been sent to {worker.name}. You'll receive a notification when they respond.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
              <h4 className="font-medium text-blue-800 mb-2">Request Details:</h4>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Date:</span> {new Date(formData.date).toLocaleDateString()} at {formData.time}
              </p>
              <p className="text-sm text-blue-700">
                <span className="font-medium">For:</span> {formData.duration} hours ({worker.profession})
              </p>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Total:</span> ₹{formData.emergency ? totalPrice * 1.5 : totalPrice}
                {formData.emergency && ' (includes emergency fee)'}
              </p>
            </div>
            <button
              onClick={() => navigate('/bookings')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View My Bookings
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification System Integration */}
      {notification && (
        <div className="fixed bottom-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-lg p-4 max-w-xs border-l-4 border-indigo-500 flex"
          >
            <div className="mr-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <FiCheck className="text-indigo-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{notification.title}</h4>
              <p className="text-sm text-gray-600">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;