import React, { useContext, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AppContext';
import { FaUniversity, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../assets/assets';

const Adminnavbar = () => {
  const navigate = useNavigate();
  const { setAdminToken } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('Admin-Token');
    setAdminToken('');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin-dashboard', label: 'Dashboard' },
    { to: '/allcompanies', label: 'Companies' },
    { to: '/alljobs', label: 'Jobs' },
    { to: '/allstudents', label: 'Students' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2 text-xl font-semibold text-indigo-600 cursor-pointer"
          onClick={() => navigate('/admin-dashboard')}
        >
           <img src={assets.logo} alt=""  className='w-30'/>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-medium py-2 ${
                      isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-200 text-left cursor-pointer"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Adminnavbar;