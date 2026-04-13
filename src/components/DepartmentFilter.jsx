import React from 'react';
import { Filter } from 'lucide-react';

const DepartmentFilter = ({
  departments = [],
  selectedId = 'all',
  onSelect,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>

      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
        <Filter size={18} />
      </div>

      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)} // ✅ FIX
        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer min-w-[180px]"
      >
        <option value="all">All Departments</option>

        {Array.isArray(departments) &&
          departments.map((dept, index) => {
            const id = dept.id || dept.department_id;
            const name = dept.name || dept.department_name;

            return (
              <option key={`${id}-${index}`} value={String(id)}>
                {name}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default DepartmentFilter;