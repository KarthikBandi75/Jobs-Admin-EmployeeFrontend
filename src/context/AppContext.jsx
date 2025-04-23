import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [adminToken, setAdminToken] = useState(localStorage.getItem("Admin-Token") || "");
  const [employeeToken, setEmployeeToken] = useState(localStorage.getItem("Employee-Token") || "");

  const [allJobs, setAllJobs] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5577/api/admin/users", {
        headers: { token: adminToken },
      });
      setAllJobs(response.data.alljobs || []);
      setEmployee(response.data.employers || []);
      setUsers(response.data.jobSeekers || []);
    } catch (err) {
      console.error("Error fetching admin details:", err);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminDetails().then(() => navigate("/admin-dashboard"));
    } else if (employeeToken) {
      navigate("/employee-dashboard");
    } else {
      navigate("/login");
    }
  }, [adminToken, employeeToken]);

  return (
    <AuthContext.Provider
      value={{
        adminToken,
        setAdminToken,
        employeeToken,
        setEmployeeToken,
        allJobs,
        setAllJobs,
        employee,
        setEmployee,
        users,
        setUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
