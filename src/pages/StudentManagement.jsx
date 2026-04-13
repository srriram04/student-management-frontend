import React, { useEffect, useState } from 'react';
import { studentService, departmentService } from '../services/dataService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import DepartmentFilter from '../components/DepartmentFilter';
import { Loader2 } from 'lucide-react';

export const StudentManagement = () => {

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    roll_no: '',
    name: '',
    email: '',
    mobile_number: '',
    department_id: '',
    date_of_birth: '',
    created_by: '',
    updated_by: '',
    password: ''
  });

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const [stuRes, deptRes] = await Promise.all([
        studentService.getAll(),
        departmentService.getAll()
      ]);

      const deptData = deptRes.data.data || deptRes.data || [];
      const studentData = stuRes.data.data || [];

      const updatedStudents = studentData.map((s) => {
        const dept = deptData.find(
          (d) =>
            d.department_id === s.department ||
            d.id === s.department
        );

        return {
          ...s,
          department_name: dept
            ? (dept.department_name || dept.name)
            : "N/A"
        };
      });

      setStudents(updatedStudents);
      setDepartments(deptData);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= MODAL =================
  const handleOpenModal = (student = null) => {
    setErrors({});

    if (student) {
      setEditingStudent(student);
      setFormData({
        id: student.id,
        roll_no: student.roll_no,
        name: student.name,
        email: student.email,
        mobile_number: student.mobile_number || '',
        department_id: String(student.department),
        date_of_birth: student.date_of_birth || '',
        created_by: '',
        updated_by: '',
        password: ''
      });
    } else {
      setEditingStudent(null);
      setFormData({
        id: null,
        roll_no: '',
        name: '',
        email: '',
        mobile_number: '',
        department_id: '',
        date_of_birth: '',
        created_by: '',
        updated_by: '',
        password: ''
      });
    }

    setIsModalOpen(true);
  };

  // ================= VALIDATION =================
  const validate = () => {
    let newErrors = {};

    if (!formData.roll_no) newErrors.roll_no = "Roll No required";
    if (!formData.name) newErrors.name = "Name required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.password) newErrors.password = "Password required";

    if (!formData.mobile_number) {
      newErrors.mobile_number = "Mobile required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Must be 10 digits";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "DOB required";
    }

    if (!formData.department_id) {
      newErrors.department_id = "Select department";
    }

    if (!editingStudent && !formData.created_by) {
      newErrors.created_by = "Created By required";
    }

    if (editingStudent && !formData.updated_by) {
      newErrors.updated_by = "Updated By required";
    }

    return newErrors;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const deptId = parseInt(formData.department_id, 10);

    if (isNaN(deptId)) {
      setErrors({ department_id: "Invalid department selected" });
      return;
    }

    const payload = {
      roll_no: formData.roll_no,
      name: formData.name,
      email: formData.email,
      mobile_number: formData.mobile_number,
      password: formData.password,
      department: deptId,
      date_of_birth: formData.date_of_birth
    };

    setIsSubmitting(true);

    try {
      if (editingStudent) {
        await studentService.update({
          ...payload,
          id: formData.id,
          updated_by: formData.updated_by
        });
        setSuccess("Student updated successfully ✅");
      } else {
        await studentService.create({
          ...payload,
          created_by: formData.created_by
        });
        setSuccess("Student added successfully ✅");
      }

      fetchData();
      setIsModalOpen(false);

      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      setErrors({
        api: err.response?.data?.error || "Something went wrong"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await studentService.delete(studentToDelete.id);
    fetchData();
    setIsDeleteModalOpen(false);
    setSuccess("Student deleted successfully ✅");
    setTimeout(() => setSuccess(""), 3000);
  };

  // ================= FILTER =================
  const filteredStudents =
    selectedDeptId === 'all'
      ? students
      : students.filter(s => String(s.department) === selectedDeptId);

  return (
    <div className="space-y-6">

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Student Management
        </h2>

        <DepartmentFilter
          departments={departments}
          selectedId={selectedDeptId}
          onSelect={setSelectedDeptId}
        />
      </div>

      {/* TABLE */}
      <DataTable
        data={filteredStudents}
        columns={[
          { header: 'Roll No', accessor: 'roll_no' },
          { header: 'Name', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
          { header: 'Department', accessor: 'department_name' }
        ]}
        onAdd={() => handleOpenModal()}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? "Edit Student" : "Add Student"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}

          {/* DEPARTMENT */}
          <select
            value={formData.department_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                department_id: e.target.value
              })
            }
            className="w-full p-2 border rounded-xl"
          >
            <option value="">Select Department</option>
            {departments.map((d, index) => {
              const id = d.department_id || d.id;
              const name = d.department_name || d.name;
              return (
                <option key={`${id}-${index}`} value={String(id)}>
                  {name}
                </option>
              );
            })}
          </select>
          <p className="text-red-500 text-sm">{errors.department_id}</p>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-2">
              <input placeholder="Roll No"
                value={formData.roll_no}
                onChange={(e)=>setFormData({...formData, roll_no:e.target.value})}
                className="w-full p-2 border rounded-xl"/>
              <p className="text-red-500 text-sm">{errors.roll_no}</p>

              <input placeholder="Name"
                value={formData.name}
                onChange={(e)=>setFormData({...formData, name:e.target.value})}
                className="w-full p-2 border rounded-xl"/>
              <p className="text-red-500 text-sm">{errors.name}</p>

              <input type="date"
                value={formData.date_of_birth}
                onChange={(e)=>setFormData({...formData, date_of_birth:e.target.value})}
                className="w-full p-2 border rounded-xl"/>
              <p className="text-red-500 text-sm">{errors.date_of_birth}</p>
            </div>

            <div className="space-y-2">
              <input placeholder="Email"
                value={formData.email}
                onChange={(e)=>setFormData({...formData, email:e.target.value})}
                className="w-full p-2 border rounded-xl"/>
              <p className="text-red-500 text-sm">{errors.email}</p>

              <input placeholder="Password"
                value={formData.password}
                onChange={(e)=>setFormData({...formData, password:e.target.value})}
                className="w-full p-2 border rounded-xl"/>
              <p className="text-red-500 text-sm">{errors.password}</p>

              <input placeholder="Mobile"
                value={formData.mobile_number}
                onChange={(e)=>setFormData({...formData, mobile_number:e.target.value})}
                className="w-full p-2 border rounded-xl"/>
              <p className="text-red-500 text-sm">{errors.mobile_number}</p>

              {!editingStudent ? (
                <>
                  <input placeholder="Created By"
                    value={formData.created_by}
                    onChange={(e)=>setFormData({...formData, created_by:e.target.value})}
                    className="w-full p-2 border rounded-xl"/>
                  <p className="text-red-500 text-sm">{errors.created_by}</p>
                </>
              ) : (
                <>
                  <input placeholder="Updated By"
                    value={formData.updated_by}
                    onChange={(e)=>setFormData({...formData, updated_by:e.target.value})}
                    className="w-full p-2 border rounded-xl"/>
                  <p className="text-red-500 text-sm">{errors.updated_by}</p>
                </>
              )}
            </div>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl"
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : (editingStudent ? "Update" : "Create")}
          </button>

        </form>
      </Modal>

      {/* DELETE */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={()=>setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record?"
      />

    </div>
  );
};