import React from 'react';
export default function InputNumeric({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      inputMode="decimal"
      pattern="[0-9]*"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 text-xl border rounded-2xl"
    />
  );
}