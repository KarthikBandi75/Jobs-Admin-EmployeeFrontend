import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Lock, Building2 } from 'lucide-react';
import Input from '../components/Input';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AppContext';

const Login = () => {
  const [role, setRole] = useState("Admin"); 
  const [mode, setMode] = useState("Login"); 
  const [email, setEmail] = useState("jobadmin@gmail.com");
  const [password, setPassword] = useState("qwerty123");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW

  const { setAdminToken, setEmployeeToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading

    try {
      if (role === "Admin") {
        const response = await axios.post(`https://jobs-backend-47u0.onrender.com/api/admin/login`, {
          email,
          password,
        });

        if (response.data.success) {
          localStorage.setItem("Admin-Token", response.data.token);
          setAdminToken(response.data.token);
          toast.success(response.data.message || "Admin logged in");
        } else {
          toast.error("Admin login failed.");
        }

      } else {
        if (mode === "Login") {
          const response = await axios.post(`https://jobs-backend-47u0.onrender.com/api/employee/login`, {
            email,
            password,
          });

          if (response.data.success) {
            localStorage.setItem("Employee-Token", response.data.token);
            setEmployeeToken(response.data.token);
            toast.success(response.data.message || "Employee logged in");
          } else {
            toast.error("Employee login failed.");
          }

        } else {
          const response = await axios.post(`https://jobs-backend-47u0.onrender.com/api/employee/signup`, {
            companyName,
            email,
            password,
          });

          if (response.data.success) {
            localStorage.setItem("Employee-Token", response.data.token);
            setEmployeeToken(response.data.token);
            toast.success(response.data.message || "Employee registered & logged in");
          } else {
            toast.error("Signup failed.");
          }
        }
      }
    } catch (error) {
      console.error("Error during auth:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <motion.div
        className="w-full max-w-md p-8 text-white bg-gray-900 shadow-2xl rounded-2xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center">
          {role} {mode}
        </h2>

        <form onSubmit={onSubmitHandler} className="mt-6 space-y-4">
          {(role === "Employee" && mode === "Signup") && (
            <Input
              icon={Building2}
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          )}
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            className={`w-full py-3 font-bold rounded-xl cursor-pointer flex items-center justify-center ${
              loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <motion.div
                className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            ) : (
              mode
            )}
          </motion.button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <p>
            {role === "Admin" ? "Employee?" : "Admin?"}{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => {
                const newRole = role === "Admin" ? "Employee" : "Admin";
                setRole(newRole);
                setMode("Login");
                if (newRole === "Admin") {
                  setEmail("jobadmin@gmail.com");
                  setPassword("qwerty123");
                  setCompanyName("");
                } else {
                  setEmail("");
                  setPassword("");
                  setCompanyName("");
                }
              }}
            >
              Click here
            </span>
          </p>

          {role === "Employee" && (
            <p>
              {mode === "Login" ? "New Employer?" : "Already have an account?"}{" "}
              <span
                className="text-green-400 cursor-pointer hover:underline"
                onClick={() => setMode(mode === "Login" ? "Signup" : "Login")}
              >
                {mode === "Login" ? "Sign up" : "Log in"}
              </span>
            </p>
          )}

          <div className="mt-2 text-center">
                    <p>
                        Admin Login?{" "}   
                        <span
                            className="text-blue-400 cursor-pointer hover:underline"
                          
                        >
<a href="https://jobs-user-frontend.vercel.app/login" >Click Here</a>
                        </span>
                    </p>
                </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
