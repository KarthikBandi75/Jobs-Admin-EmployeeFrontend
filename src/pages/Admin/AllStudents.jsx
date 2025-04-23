import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUserCircle, FaFileAlt, FaTrash } from 'react-icons/fa';

const AllStudents = () => {
  const { adminToken, users } = useContext(AuthContext);
  const [students, setStudents] = useState(Array.isArray(users) ? users : []);
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await axios.delete(
        `http://localhost:5577/api/admin/jobseeker/${userId}`,
        { headers: { token: adminToken } }
      );
      if (response.data.success) {
        setStudents(students.filter(student => student._id !== userId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error('Failed to delete user');
      console.error('Delete error:', err.message);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 pt-20">
      <div className="container mx-auto px-4 py-10">
         <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-gray-700 mb-8"
                >
                  Students Management
                </motion.h2>

        {students.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.map((student, index) => (
              <motion.div
                key={student._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <FaUserCircle className="text-5xl text-indigo-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Gender:</strong> {student.gender}</p>
                  <p><strong>Phone:</strong> {student.phone}</p>
                  <p><strong>Skills:</strong> { student.skills.length > 0 ? student.skills.map(skill => skill.skillname).join(', ') : 'None'}</p>
                  <p><strong>Joined:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
                </div>

                {student.resumeUrl && (
                  <a
                    href={student.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-3 text-indigo-600 hover:underline text-sm"
                  >
                    <FaFileAlt /> View Resume
                  </a>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteUser(student._id)}
                  className="mt-6 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#EF4444] rounded-md hover:bg-[#DC2626] w-full"
                >
                  <FaTrash /> Delete Student
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
            No students found.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default AllStudents;
