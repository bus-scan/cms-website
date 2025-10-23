"use client";

import React, { useState, useMemo } from "react";
import { Select } from "@/components/common/select";
import { TablePagination } from "@/components/common/table";

export interface HistoryLogEntry {
  id: number;
  name: string;
  dateOpened: string;
  type: string;
  condition: string;
  membersJoined: number;
  timesJoined: number;
}

interface HistoryLogTableProps {
  privilegeId: string;
  yearOptions?: { value: string; label: string }[];
  initialYear?: string;
}

const defaultYearOptions = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
];

// Mock history log data
const mockHistoryLogData: HistoryLogEntry[] = [
  {
    id: 1,
    name: "Happy BUSDAY The Sophomore",
    dateOpened: "14/03/2025",
    type: "Quota",
    condition: "AA",
    membersJoined: 29101,
    timesJoined: 38811,
  },
  {
    id: 2,
    name: "Happy BUSDAY The Sophomore",
    dateOpened: "14/03/2025",
    type: "Quota",
    condition: "AA",
    membersJoined: 18211,
    timesJoined: 22711,
  },
  {
    id: 3,
    name: "Happy BUSDAY The Sophomore",
    dateOpened: "14/03/2025",
    type: "Normal",
    condition: "AA",
    membersJoined: 88190,
    timesJoined: 108211,
  },
  {
    id: 4,
    name: "Happy BUSDAY The Sophomore",
    dateOpened: "14/03/2025",
    type: "Normal",
    condition: "AA",
    membersJoined: 7712,
    timesJoined: 9811,
  },
  {
    id: 5,
    name: "Happy BUSDAY The Sophomore",
    dateOpened: "14/03/2025",
    type: "Normal",
    condition: "AA",
    membersJoined: 5500,
    timesJoined: 7200,
  },
];

export default function HistoryLogTable({
  privilegeId,
  yearOptions = defaultYearOptions,
  initialYear = "2025",
}: HistoryLogTableProps) {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Use mock data for now - replace with API call later
  const data = mockHistoryLogData;

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, rowsPerPage]);

  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Year Filter */}
      <div className="flex justify-end">
        <div className="w-32">
          <Select
            label="Year"
            options={yearOptions}
            value={selectedYear}
            onChange={setSelectedYear}
            searchable={false}
          />
        </div>
      </div>

      {/* History Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                วันที่เปิด
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                ประเภท
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Condition
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                จำนวน Member ที่เข้าร่วม
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                จำนวนครั้งที่มีคนเข้าร่วม
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-sm text-gray-900">{entry.id}</td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {entry.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {entry.dateOpened}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{entry.type}</td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {entry.condition}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {entry.membersJoined.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {entry.timesJoined.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={totalRows}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
}

