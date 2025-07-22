import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BackToHome from "./components/BackToHome";
import LeaveDetails from "./pages/LeaveDetails";
import SessionHandler from "./components/SessionHandler";
import { useSelector } from "react-redux";
import DebugAuth from "./redux/DebugAuth";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <Router>
      <DebugAuth />
      {isAuthenticated && <SessionHandler />} {/* 👈 handles session tracking globally */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['manager','employee']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-details"
          element={
            <ProtectedRoute allowedRoles={['manager','employee']}>
              <LeaveDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={
          <>
            <BackToHome path="/" btntext=" Back to Login"/>
            <h2>Unauthorized Access</h2>
          </>
        } />

        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
