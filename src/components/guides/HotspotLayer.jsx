'use client';

import { useEffect, useState } from 'react';
import Hotspot from './Hotspot';

function measureHotspots(container, hotspots) {
  if (!container) return [];

  const cr = container.getBoundingClientRect();

  return hotspots
    .map((hotspot) => {
      if (hotspot.anchor) {
        const el = container.querySelector(
          `[data-guide-hotspot="${hotspot.anchor}"]`
        );
        if (!el) return null;
        const er = el.getBoundingClientRect();
        return {
          label: hotspot.label,
          top: er.top - cr.top + er.height / 2,
          left: er.left - cr.left + er.width / 2,
          pixel: true,
        };
      }

      if (hotspot.top != null && hotspot.left != null) {
        return {
          label: hotspot.label,
          top: hotspot.top,
          left: hotspot.left,
          pixel: false,
        };
      }

      return null;
    })
    .filter(Boolean);
}

export default function HotspotLayer({ hotspots, containerRef }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hotspots?.length) {
      setPositions([]);
      return;
    }

    const update = () => {
      setPositions(measureHotspots(container, hotspots));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);

    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [hotspots, containerRef]);

  return positions.map((pos, i) => (
    <Hotspot
      key={`${pos.label}-${i}`}
      top={pos.top}
      left={pos.left}
      label={pos.label}
      pixel={pos.pixel}
    />
  ));
}
