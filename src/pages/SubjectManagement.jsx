import React, { useEffect, useState } from 'react';
import { departmentService, subjectService } from '../services/dataService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import DepartmentFilter from '../components/DepartmentFilter';
import { Loader2 } from 'lucide-react';

export const SubjectManagement = () => {

  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    code: '',
    name: '',
    department_id: '',
    created_by: '',
    updated_by: ''
  });

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const [subRes, deptRes] = await Promise.all([
        subjectService.getAll(),
        departmentService.getAll()
      ]);

      const subjectData = subRes.data.data || subRes.data || [];
      const deptData = deptRes.data.data || deptRes.data || [];

      const updatedSubjects = subjectData.map((s) => {
        const dept = deptData.find(
          (d) => (d.id || d.department_id) === s.department
        );

        return {
          ...s,
          code: s.sub_code,
          name: s.sub_name,
          department_name: dept
            ? (dept.name || dept.department_name)
            : "N/A"
        };
      });

      setSubjects(updatedSubjects);
      setDepartments(deptData);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= MODAL =================
  const handleOpenModal = (subject = null) => {
    setErrors({});

    if (subject) {
      setEditingSubject(subject);
      setFormData({
        id: subject.id,
        code: subject.code,
        name: subject.name,
        department_id: String(subject.department),
        created_by: '',
        updated_by: ''
      });
    } else {
      setEditingSubject(null);
      setFormData({
        id: null,
        code: '',
        name: '',
        department_id: '',
        created_by: '',
        updated_by: ''
      });
    }

    setIsModalOpen(true);
  };

  // ================= VALIDATION =================
  const validate = () => {
    let newErrors = {};

    if (!formData.code) newErrors.code = "Subject code required";
    if (!formData.name) newErrors.name = "Subject name required";
    if (!formData.department_id) newErrors.department_id = "Select department";

    if (!editingSubject && !formData.created_by)
      newErrors.created_by = "Created By required";

    if (editingSubject && !formData.updated_by)
      newErrors.updated_by = "Updated By required";

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
      setErrors({ department_id: "Invalid department" });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingSubject) {

        await subjectService.update({
          id: formData.id,
          sub_name: formData.name,
          updated_by: formData.updated_by
        });

        setSuccess("Subject updated successfully ✅");

      } else {

        await subjectService.create({
          sub_code: formData.code,
          sub_name: formData.name,
          department: deptId,
          created_by: formData.created_by
        });

        setSuccess("Subject added successfully ✅");
      }

      fetchData();
      setIsModalOpen(false);
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error(err);
      setErrors({ api: "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = (subject) => {
    setSubjectToDelete(subject);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await subjectService.delete(subjectToDelete.id);
    fetchData();
    setIsDeleteModalOpen(false);
    setSuccess("Deleted successfully ✅");
    setTimeout(() => setSuccess(""), 3000);
  };

  // ================= FILTER =================
  const filteredSubjects =
    selectedDeptId === 'all'
      ? subjects
      : subjects.filter(s => String(s.department) === selectedDeptId);

  return (
    <div className="space-y-6">

      {success && (
        <div className="bg-green-100 text-green-700 p-2 rounded">
          {success}
        </div>
      )}

      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Subject Management</h2>

        <DepartmentFilter
          departments={departments}
          selectedId={selectedDeptId}
          onSelect={setSelectedDeptId}
        />
      </div>

      <DataTable
        data={filteredSubjects}
        columns={[
          { header: 'Code', accessor: 'code' },
          { header: 'Name', accessor: 'name' },
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
        title={editingSubject ? "Edit Subject" : "Add Subject"}
      >
        <form onSubmit={handleSubmit} className="space-y-3">

          {errors.api && <p className="text-red-500">{errors.api}</p>}

          <select
            value={formData.department_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, department_id: e.target.value })
            }
            className="w-full p-2 border rounded-xl"
          >
            <option value="">Select Department</option>

            {departments.map((d, index) => {
              const id = d.id || d.department_id;
              const name = d.name || d.department_name;

              return (
                <option key={`${id}-${index}`} value={String(id)}>
                  {name}
                </option>
              );
            })}
          </select>
          <p className="text-red-500 text-sm">{errors.department_id}</p>

          <input
            placeholder="Subject Code"
            value={formData.code}
            onChange={(e)=>setFormData({...formData, code:e.target.value})}
            className="w-full p-2 border rounded-xl"
          />
          <p className="text-red-500 text-sm">{errors.code}</p>

          <input
            placeholder="Subject Name"
            value={formData.name}
            onChange={(e)=>setFormData({...formData, name:e.target.value})}
            className="w-full p-2 border rounded-xl"
          />
          <p className="text-red-500 text-sm">{errors.name}</p>

          {/* CREATED BY */}
          {!editingSubject && (
            <>
              <input
                placeholder="Created By"
                value={formData.created_by}
                onChange={(e)=>setFormData({...formData, created_by:e.target.value})}
                className="w-full p-2 border rounded-xl"
              />
              <p className="text-red-500 text-sm">{errors.created_by}</p>
            </>
          )}

          {/* UPDATED BY */}
          {editingSubject && (
            <>
              <input
                placeholder="Updated By"
                value={formData.updated_by}
                onChange={(e)=>setFormData({...formData, updated_by:e.target.value})}
                className="w-full p-2 border rounded-xl"
              />
              <p className="text-red-500 text-sm">{errors.updated_by}</p>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl"
          >
            {isSubmitting
              ? <Loader2 className="animate-spin mx-auto"/>
              : (editingSubject ? "Update" : "Create")}
          </button>

        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={()=>setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this subject?"
      />

    </div>
  );
};