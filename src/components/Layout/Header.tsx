import { ThemeToggle } from '../../features/theme/ThemeToggle';
import siteContent from '../../data/siteContent.json';
import './Header.css';

interface Props {
  onMenuClick: () => void;
  totalProblems?: number;
  totalTopics?: number;
  totalDone?: number;
}

export function Header({ onMenuClick, totalProblems = 0, totalTopics = 0, totalDone = 0 }: Props) {
  const pct = totalProblems > 0 ? Math.round((totalDone / totalProblems) * 100) : 0;

  return (
    <header className="header">
      {/* Left */}
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="17" x2="14" y2="17" />
          </svg>
        </button>

        <div className="header__brand">
          <div className="header__logo">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 2L22 12L12 22L2 12Z" fill="url(#hLogoGrad)" />
              <path d="M12 7L17 12L12 17L7 12Z" fill="rgba(0,0,0,0.22)" />
              <defs>
                <linearGradient id="hLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c6af7" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="header__wordmark">
            <span className="header__wordmark-primary">DSA</span>
            <span className="header__wordmark-sep">/</span>
            <span className="header__wordmark-secondary">Sheet</span>
          </span>
        </div>
      </div>

      {/* Center */}
      <div className="header__center">
        {totalProblems > 0 ? (
          <div className="header__stat-pills">
            <span className="header__pill">
              <span className="header__pill-dot header__pill-dot--accent" />
              {totalProblems} problems
            </span>
            <span className="header__pill-sep">·</span>
            <span className="header__pill">
              <span className="header__pill-dot header__pill-dot--teal" />
              {totalTopics} topics
            </span>
            {totalDone > 0 && (
              <>
                <span className="header__pill-sep">·</span>
                <span className="header__pill header__pill--done">
                  <span className="header__pill-dot header__pill-dot--green" />
                  {pct}% done
                </span>
              </>
            )}
          </div>
        ) : (
          <span className="header__tagline">{siteContent.site.tagline}</span>
        )}
      </div>

      {/* Right */}
      <nav className="header__right">
        <a href={siteContent.site.github} target="_blank" rel="noopener noreferrer"
          className="header__action-btn" title="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z" />
          </svg>
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
