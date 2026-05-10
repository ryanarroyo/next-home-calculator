import { useEffect, useState } from "react";

const KEY = "cc.scenarios";
const MAX = 50;

export interface ScenarioInputs {
  homeEquity: number;
  nextPrice: number;
  cashDown: number;
  mortgageRate: number;
  loanTerm: number;
  taxRate: number;
  insRate: number;
  location: string;
  resolvedLoc: string;
  electricity: number;
  gas: number;
  hoa: number;
  landscaping: number;
  cleaning: number;
}

export interface Scenario {
  id: string;
  name: string;
  savedAt: number;
  inputs: ScenarioInputs;
}

function readAll(): Scenario[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Scenario[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: Scenario[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore quota / serialization errors
  }
}

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>(() => readAll());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setScenarios(readAll());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = (name: string, inputs: ScenarioInputs) => {
    const id = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const next: Scenario = { id, name, savedAt: Date.now(), inputs };
    const list = [next, ...readAll()].slice(0, MAX);
    writeAll(list);
    setScenarios(list);
  };

  const remove = (id: string) => {
    const list = readAll().filter((s) => s.id !== id);
    writeAll(list);
    setScenarios(list);
  };

  return { scenarios, save, remove };
}
