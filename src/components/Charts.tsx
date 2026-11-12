import React from 'react';
import {clamp} from '../anim';
import {useT} from './ui';

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const large = a1 - a0 > 180 ? 1 : 0;
  const p0 = [cx + r * Math.cos(rad(a0)), cy + r * Math.sin(rad(a0))];
  const p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))];
  return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${large} 1 ${p1[0]} ${p1[1]}`;
};

/**
 * Anneau (donut) du Bilan : segments dessinés un par un (cutout 72 %).
 * `draw` 0 → 1 parcourt tout l'anneau ; `pop` fait ressortir un segment.
 */
export const Donut: React.FC<{
  size: number;
  parts: {v: number; c: string}[];
  draw: number;
  pop?: {i: number; t: number};
  gap?: number;
  children?: React.ReactNode;
}> = ({size, parts, draw, pop, gap = 1.6, children}) => {
  const t = useT();
  const total = parts.reduce((s, p) => s + p.v, 0);
  const pad = 8;
  const rOut = size / 2 - pad;
  const thick = rOut * 0.28;
  const r = rOut - thick / 2;
  const c = size / 2;
  let acc = 0;
  const shown = draw * 360;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <svg width={size} height={size} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {parts.map((p, i) => {
          const a0 = (acc / total) * 360;
          acc += p.v;
          const a1 = (acc / total) * 360;
          const s0 = a0 + gap / 2;
          const s1 = Math.min(a1 - gap / 2, shown);
          if (s1 <= s0) return null;
          const isPop = pop && pop.i === i ? pop.t : 0;
          const mid = rad((a0 + a1) / 2);
          const off = 9 * isPop;
          return (
            <path
              key={i}
              d={arc(c + Math.cos(mid) * off, c + Math.sin(mid) * off, r + isPop * 2, s0, s1)}
              stroke={p.c}
              strokeWidth={thick + isPop * 6}
              fill="none"
              strokeLinecap="butt"
              opacity={pop && pop.t > 0 && pop.i !== i ? 1 - 0.35 * pop.t : 1}
            />
          );
        })}
        {draw < 0.02 && <circle cx={c} cy={c} r={r} stroke={t.track} strokeWidth={thick} fill="none" />}
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    </div>
  );
};

// Courbe lissée (comme tension 0.35 de Chart.js)
const smooth = (pts: [number, number][], tension = 0.35) => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const k = tension / 2;
    const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};

export interface Series {
  data: number[];
  color: string;
  dash?: boolean;
  width?: number;
  area?: boolean;
  points?: boolean;
  /** couleur de bordure par point (ex. dépassement) */
  pointColors?: string[];
  values?: boolean;
  straight?: boolean;
}

/** Graphique en courbes SVG qui se dessine de gauche à droite */
export const LineChart: React.FC<{
  w: number;
  h: number;
  labels: string[];
  series: Series[];
  draw: number;
  min?: number;
  max: number;
  ticks: number[];
  id: string;
}> = ({w, h, labels, series, draw, min = 0, max, ticks, id}) => {
  const t = useT();
  const left = 46;
  const right = 14;
  const top = 20;
  const bottom = 24;
  const iw = w - left - right;
  const ih = h - top - bottom;
  const X = (i: number) => left + (labels.length === 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
  const Y = (v: number) => top + ih - ((v - min) / (max - min)) * ih;
  const revealX = left + iw * clamp(draw) + 8;
  const grid = t.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  return (
    <svg width={w} height={h} style={{overflow: 'visible', display: 'block'}}>
      <defs>
        <clipPath id={`clip-${id}`}>
          <rect x={0} y={-20} width={revealX} height={h + 40} />
        </clipPath>
        {series.map((s, si) =>
          s.area ? (
            <linearGradient key={si} id={`g-${id}-${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s.color} stopOpacity={t.mode === 'dark' ? 0.25 : 0.16} />
              <stop offset="1" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ) : null,
        )}
      </defs>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={left} x2={w - right} y1={Y(v)} y2={Y(v)} stroke={grid} />
          <text x={left - 8} y={Y(v) + 3.5} textAnchor="end" fontSize={10} fill={t.muted} fontFamily="Manrope">
            {v.toLocaleString('fr-FR').replace(/ /g, ' ')} €
          </text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={l} x={X(i)} y={h - 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={t.muted} fontFamily="Manrope">
          {l}
        </text>
      ))}
      <g clipPath={`url(#clip-${id})`}>
        {series.map((s, si) => {
          const pts = s.data.map((v, i) => [X(i), Y(v)] as [number, number]);
          const d = s.straight
            ? pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')
            : smooth(pts);
          return (
            <g key={si}>
              {s.area && <path d={`${d} L ${pts[pts.length - 1][0]} ${Y(min)} L ${pts[0][0]} ${Y(min)} Z`} fill={`url(#g-${id}-${si})`} />}
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width ?? 2.5}
                strokeDasharray={s.dash ? '6 5' : undefined}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>
      {series.map((s, si) =>
        s.points
          ? s.data.map((v, i) => {
              const px = X(i);
              const k = clamp((revealX - px) / 30);
              if (k <= 0) return null;
              const pc = s.pointColors?.[i] ?? s.color;
              const big = s.values;
              return (
                <g key={`${si}-${i}`} transform={`translate(${px} ${Y(v)}) scale(${0.4 + 0.6 * k})`} opacity={k}>
                  <circle r={big ? 5 : 3.5} fill={t.card} stroke={pc} strokeWidth={big ? 3 : 2.5} />
                  {s.values && (
                    <text y={-11} textAnchor="middle" fontSize={11} fontWeight={700} fill={pc} fontFamily="Manrope">
                      {Math.round(v)} €
                    </text>
                  )}
                </g>
              );
            })
          : null,
      )}
    </svg>
  );
};
