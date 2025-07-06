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

function App() {
  return (
    <Router>
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
            <ProtectedRoute allowedRoles={['manager']}>
              <LeaveDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={
          <>
            <BackToHome />
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
