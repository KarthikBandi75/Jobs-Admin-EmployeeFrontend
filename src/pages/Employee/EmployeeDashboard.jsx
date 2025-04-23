import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, Users, FileText, UserCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AdminFooter from '../../components/AdminFooter';

const EmployeeDashboard = () => {
  const { employeeToken } = useContext(AuthContext);
  const [metrics, setMetrics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    profileCompletion: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await axios.get('http://localhost:5577/api/jobs/company', {
          headers: { token: employeeToken },
        });
        const jobs = jobsRes.data.jobs || [];
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.isActive).length;

        const appsRes = await axios.get('http://localhost:5577/api/applications/company', {
          headers: { token: employeeToken },
        });
        
        const applications = appsRes.data.applications || [];
        const totalApplications = applications.length;

        const profileRes = await axios.get('http://localhost:5577/api/employee/profile', {
          headers: { token: employeeToken },
        });
       
        const profile = profileRes.data.profile || {};
        setCompanyName(profile.employer?.companyName || 'Your Company');

        const profileFields = [
          profile.description,
          profile.website,
          profile.location,
          profile.numberOfEmployees,
          profile.achievements,
          profile.awards,
          profile.companyLogo,
        ];
        const completedFields = profileFields.filter(field => field && field !== '').length;
        const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

        setMetrics({ totalJobs, activeJobs, totalApplications, profileCompletion });

        const recentApps = applications.slice(0, 3).map(app => ({
          type: 'application',
          text: `New application from ${app.user.name} for ${app.job.title}`,
          link: `/applied/${app.job._id}`,
          date: app.createdAt,
        }));
        const recentJobs = jobs.slice(0, 3).map(job => ({
          type: 'job',
          text: `Posted job: ${job.title}`,
          link: `/job/${job._id}`,
          date: job.createdAt,
        }));
        setRecentActivity([...recentApps, ...recentJobs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4));

        if (jobsRes.data.success && appsRes.data.success && profileRes.data.success) {
          toast.success('Dashboard data loaded successfully');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (employeeToken) fetchData();
  }, [employeeToken]);

  const chartData = [
    { name: 'Total Jobs', value: metrics.totalJobs, fill: '#0A66C2' },
    { name: 'Active Jobs', value: metrics.activeJobs, fill: '#00A69C' },
    { name: 'Applications', value: metrics.totalApplications, fill: '#EF4444' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 bg-[#F4F6F8]"
    >
      <div className="max-w-6xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200 flex flex-col md:flex-row items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-[#1F2A44] mb-2">Welcome, {companyName}</h1>
            <p className="text-sm text-[#6B7280]">"Find the best talent to grow your team."</p>
          </div>
          <Link
            to="/add-job"
            className="mt-4 md:mt-0 px-4 py-2 bg-[#0A66C2] text-white rounded-md text-sm font-medium hover:bg-[#0958A6]"
          >
            Post a New Job
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: 'Total Jobs', value: metrics.totalJobs, icon: <Briefcase className="text-[#0A66C2]" size={24} />, link: '/alljobs' },
            { label: 'Active Jobs', value: metrics.activeJobs, icon: <Briefcase className="text-[#00A69C]" size={24} />, link: '/alljobs' },
            { label: 'Applications', value: metrics.totalApplications, icon: <FileText className="text-[#EF4444]" size={24} />, link: '/alljobs' },
            { label: 'Profile Completion', value: metrics.profileCompletion, icon: <UserCheck className="text-[#0A66C2]" size={24} />, link: '/employee-profile' },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              {metric.icon}
              <div>
                <h3 className="text-sm font-medium text-[#6B7280]">{metric.label}</h3>
                <p className="text-xl font-semibold text-[#1F2A44]">{metric.label === 'Profile Completion' ? `${metric.value}%` : metric.value}</p>
                <Link to={metric.link} className="text-[#0A66C2] hover:text-[#0958A6] text-sm">
                  View Details
                </Link>
              </div>
              {metric.label === 'Profile Completion' && (
                <div className="w-12 h-12">
                  <CircularProgressbar
                    value={metric.value}
                    styles={buildStyles({
                      pathColor: '#0A66C2',
                      textColor: '#1F2A44',
                      trailColor: '#E5E7EB',
                    })}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 border border-gray-200"
          >
            <h3 className="text-base font-semibold text-[#1F2A44] mb-4">Job Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px' }}
                    labelStyle={{ color: '#1F2A44' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
          >
            <h3 className="text-base font-semibold text-[#1F2A44] mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`p-2 rounded-full ${activity.type === 'application' ? 'bg-[#E6F0FA]' : 'bg-[#D1FAE5]'}`}>
                      {activity.type === 'application' ? <FileText className="text-[#0A66C2]" size={16} /> : <Briefcase className="text-[#00A69C]" size={16} />}
                    </div>
                    <div>
                      <Link to={activity.link} className="text-[#1F2A44] hover:text-[#0A66C2] text-sm">
                        {activity.text}
                      </Link>
                      <p className="text-xs text-[#6B7280]">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-[#6B7280] text-sm">No recent activity</p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
        >
          <h3 className="text-base font-semibold text-[#1F2A44] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { label: 'Add New Job', link: '/add-job', color: 'bg-[#0A66C2] hover:bg-[#0958A6]' },
              { label: 'View All Jobs', link: '/alljobs', color: 'bg-[#00A69C] hover:bg-[#008C84]' },
              { label: 'Manage Candidates', link: '/alljobs', color: 'bg-[#0A66C2] hover:bg-[#0958A6]' },
              { label: 'Edit Profile', link: '/employee-profile', color: 'bg-[#00A69C] hover:bg-[#008C84]' },
            ].map((action, index) => (
              <motion.div
                key={action.label}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={action.link}
                  className={`block text-center px-3 py-2 text-white text-sm font-medium rounded-md ${action.color}`}
                >
                  {action.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;