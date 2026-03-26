import { SheetFile } from '../../features/sheets/localSheets';
import './Sidebar.css';

interface Props {
  sheets: SheetFile[];
  activeSheet: string | null;
  onSelect: (name: string) => void;
  open: boolean;
  sheetDoneMap?: Record<string, number>;  // sheetName -> totalDone
  sheetTotalMap?: Record<string, number>; // sheetName -> totalProblems
}

export function Sidebar({ sheets, activeSheet, onSelect, open, sheetDoneMap = {}, sheetTotalMap = {} }: Props) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <span className="sidebar__label">Sheets</span>
        <span className="sidebar__badge">{sheets.length}</span>
      </div>

      <nav className="sidebar__nav">
        {sheets.map((sheet, i) => {
          const isActive = activeSheet === sheet.name;
          const done = sheetDoneMap[sheet.name] ?? 0;
          const total = sheetTotalMap[sheet.name] ?? 0;
          const pct = total > 0 ? (done / total) * 100 : 0;

          return (
            <button
              key={sheet.name}
              className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
              onClick={() => onSelect(sheet.name)}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              {isActive && <span className="sidebar__item-bar" />}

              <div className="sidebar__item-body">
                <div className="sidebar__item-top">
                  <span className="sidebar__item-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </span>
                  <span className="sidebar__item-name">{sheet.name}</span>
                </div>

                {total > 0 && (
                  <div className="sidebar__item-progress">
                    <div className="sidebar__item-bar-track">
                      <div
                        className={`sidebar__item-bar-fill ${pct === 100 ? 'sidebar__item-bar-fill--done' : ''}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="sidebar__item-progress-text">
                      {done}/{total}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__footer-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" style={{ opacity: 0.5 }}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z" />
          </svg>
          <span>GitHub sync</span>
        </div>
      </div>
    </aside>
  );
}
