import { useState, useEffect } from 'react';
import { getLocalSheets, SheetFile } from '../localSheets';
import { parseSheetContent, ParsedSheet } from '../parser';

export function useSheets() {
  const [sheetFiles]  = useState<SheetFile[]>(() => getLocalSheets());
  const [activeSheet, setActiveSheet] = useState<string | null>(
    () => getLocalSheets()[0]?.name ?? null
  );
  const [parsedSheet, setParsedSheet] = useState<ParsedSheet | null>(null);

  useEffect(() => {
    if (!activeSheet) { setParsedSheet(null); return; }
    const file = sheetFiles.find((f) => f.name === activeSheet);
    if (!file) { setParsedSheet(null); return; }
    // Synchronous — content is already bundled
    setParsedSheet(parseSheetContent(file.name, file.content));
  }, [activeSheet, sheetFiles]);

  return {
    sheetFiles,
    activeSheet,
    setActiveSheet,
    parsedSheet,
    loading: false,
    contentLoading: false,
    error: null,
  };
}
