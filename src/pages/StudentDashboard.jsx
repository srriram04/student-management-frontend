import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { studentDashboardService } from "../services/dataService";

import {
  User,
  Mail,
  BookOpen,
  TrendingUp
} from "lucide-react";

import { PerformanceAnalytics } from "../components/PerformanceAnalytics";

export const StudentDashboard = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({});
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await studentDashboardService.dashboard(user.roll_no);
        const data = res.data;

        setProfile(data.profile || {});
        setMarks(data.marks || []);
        setAttendance(data.attendance || []);
        setSubjects(data.subjects || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.roll_no) fetchData();
  }, [user]);

  // ================= CALCULATIONS =================
  const avgMarks =
    marks.length > 0
      ? Math.round(
          (marks.reduce((a, b) => a + Number(b.marks || 0), 0) /
            (marks.length * 100)) *
            100
        )
      : 0;

  const attendanceRate =
    attendance.length > 0
      ? Math.round(
          (attendance.filter((a) => a.status === 1).length /
            attendance.length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold">
          Student Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          Welcome back, {profile?.name}
        </p>
      </div>

      {/* ================= TOP SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROFILE */}
        <div className="bg-white p-5 rounded-2xl shadow border text-center">

          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User />
          </div>

          <h3 className="font-bold text-base sm:text-lg">
            {profile?.name}
          </h3>
          <p className="text-sm text-gray-500">
            {profile?.roll_no}
          </p>

          <div className="mt-3 inline-block px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">
            STUDENT
          </div>

          <div className="mt-5 space-y-2 text-sm text-left">
            <p className="flex items-center gap-2">
              <Mail size={16} /> {profile?.email}
            </p>
            <p className="flex items-center gap-2">
              <BookOpen size={16} /> {profile?.department}
            </p>
          </div>

        </div>

        {/* STATS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded-xl border text-center">
            <p className="text-xs text-gray-500">Avg Score</p>
            <h2 className="text-lg sm:text-xl font-bold text-indigo-600">
              {avgMarks}%
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl border text-center">
            <p className="text-xs text-gray-500">Attendance</p>
            <h2 className="text-lg sm:text-xl font-bold text-green-600">
              {attendanceRate}%
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl border text-center">
            <p className="text-xs text-gray-500">Subjects</p>
            <h2 className="text-lg sm:text-xl font-bold text-blue-600">
              {subjects.length}
            </h2>
          </div>

          {/* OVERVIEW */}
          <div className="sm:col-span-3 bg-white p-4 rounded-xl border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm sm:text-base">
                Academic Overview
              </h3>
              <TrendingUp size={18} />
            </div>

            <div className="text-sm space-y-1">
              <p>✔ Status: Active</p>
              <p>✔ Roll No: {profile?.roll_no}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div>
        <h3 className="font-semibold mb-3 text-base sm:text-lg">
          Academic Performance
        </h3>

        <PerformanceAnalytics
          marks={marks}
          attendance={attendance}
        />
      </div>

      {/* ================= LISTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* MARKS */}
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            Recent Marks
          </h3>

          {marks.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No marks available
            </p>
          ) : (
            marks.map((m, i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b last:border-none text-sm"
              >
                <p>{m.subject}</p>
                <p className="text-indigo-600 font-bold">
                  {m.marks}/100
                </p>
              </div>
            ))
          )}
        </div>

        {/* ATTENDANCE */}
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            Recent Attendance
          </h3>

          {attendance.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No attendance available
            </p>
          ) : (
            attendance.map((a, i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b last:border-none text-sm"
              >
                <p>{a.subject}</p>
                <p
                  className={
                    a.status === 1
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {a.status === 1 ? "Present" : "Absent"}
                </p>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};