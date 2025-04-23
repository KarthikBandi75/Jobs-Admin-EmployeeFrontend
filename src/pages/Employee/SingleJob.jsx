import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import QuillEditor from '../../components/QuillEditor';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

const SingleJob = () => {
  const { id } = useParams();
  const { employeeToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [lastDateToApply, setLastDateToApply] = useState('');
  const [salary, setSalary] = useState('');
  const [skills, setSkills] = useState('');
  const [whoCanApply, setWhoCanApply] = useState('');
  const [otherRequirements, setOtherRequirements] = useState('');
  const [perks, setPerks] = useState('');
  const [noOfOpenings, setNoOfOpenings] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const getJob = async () => {
    try {
      const res = await axios.get(`https://jobs-backend-47u0.onrender.com/api/jobs/${id}`, {
        headers: { token: employeeToken },
      });
      if (res.data.success) {
        const jobData = res.data.job;
        setJob(jobData);
        setTitle(jobData.title);
        setDescription(jobData.description);
        setLocation(jobData.location);
        setDuration(jobData.duration);
        setLastDateToApply(jobData.lastDateToApply?.split('T')[0]);
        setSalary(jobData.salary);
        setSkills(jobData.skills.join(', '));
        setWhoCanApply(jobData.whoCanApply);
        setOtherRequirements(jobData.otherRequirements);
        setPerks(jobData.perks.join(', '));
        setNoOfOpenings(jobData.noOfOpenings);
        setIsActive(jobData.isActive);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJob();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://jobs-backend-47u0.onrender.com/api/jobs/${id}`,
        {
          title,
          description,
          location,
          duration,
          lastDateToApply,
          salary,
          skills: skills.split(',').map((s) => s.trim()),
          whoCanApply,
          otherRequirements,
          perks: perks.split(',').map((p) => p.trim()),
          noOfOpenings,
          isActive,
        },
        { headers: { token: employeeToken } }
      );
      if (res.data.success) {
        toast.success('Job updated successfully');
        setEditing(false);
        getJob();
      } else {
        toast.error('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`https://jobs-backend-47u0.onrender.com/api/jobs/${id}`, {
        headers: { token: employeeToken },
      });
      if (res.data.success) {
        toast.success('Job deleted');
        navigate('/employee/alljobs');
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Delete failed');
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) return <div className="text-center py-10 text-[#6B7280]">Loading...</div>;
  if (!job) return <div className="text-center py-10 text-[#6B7280]">Job not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full pt-16 px-4 sm:px-6 lg:px-8 bg-[#F4F6F8]"
    >
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 border border-gray-200"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {!editing ? (
            <>
              <h1 className="text-2xl font-bold text-teal-950 mb-4">{job.title}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-teal-950">Company:</span>{' '}
                  {job.company.companyName}
                </p>
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-teal-950">Email:</span>{' '}
                  {job.company.email}
                </p>
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-teal-950">Location:</span>{' '}
                  {job.location}
                </p>
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-teal-950">Salary:</span> ₹{job.salary}
                </p>
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-teal-950">Duration:</span>{' '}
                  {job.duration}
                </p>
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-teal-950">Last Date:</span>{' '}
                  {new Date(job.lastDateToApply).toLocaleDateString()}
                </p>
              </div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h3 className="text-base font-semibold text-teal-950 mb-2">
                  Job Description
                </h3>
                <div
                  className="prose max-w-none text-[#6B7280]"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h3 className="text-base font-semibold text-teal-950 mb-2">
                  Who Can Apply
                </h3>
                <div
                  className="prose max-w-none text-[#6B7280]"
                  dangerouslySetInnerHTML={{ __html: job.whoCanApply }}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h3 className="text-base font-semibold text-teal-950 mb-2">
                  Other Requirements
                </h3>
                <div
                  className="prose max-w-none text-[#6B7280]"
                  dangerouslySetInnerHTML={{ __html: job.otherRequirements }}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h3 className="text-base font-semibold text-teal-950 mb-2">
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h3 className="text-base font-semibold text-teal-950 mb-2">Perks</h3>
                <ul className="list-disc list-inside text-[#6B7280]">
                  {job.perks.map((perk, idx) => (
                    <li key={idx}>{perk}</li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-teal-950">No. of Openings:</span>{' '}
                  {job.noOfOpenings}
                </p>
              </motion.div>

              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(true)}
                  className="flex items-center justify-center gap-1 max-w-xs px-4 py-2 bg-teal-500 text-white rounded-md text-sm font-medium hover:bg-teal-600 cursor-pointer"
                >
                  <Edit size={16} /> Update Job
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-1 max-w-xs px-4 py-2 bg-[#EF4444] text-white rounded-md text-sm font-medium hover:bg-[#DC2626] cursor-pointer"
                >
                  <Trash2 size={16} /> Delete Job
                </motion.button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-[#6B7280]">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-teal-500"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-[#6B7280]">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-teal-500"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-[#6B7280]">
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-teal-500"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-[#6B7280]">
                  Last Date to Apply
                </label>
                <input
                  type="date"
                  value={lastDateToApply}
                  onChange={(e) => setLastDateToApply(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] focus:ring-2 focus:ring-teal-500"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-[#6B7280]">
                  Salary
                </label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-teal-500"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-[#6B7280]">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-teal-500"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-[#6B7280]">
                  Perks (comma-separated)
                </label>
                <input
                  type="text"
                  value={perks}
                  onChange={(e) => setPerks(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-teal-500"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-[#6B7280]">
                  Number of Openings
                </label>
                <input
                  type="number"
                  value={noOfOpenings}
                  onChange={(e) => setNoOfOpenings(Number(e.target.value))}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-teal-500"
                  required
                />
              </motion.div>

              <motion.div
                className="md:col-span-2 mb-6"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="block text-sm font-medium text-[#6B7280]">
                  Job Description
                </label>
                <div className="mt-2">
                  <QuillEditor
                    value={description}
                    onChange={setDescription}
                    className="border border-gray-300 rounded-md min-h-[200px]"
                  />
                </div>
              </motion.div>

              <motion.div
                className="md:col-span-2 mb-6"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="block text-sm font-medium text-[#6B7280]">
                  Who Can Apply
                </label>
                <div className="mt-2">
                  <QuillEditor
                    value={whoCanApply}
                    onChange={setWhoCanApply}
                    className="border border-gray-300 rounded-md min-h-[200px]"
                  />
                </div>
              </motion.div>

              <motion.div
                className="md:col-span-2 mb-6"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="block text-sm font-medium text-[#6B7280]">
                  Other Requirements
                </label>
                <div className="mt-2">
                  <QuillEditor
                    value={otherRequirements}
                    onChange={setOtherRequirements}
                    className="border border-gray-300 rounded-md min-h-[200px]"
                  />
                </div>
              </motion.div>

              <motion.div
                className="md:col-span-2 mb-6 flex items-center gap-4"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="text-sm font-medium text-[#6B7280]">
                  Is Active?
                </label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive((prev) => !prev)}
                  className="h-4 w-4 text-teal-500 rounded border-gray-300 focus:ring-teal-500"
                />
                <span className="text-sm text-[#6B7280]">Yes</span>
              </motion.div>

              <motion.div
                className="md:col-span-2 flex justify-end gap-4"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="max-w-xs px-6 py-2 bg-teal-500 text-white rounded-md font-medium hover:bg-teal-600 cursor-pointer"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setEditing(false)}
                  className="max-w-xs px-6 py-2 bg-gray-200 text-[#1F2A44] rounded-md font-medium hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </motion.button>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SingleJob;