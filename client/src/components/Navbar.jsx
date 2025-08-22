import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiHeart, FiMessageSquare, FiMenu, FiX, FiCalendar } from 'react-icons/fi';
import { FaHammer } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg"
              >
                <FaHammer className="h-6 w-6 text-white" />
              </motion.div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                WorkJunction
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div variants={itemVariants} className="hidden md:flex items-center space-x-8">
            {['Home', 'Services', 'Workers', 'Contact', 'My Bookings'].map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ scale: 1.05, color: '#6366f1' }}
                className="text-gray-700 font-medium text-sm uppercase tracking-wider"
              >
                {item}
              </motion.a>
            ))}
          </motion.div>

          {/* User Actions */}
          <motion.div variants={itemVariants} className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
              onClick={() => navigate('/searchworker')}
            >
              <FiSearch className="h-5 w-5" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
            >
              <FiHeart className="h-5 w-5" />
            </motion.button>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="ml-2"
            >
              <img
                className="h-9 w-9 rounded-full border-2 border-white shadow-md"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
              />
            </motion.div>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
            onClick={() => navigate('/mybookings')}
          > 
            My Bookings
          </motion.button>
          

        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-4 py-3 space-y-3 border-t border-gray-200">
          {['Home', 'Services', 'Workers', 'Contact'].map((item) => (
            <motion.a
              key={`mobile-${item}`}
              href="#"
              whileHover={{ x: 5 }}
              className="block py-2 text-gray-700 font-medium"
            >
              {item}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;