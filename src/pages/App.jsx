import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import { AdminLoginPage } from "./pages/AdminLoginPage";
import StudentLoginPage from "./pages/StudentLoginPage";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import { AdminDashboard } from "./pages/AdminDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";

import { DepartmentManagement } from "./pages/DepartmentManagement";
import { StudentManagement } from "./pages/StudentManagement";
import { SubjectManagement } from "./pages/SubjectManagement";
import { MarkManagement } from "./pages/MarkManagement";
import { AttendanceManagement } from "./pages/AttendanceManagement";

import { StudentSubjects } from "./pages/StudentSubjects";
import { StudentMarks } from "./pages/StudentMarks";
import { StudentAttendance } from "./pages/StudentAttendance";


// 🔥 Wrapper Layout Route (IMPORTANT)
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/login" element={<StudentLoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LayoutWrapper />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="subjects" element={<SubjectManagement />} />
            <Route path="marks" element={<MarkManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
          </Route>

          {/* ================= STUDENT ROUTES ================= */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <LayoutWrapper />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="subjects" element={<StudentSubjects />} />
            <Route path="marks" element={<StudentMarks />} />
            <Route path="attendance" element={<StudentAttendance />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}