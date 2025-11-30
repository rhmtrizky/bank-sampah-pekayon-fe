import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface BasicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  minWidth?: number;
}

export default function BasicTableOne<T extends { id?: number | string }>(
  { columns, data, loading, emptyMessage = "No data available", minWidth = 1102 }: BasicTableProps<T>
) {
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div style={{ minWidth }}>
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((col, i) => (
                  <TableCell
                    key={i}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="px-5 py-12 text-center h-[300px] flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <span className="text-2xl text-gray-400 dark:text-gray-500">∅</span>
                      </div>
                      <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white">
                        Tidak ada data
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {emptyMessage}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow key={row.id ?? rowIndex}>
                    {columns.map((col, ci) => (
                      <TableCell key={ci} className="px-5 py-4 text-start">
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey
                          ? (row[col.accessorKey] as React.ReactNode)
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
