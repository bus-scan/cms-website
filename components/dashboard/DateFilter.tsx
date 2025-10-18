"use client";

import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { SolidButton } from "@/components/common/button";
import { AppDatePicker } from "@/components/common/date";

export default function DateFilter() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSearch = () => {
    // TODO: Implement date filtering logic
    console.log("Search with dates:", { startDate, endDate });
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center space-x-2">
        <FiCalendar className="size-5 shrink-0 text-gray-500" />
        <AppDatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="วันที่เริ่ม"
          dateFormat="dd/MM/yyyy"
          locale="th"
          className="w-40"
          isClearable
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          yearDropdownItemNumber={15}
          scrollableYearDropdown
          variant="default"
          size="md"
        />
      </div>
      <span className="text-gray-500">To</span>
      <AppDatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholderText="วันที่สิ้นสุด"
        dateFormat="dd/MM/yyyy"
        locale="th"
        className="w-40"
        isClearable
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={15}
        scrollableYearDropdown
        minDate={startDate || undefined}
        variant="default"
        size="md"
      />
      <SolidButton
        variant="primary"
        size="sm"
        onClick={handleSearch}
      >
        ค้นหา
      </SolidButton>
    </div>
  );
}
