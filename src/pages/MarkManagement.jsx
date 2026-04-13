import React, { useEffect, useState } from 'react';
import {
  studentService,
  subjectService,
  marksService,
  departmentService
} from '../services/dataService';

import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import DepartmentFilter from '../components/DepartmentFilter';
import { Loader2 } from 'lucide-react';

export const MarkManagement = () => {

  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedDeptId, setSelectedDeptId] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingMark, setEditingMark] = useState(null);
  const [markToDelete, setMarkToDelete] = useState(null);

  const [formData, setFormData] = useState({
    department_id: '',
    student_roll_no: '',
    subject_name: '',
    marks: '',
    created_by: '',
    updated_by: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= FETCH =================
  const fetchData = async () => {
    const [m, s, sub, d] = await Promise.all([
      marksService.getAll(),
      studentService.getAll(),
      subjectService.getAll(),
      departmentService.getAll()
    ]);

    const markData = m.data?.data || [];
    const studentData = s.data?.data || [];
    const subjectData = sub.data?.data || [];
    const deptData = d.data?.data || [];

    const updated = markData.map((m) => {
      const student = studentData.find(
        s => s.roll_no === m.student
      );

      const dept = deptData.find(
        d => d.id === student?.department
      );

      return {
        ...m,
        uniqueKey: m.id,
        roll_no: m.student,
        subject_name: m.subject,
        department_name: dept?.department_name || 'N/A',
        department_id: student?.department
      };
    });

    setMarks(updated);
    setStudents(studentData);
    setSubjects(subjectData);
    setDepartments(deptData);
  };

  useEffect(() => { fetchData(); }, []);

  // ================= FILTER =================
  const filteredMarks =
    selectedDeptId === 'all'
      ? marks
      : marks.filter(m => String(m.department_id) === selectedDeptId);

  const filteredStudents = students.filter(
    s => String(s.department) === formData.department_id
  );

  const filteredSubjects = subjects.filter(
    s => String(s.department) === formData.department_id
  );

  // ================= OPEN MODAL =================
  const handleOpenModal = (mark = null) => {
    if (mark) {
      setEditingMark(mark);
      setFormData({
        department_id: String(mark.department_id),
        student_roll_no: mark.roll_no,
        subject_name: mark.subject_name,
        marks: mark.marks,
        created_by: '',
        updated_by: ''
      });
    } else {
      setEditingMark(null);
      setFormData({
        department_id: '',
        student_roll_no: '',
        subject_name: '',
        marks: '',
        created_by: '',
        updated_by: ''
      });
    }

    setIsModalOpen(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = students.find(
      s => s.roll_no === formData.student_roll_no
    );

    const subject = subjects.find(
      s => s.sub_name === formData.subject_name
    );

    if (!student || !subject || !formData.marks) return;

    setIsSubmitting(true);

    try {

      if (editingMark) {

        if (!formData.updated_by.trim()) {
          alert("Updated By is required");
          return;
        }

        await marksService.update({
          id: editingMark.id,
          marks: Number(formData.marks),
          updated_by: formData.updated_by
        });

      } else {

        if (!formData.created_by.trim()) {
          alert("Created By is required");
          return;
        }

        await marksService.create({
          student: student.id,
          subject: subject.id,
          marks: Number(formData.marks),
          created_by: formData.created_by
        });
      }

      fetchData();
      setIsModalOpen(false);

    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = (mark) => {
    setMarkToDelete(mark);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await marksService.delete(markToDelete.id);
    fetchData();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Marks Management</h2>

        <DepartmentFilter
          departments={departments}
          selectedId={selectedDeptId}
          onSelect={setSelectedDeptId}
        />
      </div>

      <DataTable
        data={filteredMarks}
        rowKey="uniqueKey"
        columns={[
          { header: 'Roll No', accessor: 'roll_no' },
          { header: 'Subject', accessor: 'subject_name' },
          { header: 'Department', accessor: 'department_name' },
          { header: 'Marks', accessor: 'marks' }
        ]}
        onAdd={() => handleOpenModal()}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            value={formData.department_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                department_id: e.target.value,
                student_roll_no: '',
                subject_name: ''
              })
            }
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.department_name}
              </option>
            ))}
          </select>

          <select
            value={formData.student_roll_no}
            onChange={(e) =>
              setFormData({ ...formData, student_roll_no: e.target.value })
            }
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Student</option>
            {filteredStudents.map(s => (
              <option key={s.id} value={s.roll_no}>
                {s.name} ({s.roll_no})
              </option>
            ))}
          </select>

          <select
            value={formData.subject_name}
            onChange={(e) =>
              setFormData({ ...formData, subject_name: e.target.value })
            }
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Subject</option>
            {filteredSubjects.map(s => (
              <option key={s.id} value={s.sub_name}>
                {s.sub_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Marks"
            value={formData.marks}
            onChange={(e) =>
              setFormData({ ...formData, marks: e.target.value })
            }
            className="w-full p-3 border rounded-xl"
          />

          {/* CREATED BY */}
          {!editingMark && (
            <input
              placeholder="Created By"
              value={formData.created_by}
              onChange={(e)=>setFormData({...formData, created_by:e.target.value})}
              className="w-full p-3 border rounded-xl"
            />
          )}

          {/* UPDATED BY */}
          {editingMark && (
            <input
              placeholder="Updated By"
              value={formData.updated_by}
              onChange={(e)=>setFormData({...formData, updated_by:e.target.value})}
              className="w-full p-3 border rounded-xl"
            />
          )}

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
            {isSubmitting
              ? <Loader2 className="animate-spin mx-auto" />
              : editingMark ? "Update" : "Create"}
          </button>

        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
      />

    </div>
  );
};