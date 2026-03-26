import { ThreeCanvas } from './ThreeCanvas';
import './HeroSection.css';

interface Props {
  sheetName: string;
  totalProblems: number;
  totalTopics: number;
}

export function HeroSection({ sheetName, totalProblems, totalTopics }: Props) {
  return (
    <section className="hero-section">
      {/* Three.js interactive canvas — only in this hero card */}
      <ThreeCanvas />

      {/* Radial vignette overlay */}
      <div className="hero-section__vignette" />

      <div className="hero-section__content">
        <div className="hero-section__eyebrow">
          <span className="hero-section__eyebrow-dot" />
          <span>Currently active</span>
        </div>

        <h1 className="hero-section__title">
          <span className="hero-section__title-line-1">Master</span>
          <span className="hero-section__title-line-2">
            <span className="hero-section__title-highlight">{sheetName}</span>
          </span>
        </h1>

        <p className="hero-section__sub">
          {totalProblems} problems · {totalTopics} topics · all difficulty levels
        </p>

        <div className="hero-section__scroll-hint">
          <div className="hero-section__scroll-line" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
