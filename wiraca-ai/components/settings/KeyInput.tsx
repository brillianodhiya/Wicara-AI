import React, { useState } from "react";

interface KeyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function KeyInput({ value, onChange, placeholder }: KeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        API Key
      </label>
      <div className="flex">
        <input
          type={showKey ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-gray-300 rounded-l px-3 py-2"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r"
        >
          {showKey ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
