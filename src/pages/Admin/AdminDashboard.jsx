import React, { useContext } from 'react';
import { AuthContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { FaUsers, FaBuilding, FaBriefcase, FaFlag, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const AdminDashboard = () => {
  const { users, employee, allJobs } = useContext(AuthContext);

  const safeUsers = Array.isArray(users) ? users : [];
  const safeEmployers = Array.isArray(employee) ? employee : [];
  const safeJobs = Array.isArray(allJobs) ? allJobs : [];

  const totalUsers = safeUsers.length;
  const totalEmployers = safeEmployers.length;
  const totalJobs = safeJobs.length;
  const activeJobs = safeJobs.filter(job => job.isActive).length;
  const suspiciousJobs = safeJobs.filter(job => job.isFlagged).length;

  const metrics = [
    { label: 'Total Users', value: totalUsers, icon: <FaUsers className="text-indigo-600 text-3xl" />, link: '/allstudents', color: 'bg-indigo-50' },
    { label: 'Total Employers', value: totalEmployers, icon: <FaBuilding className="text-teal-600 text-3xl" />, link: '/allcompanies', color: 'bg-teal-50' },
    { label: 'Total Jobs', value: totalJobs, icon: <FaBriefcase className="text-purple-600 text-3xl" />, link: '/admin/alljobs', color: 'bg-purple-50' },
    { label: 'Active Jobs', value: activeJobs, icon: <FaCheckCircle className="text-green-600 text-3xl" />, link: '/admin/alljobs', color: 'bg-green-50' },
    { label: 'Suspicious Jobs', value: suspiciousJobs, icon: <FaFlag className="text-yellow-600 text-3xl" />, link: '/admin/alljobs', color: 'bg-yellow-50' },
  ];

  const chartData = [
    { name: 'Total Jobs', value: totalJobs, fill: `#${Math.floor(Math.random() * 16777215).toString(16)}` },
    { name: 'Active Jobs', value: activeJobs, fill: `#${Math.floor(Math.random() * 16777215).toString(16)}` },
    { name: 'Suspicious Jobs', value: suspiciousJobs, fill: `#${Math.floor(Math.random() * 16777215).toString(16)}` },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-gray-800"
        >
          Admin Dashboard
        </motion.h2>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-lg shadow-md ${metric.color} flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300`}
            >
              {metric.icon}
              <div>
                <h3 className="text-sm font-semibold text-gray-700">{metric.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <Link
                  to={metric.link}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  View All
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Job Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Activity</h3>
          <div className="space-y-4">
            {safeUsers.length > 0 && (
              <p className="text-gray-600">
                New user: <span className="font-medium">{safeUsers[0].name}</span> joined on{' '}
                {new Date(safeUsers[0].createdAt).toLocaleDateString()}
              </p>
            )}
            {safeEmployers.length > 0 && (
              <p className="text-gray-600">
                New employer: <span className="font-medium">{safeEmployers[0].employer.companyName}</span> joined on{' '}
                {new Date(safeEmployers[0].createdAt).toLocaleDateString()}
              </p>
            )}
            {safeJobs.length > 0 && (
              <p className="text-gray-600">
                New job: <span className="font-medium">{safeJobs[0].title}</span> posted on{' '}
                {new Date(safeJobs[0].createdAt).toLocaleDateString()}
              </p>
            )}
            {safeUsers.length === 0 && safeEmployers.length === 0 && safeJobs.length === 0 && (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </motion.div>

        {/* Static Admin Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Admin Tips</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Regularly review suspicious jobs to maintain platform integrity.</li>
            <li>Monitor user and employer activity for unusual patterns.</li>
            <li>Update job statuses promptly to ensure accurate listings.</li>
            <li>Contact support at support@jobboard.com for technical issues.</li>
          </ul>
        </motion.div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;