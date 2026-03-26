import { useState } from 'react';
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
  const circumference = 2 * Math.PI * 28;

  return (
    <aside className="progress-panel">
      {/* Header */}
      <div className="progress-panel__header">
        <span className="progress-panel__title">Progress</span>
        {pct > 0 && <span className="progress-panel__pct">{pct}%</span>}
      </div>

      {/* Ring */}
      <div className="progress-ring-wrap">
        <svg className="progress-ring" viewBox="0 0 72 72">
          <defs>
            <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c6af7" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          {/* Glow ring */}
          <circle cx="36" cy="36" r="28" className="progress-ring__glow"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct / 100)}
          />
          {/* Track */}
          <circle cx="36" cy="36" r="28" className="progress-ring__track" />
          {/* Fill */}
          <circle cx="36" cy="36" r="28" className="progress-ring__fill"
            stroke="url(#ringG)"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct / 100)}
          />
        </svg>
        <div className="progress-ring__center">
          <span className="progress-ring__done">{totalDone}</span>
          <span className="progress-ring__of">/ {totalProblems}</span>
        </div>
      </div>

      {/* Divider label */}
      <div className="progress-panel__divider">
        <span>Topics</span>
      </div>

      {/* Per-topic rows */}
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
                  {topicDone}/{topicTotal}
                </span>
              </div>
              <div className="progress-topic__track">
                <div
                  className={`progress-topic__fill ${done ? 'progress-topic__fill--done' : ''}`}
                  style={{ width: `${frac * 100}%` }}
                />
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

/* ─── Mobile floating progress button + drawer ─── */
export function MobileProgressButton({
  totalDone, totalProblems, topics, sheetProgress,
}: Props) {
  const [open, setOpen] = useState(false);
  const pct = totalProblems > 0 ? Math.round((totalDone / totalProblems) * 100) : 0;

  return (
    <>
      <button className="mobile-progress-fab" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 36 36" width="36" height="36">
          <circle cx="18" cy="18" r="14" className="mobile-progress-fab__track" />
          <circle cx="18" cy="18" r="14" className="mobile-progress-fab__fill"
            strokeDasharray={2 * Math.PI * 14}
            strokeDashoffset={2 * Math.PI * 14 * (1 - pct / 100)}
          />
        </svg>
        <span className="mobile-progress-fab__label">{pct}%</span>
      </button>

      {/* Drawer */}
      <div className={`mobile-progress-drawer ${open ? 'mobile-progress-drawer--open' : ''}`}>
        <div className="mobile-progress-drawer__backdrop" onClick={() => setOpen(false)} />
        <div className="mobile-progress-drawer__sheet">
          <div className="mobile-progress-drawer__handle" />
          <div className="mobile-progress-drawer__content">
            <ProgressPanel
              topics={topics}
              sheetProgress={sheetProgress}
              totalDone={totalDone}
              totalProblems={totalProblems}
            />
          </div>
        </div>
      </div>
    </>
  );
}
