import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const PerformanceAnalytics = ({ marks = [], attendance = [] }) => {

  // ================= FIXED MARKS =================

  // ✅ Remove duplicates (important)
  const uniqueMarks = Object.values(
    marks.reduce((acc, curr) => {
      acc[curr.subject] = curr;
      return acc;
    }, {})
  );

  // ✅ Sort subjects (important)
  const sortedMarks = uniqueMarks.sort((a, b) =>
    a.subject.localeCompare(b.subject)
  );

  // ✅ Final chart data
  const marksData = sortedMarks.map((m) => ({
    name: m.subject,
    marks: Number(m.marks),
  }));

  // ================= CALCULATIONS =================
  const totalMarks = sortedMarks.reduce((sum, m) => sum + Number(m.marks), 0);
  const maxMarks = sortedMarks.length * 100;

  const percentage = maxMarks
    ? Math.round((totalMarks / maxMarks) * 100)
    : 0;

  // ================= ATTENDANCE =================
  const presentCount = attendance.filter((a) => a.status === 1).length;
  const absentCount = attendance.filter((a) => a.status === 0).length;

  const totalAttendance = attendance.length;

  const attendanceRate = totalAttendance
    ? Math.round((presentCount / totalAttendance) * 100)
    : 0;

  const attendanceData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ================= MARKS CHART ================= */}
      <div className="bg-white rounded-2xl p-6 shadow border">

        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Marks Overview</h3>
          <span className="text-indigo-600 font-bold">
            {percentage}%
          </span>
        </div>

        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marksData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} marks`, "Marks"]}
              />
              <Bar
                dataKey="marks"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between mt-4">
          <div className="bg-indigo-100 text-indigo-600 px-3 py-2 rounded-lg text-sm">
            Overall Marks: {totalMarks} / {maxMarks}
          </div>

          <div className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm">
            Percentage: {percentage}%
          </div>
        </div>

      </div>

      {/* ================= ATTENDANCE CHART ================= */}
      <div className="bg-white rounded-2xl p-6 shadow border">

        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Attendance Overview</h3>
          <span className="text-green-600 font-bold">
            {attendanceRate}%
          </span>
        </div>

        {/* CENTER PIE */}
        <div className="flex justify-center">
          <div className="relative w-[250px] h-[250px]">

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Overall</span>
              <span className="text-2xl font-bold text-green-600">
                {attendanceRate}%
              </span>
            </div>

          </div>
        </div>

        {/* LEGEND */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Present: {presentCount}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Absent: {absentCount}
          </div>
        </div>

      </div>

    </div>
  );
};