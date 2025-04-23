import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUniversity } from 'react-icons/fa';
import { AuthContext } from '../context/AppContext';
import { LayoutDashboard, PlusCircle, Briefcase, User, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';

const EmployeNavbar = () => {
  const navigate = useNavigate();
  const { setEmployeeToken } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/employee-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/add-job', label: 'Add Job', icon: <PlusCircle size={18} /> },
    { to: '/alljobs', label: 'All Jobs', icon: <Briefcase size={18} /> },
    { to: '/employee-profile', label: 'Profile', icon: <User size={18} /> },
  ];

  const logout = () => {
    localStorage.removeItem('Employee-Token');
    setEmployeeToken('');
    navigate('/login');
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2 text-lg font-semibold text-[#0A66C2] cursor-pointer"
          onClick={() => navigate('/employee-dashboard')}
        >
         <img src={assets.logo} alt=""  className='w-30'/>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {navItems.map(({ to, label, icon }) => (
            <motion.div key={to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[#1F2A44] ${
                    isActive ? 'bg-[#E6F0FA] text-[#0A66C2]' : 'hover:bg-gray-100'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="px-4 py-2 bg-[#0A66C2] text-white rounded-md text-sm font-medium hover:bg-[#0958A6] cursor-pointer"
          >
            Logout
          </motion.button>
        </div>

        <motion.button
          className="md:hidden text-[#1F2A44]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {isMenuOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          className="md:hidden bg-white border-t border-gray-200 px-4 py-4"
        >
          {navItems.map(({ to, label, icon }) => (
            <motion.div key={to} variants={itemVariants}>
              <NavLink
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium text-[#1F2A44] ${
                    isActive ? 'bg-[#E6F0FA] text-[#0A66C2]' : 'hover:bg-gray-100'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            </motion.div>
          ))}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="w-full mt-2 px-4 py-2 bg-[#0A66C2] text-white rounded-md text-sm font-medium hover:bg-[#0958A6]"
          >
            Logout
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmployeNavbar;