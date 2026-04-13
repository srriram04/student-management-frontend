import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentDashboardService } from '../services/dataService';
import DataTable from '../components/DataTable';

export const StudentMarks = () => {
  const { user } = useAuth();

  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchMarks = async () => {
      if (!user?.roll_no) return;

      try {
        const res = await studentDashboardService.marks(user.roll_no);

        const data = res.data?.data || [];

        setMarks(data);
        setFilteredMarks(data);

        // ✅ GET UNIQUE SUBJECTS
        const uniqueSubjects = [
          ...new Set(data.map((m) => m.subject)),
        ];

        setSubjects(uniqueSubjects);

      } catch (err) {
        console.error("Marks Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarks();
  }, [user]);

  // ================= FILTER LOGIC =================
  useEffect(() => {
    if (selectedSubject === 'all') {
      setFilteredMarks(marks);
    } else {
      setFilteredMarks(
        marks.filter((m) => m.subject === selectedSubject)
      );
    }
  }, [selectedSubject, marks]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900">
          My Marks
        </h2>
        <p className="text-slate-500 text-sm">
          View your academic performance
        </p>
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex items-center gap-3">

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border px-4 py-2 rounded-xl bg-white text-sm"
        >
          <option value="all">All Subjects</option>

          {subjects.map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>

      </div>

      {/* ================= TABLE ================= */}
      <DataTable
        data={Array.isArray(filteredMarks) ? filteredMarks : []}
        isLoading={isLoading}
        columns={[
          {
            header: 'Subject',
            accessor: 'subject',
            className: 'font-semibold',
          },
          {
            header: 'Marks',
            accessor: 'marks',
            className: 'font-mono',
          },
          {
            header: 'Status',
            accessor: (m) => (
              <span
                className={
                  m.marks >= 50
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {m.marks >= 50 ? "Pass" : "Fail"}
              </span>
            ),
          },
        ]}
      />

    </div>
  );
};