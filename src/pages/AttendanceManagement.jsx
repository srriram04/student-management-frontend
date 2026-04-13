import React, { useEffect, useState } from 'react';
import {
  attendanceService,
  studentService,
  subjectService,
  departmentService
} from '../services/dataService';

import { Pencil, Trash2 } from 'lucide-react';

export const AttendanceManagement = () => {

  const [mode, setMode] = useState("take");

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

  // ================= FILTER =================
  const filteredSubjects =
    dept
      ? subjects.filter(s => String(s.department) === String(dept))
      : subjects;

  const filteredStudents =
    dept
      ? students.filter(s => String(s.department) === String(dept))
      : students;

  const finalStudents = filteredStudents.filter(s =>
    (s.roll_no || "").toLowerCase().includes(search.toLowerCase())
  );

  const finalRecords = attendance.filter(row => {
    return (
      (!dept || String(row.department) === String(dept)) &&
      (!subject || String(row.subject_id) === String(subject)) &&
      (!filterDate || row.date === filterDate) &&
      (row.student || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  // ================= ACTIONS =================
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
      await attendanceService.create({
        student: s.id,
        subject,
        date,
        status: s.status ? 1 : 0,
        created_by: createdBy
      });
    }

    setMessage("Attendance submitted ✅");
    load();
  };

  const handleUpdate = async () => {

    if (!editData.updated_by) return;

    await attendanceService.update({
      id: editData.id,
      status: editData.status ? 1 : 0,
      updated_by: editData.updated_by
    });

    setEditData(null);
    load();
  };

  const confirmDelete = async () => {
    await attendanceService.delete(deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div className="space-y-6">

      {/* MODE SWITCH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={()=>setMode("take")}
          className={`px-4 py-2 rounded ${mode==="take"?"bg-indigo-600 text-white":"border"}`}
        >
          Take Attendance
        </button>

        <button
          onClick={()=>setMode("view")}
          className={`px-4 py-2 rounded ${mode==="view"?"bg-indigo-600 text-white":"border"}`}
        >
          View Records
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">

        <select onChange={(e)=>setDept(e.target.value)} className="w-full sm:w-auto border px-3 py-2 rounded">
          <option value="">All Departments</option>
          {departments.map(d=>(
            <option key={d.id} value={d.id}>{d.department_name}</option>
          ))}
        </select>

        <select onChange={(e)=>setSubject(e.target.value)} className="w-full sm:w-auto border px-3 py-2 rounded">
          <option value="">All Subjects</option>
          {filteredSubjects.map(s=>(
            <option key={s.id} value={s.id}>{s.sub_name}</option>
          ))}
        </select>

        {mode==="take" && (
          <input type="date" onChange={(e)=>setDate(e.target.value)} className="w-full sm:w-auto border px-3 py-2 rounded"/>
        )}
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Search..."
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        {mode==="view" && (
          <input
            type="date"
            onChange={(e)=>setFilterDate(e.target.value)}
            className="w-full sm:w-auto border px-3 py-2 rounded"
          />
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full min-w-[700px]">

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

                <td className="p-3 flex gap-3">
                  <Pencil size={18} onClick={()=>setEditData({...r, updated_by:""})} className="cursor-pointer text-indigo-600"/>
                  <Trash2 size={18} onClick={()=>setDeleteId(r.id)} className="cursor-pointer text-red-500"/>
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      </div>

      {/* BULK SUBMIT */}
      {mode==="take" && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <input
            placeholder="Created By"
            onChange={(e)=>setCreatedBy(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Submit Attendance
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="mb-3 font-semibold">Edit Attendance</h3>

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
              className="border p-2 w-full mb-3 rounded"
            />

            <button
              onClick={handleUpdate}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center">
            <h3>Confirm Delete</h3>

            <div className="flex gap-3 mt-4">
              <button onClick={()=>setDeleteId(null)} className="w-full border py-2 rounded">
                Cancel
              </button>

              <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};