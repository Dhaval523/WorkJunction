import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiUser, FiCheck, FiX, FiAlertCircle, FiLoader, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <FiLoader className="animate-spin" />,
    text: 'Pending Confirmation'
  },
  confirmed: {
    color: 'bg-green-100 text-green-800',
    icon: <FiCheck />,
    text: 'Confirmed'
  },
  rejected: {
    color: 'bg-red-100 text-red-800',
    icon: <FiX />,
    text: 'Rejected'
  },
  completed: {
    color: 'bg-blue-100 text-blue-800',
    text: 'Completed'
  },
  cancelled: {
    color: 'bg-gray-100 text-gray-800',
    icon: <FiAlertCircle />,
    text: 'Cancelled'
  }
};

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch bookings from localStorage (simulating API)
  const fetchBookings = () => {
    setIsLoading(true);
    try {
      const storedBookings = JSON.parse(localStorage.getItem('bookingRequests') || '[]');
      // Sort by date (newest first)
      const sortedBookings = storedBookings.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleCancel = (bookingId) => {
    // Update booking status to cancelled
    const updatedBookings = bookings.map(booking => 
      booking.bookingId === bookingId ? { ...booking, status: 'cancelled' } : booking
    );
    localStorage.setItem('bookingRequests', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    
    // Create notification
    const cancelledBooking = bookings.find(b => b.bookingId === bookingId);
    const notification = {
      id: Date.now(),
      type: 'booking',
      title: 'Booking Cancelled',
      message: `You cancelled booking with ${cancelledBooking.workerName}`,
      read: false,
      createdAt: new Date().toISOString(),
      meta: { bookingId }
    };
    
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([...existingNotifications, notification]));
  };

  const filteredBookings = bookings.filter(booking => 
    activeTab === 'current' 
      ? ['pending', 'confirmed'].includes(booking.status)
      : ['completed', 'rejected', 'cancelled'].includes(booking.status)
  );

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('current')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'current' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Current Bookings
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Booking History
          </button>
        </nav>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <FiCalendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'current' ? 'current bookings' : 'booking history'}
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'current' 
              ? "You don't have any active bookings right now." 
              : "Your completed and cancelled bookings will appear here."}
          </p>
          <button
            onClick={() => navigate('/search')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Find Workers
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.bookingId || booking.createdAt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  {/* Worker Info */}
                  <div className="flex items-center mb-4 sm:mb-0">
                    <img 
                      src={booking.workerAvatar} 
                      alt={booking.workerName} 
                      className="h-12 w-12 rounded-full border-2 border-white shadow-sm mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{booking.workerName}</h3>
                      <p className="text-indigo-600 text-sm">{booking.workerProfession}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center mb-4 sm:mb-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {statusConfig[booking.status]?.icon && (
                        <span className="mr-1.5">{statusConfig[booking.status].icon}</span>
                      )}
                      {statusConfig[booking.status]?.text || booking.status}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formatDate(booking.date)} at {formatTime(booking.time)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {booking.duration} hours
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      ₹{booking.totalPrice}
                      {booking.emergency && ' (Emergency)'}
                    </span>
                  </div>
                </div>

                {booking.address && (
                  <div className="mt-3 flex items-start">
                    <FiMapPin className="text-gray-400 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">{booking.address}</span>
                  </div>
                )}

                {booking.specialInstructions && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Special Instructions</p>
                    <p className="text-sm text-gray-600">{booking.specialInstructions}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  {activeTab === 'current' && booking.status === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCancel(booking.bookingId)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Cancel Request
                    </motion.button>
                  )}
                  {booking.status === 'confirmed' && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/chat/${booking.workerId}`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Message Worker
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/worker/${booking.workerId}`)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    View Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyBookings;