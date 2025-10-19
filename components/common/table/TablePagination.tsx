"use client";

import React from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  className?: string;
}

export default function TablePagination({
  currentPage,
  totalPages,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20],
  className = "",
}: TablePaginationProps) {
  const handlePreviousPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = Number(event.target.value);
    onRowsPerPageChange(newRowsPerPage);
    onPageChange(1); // Reset to first page when changing rows per page
  };

  const startItem = Math.min((currentPage - 1) * rowsPerPage + 1, total);
  const endItem = Math.min(currentPage * rowsPerPage, total);

  return (
    <div
      className={`bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 ${className}`}
    >
      {/* Mobile pagination */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Rows per page:{" "}
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="mx-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            {startItem}-{endItem} of {total}
          </span>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <HiArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <HiArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
