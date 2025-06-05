/** @format */

import { ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  emptyMessage = "Tidak ada data",
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-base-content/60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className={onRowClick ? "hover:bg-base-200 cursor-pointer" : ""}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, index) => (
                <td key={index} className={column.className}>
                  {column.render
                    ? column.render(item)
                    : String(item[column.key as keyof T] || "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
