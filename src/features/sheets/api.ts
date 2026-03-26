// api.ts re-exports from localSheets for backwards compatibility.
// All sheet data is now loaded via Vite import.meta.glob — no GitHub API needed.
export type { SheetFile } from './localSheets';
export { getLocalSheets } from './localSheets';
