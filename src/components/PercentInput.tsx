import { useState } from "react";

interface PercentInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function PercentInput({
  value,
  onChange,
  min = 0,
  max = 100,
}: PercentInputProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  const formatted = (n: number) =>
    Number(n).toFixed(2).replace(/\.?0+$/, "") || "0";

  const display = focused
    ? draft
    : value == null || (value as unknown) === ""
      ? ""
      : formatted(value);

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div className="input-wrap">
      <input
        type="text"
        inputMode="decimal"
        value={display}
        onFocus={() => {
          setFocused(true);
          setDraft(value == null ? "" : String(value));
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
      <span className="suffix">%</span>
    </div>
  );
}
