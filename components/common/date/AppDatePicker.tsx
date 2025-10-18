"use client";

import { forwardRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils/classname";

// Register Thai locale
registerLocale("th", th);

interface AppDatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  dateFormat?: string;
  locale?: string;
  className?: string;
  isClearable?: boolean;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  dropdownMode?: "scroll" | "select";
  yearDropdownItemNumber?: number;
  scrollableYearDropdown?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  variant?: "default" | "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const AppDatePicker = forwardRef<any, AppDatePickerProps>(
  (
    {
      selected,
      onChange,
      placeholderText = "เลือกวันที่",
      dateFormat = "dd/MM/yyyy",
      locale = "th",
      className,
      isClearable = true,
      showYearDropdown = true,
      showMonthDropdown = true,
      dropdownMode = "select",
      yearDropdownItemNumber = 15,
      scrollableYearDropdown = true,
      minDate,
      maxDate,
      disabled = false,
      variant = "default",
      size = "md",
      ...props
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return "border-blue-300 focus:ring-blue-500 focus:border-blue-500 bg-blue-50";
        case "secondary":
          return "border-gray-300 focus:ring-gray-500 focus:border-gray-500 bg-gray-50";
        case "outline":
          return "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-transparent";
        default:
          return "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white";
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return "px-2 py-1 text-xs";
        case "lg":
          return "px-4 py-3 text-base";
        default:
          return "px-3 py-2 text-sm";
      }
    };

    const baseStyles = cn(
      "w-full rounded-md border transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-opacity-50",
      "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
      "text-gray-900 placeholder:text-gray-600",
      getVariantStyles(),
      getSizeStyles(),
      className
    );

    return (
      <DatePicker
        ref={ref}
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        dateFormat={dateFormat}
        locale={locale}
        className={baseStyles}
        isClearable={isClearable}
        showYearDropdown={showYearDropdown}
        showMonthDropdown={showMonthDropdown}
        dropdownMode={dropdownMode}
        yearDropdownItemNumber={yearDropdownItemNumber}
        scrollableYearDropdown={scrollableYearDropdown}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        {...props}
      />
    );
  }
);

AppDatePicker.displayName = "AppDatePicker";

export default AppDatePicker;
