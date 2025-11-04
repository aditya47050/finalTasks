import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Reusable InputField Component
 * @param {string} label - The label text
 * @param {string} id - The unique ID for the input field
 * @param {string} type - The type of input (default: "text")
 * @param {string} placeholder - The placeholder text
 * @param {string|number} value - The current value of the input
 * @param {function} onChange - The function to handle input change
 */
const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="border border-gray-300  placeholder:text-sm p-2 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
};

/**
 * Reusable SelectField Component
 * @param {string} label - The label text
 * @param {string} id - The unique ID for the select field
 * @param {string} value - The currently selected value
 * @param {function} onChange - The function to handle select change
 * @param {Array} options - The dropdown options [{ value: "", label: "Option" }]
 */
const SelectField = ({ label, id, value, onChange, options = [] }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <select
        id={id}
        className="border border-gray-300 p-2 text-sm rounded-xl w-full text-gray-400 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
const DateFilter = ({ label, id, selected, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="block text-sm font-medium text-gray-600">
      {label}
    </label>
    <ReactDatePicker
      id={id}
      selected={selected ? new Date(selected) : null} // Ensure selected is a Date object
      onChange={(date) => onChange(id, date ? date.toISOString() : "")} // Fix: Pass field name correctly
      dateFormat="yyyy-MM-dd"
      className="border border-gray-300 p-2 text-sm rounded-xl w-full bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      isClearable
      showMonthDropdown
      showYearDropdown
      scrollableYearDropdown
      placeholderText="Select date"
    />
  </div>
);

const MultiSelectDropdown = ({ label, options, selectedValues, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Toggle dropdown open/close
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Handle checkbox selection
  const handleCheckboxChange = (value) => {
    let newValues;
    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter((v) => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    onChange(newValues);
  };

  // Clear all selections
  const handleClearSelection = (e) => {
    e.stopPropagation(); // Prevent dropdown from toggling
    onChange([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <h1 className="block text-sm font-medium text-gray-600">{label}</h1>
      <div
        className="relative border border-gray-300 p-2 rounded-xl w-full bg-white flex justify-between items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        {/* Selected Items */}
        <div className="flex-1 max-h-8 overflow-y-auto flex flex-wrap items-center gap-1 text-black">
          {selectedValues.length > 0 ? (
            selectedValues.map((item, index) => (
              <span
                key={index}
                className="bg-gray-200 text-black px-2 py-1 rounded-md text-xs"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select {label}</span>
          )}
        </div>

        {/* Clear Button */}
        {selectedValues.length > 0 && (
          <button
            className="ml-2 text-xs text-red-600 hover:text-red-800"
            onClick={handleClearSelection}
          >
            ✕ Clear
          </button>
        )}

       
      </div>

      {/* Dropdown with Checkboxes */}
      {isDropdownOpen && (
        <div className="absolute w-full max-h-40 overflow-y-auto bg-white border border-gray-300 mt-1 rounded-xl shadow-lg z-50">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center px-3 py-2 hover:bg-gray-200 cursor-pointer"
            >
              <input
                type="checkbox"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
                className="mr-2"
              />
              <span className="text-black">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;

export { InputField, SelectField, DateFilter, MultiSelectDropdown };
