import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { studentService, studentDashboardService } from "../services/dataService";
import { PerformanceAnalytics } from "../components/PerformanceAnalytics";

import {
  Search,
  UserPlus,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAll();
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH PERFORMANCE =================
  const fetchPerformance = async (student) => {
    if (!student?.roll_no) return;

    setIsLoading(true);

    try {
      const [marksRes, attendanceRes] = await Promise.all([
        studentDashboardService.marks(student.roll_no),
        studentDashboardService.attendance(student.roll_no),
      ]);

      setMarks(marksRes.data?.data || []);
      setAttendance(attendanceRes.data?.data || []);

    } catch (err) {
      console.error(err);
      setMarks([]);
      setAttendance([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= SEARCH =================
  useEffect(() => {

    if (!search) {
      setSelectedStudent(null);
      setMarks([]);
      setAttendance([]);
      return;
    }

    const found = students.find((s) =>
      `${s.name} ${s.roll_no}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (found) {
      setSelectedStudent(found);
      fetchPerformance(found);
    } else {
      setSelectedStudent(null);
      setMarks([]);
      setAttendance([]);
    }

  }, [search, students]);

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow border">

        <h3 className="font-semibold mb-4 text-lg">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Add Student */}
          <div
            onClick={() => navigate("/admin/students")}
            className="group p-5 rounded-xl bg-blue-100 text-center cursor-pointer transition hover:scale-[1.02] hover:shadow"
          >
            <UserPlus className="mx-auto mb-2 text-blue-600 group-hover:scale-110 transition" size={26} />
            <p className="font-semibold text-blue-700">Add Student</p>
          </div>

          {/* Record Marks */}
          <div
            onClick={() => navigate("/admin/marks")}
            className="group p-5 rounded-xl bg-indigo-100 text-center cursor-pointer transition hover:scale-[1.02] hover:shadow"
          >
            <BookOpen className="mx-auto mb-2 text-indigo-600 group-hover:scale-110 transition" size={26} />
            <p className="font-semibold text-indigo-700">Record Marks</p>
          </div>

          {/* New Subject */}
          <div
            onClick={() => navigate("/admin/subjects")}
            className="group p-5 rounded-xl bg-green-100 text-center cursor-pointer transition hover:scale-[1.02] hover:shadow"
          >
            <GraduationCap className="mx-auto mb-2 text-green-600 group-hover:scale-110 transition" size={26} />
            <p className="font-semibold text-green-700">New Subject</p>
          </div>

          {/* Attendance */}
          <div
            onClick={() => navigate("/admin/attendance")}
            className="group p-5 rounded-xl bg-orange-100 text-center cursor-pointer transition hover:scale-[1.02] hover:shadow"
          >
            <ClipboardCheck className="mx-auto mb-2 text-orange-600 group-hover:scale-110 transition" size={26} />
            <p className="font-semibold text-orange-700">Attendance</p>
          </div>

        </div>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow border">

        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Student Performance Analytics
        </h3>

        {/* SEARCH */}
        <div className="relative mb-6 w-full sm:max-w-md">

          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />

        </div>

        {/* EMPTY */}
        {!selectedStudent && !isLoading && (
          <div className="text-center text-gray-400 py-12 sm:py-16">
            Select a student to view analytics
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="text-center py-10 animate-pulse text-gray-500">
            Loading performance...
          </div>
        )}

        {/* DATA */}
        {selectedStudent && !isLoading && (
          <PerformanceAnalytics
            marks={marks}
            attendance={attendance}
          />
        )}

      </div>

    </div>
  );
}