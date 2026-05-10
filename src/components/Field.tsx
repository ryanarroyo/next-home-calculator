import type { ReactNode } from "react";

interface FieldProps {
  name: string;
  hint?: ReactNode;
  desc?: ReactNode;
  children: ReactNode;
}

export function Field({ name, hint, desc, children }: FieldProps) {
  return (
    <div className="field">
      <div className="field-label">
        <span className="name">{name}</span>
        {hint != null && <span className="hint">{hint}</span>}
      </div>
      {children}
      {desc != null && <div className="field-desc">{desc}</div>}
    </div>
  );
}
