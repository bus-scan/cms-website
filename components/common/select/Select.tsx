import { forwardRef, useState, useRef, useEffect } from "react";
import { HiXMark, HiChevronDown } from "react-icons/hi2";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      searchable = true,
      clearable = true,
      value,
      onChange,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
      null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Find selected option based on value
    useEffect(() => {
      const option = options.find((opt) => opt.value === value);
      setSelectedOption(option || null);
    }, [value, options]);

    // Filter options based on search term
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle option selection
    const handleOptionSelect = (option: SelectOption) => {
      setSelectedOption(option);
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedOption(null);
      onChange?.("");
      setSearchTerm("");
    };

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const baseInputClasses =
      "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 bg-white";
    const errorClasses = error
      ? "border-red-300 focus:ring-red-500"
      : "border-gray-300";

    // If not searchable, render as regular select
    if (!searchable) {
      return (
        <div className="mb-4">
          {label && (
            <label
              htmlFor={props.id}
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              {label}
            </label>
          )}
          <div className="relative">
            <select
              ref={ref}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className={`${baseInputClasses} ${errorClasses} ${className}`}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <HiChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );
    }

    // Searchable select
    return (
      <div className="mb-4 text-sm">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={isOpen ? searchTerm : selectedOption?.label || ""}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder || "ค้นหา..."}
              className={`${baseInputClasses} ${errorClasses} ${className} pr-20`}
              id={props.id}
              name={props.name}
              disabled={props.disabled}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              {clearable && selectedOption && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover:text-gray-600 mr-1 cursor-pointer"
                >
                  <HiXMark className="h-4 w-4" />
                </button>
              )}
              <div className="py-1 pr-2 text-gray-400">
                <HiChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  ไม่พบข้อมูล
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                      selectedOption?.value === option.value
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
