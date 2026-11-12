import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useLayout} from '../layout';
import {ACCENTS, DARK_BG, LIGHT_BG, alpha} from '../theme';

type Variant = 'light' | 'accent' | 'dark';

/**
 * Fond des scènes : couleur unie + formes géométriques douces (cercles, anneaux)
 * qui dérivent lentement en parallaxe. `drift` décale les formes (parallaxe caméra).
 */
export const Background: React.FC<{
  variant?: Variant;
  color?: string;
  accent?: string;
  blur?: number;
  drift?: {x: number; y: number};
  frameOffset?: number;
}> = ({variant = 'light', color, accent = ACCENTS.indigo, blur = 0, drift = {x: 0, y: 0}, frameOffset = 0}) => {
  const f = useCurrentFrame() + frameOffset;
  const {w, h, portrait} = useLayout();
  const bg = color ?? (variant === 'light' ? LIGHT_BG : variant === 'dark' ? DARK_BG : accent);
  const ink = variant === 'light' ? accent : '#ffffff';
  const k = variant === 'light' ? 1 : 0.9;
  const m = Math.min(w, h);
  const shapes = [
    // [cx, cy, r, type, depth, phase]
    {cx: portrait ? 0.92 : 0.86, cy: portrait ? 0.14 : 0.18, r: 0.42, ring: true, depth: 0.5, ph: 0, a: 0.1},
    {cx: portrait ? 0.06 : 0.1, cy: portrait ? 0.86 : 0.86, r: 0.5, ring: false, depth: 0.25, ph: 1.7, a: 0.05},
    {cx: portrait ? 0.12 : 0.36, cy: portrait ? 0.3 : 0.12, r: 0.09, ring: true, depth: 0.9, ph: 3.1, a: 0.13},
    {cx: portrait ? 0.86 : 0.94, cy: portrait ? 0.7 : 0.78, r: 0.16, ring: false, depth: 0.7, ph: 4.4, a: 0.06},
    {cx: portrait ? 0.7 : 0.6, cy: portrait ? 0.95 : 0.98, r: 0.26, ring: true, depth: 0.4, ph: 2.3, a: 0.08},
  ];
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{filter: blur > 0 ? `blur(${blur}px)` : undefined}}>
        {shapes.map((s, i) => {
          const r = s.r * m;
          const dx = Math.sin(f / 170 + s.ph) * 26 * s.depth + drift.x * s.depth;
          const dy = Math.cos(f / 210 + s.ph) * 22 * s.depth + drift.y * s.depth;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: s.cx * w - r + dx,
                top: s.cy * h - r + dy,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                border: s.ring ? `${Math.max(2, r * 0.035)}px solid ${alpha(ink, s.a * 1.3 * k)}` : undefined,
                background: s.ring ? undefined : alpha(ink, s.a * k),
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
