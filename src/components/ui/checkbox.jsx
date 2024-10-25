import React from "react";

export function Checkbox({ className = "", ...props }) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border border-primary text-primary ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
