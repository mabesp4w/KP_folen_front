/** @format */

// src/components/ui/SearchBox.tsx
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search...",
  className = "",
}) => {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        icon={Search}
        iconPosition="left"
        className="pr-10"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          icon={X}
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-circle btn-xs"
        />
      )}
    </div>
  );
};
