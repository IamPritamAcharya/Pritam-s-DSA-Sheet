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
  totalDone?: number;
  children: ReactNode;
  rightPanel?: ReactNode;
}

export function Layout({
  sheets, activeSheet, onSelectSheet,
  totalProblems, totalTopics, totalDone,
  children, rightPanel
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      {/* CSS ambient background */}
      <div className="orbs" aria-hidden="true">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
        <div className="orb orb--4" />
      </div>

      <Header
        onMenuClick={() => setSidebarOpen(true)}
        totalProblems={totalProblems}
        totalTopics={totalTopics}
        totalDone={totalDone}
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
          <div className="layout__main-inner">{children}</div>
        </main>

        {/* Right progress panel (desktop only) */}
        {rightPanel && <div className="layout__right">{rightPanel}</div>}
      </div>
    </div>
  );
}
