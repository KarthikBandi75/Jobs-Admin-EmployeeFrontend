import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaFlag, FaRegFlag, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminAllJobs = () => {
  const { adminToken, allJobs } = useContext(AuthContext);
  const [jobs, setJobs] = useState(allJobs || []);

  const handleUpdateJob = async (jobId, updates) => {
    try {
      const response = await axios.put(
        `https://jobs-backend-47u0.onrender.com/api/admin/job/${jobId}`,
        updates,
        { headers: { token: adminToken } }
      );
      if (response.data.success) {
        setJobs(jobs.map((job) => (job._id === jobId ? { ...job, ...updates } : job)));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error('Failed to update job');
      console.error('Update error:', err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const response = await axios.delete(
        `https://jobs-backend-47u0.onrender.com/api/admin/job/${jobId}`,
        { headers: { token: adminToken } }
      );
      if (response.data.success) {
        setJobs(jobs.filter((job) => job._id !== jobId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error('Failed to delete job');
      console.error('Delete error:', err.message);
    }
  };

  const toggleActive = (job) => {
    handleUpdateJob(job._id, { isActive: !job.isActive });
  };

  const toggleSuspicious = (job) => {
    if (!window.confirm('Do you feel this job is suspicious?')) return;
    handleUpdateJob(job._id, { isFlagged: !job.isFlagged });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-700 mb-8"
        >
          Manage Jobs
        </motion.h2>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Company:</span> {job.company.companyName}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                  <p>
                    <span className="font-medium">Salary:</span> {job.salary}
                  </p>
                  <p>
                    <span className="font-medium">Skills:</span> {job.skills.join(', ')}
                  </p>
                  <p>
                    <span className="font-medium">Last Date:</span>{' '}
                    {new Date(job.lastDateToApply).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleActive(job)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      job.isActive
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    aria-label={job.isActive ? 'Deactivate job' : 'Activate job'}
                  >
                    {job.isActive ? (
                      <FaCheckCircle className="text-lg" />
                    ) : (
                      <FaTimesCircle className="text-lg" />
                    )}
                    <span>{job.isActive ? 'Active' : 'Inactive'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleSuspicious(job)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      job.isFlagged
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    aria-label={job.isFlagged ? 'Unflag job' : 'Flag job as suspicious'}
                  >
                    {job.isFlagged ? (
                      <FaFlag className="text-lg" />
                    ) : (
                      <FaRegFlag className="text-lg" />
                    )}
                    <span>{job.isFlagged ? 'Suspicious' : 'Not Suspicious'}</span>
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDeleteJob(job._id)}
                  className="mt-4 w-full py-2 px-4 rounded-lg text-sm font-medium text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors cursor-pointer"
                  aria-label="Delete job"
                >
                  Delete Job
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-500 text-center text-lg"
          >
            No jobs found
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default AdminAllJobs;