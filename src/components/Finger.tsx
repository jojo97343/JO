import React from 'react';
import {EASE_IN_OUT, clamp, keys, prog} from '../anim';

export interface FingerKey {
  f: number;
  x: number;
  y: number;
}

/**
 * Doigt stylisé : cercle semi-transparent qui s'enfonce au tap, avec une onde.
 * Coordonnées dans l'écran de l'appli (il suit donc le téléphone).
 */
export const Finger: React.FC<{
  frame: number;
  path: FingerKey[];
  taps?: number[];
  show?: [number, number];
  size?: number;
}> = ({frame: f, path, taps = [], show, size = 46}) => {
  const start = show ? show[0] : path[0].f - 12;
  const end = show ? show[1] : path[path.length - 1].f + 24;
  const vis = Math.min(prog(f, start, 12), 1 - prog(f, end - 12, 12));
  if (vis <= 0) return null;
  const fs = path.map((k) => k.f);
  const x = path.length > 1 ? keys(f, fs, path.map((k) => k.x), EASE_IN_OUT) : path[0].x;
  const y = path.length > 1 ? keys(f, fs, path.map((k) => k.y), EASE_IN_OUT) : path[0].y;

  let pr = 0;
  const ripples: React.ReactNode[] = [];
  taps.forEach((tf, i) => {
    if (f >= tf - 7 && f <= tf + 14) {
      pr = Math.max(pr, f <= tf ? prog(f, tf - 7, 7) : 1 - prog(f, tf, 14));
    }
    const d = f - tf;
    if (d >= 0 && d < 26) {
      const t = prog(f, tf, 26);
      ripples.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - size * (0.5 + t * 0.55),
            top: y - size * (0.5 + t * 0.55),
            width: size * (1 + t * 1.1),
            height: size * (1 + t * 1.1),
            borderRadius: '50%',
            border: '2.5px solid rgba(255,255,255,0.9)',
            boxShadow: '0 0 0 1px rgba(17,19,26,0.12)',
            opacity: (1 - t) * 0.8 * vis,
          }}
        />,
      );
    }
  });
  const s = 1 - 0.2 * pr;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 200}}>
      {ripples}
      <div
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `rgba(30,32,40,${0.22 + pr * 0.14})`,
          border: '2.5px solid rgba(255,255,255,0.92)',
          boxShadow: `0 ${8 - pr * 5}px ${18 - pr * 8}px rgba(17,19,26,${0.22})`,
          transform: `scale(${s * clamp(0.6 + vis * 0.4)})`,
          opacity: vis,
        }}
      />
    </div>
  );
};
