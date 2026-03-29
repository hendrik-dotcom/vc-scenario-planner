"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onSave: (value: string) => void;
  type?: "text" | "number" | "url";
  className?: string;
  placeholder?: string;
}

export function EditableField({ value, onSave, type = "text", className = "", placeholder }: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  function handleSave() {
    setEditing(false);
    if (editValue !== value) {
      onSave(editValue);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(value);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-[var(--background)] border border-[var(--ring)] rounded px-2 py-1 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${className}`}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        min={type === "number" ? "0" : undefined}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={`cursor-pointer hover:bg-[var(--accent)] rounded px-1 -mx-1 transition-colors ${className}`}
      title="Click to edit"
    >
      {value || <span className="text-[var(--muted-foreground)] italic">{placeholder || "Click to edit"}</span>}
    </span>
  );
}
