import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  CalendarDays,
  Briefcase,
} from "lucide-react";

const SortDropdown = ({ value, onChange, className }) => {
  const sortOptions = [
    {
      value: "name_asc",
      label: "Company Name (A-Z)",
      icon: ArrowUp,
    },
    {
      value: "name_desc",
      label: "Company Name (Z-A)",
      icon: ArrowDown,
    },
    {
      value: "newest",
      label: "Newest Companies",
      icon: Calendar,
    },
    {
      value: "oldest",
      label: "Oldest Companies",
      icon: CalendarDays,
    },
    {
      value: "most_jobs",
      label: "Most Job Openings",
      icon: Briefcase,
    },
  ];

  const selectedOption = sortOptions.find((option) => option.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`w-[200px] border-gray-200 hover:border-gray-300 text-sm ${className}`}
      >
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-gray-600" />
          <SelectValue placeholder="Sort by...">
            {selectedOption && (
              <div className="flex items-center space-x-2">
                <selectedOption.icon className="h-4 w-4 text-gray-600" />
                <span className="truncate text-gray-700">
                  {selectedOption.label}
                </span>
              </div>
            )}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200">
        {sortOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-sm hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <option.icon className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortDropdown;
