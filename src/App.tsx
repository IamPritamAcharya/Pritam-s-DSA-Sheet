import { useMemo } from 'react';
import { Layout } from './components/Layout/Layout';
import { CustomCursor } from './components/CustomCursor';
import { HeroSection } from './components/HeroSection';
import { BackgroundMesh } from './components/BackgroundMesh';
import { ProgressPanel, MobileProgressButton } from './features/progress/ProgressPanel';
import { useSheets } from './features/sheets/hooks/useSheets';
import { useProgress } from './features/progress/useProgress';
import { TopicGroup } from './features/problems/TopicGroup';
import { Spinner } from './components/Spinner';
import { EmptyState } from './components/EmptyState';
import { ThemeProvider } from './features/theme/ThemeProvider';
import './App.css';

function AppContent() {
  const { sheetFiles, activeSheet, setActiveSheet, parsedSheet, loading, contentLoading, error } =
    useSheets();

  const { isDone, toggle, totalDone, sheetProgress } = useProgress(activeSheet);

  const { totalProblems, totalTopics, totalEasy, totalMedium, totalHard } = useMemo(() => {
    if (!parsedSheet) return { totalProblems: 0, totalTopics: 0, totalEasy: 0, totalMedium: 0, totalHard: 0 };
    const e = parsedSheet.topics.reduce((acc, t) => acc + t.easy.length, 0);
    const m = parsedSheet.topics.reduce((acc, t) => acc + t.medium.length, 0);
    const h = parsedSheet.topics.reduce((acc, t) => acc + t.hard.length, 0);
    return { totalProblems: e + m + h, totalTopics: parsedSheet.topics.length, totalEasy: e, totalMedium: m, totalHard: h };
  }, [parsedSheet]);

  const renderMain = () => {
    if (loading) return <Spinner label="Connecting to GitHub..." />;
    if (error) return <EmptyState title="Connection failed" description={error} />;
    if (contentLoading) return <Spinner label="Loading problems..." />;
    if (!parsedSheet || parsedSheet.topics.length === 0) {
      return <EmptyState title="No problems yet" description="Add problems to the GitHub sheets directory." />;
    }

    return (
      <div className="sheet-view">
        {/* Three.js Hero */}
        <HeroSection
          sheetName={parsedSheet.name}
          totalProblems={totalProblems}
          totalTopics={totalTopics}
        />

        {/* Difficulty pills row */}
        <div className="difficulty-summary">
          <span className="diff-pill diff-pill--easy">
            <span className="diff-pill__dot diff-pill__dot--easy" />
            {totalEasy} Easy
          </span>
          <span className="diff-pill diff-pill--medium">
            <span className="diff-pill__dot diff-pill__dot--medium" />
            {totalMedium} Medium
          </span>
          <span className="diff-pill diff-pill--hard">
            <span className="diff-pill__dot diff-pill__dot--hard" />
            {totalHard} Hard
          </span>
        </div>

        {/* Topics */}
        <div className="topics-section">
          <div className="topics-section__header">
            <span className="topics-section__label">All Topics</span>
            <span className="topics-section__count">{totalTopics}</span>
          </div>
          <div className="topic-list">
            {parsedSheet.topics.map((group, i) => (
              <TopicGroup
                key={group.topic}
                group={group}
                index={i}
                defaultOpen={i === 0}
                isDone={isDone}
                onToggle={toggle}
              />
            ))}
          </div>
        </div>

        <footer className="site-footer">
          <span>Built with ❤️ by Pritam · Progress saved locally</span>
        </footer>
      </div>
    );
  };

  const progressProps = {
    topics: parsedSheet?.topics ?? [],
    sheetProgress,
    totalDone,
    totalProblems,
  };

  const rightPanel = parsedSheet && parsedSheet.topics.length > 0 ? (
    <ProgressPanel {...progressProps} />
  ) : undefined;

  return (
    <>
      <Layout
        sheets={sheetFiles}
        activeSheet={activeSheet}
        onSelectSheet={setActiveSheet}
        totalProblems={totalProblems}
        totalTopics={totalTopics}
        rightPanel={rightPanel}
      >
        {renderMain()}
      </Layout>
      {parsedSheet && parsedSheet.topics.length > 0 && (
        <MobileProgressButton {...progressProps} />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BackgroundMesh />
      <CustomCursor />
      <AppContent />
    </ThemeProvider>
  );
}
