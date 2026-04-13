import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import { AuthProvider } from "./context/AuthContext"

import { AdminLoginPage } from "./pages/AdminLoginPage"
import StudentLoginPage from "./pages/StudentLoginPage"

import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"

import { AdminDashboard } from "./pages/AdminDashboard"
import { StudentDashboard } from "./pages/StudentDashboard"

import { DepartmentManagement } from "./pages/DepartmentManagement"
import { StudentManagement } from "./pages/StudentManagement"
import { SubjectManagement } from "./pages/SubjectManagement"
import { MarkManagement } from "./pages/MarkManagement"
import { AttendanceManagement } from "./pages/AttendanceManagement"

import { StudentSubjects } from "./pages/StudentSubjects"
import { StudentMarks } from "./pages/StudentMarks"
import { StudentAttendance } from "./pages/StudentAttendance"

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<StudentLoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <DepartmentManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <StudentManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <SubjectManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/marks"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <MarkManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AttendanceManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ================= STUDENT ROUTES ================= */}

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <StudentDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/subjects"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <StudentSubjects />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/marks"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <StudentMarks />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <StudentAttendance />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback — unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  )
}