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
  filterKeys?: (keyof T)[];
  statusOptions?: StatusOption[];
  showStatusFilter?: boolean;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  filterKeys = [],
  statusOptions,
  showStatusFilter = false,
}: DataTableProps<T>) {
  const {
    rows,
    totalRows,
    sort,
    handleSort,
    statusFilter,
    setStatusFilter,
    pagination,
    setPagination,
    totalPages,
  } = useDataTable({ data, filterKeys });

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      {/* Toolbar — sadece status filter varsa göster */}
      {showStatusFilter && (
        <div
          className="flex items-center justify-end px-4 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <DataTableHeader
            columns={columns}
            sort={sort}
            onSort={handleSort}
          />
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-white/25 font-mono"
                >
                  Kayıt bulunamadı
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b transition-colors hover:bg-white/[0.02]"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-sm"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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