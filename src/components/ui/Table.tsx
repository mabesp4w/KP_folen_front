/** @format */

// src/components/ui/Table.tsx
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  sortKey?: keyof T;
  sortDirection?: "asc" | "desc";
  className?: string;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onSort,
  sortKey,
  sortDirection,
  className = "",
}: TableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (!onSort) return;

    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort(key, newDirection);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`table table-zebra w-full ${className}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width }}
                className={
                  column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                }
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.title}
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp
                        size={12}
                        className={`${
                          sortKey === column.key && sortDirection === "asc"
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      />
                      <ChevronDown
                        size={12}
                        className={`${
                          sortKey === column.key && sortDirection === "desc"
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {column.render
                      ? column.render(record[column.key], record)
                      : record[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
