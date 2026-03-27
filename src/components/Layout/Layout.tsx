import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SheetFile } from '../../features/sheets/localSheets';
import './Layout.css';

interface Props {
  sheets: SheetFile[];
  activeSheet: string | null;
  onSelectSheet: (name: string) => void;
  totalProblems?: number;
  totalTopics?: number;
  children: ReactNode;
  rightPanel?: ReactNode;
}

export function Layout({
  sheets, activeSheet, onSelectSheet,
  totalProblems, totalTopics,
  children, rightPanel
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">

      <Header
        onMenuClick={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
        totalProblems={totalProblems}
        totalTopics={totalTopics}
      />

      <div className="layout__body">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Left sidebar */}
        <Sidebar
          sheets={sheets}
          activeSheet={activeSheet}
          onSelect={(name) => { onSelectSheet(name); setSidebarOpen(false); }}
          open={sidebarOpen}
        />

        {/* Main content */}
        <main className="layout__main">
          {/* Spacer so content scrolls behind floating header smoothly */}
          <div className="layout__spacer-top" />
          <div className="layout__main-inner">{children}</div>
          {/* Spacer for bottom padding */}
          <div className="layout__spacer-bottom" />
        </main>

        {/* Right progress panel (desktop only) */}
        {rightPanel && <div className="layout__right">{rightPanel}</div>}
      </div>
    </div>
  );
}
