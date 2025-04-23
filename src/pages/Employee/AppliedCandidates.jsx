import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const AppliedCandidates = () => {
  const { id } = useParams();
  const { employeeToken } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`https://jobs-backend-47u0.onrender.com/api/applications/job/${id}`, {
        headers: { token: employeeToken },
      });
      setCandidates(response.data.applications);
      toast.success(response.data.message || 'Applications fetched successfully');
    } catch (err) {
      console.error('Error fetching applications:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch applications');
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await axios.put(
        `https://jobs-backend-47u0.onrender.com/api/applications/status/${applicationId}`,
        { status },
        { headers: { token: employeeToken } }
      );
      setCandidates(prev =>
        prev.map(candidate =>
          candidate._id === applicationId ? { ...candidate, status } : candidate
        )
      );
      toast.success(response.data.message || 'Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchApplications();
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
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-[#1F2A44] mb-6">Applied Candidates</h2>
        {candidates.length === 0 ? (
          <p className="text-[#6B7280]">No candidates have applied yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-base font-semibold text-[#1F2A44]">{candidate.user.name}</h3>
                <p className="text-sm text-[#6B7280]">Email: {candidate.user.email}</p>
                <p className="text-sm text-[#6B7280]">
                  Status:{' '}
                  <span
                    className={`capitalize font-medium ${
                      candidate.status === 'accepted'
                        ? 'text-[#00A69C]'
                        : candidate.status === 'rejected'
                        ? 'text-[#EF4444]'
                        : 'text-[#0A66C2]'
                    }`}
                  >
                    {candidate.status}
                  </span>
                </p>
                <p className="text-sm text-[#6B7280]">Applied on: {new Date(candidate.createdAt).toLocaleString()}</p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href={candidate.user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[#00A69C] hover:text-[#008C84] text-sm"
                >
                  <FileText size={16} /> View Resume
                </motion.a>
                <div className="mt-3 flex items-center gap-2">
                  <label htmlFor={`status-${candidate._id}`} className="text-sm font-medium text-[#6B7280]">
                    Update Status:
                  </label>
                  <motion.select
                    whileHover={{ scale: 1.02 }}
                    id={`status-${candidate._id}`}
                    value={candidate.status}
                    onChange={e => updateStatus(candidate._id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm text-[#1F2A44] focus:ring-2 focus:ring-[#0A66C2]"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </motion.select>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppliedCandidates;