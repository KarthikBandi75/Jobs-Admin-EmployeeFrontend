import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AppContext';




import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import Profile from './pages/Employee/Profile';
import AddJob from './pages/Employee/AddJob';
import AllJobs from './pages/Employee/AllJobs';

import SingleJob from './pages/Employee/SingleJob';


import AppliedCandidates from './pages/Employee/AppliedCandidates';
import AllCompanies from './pages/Admin/AllCompanies';
import AllStudents from './pages/Admin/AllStudents';
import AdminAllJobs from './pages/Admin/AdminAllJobs';
import Adminnavbar from './components/Adminnavbar';
import EmployeNavbar from './components/EmployeNavbar';




const App = () => {
  const { adminToken, employeeToken } = useContext(AuthContext);
  const isLoggedIn = adminToken || employeeToken;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {adminToken && <Adminnavbar />}
      {employeeToken && <EmployeNavbar/>}
      <div className="flex">
        
        

        <main className="flex-1 p-4">
          <Routes>
            <Route path="/login" element={<Login />} />

            {adminToken && (
              <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/allcompanies" element={<AllCompanies/>}/>
              <Route path="/alljobs" element={<AdminAllJobs/>}/>
              <Route path="/allstudents" element={<AllStudents/>}/>
              </>
            )}
             
            {employeeToken && (
              <>
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee-profile" element={<Profile />} />
                <Route path="/add-job" element={<AddJob />} />
                <Route path="/alljobs" element={<AllJobs />} />
                <Route path="/job/:id" element={<SingleJob />} />
                <Route path="/applied/:id" element={<AppliedCandidates/>}/>
              </>
              
            )}
            
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>

        </main>
       
      </div>
    </>
  );
};

export default App;
