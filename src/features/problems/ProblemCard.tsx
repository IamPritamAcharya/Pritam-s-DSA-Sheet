import { useRef, MouseEvent, useCallback } from 'react';
import { Problem } from '../../features/sheets/parser';
import './ProblemCard.css';

interface Props {
  problem: Problem;
  index: number;
  isDone: boolean;
  onToggle: (url: string) => void;
}

// Detect touch — skip 3D tilt on touch devices
const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

function LeetCodeLogo() {
  return (
    <svg className="platform-logo platform-logo--lc" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
    </svg>
  );
}

function GFGLogo() {
  return (
    <svg className="platform-logo platform-logo--gfg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.29-.845h3.517l.004-.006h.006c.168-.027.334-.09.478-.188a.726.726 0 0 0 .257-.282.72.72 0 0 0 .086-.353.803.803 0 0 0-.152-.44.656.656 0 0 0-.38-.27 1.058 1.058 0 0 0-.283-.037h-3.72a3.41 3.41 0 0 1 .288-.835 3.782 3.782 0 0 1 2.135-2.078 4.51 4.51 0 0 1 3.116-.015c.422.157.81.38 1.143.674.165.135.315.288.449.456l.034.039 1.364-1.32-.034-.04a5.97 5.97 0 0 0-5.07-2.347 5.792 5.792 0 0 0-2.666.672 5.525 5.525 0 0 0-2.002 1.845 5.282 5.282 0 0 0-.825 1.955H9.97a5.183 5.183 0 0 0-.826-1.955A5.515 5.515 0 0 0 7.14 7.363a5.755 5.755 0 0 0-2.667-.672A5.97 5.97 0 0 0 .14 9.036L.106 9.076l1.365 1.32.034-.04c.133-.167.283-.32.448-.455a3.66 3.66 0 0 1 1.143-.674 4.51 4.51 0 0 1 3.116.015 3.782 3.782 0 0 1 2.135 2.078c.133.27.228.554.288.834H5.048c-.095 0-.192.012-.283.037a.656.656 0 0 0-.38.27.803.803 0 0 0-.152.44c0 .124.03.247.086.353a.726.726 0 0 0 .257.282c.144.098.31.16.478.188h.005l.005.005h3.517a3.571 3.571 0 0 1-.29.846 3.79 3.79 0 0 1-2.135 2.078 4.51 4.51 0 0 1-3.116.016 3.691 3.691 0 0 1-1.104-.695 3.895 3.895 0 0 1-.565-.745l-.034-.05L.105 16.58l.034.05a5.97 5.97 0 0 0 5.334 2.678 5.756 5.756 0 0 0 2.667-.672 5.515 5.515 0 0 0 2.001-1.846 5.183 5.183 0 0 0 .826-1.954h1.065a5.282 5.282 0 0 0 .825 1.954 5.525 5.525 0 0 0 2.002 1.846 5.792 5.792 0 0 0 2.666.672 5.97 5.97 0 0 0 5.334-2.678l.034-.05-1.365-1.32z"/>
    </svg>
  );
}

function OtherLogo() {
  return (
    <svg className="platform-logo platform-logo--other" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

const platformLogos = { leetcode: LeetCodeLogo, geeksforgeeks: GFGLogo, other: OtherLogo } as const;
const platformNames: Record<Problem['platform'], string> = {
  leetcode: 'LeetCode', geeksforgeeks: 'GeeksforGeeks', other: 'External',
};

export function ProblemCard({ problem, index, isDone, onToggle }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const PlatformLogo = platformLogos[problem.platform];
  const touch = isTouch();

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (touch) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = rect.width / 2,       cy = rect.height / 2;
    card.style.transform = `perspective(500px) rotateX(${((y-cy)/cy)*-5}deg) rotateY(${((x-cx)/cx)*5}deg) translateY(-1px)`;
    card.style.setProperty('--sx', `${(x/rect.width)*100}%`);
    card.style.setProperty('--sy', `${(y/rect.height)*100}%`);
    card.style.setProperty('--s-op', '1');
  }, [touch]);

  const handleMouseLeave = useCallback(() => {
    if (touch) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
    card.style.setProperty('--s-op', '0');
  }, [touch]);

  return (
    <div
      ref={cardRef}
      className={`problem-card ${isDone ? 'problem-card--done' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
      onMouseMove={!touch ? handleMouseMove : undefined}
      onMouseLeave={!touch ? handleMouseLeave : undefined}
    >
      <div className="problem-card__spotlight" />

      {/* Checkbox */}
      <button
        className={`problem-card__check ${isDone ? 'problem-card__check--done' : ''}`}
        onClick={() => onToggle(problem.url)}
        aria-label={isDone ? 'Mark undone' : 'Mark done'}
      >
        {isDone && (
          <svg viewBox="0 0 12 12" fill="none" strokeWidth="2.2" stroke="currentColor"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 6 5 9 10 3"/>
          </svg>
        )}
      </button>

      {/* Platform badge — opens link */}
      <a href={problem.url} target="_blank" rel="noopener noreferrer"
        className={`problem-card__platform-badge problem-card__platform-badge--${problem.platform}`}
        onClick={e => e.stopPropagation()}>
        <PlatformLogo/>
      </a>

      {/* Info — opens link */}
      <a href={problem.url} target="_blank" rel="noopener noreferrer"
        className="problem-card__info" onClick={e => e.stopPropagation()}>
        <span className="problem-card__name">{problem.name}</span>
        <span className="problem-card__platform-name">{platformNames[problem.platform]}</span>
      </a>

      <span className={`problem-card__difficulty problem-card__difficulty--${problem.difficulty}`}>
        {problem.difficulty}
      </span>

      <span className="problem-card__arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"/>
          <polyline points="7 7 17 7 17 17"/>
        </svg>
      </span>
    </div>
  );
}
