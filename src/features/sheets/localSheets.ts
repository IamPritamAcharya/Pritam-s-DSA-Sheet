// Import all .txt files from the sheets folder at build time via Vite's import.meta.glob
// The { eager: true, query: '?raw' } options bundle the files as raw strings — no network fetch needed.

const rawSheets = import.meta.glob('/sheets/*.txt', { eager: true, query: '?raw' });

export interface SheetFile {
  name: string;
  content: string;
}

export function getLocalSheets(): SheetFile[] {
  return Object.entries(rawSheets)
    .filter(([path]) => path.endsWith('.txt'))
    .map(([path, mod]) => {
      const filename = path.split('/').pop()!.replace('.txt', '');
      const content = (mod as { default: string }).default ?? '';
      return { name: filename, content };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
