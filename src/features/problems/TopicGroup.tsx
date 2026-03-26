import { useState } from 'react';
import { TopicGroup as TopicGroupType } from '../../features/sheets/parser';
import { ProblemCard } from './ProblemCard';
import './TopicGroup.css';

interface Props {
  group: TopicGroupType;
  defaultOpen?: boolean;
  index: number;
  isDone: (url: string) => boolean;
  onToggle: (url: string) => void;
}

const diffMeta = {
  easy: { label: 'Easy', cls: 'easy' },
  medium: { label: 'Medium', cls: 'medium' },
  hard: { label: 'Hard', cls: 'hard' },
} as const;

export function TopicGroup({ group, defaultOpen = false, index, isDone, onToggle }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const totalCount = group.easy.length + group.medium.length + group.hard.length;
  const doneCount = [...group.easy, ...group.medium, ...group.hard].filter((p) => isDone(p.url)).length;
  const topicPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const topicDone = doneCount === totalCount && totalCount > 0;

  return (
    <div
      className={`topic-group ${isOpen ? 'topic-group--open' : ''} ${topicDone ? 'topic-group--done' : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        className="topic-group__header"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        {/* Micro progress bar */}
        <div
          className={`topic-group__progress-bar ${topicDone ? 'topic-group__progress-bar--done' : ''}`}
          style={{ width: `${topicPct}%` }}
        />

        <span className="topic-group__chevron">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>

        <span className="topic-group__name">{group.topic}</span>

        <div className="topic-group__badges">
          {group.easy.length > 0 && (
            <span className="topic-badge topic-badge--easy">
              <span className="topic-badge__dot" />{group.easy.length}
            </span>
          )}
          {group.medium.length > 0 && (
            <span className="topic-badge topic-badge--medium">
              <span className="topic-badge__dot" />{group.medium.length}
            </span>
          )}
          {group.hard.length > 0 && (
            <span className="topic-badge topic-badge--hard">
              <span className="topic-badge__dot" />{group.hard.length}
            </span>
          )}
        </div>

        <span className={`topic-group__done-count ${topicDone ? 'topic-group__done-count--complete' : ''}`}>
          {doneCount}/{totalCount}
        </span>
      </button>

      <div className={`topic-group__body ${isOpen ? 'topic-group__body--open' : ''}`}>
        <div className="topic-group__body-inner">
          {isOpen && (['easy', 'medium', 'hard'] as const).map((diff) => {
            const problems = group[diff];
            if (problems.length === 0) return null;
            const { label, cls } = diffMeta[diff];
            return (
              <div key={diff} className="difficulty-section">
                <div className="difficulty-section__header">
                  <span className={`difficulty-section__label difficulty-section__label--${cls}`}>{label}</span>
                  <span className="difficulty-section__line" />
                  <span className="difficulty-section__count">{problems.length}</span>
                </div>
                <div className="problem-list">
                  {problems.map((problem, i) => (
                    <ProblemCard
                      key={problem.url}
                      problem={problem}
                      index={i}
                      isDone={isDone(problem.url)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
