import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import QuillEditor from '../../components/QuillEditor';
import 'quill/dist/quill.snow.css';
import { motion } from 'framer-motion';

const AddJob = () => {
  const { employeeToken } = useContext(AuthContext);
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

  const addJob = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5577/api/jobs/',
        {
          title,
          description,
          location,
          duration,
          lastDateToApply,
          salary,
          skills: skills.split(',').map(skill => skill.trim()),
          whoCanApply,
          otherRequirements,
          perks: perks.split(',').map(perk => perk.trim()),
          noOfOpenings,
          isActive,
        },
        { headers: { token: employeeToken } }
      );
      if (response.data.success) {
        toast.success('Job added successfully');
        setTitle('');
        setDescription('');
        setLocation('');
        setDuration('');
        setLastDateToApply('');
        setSalary('');
        setSkills('');
        setWhoCanApply('');
        setOtherRequirements('');
        setPerks('');
        setNoOfOpenings(1);
        setIsActive(true);
      } else {
        toast.error(response.data.message || 'Failed to add job');
      }
    } catch (err) {
      console.error('Error adding job:', err);
      toast.error('Error adding job, please try again later');
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
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
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[#1F2A44] mb-6">Post a New Job</h2>
          <form onSubmit={addJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Job Title', value: title, setValue: setTitle, placeholder: 'Enter job title', type: 'text' },
              { label: 'Location', value: location, setValue: setLocation, placeholder: 'Enter job location', type: 'text' },
              { label: 'Duration', value: duration, setValue: setDuration, placeholder: 'Enter job duration', type: 'text' },
              { label: 'Last Date to Apply', value: lastDateToApply, setValue: setLastDateToApply, type: 'date' },
              { label: 'Salary', value: salary, setValue: setSalary, placeholder: 'Enter salary', type: 'text' },
              { label: 'Skills', value: skills, setValue: setSkills, placeholder: 'Enter skills (comma-separated)', type: 'text' },
              { label: 'Perks', value: perks, setValue: setPerks, placeholder: 'Enter perks (comma-separated)', type: 'text' },
              { label: 'Number of Openings', value: noOfOpenings, setValue: setNoOfOpenings, type: 'number' },
            ].map(({ label, value, setValue, placeholder, type }, index) => (
              <motion.div
                key={label}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="mb-8"
              >
                <label className="block text-sm font-medium text-[#6B7280]">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={e => setValue(type === 'number' ? Number(e.target.value) : e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                  placeholder={placeholder}
                  required
                />
              </motion.div>
            ))}

            <motion.div
              className="md:col-span-2 mb-10"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-sm font-medium text-[#6B7280]">Job Description</label>
              <div className="mt-2">
                <QuillEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter detailed job description"
                  className="border border-gray-300 rounded-md min-h-[200px]"
                />
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-2 mb-10"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-sm font-medium text-[#6B7280]">Who Can Apply</label>
              <div className="mt-2">
                <QuillEditor
                  value={whoCanApply}
                  onChange={setWhoCanApply}
                  placeholder="Specify who can apply for this job"
                  className="border border-gray-300 rounded-md min-h-[200px]"
                />
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-2 mb-10"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-sm font-medium text-[#6B7280]">Other Requirements</label>
              <div className="mt-2">
                <QuillEditor
                  value={otherRequirements}
                  onChange={setOtherRequirements}
                  placeholder="Mention any other requirements"
                  className="border border-gray-300 rounded-md min-h-[200px]"
                />
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-2 flex items-center gap-4 mb-8"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="text-sm font-medium text-[#6B7280]">Is Active?</label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(prev => !prev)}
                className="h-4 w-4 text-[#0A66C2] rounded border-gray-300 focus:ring-[#0A66C2]"
              />
              <span className="text-sm text-[#6B7280]">Yes</span>
            </motion.div>

            <motion.div
              className="md:col-span-2 text-right mb-8"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-[#0A66C2] text-white rounded-md font-medium hover:bg-[#0958A6] cursor-pointer"
              >
                Add Job
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddJob;