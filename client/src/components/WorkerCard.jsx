import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const WorkerCard = ({ worker }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300"></div>
      
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Worker Image */}
        <div className="relative h-48 overflow-hidden">
          <motion.img 
            className="w-full h-full object-cover"
            src={worker.image}
            alt={worker.profession}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="text-sm font-semibold">{worker.rating}</span>
          </div>
        </div>

        {/* Worker Info */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start mb-4">
            <motion.img 
              className="h-12 w-12 rounded-full border-2 border-white shadow-md mr-3"
              src={worker.avatar}
              alt={worker.name}
              whileHover={{ rotate: 5 }}
            />
            <div>
              <h3 className="font-bold text-lg">{worker.name}</h3>
              <p className="text-indigo-600 font-medium">{worker.profession}</p>
            </div>
          </div>

          <p className="text-gray-600 mb-4 flex-grow">{worker.description}</p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <FiMapPin className="mr-2" />
              <span>{worker.location} • {worker.distance} km away</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-2" />
              <span>Available {worker.availability}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto">
            <div>
              <span className="text-2xl font-bold text-gray-900">₹{worker.rate}</span>
              <span className="text-gray-500">/day</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              View Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
              onClick={() => navigate('/bookingform')}
            >
              Book Now
            </motion.button>
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkerCard;