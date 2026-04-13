import React, { useEffect, useState } from 'react';
import {
  attendanceService,
  studentService,
  subjectService,
  departmentService
} from '../services/dataService';

import { Pencil, Trash2 } from 'lucide-react';

export const AttendanceManagement = () => {

  const [mode, setMode] = useState("take"); // take | view

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [dept, setDept] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');

  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [createdBy, setCreatedBy] = useState('');
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [message, setMessage] = useState('');

  // ================= LOAD =================
  const load = async () => {
    const [stu, sub, deptRes, att] = await Promise.all([
      studentService.getAll(),
      subjectService.getAll(),
      departmentService.getAll(),
      attendanceService.getAll()
    ]);

    setStudents(stu.data?.data || []);
    setSubjects(sub.data?.data || []);
    setDepartments(deptRes.data?.data || []);
    setAttendance(att.data?.data || []);
  };

  useEffect(() => { load(); }, []);

  // ================= FILTER SUBJECT =================
  const filteredSubjects =
    dept
      ? subjects.filter(s => String(s.department) === String(dept))
      : subjects;

  // ================= FILTER STUDENTS =================
  const filteredStudents =
    dept
      ? students.filter(s => String(s.department) === String(dept))
      : students;

  // ================= TAKE MODE =================
  const finalStudents = filteredStudents.filter(s =>
    (s.roll_no || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === id ? { ...s, status: !s.status } : s
      )
    );
  };

  const handleSubmit = async () => {

    if (!dept || !subject || !date || !createdBy) {
      setMessage("Fill all fields ❌");
      return;
    }

    for (let s of finalStudents) {
      try {
        await attendanceService.create({
          student: s.id,
          subject,
          date,
          status: s.status ? 1 : 0,
          created_by: createdBy
        });
      } catch {}
    }

    setMessage("Attendance submitted ✅");
    load();
  };

  // ================= VIEW MODE =================
  const finalRecords = attendance.filter(row => {

    const matchesSearch =
      (row.student || "").toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      !dept || String(row.department) === String(dept);

    const matchesSubject =
      !subject || String(row.subject_id) === String(subject);

    const matchesDate =
      !filterDate || row.date === filterDate;

    return matchesSearch && matchesDept && matchesSubject && matchesDate;
  });

  // ================= EDIT =================
  const handleUpdate = async () => {

    if (!editData.updated_by) return;

    await attendanceService.update({
      id: editData.id,
      status: editData.status ? 1 : 0,
      updated_by: editData.updated_by
    });

    setEditData(null);
    load();
    setMessage("Updated successfully ✅");
  };

  // ================= DELETE =================
  const confirmDelete = async () => {
    await attendanceService.delete(deleteId);
    setDeleteId(null);
    load();
    setMessage("Deleted successfully ✅");
  };

  return (
    <div className="space-y-6">

      {/* MODE SWITCH */}
      <div className="flex gap-3">
        <button onClick={()=>setMode("take")} className={`px-4 py-2 rounded ${mode==="take"?"bg-indigo-600 text-white":"border"}`}>
          Take Attendance
        </button>
        <button onClick={()=>setMode("view")} className={`px-4 py-2 rounded ${mode==="view"?"bg-indigo-600 text-white":"border"}`}>
          View Records
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">

        <select onChange={(e)=>setDept(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All Departments</option>
          {departments.map(d=>(
            <option key={d.id} value={d.id}>{d.department_name}</option>
          ))}
        </select>

        <select onChange={(e)=>setSubject(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All Subjects</option>
          {filteredSubjects.map(s=>(
            <option key={s.id} value={s.id}>{s.sub_name}</option>
          ))}
        </select>

        {mode==="take" && (
          <input type="date" onChange={(e)=>setDate(e.target.value)} className="border px-3 py-2 rounded"/>
        )}
      </div>

      {/* SEARCH + DATE FILTER */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3">
        <input
          placeholder="Search..."
          onChange={(e)=>setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-1/2"
        />

        {mode==="view" && (
          <input
            type="date"
            onChange={(e)=>setFilterDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Roll No</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Department</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {mode==="take" && finalStudents.map(s => {
              const deptObj = departments.find(d => d.id === s.department);

              return (
                <tr key={s.id}>
                  <td className="p-3">{s.roll_no}</td>
                  <td className="p-3">{subject || "-"}</td>
                  <td className="p-3">{deptObj?.department_name}</td>
                  <td className="p-3">{date || "-"}</td>

                  <td className="p-3">
                    <span
                      onClick={()=>toggleStatus(s.id)}
                      className={`px-3 py-1 rounded-full cursor-pointer ${
                        s.status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {s.status ? "Present" : "Absent"}
                    </span>
                  </td>

                  <td className="p-3">-</td>
                </tr>
              );
            })}

            {mode==="view" && finalRecords.map(r => (
              <tr key={r.id}>
                <td className="p-3">{r.student}</td>
                <td className="p-3">{r.subject}</td>
                <td className="p-3">{r.department_name}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.status ? "Present" : "Absent"}</td>

                <td className="p-3 flex gap-4">
                  <Pencil size={18} onClick={()=>setEditData({...r, updated_by:""})} className="cursor-pointer text-indigo-600"/>
                  <Trash2 size={18} onClick={()=>setDeleteId(r.id)} className="cursor-pointer text-red-500"/>
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      </div>

      {/* BULK */}
      {mode==="take" && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <input
            placeholder="Created By"
            onChange={(e)=>setCreatedBy(e.target.value)}
            className="border p-2 w-full"
          />
          <button onClick={handleSubmit} className="bg-indigo-600 text-white w-full p-2 rounded">
            Submit Attendance
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="mb-3">Edit Attendance</h3>

            <label className="flex gap-2 mb-3">
              <input
                type="checkbox"
                checked={editData.status}
                onChange={()=>setEditData({...editData, status: !editData.status})}
              />
              Present
            </label>

            <input
              placeholder="Updated By"
              onChange={(e)=>setEditData({...editData, updated_by:e.target.value})}
              className="border p-2 w-full mb-3"
            />

            <button onClick={handleUpdate} className="w-full bg-indigo-600 text-white py-2">
              Update
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h3>Confirm Delete</h3>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setDeleteId(null)} className="w-full border py-2">Cancel</button>
              <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-2">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};