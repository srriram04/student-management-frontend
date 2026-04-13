import React from 'react';
import { Edit2, Trash2, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "../utils/cn";

const DataTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onAdd,
  extraActions,
  addLabel = 'Add New',
  isLoading = false,
  searchPlaceholder = 'Search...',
}) => {

  const [searchTerm, setSearchTerm] = React.useState('');

  // ================= SEARCH FILTER =================
  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        Object.values(item || {}).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* ================= HEADER ================= */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-100"
          >
            <Plus size={18} />
            {addLabel}
          </button>
        )}

      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          {/* HEADER */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}

              {(onEdit || onDelete || extraActions) && (
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-slate-100">

            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`loading-${i}`} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredData.length > 0 ? (

              filteredData.map((item, index) => (
                <tr
                  key={`${item?.id || item?.student || item?.roll_no || 'row'}-${index}`}
                  className="hover:bg-slate-50 transition-colors"
                >

                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn("px-6 py-4 text-sm text-slate-600", col.className)}
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : item?.[col.accessor]}
                    </td>
                  ))}

                  {(onEdit || onDelete || extraActions) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">

                        {extraActions && extraActions(item)}

                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                      </div>
                    </td>
                  )}

                </tr>
              ))

            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-12 text-center text-slate-400 italic"
                >
                  No records found
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium">{filteredData.length}</span> results
        </p>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 rounded-lg" disabled>
            <ChevronLeft size={18} />
          </button>
          <button className="p-2 text-slate-400 rounded-lg" disabled>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default DataTable;