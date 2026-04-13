import React from 'react';
import { Edit2, Trash2, Search, Plus } from 'lucide-react';
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

  // 🔍 FILTER
  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        Object.values(item || {}).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      {/* HEADER */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">

        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium w-full sm:w-auto"
          >
            <Plus size={18} />
            {addLabel}
          </button>
        )}
      </div>

      {/* 🔥 DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">

          <thead className="bg-slate-50 border-b">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "px-6 py-4 text-xs font-bold text-slate-500 uppercase",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}

              {(onEdit || onDelete || extraActions) && (
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">

            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredData.length > 0 ? (

              filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">

                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm text-slate-600"
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : item?.[col.accessor]}
                    </td>
                  ))}

                  {(onEdit || onDelete || extraActions) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">

                        {extraActions && extraActions(item)}

                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                <td colSpan={columns.length + 1} className="text-center py-10 text-slate-400">
                  No records found
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

      {/* 🔥 MOBILE CARD VIEW */}
      <div className="md:hidden p-4 space-y-4">

        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-xl animate-pulse">
              <div className="h-4 bg-slate-100 rounded mb-2"></div>
              <div className="h-4 bg-slate-100 rounded"></div>
            </div>
          ))
        ) : filteredData.length > 0 ? (

          filteredData.map((item, index) => (
            <div key={index} className="p-4 border rounded-xl shadow-sm">

              {columns.map((col, colIndex) => (
                <div key={colIndex} className="mb-2">
                  <p className="text-xs text-slate-400">{col.header}</p>
                  <p className="text-sm font-medium text-slate-700">
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : item?.[col.accessor]}
                  </p>
                </div>
              ))}

              {(onEdit || onDelete || extraActions) && (
                <div className="flex gap-2 mt-3">

                  {extraActions && extraActions(item)}

                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="flex-1 py-2 text-indigo-600 bg-indigo-50 rounded-lg"
                    >
                      Edit
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="flex-1 py-2 text-red-600 bg-red-50 rounded-lg"
                    >
                      Delete
                    </button>
                  )}

                </div>
              )}

            </div>
          ))

        ) : (
          <p className="text-center text-slate-400 py-10">No records found</p>
        )}

      </div>

      {/* FOOTER */}
      <div className="p-4 text-sm text-slate-500 border-t">
        Showing <span className="font-medium">{filteredData.length}</span> results
      </div>

    </div>
  );
};

export default DataTable;