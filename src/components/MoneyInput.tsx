import { useState } from "react";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  placeholder?: string;
}

export function MoneyInput({
  value,
  onChange,
  prefix = "$",
  suffix,
  min = 0,
  max = 100_000_000,
  placeholder,
}: MoneyInputProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  const display = focused
    ? draft
    : value === 0 || value == null
      ? ""
      : Number(value).toLocaleString("en-US");

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div className="input-wrap">
      {prefix && <span className="prefix">{prefix}</span>}
      <input
        type="text"
        inputMode="numeric"
        value={display}
        placeholder={placeholder}
        onFocus={() => {
          setFocused(true);
          setDraft(value == null || value === 0 ? "" : String(value));
        }}
        onBlur={() => {
          setFocused(false);
          const cleaned = draft.replace(/[^0-9.]/g, "");
          const n = cleaned === "" ? 0 : parseFloat(cleaned);
          onChange(Number.isNaN(n) ? 0 : clamp(n));
        }}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^0-9.]/g, "");
          setDraft(cleaned);
          const n = cleaned === "" ? 0 : parseFloat(cleaned);
          if (!Number.isNaN(n)) onChange(clamp(n));
        }}
      />
      {suffix && <span className="suffix">{suffix}</span>}
    </div>
  );
}
