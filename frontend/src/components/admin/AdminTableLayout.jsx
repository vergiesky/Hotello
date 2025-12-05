import React from "react";
import AdminPagination from "./AdminPagination";

export default function AdminTableLayout({
  children,
  page,
  totalItems,
  pageSize = 10,
  onPageChange,
}) {
  return (
    <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
      {typeof totalItems === "number" && totalItems > pageSize && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <AdminPagination
            page={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
