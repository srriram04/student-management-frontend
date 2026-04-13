import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentDashboardService } from '../services/dataService';
import DataTable from '../components/DataTable';
import { cn } from "../utils/cn";

export const StudentAttendance = () => {

  const { user } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDate, setSelectedDate] = useState(''); // ✅ NEW

  const [isLoading, setIsLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.roll_no) return;

      try {
        const res = await studentDashboardService.attendance(user.roll_no);
        const data = res.data?.data || [];

        setAttendance(data);
        setFilteredAttendance(data);

        const uniqueSubjects = [...new Set(data.map(a => a.subject))];
        setSubjects(uniqueSubjects);

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  // ================= FILTER =================
  useEffect(() => {

    let filtered = attendance;

    // 🔹 Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(a => a.subject === selectedSubject);
    }

    // 🔹 Date filter (NEW)
    if (selectedDate) {
      filtered = filtered.filter(a => a.date === selectedDate);
    }

    setFilteredAttendance(filtered);

  }, [selectedSubject, selectedDate, attendance]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">My Attendance</h2>
        <p className="text-gray-500 text-sm">
          Track your attendance across subjects
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">

        {/* SUBJECT FILTER */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border px-4 py-2 rounded-xl"
        >
          <option value="all">All Subjects</option>
          {subjects.map((sub, i) => (
            <option key={i} value={sub}>{sub}</option>
          ))}
        </select>

        {/* DATE FILTER (NEW) */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-4 py-2 rounded-xl"
        />

      </div>

      {/* TABLE */}
      <DataTable
        data={filteredAttendance}
        isLoading={isLoading}
        columns={[
          {
            header: 'Subject',
            accessor: 'subject',
          },
          {
            header: 'Date',
            accessor: (a) => a.date || "N/A",
          },
          {
            header: 'Status',
            accessor: (a) => (
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-bold',
                  a.status === 1
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                )}
              >
                {a.status === 1 ? "Present" : "Absent"}
              </span>
            ),
          },
        ]}
      />

    </div>
  );
};