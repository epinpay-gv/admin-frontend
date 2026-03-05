import Pagination from "@/components/common/pagination/Pagination";
import { PaginationState } from "../hooks/useDataTable";

interface DataTablePaginationProps {
  pagination: PaginationState;
  totalRows: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function DataTablePagination({
  pagination,
  totalRows,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  return (
    <Pagination
      page={pagination.page}
      totalPages={totalPages}
      totalRows={totalRows}
      pageSize={pagination.pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}