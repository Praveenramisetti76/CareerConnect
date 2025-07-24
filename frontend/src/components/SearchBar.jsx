import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search companies...",
  className,
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value || "");

  // Debounced function to call onChange after user stops typing
  const debouncedOnChange = useCallback(
    debounce((searchValue) => {
      onChange?.(searchValue);
    }, 300),
    [onChange]
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange?.("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange?.(localValue);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "pl-10 pr-10 h-12 text-base",
            "border-gray-200 focus:border-blue-300 focus:ring-blue-100",
            "bg-white/80 backdrop-blur-sm",
            "placeholder:text-gray-400"
          )}
        />
        {localValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={handleClear}
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
