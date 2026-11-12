import React from 'react';
import {prog} from '../anim';
import {ACCENTS} from '../theme';

/** Logo : carré arrondi accent + barres de graphique blanches (icône « Bilan » de l'appli) */
export const Logo: React.FC<{
  size: number;
  frame?: number;
  /** image de départ du tracé des barres ; undefined = déjà dessiné */
  drawStart?: number;
  color?: string;
  radius?: number;
}> = ({size, frame = 0, drawStart, color = ACCENTS.indigo, radius}) => {
  const paths = [
    {d: 'M2 21H22', len: 20},
    {d: 'M5 21V11', len: 10},
    {d: 'M10 21V5', len: 16},
    {d: 'M15 21V13', len: 8},
    {d: 'M20 21V8', len: 13},
  ];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius ?? size * 0.27,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 ${size * 0.12}px ${size * 0.3}px -${size * 0.08}px rgba(79,70,229,0.45)`,
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" style={{overflow: 'visible'}}>
        {paths.map((p, i) => {
          const t = drawStart === undefined ? 1 : prog(frame, drawStart + i * 6, 22);
          return (
            <path
              key={i}
              d={p.d}
              stroke="#fff"
              strokeWidth={2.3}
              strokeLinecap="round"
              strokeDasharray={p.len}
              strokeDashoffset={p.len * (1 - t)}
              opacity={t > 0 ? 1 : 0}
            />
          );
        })}
      </svg>
    </div>
  );
};
