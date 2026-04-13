import React, { useEffect, useState } from 'react';
import { departmentService } from '../services/dataService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import DepartmentFilter from '../components/DepartmentFilter';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from "../utils/cn";

export const DepartmentManagement = () => {

  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingDept, setEditingDept] = useState(null);
  const [deptToDelete, setDeptToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    created_by: '',
    updated_by: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [message, setMessage] = useState(null);
  const [globalMessage, setGlobalMessage] = useState(null);

  // ================= FETCH =================
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await departmentService.getAll();

      const formatted = (res.data.data || []).map((d) => ({
        ...d,
        name: d.department_name,
      }));

      setDepartments(formatted);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ================= MODAL =================
  const handleOpenModal = (dept = null) => {

    setMessage(null);

    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        created_by: '',
        updated_by: ''
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: '',
        created_by: '',
        updated_by: ''
      });
    }

    setIsModalOpen(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Department name is required' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {

      if (editingDept) {

        if (!formData.updated_by.trim()) {
          setMessage({ type: 'error', text: 'Updated By is required' });
          return;
        }

        await departmentService.update({
          id: editingDept.id,
          department_name: formData.name,
          updated_by: formData.updated_by
        });

        setMessage({ type: 'success', text: 'Department updated successfully!' });

      } else {

        if (!formData.created_by.trim()) {
          setMessage({ type: 'error', text: 'Created By is required' });
          return;
        }

        await departmentService.create({
          department_name: formData.name,
          created_by: formData.created_by
        });

        setMessage({ type: 'success', text: 'Department created successfully!' });
      }

      fetchDepartments();
      setTimeout(() => setIsModalOpen(false), 1000);

    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to save department',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = (dept) => {
    setDeptToDelete(dept);
    setIsDeleteModalOpen(true);
    setGlobalMessage(null);
  };

  const confirmDelete = async () => {

    if (!deptToDelete) return;

    setIsDeleting(true);

    try {
      await departmentService.delete(deptToDelete.id);

      setGlobalMessage({
        type: 'success',
        text: 'Department deleted successfully',
      });

      fetchDepartments();
      setTimeout(() => setGlobalMessage(null), 3000);

    } catch (err) {
      setGlobalMessage({
        type: 'error',
        text: 'Failed to delete department',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeptToDelete(null);
    }
  };

  // ================= FILTER =================
  const filteredDepartments =
    selectedDeptId === 'all'
      ? departments
      : departments.filter(
          (d) => String(d.id) === selectedDeptId
        );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Department Management
        </h2>

        <DepartmentFilter
          departments={departments}
          selectedId={selectedDeptId}
          onSelect={setSelectedDeptId}
        />
      </div>

      {/* GLOBAL MESSAGE */}
      {globalMessage && (
        <div className={cn(
          'p-3 rounded-lg flex items-center gap-2 text-sm border',
          globalMessage.type === 'success'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        )}>
          {globalMessage.type === 'success'
            ? <CheckCircle2 size={18} />
            : <AlertCircle size={18} />}
          {globalMessage.text}
        </div>
      )}

      {/* TABLE */}
      <DataTable
        data={filteredDepartments}
        isLoading={isLoading}
        columns={[
          { header: 'ID', accessor: 'id' },
          { header: 'Name', accessor: 'name' }
        ]}
        onAdd={() => handleOpenModal()}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        addLabel="Add Department"
      />

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? "Edit Department" : "Add Department"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          {message && (
            <div className={cn(
              'p-2 rounded text-sm',
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            )}>
              {message.text}
            </div>
          )}

          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e)=>setFormData({...formData, name:e.target.value})}
            className="w-full p-2 border rounded-xl"
          />

          {!editingDept && (
            <input
              type="text"
              placeholder="Created By"
              value={formData.created_by}
              onChange={(e)=>setFormData({...formData, created_by:e.target.value})}
              className="w-full p-2 border rounded-xl"
            />
          )}

          {editingDept && (
            <input
              type="text"
              placeholder="Updated By"
              value={formData.updated_by}
              onChange={(e)=>setFormData({...formData, updated_by:e.target.value})}
              className="w-full p-2 border rounded-xl"
            />
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={()=>setIsModalOpen(false)}
              className="w-full border py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-xl"
            >
              {isSubmitting
                ? <Loader2 className="animate-spin mx-auto"/>
                : editingDept ? "Update" : "Create"}
            </button>
          </div>

        </form>
      </Modal>

      {/* DELETE */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={()=>setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Department"
        message="Are you sure?"
        isDeleting={isDeleting}
      />

    </div>
  );
};