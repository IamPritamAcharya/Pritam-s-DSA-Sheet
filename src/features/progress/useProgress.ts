import { useState, useCallback } from 'react';

type ProgressMap = Record<string, Record<string, boolean>>;

const STORAGE_KEY = 'dsa-sheet-progress';

function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useProgress(sheetName: string | null) {
  const [progress, setProgress] = useState<ProgressMap>(load);

  const sheetProgress: Record<string, boolean> = sheetName
    ? (progress[sheetName] ?? {})
    : {};

  const toggle = useCallback(
    (problemUrl: string) => {
      if (!sheetName) return;
      setProgress((prev) => {
        const updated: ProgressMap = {
          ...prev,
          [sheetName]: {
            ...(prev[sheetName] ?? {}),
            [problemUrl]: !(prev[sheetName]?.[problemUrl] ?? false),
          },
        };
        save(updated);
        return updated;
      });
    },
    [sheetName]
  );

  const isDone = useCallback(
    (problemUrl: string) => sheetProgress[problemUrl] ?? false,
    [sheetProgress]
  );

  const totalDone = Object.values(sheetProgress).filter(Boolean).length;

  return { isDone, toggle, totalDone, sheetProgress };
}
