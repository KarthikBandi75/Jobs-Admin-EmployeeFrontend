import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AllCompanies = () => {
  const { adminToken, employee } = useContext(AuthContext);
  const [companies, setCompanies] = useState(Array.isArray(employee) ? employee : []);

  const handleDeleteEmployer = async (employerId) => {
    if (!window.confirm('Are you sure you want to delete this employer?')) return;
    try {
      const response = await axios.delete(
        `http://localhost:5577/api/admin/employer/${employerId}`,
        { headers: { token: adminToken } }
      );
      if (response.data.success) {
        setCompanies(companies.filter(company => company._id !== employerId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error('Failed to delete employer');
      console.error('Delete error:', err.message);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
         <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-cyan-900 mb-8"
                >
                  Manage Companies
                </motion.h2>

        {companies.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company, index) => (
              <motion.div
                key={company._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  {company.companyLogo && (
                    <img
                      src={company.companyLogo}
                      alt={`${company.employer.companyName} logo`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800">
                    {company.employer.companyName}
                  </h3>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p><span className="font-medium">Email:</span> {company.employer.email}</p>
                  <p><span className="font-medium">Location:</span> {company.location}</p>
                  <p><span className="font-medium">Employees:</span> {company.numberOfEmployees}</p>
                  <p><span className="font-medium">Joined:</span> {new Date(company.createdAt).toLocaleDateString()}</p>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-indigo-600 hover:underline mt-2"
                    >
                      Visit Website
                    </a>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDeleteEmployer(company.employer._id)}
                  className="mt-auto bg-[#EF4444] hover:bg-[#DC2626] text-white py-2 px-4 rounded-lg text-sm transition-all cursor-pointer"
                >
                  Delete Company
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-500 text-center mt-10"
          >
            No companies found
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default AllCompanies;
