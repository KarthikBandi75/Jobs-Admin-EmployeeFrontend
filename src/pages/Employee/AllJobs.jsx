import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Users } from 'lucide-react';

const AllJobs = () => {
  const { employeeToken } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const allJobs = async () => {
    try {
      const res = await axios.get(`https://jobs-backend-47u0.onrender.com/api/jobs/company`, {
        headers: { token: employeeToken },
      });
      if (res.data.success) setJobs(res.data.jobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allJobs();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 bg-[#F4F6F8]"
    >
      <div className="max-w-6xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-[#1F2A44] mb-6">All Jobs</h2>
        {loading ? (
          <p className="text-center text-[#6B7280]">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-[#6B7280]">No jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-[#1F2A44] mb-2">{job.title}</h3>
                <p className="text-sm text-[#6B7280] mb-1"><span className="font-medium text-[#1F2A44]">Location:</span> {job.location}</p>
                <p className="text-sm text-[#6B7280] mb-1"><span className="font-medium text-[#1F2A44]">Salary:</span> {job.salary}</p>
                <p className="text-sm text-[#6B7280] mb-1"><span className="font-medium text-[#1F2A44]">Duration:</span> {job.duration}</p>
                <p className="text-sm text-[#6B7280] mb-3">
                  <span className="font-medium text-[#1F2A44]">Last Date:</span> {new Date(job.lastDateToApply).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="bg-[#E6F0FA] text-[#0A66C2] px-2 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/job/${job._id}`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#0A66C2] text-white rounded-md text-sm font-medium hover:bg-[#0958A6] cursor-pointer"
                  >
                    <Eye size={16} /> View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/applied/${job._id}`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#00A69C] text-white rounded-md text-sm font-medium hover:bg-[#008C84] cursor-pointer"
                  >
                    <Users size={16} /> Candidates
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AllJobs;