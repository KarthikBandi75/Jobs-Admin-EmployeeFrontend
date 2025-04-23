import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import QuillEditor from '../../components/QuillEditor';
import 'quill/dist/quill.snow.css';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Profile = () => {
  const { employeeToken } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [completion, setCompletion] = useState(0);

  const [formData, setFormData] = useState({
    description: '',
    website: '',
    location: '',
    numberOfEmployees: '',
    achievements: '',
    awards: '',
    companyLogo: null,
  });

  const defaultLogo = 'https://via.placeholder.com/150?text=Logo';

  useEffect(() => {
    if (employeeToken) fetchProfile();
  }, [employeeToken]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://jobs-backend-47u0.onrender.com/api/employee/profile`, {
        headers: { token: employeeToken },
      });
      if (data.success) {
        const p = data.profile;
        setProfile(p);
        setFormData({
          description: p.description || '',
          website: p.website || '',
          location: p.location || '',
          numberOfEmployees: p.numberOfEmployees || '',
          achievements: p.achievements || '',
          awards: p.awards || '',
          companyLogo: null,
        });
        const fields = [
          p.description,
          p.website,
          p.location,
          p.numberOfEmployees,
          p.achievements,
          p.awards,
          p.companyLogo,
        ];
        const completed = fields.filter(f => f && f !== '').length;
        setCompletion(Math.round((completed / fields.length) * 100));
      } else {
        toast.error('Failed to fetch profile');
      }
    } catch {
      toast.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    try {
      const { data } = await axios.put(`https://jobs-backend-47u0.onrender.com/api/employee/profile`, form, {
        headers: { token: employeeToken, 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setProfile(data.profile);
        setIsEditing(false);
        toast.success('Profile updated');
        fetchProfile();
      } else {
        toast.error('Update failed');
      }
    } catch {
      toast.error('Error updating profile');
    }
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1F2A44]">Company Profile</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-[#0A66C2] text-white rounded-md text-sm font-medium hover:bg-[#0958A6] cursor-pointer"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </motion.button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-[#6B7280]">Loading...</div>
          ) : (
            <div className="space-y-6">
              <motion.div variants={inputVariants} initial="hidden" animate="visible" className="flex items-center gap-4">
                <img
                  src={
                    isEditing && formData.companyLogo
                      ? URL.createObjectURL(formData.companyLogo)
                      : profile?.companyLogo || defaultLogo
                  }
                  alt="Company Logo"
                  className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
                {isEditing && (
                  <input
                    type="file"
                    name="companyLogo"
                    accept="image/*"
                    onChange={handleChange}
                    className="block text-sm text-[#6B7280]"
                  />
                )}
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={completion}
                    text={`${completion}%`}
                    styles={buildStyles({
                      pathColor: '#0A66C2',
                      textColor: '#1F2A44',
                      trailColor: '#E5E7EB',
                    })}
                  />
                </div>
              </motion.div>

              {isEditing ? (
                <form
                onSubmit={e => {
                  e.preventDefault();
                  updateProfile();
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  { label: 'Description', name: 'description', type: 'text' },
                  { label: 'Website', name: 'website', type: 'text' },
                  { label: 'Location', name: 'location', type: 'text' },
                  { label: 'Number of Employees', name: 'numberOfEmployees', type: 'number' },
                ].map(({ label, name, type }, index) => (
                  <motion.div
                    key={name}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className="mb-4"
                  >
                    <label className="block text-sm font-medium text-[#6B7280]">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md text-[#1F2A44] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#0A66C2]"
                    />
                  </motion.div>
                ))}
              
                <motion.div
                  className="md:col-span-2 mb-4"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-sm font-medium text-[#6B7280]">Achievements</label>
                  <div className="mt-1">
                    <QuillEditor
                      value={formData.achievements}
                      onChange={value => setFormData(prev => ({ ...prev, achievements: value }))}
                      className="border border-gray-300 rounded-md"
                    />
                  </div>
                </motion.div>
              
                <motion.div
                  className="md:col-span-2 mb-4"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-sm font-medium text-[#6B7280]">Awards</label>
                  <div className="mt-1">
                    <QuillEditor
                      value={formData.awards}
                      onChange={value => setFormData(prev => ({ ...prev, awards: value }))}
                      className="border border-gray-300 rounded-md"
                    />
                  </div>
                </motion.div>
              
                <motion.div
                  className="md:col-span-2 text-right mb-0"
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
                    Save
                  </motion.button>
                </motion.div>
              </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileItem label="Company Name" value={profile?.employer.companyName} />
                  <ProfileItem label="Email" value={profile?.employer.email} />
                  <ProfileItem label="Website" value={profile?.website} isLink />
                  <ProfileItem label="Location" value={profile?.location} />
                  <ProfileItem label="Employees" value={profile?.numberOfEmployees} />
                  <ProfileItem label="Description" value={profile?.description} />
                  <ProfileItem label="Achievements" value={profile?.achievements} isHTML />
                  <ProfileItem label="Awards" value={profile?.awards} isHTML />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProfileItem = ({ label, value, isLink, isHTML }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="text-sm font-medium text-[#6B7280]">{label}</p>
    {isLink ? (
      <a href={value} target="_blank" rel="noreferrer" className="text-[#0A66C2] hover:text-[#0958A6]">
        {value || 'N/A'}
      </a>
    ) : isHTML ? (
      <div className="text-[#1F2A44] prose" dangerouslySetInnerHTML={{ __html: value || 'N/A' }} />
    ) : (
      <p className="text-[#1F2A44]">{value || 'N/A'}</p>
    )}
  </motion.div>
);

export default Profile;