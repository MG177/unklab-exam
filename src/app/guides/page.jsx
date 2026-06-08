import Link from 'next/link';
import { guideHubCards } from '@/components/guides/guide-content';

export default function GuidesHubPage() {
  return (
    <div className="guide-hub">
      <header className="guide-hub__masthead">
        <p className="guide-hub__eyebrow">KEP Unklab Exam</p>
        <h1>Operation guides</h1>
        <p className="guide-hub__lede">
          Step-by-step interactive walkthroughs for running placement exams —
          from setting up question banks to helping students log in on exam day.
        </p>
      </header>

      <div className="guide-hub__grid">
        {guideHubCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`guide-hub__card guide-hub__card--${card.variant}`}
          >
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            {card.steps != null && (
              <span className="guide-hub__meta">{card.steps} steps</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
