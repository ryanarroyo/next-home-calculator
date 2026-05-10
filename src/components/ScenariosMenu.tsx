import { useEffect, useRef, useState } from "react";
import {
  type ScenarioInputs,
  useScenarios,
} from "../lib/savedScenarios";

interface ScenariosMenuProps {
  current: ScenarioInputs;
  defaultName: string;
  onLoad: (inputs: ScenarioInputs) => void;
}

export function ScenariosMenu({
  current,
  defaultName,
  onLoad,
}: ScenariosMenuProps) {
  const { scenarios, save, remove } = useScenarios();
  const [open, setOpen] = useState(false);
  const [naming, setNaming] = useState(false);
  const [draft, setDraft] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setNaming(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setNaming(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (naming) {
      setDraft(defaultName);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [naming, defaultName]);

  const commitSave = () => {
    const name = draft.trim() || defaultName;
    save(name, current);
    setNaming(false);
  };

  return (
    <div className="scn" ref={wrapRef}>
      <button
        type="button"
        className="scn-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="scn-label">Scenarios</span>
        {scenarios.length > 0 && (
          <span className="scn-count">{scenarios.length}</span>
        )}
        <span className="scn-caret" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="scn-menu" role="menu">
          {naming ? (
            <div className="scn-naming">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitSave();
                  if (e.key === "Escape") setNaming(false);
                }}
                placeholder={defaultName}
              />
              <button type="button" onClick={commitSave}>
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="scn-add"
              onClick={() => setNaming(true)}
            >
              + Save current
            </button>
          )}

          <div className="scn-sep" />

          {scenarios.length === 0 ? (
            <div className="scn-empty">No saved scenarios yet.</div>
          ) : (
            <ul className="scn-list">
              {scenarios.map((s) => (
                <li key={s.id} className="scn-item">
                  <button
                    type="button"
                    className="scn-load"
                    onClick={() => {
                      onLoad(s.inputs);
                      setOpen(false);
                    }}
                    title={new Date(s.savedAt).toLocaleString()}
                  >
                    {s.name}
                  </button>
                  <button
                    type="button"
                    className="scn-del"
                    aria-label={`Delete ${s.name}`}
                    onClick={() => remove(s.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
