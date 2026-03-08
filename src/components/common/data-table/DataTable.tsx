"use client";

import { useDataTable } from "./hooks/useDataTable";
import DataTableHeader, { ColumnDef } from "./components/DataTableHeader";
import DataTableStatusFilter from "./components/DataTableStatusFilter";
import DataTablePagination from "./components/DataTablePagination";

interface StatusOption {
  label: string;
  value: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  statusOptions?: StatusOption[];
  showStatusFilter?: boolean;
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  statusOptions,
  showStatusFilter = false,
  actions,
}: DataTableProps<T>) {
  const {
    rows,
    totalRows,
    sort,
    handleSort,
    columnFilters,
    setColumnFilter,
    clearColumnFilter,
    statusFilter,
    setStatusFilter,
    pagination,
    setPagination,
    totalPages,
  } = useDataTable({ data, columns });

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--background-card)",
        borderColor: "var(--border)",
      }}
    >
      {showStatusFilter && (
        <div
          className="flex items-center justify-end px-4 py-3 border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <DataTableStatusFilter
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            options={statusOptions}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <DataTableHeader
            columns={columns}
            sort={sort}
            onSort={handleSort}
            columnFilters={columnFilters}
            onColumnFilter={setColumnFilter}
            onClearColumnFilter={clearColumnFilter}
          />
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  Kayıt bulunamadı
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b transition-colors hover:bg-black/5 dark:hover:bg-white/[0.02]"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "-")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        pagination={pagination}
        totalRows={totalRows}
        totalPages={totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
      />
    </div>
  );
}