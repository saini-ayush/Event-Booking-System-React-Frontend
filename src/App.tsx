import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@contexts/AuthContext";
import PrivateRoute from "@components/PrivateRoute";
import Login from "@components/Login";
import Register from "@components/Register";
import UserDashboard from "@components/user/UserDashboard";
import Unauthorized from "@components/Unauthorized";
import AdminDashboard from "@components/admin/AdminDashboard";
import Dashboard from "@components/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<PrivateRoute />}>
            <Route path="/userdashboard" element={<UserDashboard />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<PrivateRoute requireAdmin={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>

        <ToastContainer position="top-right" autoClose={5000} />
      </AuthProvider>
    </Router>
  );
};

export default App;
