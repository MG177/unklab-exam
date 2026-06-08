'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import HotspotLayer from './HotspotLayer';
import MockScreen from './MockScreen';

export default function GuideStep({ step, variant }) {
  const viewportRef = useRef(null);

  return (
    <div className="guide-step">
      <div className="guide-step__mock-wrap">
        <p className="guide-step__mock-label">Screen preview</p>
        <div className="guide-step__viewport" ref={viewportRef}>
          <MockScreen mock={step.mock} variant={variant} />
          <HotspotLayer hotspots={step.hotspots} containerRef={viewportRef} />
        </div>
      </div>

      <div className="guide-step__actions">
        <div className="guide-step__card">
          <h3 className="guide-step__card-title">What to do</h3>
          <ul className="guide-step__list">
            {step.whatToDo.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="guide-step__card">
          <h3 className="guide-step__card-title">What happens</h3>
          <ul className="guide-step__list">
            {step.whatHappens.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        {step.tryItHref && (
          <Link
            href={step.tryItHref}
            target="_blank"
            rel="noopener noreferrer"
            className="guide-step__try"
          >
            Try it in the app
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
