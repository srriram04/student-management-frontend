import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DataTable from '../components/DataTable';

export const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!user?.roll_no) return;

        const res = await axios.get(
          `http://127.0.0.1:8000/student_subjects/${user.roll_no}/`
        );

        // ✅ DIRECT DATA FROM BACKEND
        setSubjects(res.data?.data || []);

      } catch (err) {
        console.error("Subjects Error:", err);
        setSubjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [user]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          My Subjects
        </h2>
        <p className="text-slate-500 text-sm">
          Subjects based on your department
        </p>
      </div>

      {/* TABLE */}
      <DataTable
        data={subjects}
        isLoading={isLoading}
        columns={[
          {
            header: 'Code',
            accessor: 'sub_code',
            className: 'font-mono font-medium',
          },
          {
            header: 'Subject Name',
            accessor: 'sub_name',
            className: 'font-semibold text-slate-900',
          },
        ]}
      />

    </div>
  );
};