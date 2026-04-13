import axios from "axios"

const BASE_URL = "https://student-management-backend-3dbc.onrender.com";

// ================= ADMIN =================

// Register
export const registerService = {
  create: (data) => axios.post(`${BASE_URL}/register/`, data),
  getOne: (id) => axios.get(`${BASE_URL}/get_register/${id}/`),
  getAll: () => axios.get(`${BASE_URL}/sum_register/`),
  update: (data) => axios.put(`${BASE_URL}/update_register/`, data),
  delete: (id) => axios.delete(`${BASE_URL}/delete_register/${id}/`),
  login: (data) => axios.post(`${BASE_URL}/sign_in/`, data),
}

// Department
export const departmentService = {
  getAll: () => axios.get(`${BASE_URL}/departments/`),
  create: (data) => axios.post(`${BASE_URL}/create_department/`, data),
  update: (data) => axios.put(`${BASE_URL}/update_department/`, data),
  delete: (id) => axios.delete(`${BASE_URL}/delete_department/${id}/`),
}

// Students
export const studentService = {
  getAll: () => axios.get(`${BASE_URL}/students/`),
  create: (data) => axios.post(`${BASE_URL}/create_student/`, data),
  update: (data) => axios.put(`${BASE_URL}/update_student/`, data),
  delete: (id) => axios.delete(`${BASE_URL}/delete_student/${id}/`),
}

// Subject
export const subjectService = {
  getAll: () => axios.get(`${BASE_URL}/subjects/`),
  create: (data) => axios.post(`${BASE_URL}/create_subject/`, data),
  update: (data) => axios.put(`${BASE_URL}/update_subject/`, data),
  delete: (id) => axios.delete(`${BASE_URL}/delete_subject/${id}/`),
}

// Attendance
export const attendanceService = {
  getAll: () => axios.get(`${BASE_URL}/attendance/`),
  create: (data) => axios.post(`${BASE_URL}/create_attendance/`, data),
  update: (data) => axios.put(`${BASE_URL}/update_attendance/`, data),
  delete: (id) => axios.delete(`${BASE_URL}/delete_attendance/${id}/`),
}

// Marks
export const marksService = {
  getAll: () => axios.get(`${BASE_URL}/marks/`),

  getForStudent: (id) =>
    axios.get(`${BASE_URL}/student_marks/${id}/`),

  create: (data) => axios.post(`${BASE_URL}/create_marks/`, data),

  update: (data) => axios.put(`${BASE_URL}/update_marks/`, data),

  delete: (id) => axios.delete(`${BASE_URL}/delete_marks/${id}/`),
}
// ================= STUDENT =================

export const studentDashboardService = {
  login: (data) => axios.post(`${BASE_URL}/student_login/`, data),
  profile: (id) => axios.get(`${BASE_URL}/student_profile/${id}/`),
  subjects: (id) => axios.get(`${BASE_URL}/student_subjects/${id}/`),
  marks: (id) => axios.get(`${BASE_URL}/student_marks/${id}/`),
  attendance: (id) => axios.get(`${BASE_URL}/student_attendance/${id}/`),
  dashboard: (id) => axios.get(`${BASE_URL}/student_dashboard/${id}/`),
}