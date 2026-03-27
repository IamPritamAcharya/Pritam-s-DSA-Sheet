import { useState, useRef } from 'react';
import { TopicGroup } from '../sheets/parser';
import './ProgressPanel.css';

interface Props {
  topics: TopicGroup[];
  sheetProgress: Record<string, boolean>;
  totalDone: number;
  totalProblems: number;
}

export function ProgressPanel({ topics, sheetProgress, totalDone, totalProblems }: Props) {
  const pct = totalProblems > 0 ? Math.round((totalDone / totalProblems) * 100) : 0;

  return (
    <aside className="progress-panel">
      <div className="progress-panel__header">
        <span className="progress-panel__title">Overview</span>
      </div>

      <div className="progress-bento">
        <div className="progress-bento__main">
          <div className="progress-bento__meta">
            <span className="progress-bento__pct">{pct}%</span>
            <span className="progress-bento__label">Completed</span>
          </div>
          
          <div className="progress-bento__bar-wrap">
            <div className="progress-bento__bar-track">
              <div 
                className="progress-bento__bar-fill" 
                style={{ width: `${pct}%` }} 
              />
            </div>
            <div 
              className="progress-bento__bar-glow" 
              style={{ width: `${pct}%` }} 
            />
          </div>

          <div className="progress-bento__stats">
            <span className="progress-bento__stat-val">{totalDone}</span>
            <span className="progress-bento__stat-sep">/</span>
            <span className="progress-bento__stat-total">{totalProblems} problems</span>
          </div>
        </div>
      </div>

      <div className="progress-panel__divider"><span>Topics Overview</span></div>

      <div className="progress-topics">
        {topics.map((t) => {
          const topicTotal = t.easy.length + t.medium.length + t.hard.length;
          const topicDone = [...t.easy, ...t.medium, ...t.hard].filter((p) => sheetProgress[p.url]).length;
          const frac = topicTotal > 0 ? topicDone / topicTotal : 0;
          const done = frac === 1;
          return (
            <div key={t.topic} className={`progress-topic ${done ? 'progress-topic--done' : ''}`}>
              <div className="progress-topic__meta">
                <span className="progress-topic__name">{t.topic}</span>
                <span className={`progress-topic__frac ${done ? 'progress-topic__frac--done' : ''}`}>
                  {Math.round(frac * 100)}%
                </span>
              </div>
              <div className="progress-topic__track">
                <div
                  className={`progress-topic__fill ${done ? 'progress-topic__fill--done' : ''}`}
                  style={{ width: `${frac * 100}%` }}
                />
              </div>
              <div className="progress-topic__sub">
                {topicDone} of {topicTotal}
              </div>
            </div>
          );
        })}
      </div>

      {pct === 100 && totalProblems > 0 && (
        <div className="progress-complete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Sheet complete!</span>
        </div>
      )}
    </aside>
  );
}

/* ─── Mobile FAB + Drawer ─── */
export function MobileProgressButton({ totalDone, totalProblems, topics, sheetProgress }: Props) {
  const [open, setOpen] = useState(false);
  const pct = totalProblems > 0 ? Math.round((totalDone / totalProblems) * 100) : 0;
  const touchStartY = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    // Swipe down > 70px → close
    if (e.changedTouches[0].clientY - touchStartY.current > 70) setOpen(false);
  };

  return (
    <>
      {/* FAB — tap to toggle */}
      <button
        className={`mobile-progress-fab ${pct === 100 ? 'mobile-progress-fab--done' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close progress' : 'View progress'}
      >
        <div className="mobile-progress-fab__inner">
          <div className="mobile-progress-fab__ring" style={{ background: `conic-gradient(var(--accent) ${pct}%, transparent ${pct}%)` }} />
          <div className="mobile-progress-fab__center">
            <span className="mobile-progress-fab__label">{pct}%</span>
          </div>
        </div>
      </button>

      {/* Drawer */}
      <div className={`mobile-progress-drawer ${open ? 'mobile-progress-drawer--open' : ''}`}>
        <div className="mobile-progress-drawer__backdrop" onClick={() => setOpen(false)} />
        <div
          className="mobile-progress-drawer__sheet"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Drag handle — tap also closes */}
          <div className="mobile-progress-drawer__handle" onClick={() => setOpen(false)} />

          {/* Header row */}
          <div className="drawer-header">
            <span className="drawer-header__title">Sheet Progress</span>
          </div>

          {/* Scrollable content */}
          <div className="mobile-progress-drawer__content">
            
            {/* Bento Main Card */}
            <div className="drawer-bento">
              <div className="drawer-bento__meta">
                <span className="drawer-bento__pct">{pct}%</span>
                <span className="drawer-bento__label">Overall Completion</span>
              </div>
              
              <div className="drawer-bento__bar-wrap">
                <div className="drawer-bento__bar-track">
                  <div 
                    className="drawer-bento__bar-fill" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
                <div 
                  className="drawer-bento__bar-glow" 
                  style={{ width: `${pct}%` }} 
                />
              </div>

              <div className="drawer-bento__stats">
                <span className="drawer-bento__stat-val">{totalDone}</span>
                <span className="drawer-bento__stat-sep">/</span>
                <span className="drawer-bento__stat-total">{totalProblems} problems assigned</span>
              </div>
            </div>

            {/* Per-topic bars */}
            <div className="drawer-topics">
              <span className="drawer-topics__heading">Topic Breakdown</span>
              {topics.map((t) => {
                const topicTotal = t.easy.length + t.medium.length + t.hard.length;
                const topicDone = [...t.easy, ...t.medium, ...t.hard]
                  .filter(p => sheetProgress[p.url]).length;
                const frac = topicTotal > 0 ? topicDone / topicTotal : 0;
                const done = frac === 1;
                return (
                  <div key={t.topic} className={`drawer-topic ${done ? 'drawer-topic--done' : ''}`}>
                    <div className="drawer-topic__meta">
                      <span className="drawer-topic__name">{t.topic}</span>
                      <span className={`drawer-topic__frac ${done ? 'drawer-topic__frac--done' : ''}`}>
                        {Math.round(frac * 100)}%
                      </span>
                    </div>
                    <div className="drawer-topic__track">
                      <div
                        className={`drawer-topic__fill ${done ? 'drawer-topic__fill--done' : ''}`}
                        style={{ width: `${frac * 100}%` }}
                      />
                    </div>
                    <div className="drawer-topic__sub">
                      {topicDone} of {topicTotal}
                    </div>
                  </div>
                );
              })}
            </div>

            {pct === 100 && totalProblems > 0 && (
              <div className="progress-complete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Sheet complete! 🎉</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
