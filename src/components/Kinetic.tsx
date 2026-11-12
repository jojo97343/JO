import React from 'react';
import {EASE, EASE_IN, clamp, prog} from '../anim';
import {useLayout} from '../layout';

/**
 * Kinetic type : chaque mot arrive par un masque (clip-path) avec un léger flou de mouvement,
 * puis repart vers le haut à `out`.
 */
export const KineticText: React.FC<{
  text: string;
  frame: number;
  start: number;
  out?: number;
  size: number;
  color?: string;
  weight?: number;
  stagger?: number;
  align?: 'left' | 'center';
  lineHeight?: number;
  style?: React.CSSProperties;
  /** Couleur de mise en avant pour certains mots (index) */
  accentWords?: {[i: number]: string};
}> = ({text, frame: f, start, out, size, color = '#11131a', weight = 800, stagger = 5, align = 'center', lineHeight = 1.04, style, accentWords}) => {
  const lines = text.split('\n');
  let wi = 0;
  return (
    <div
      style={{
        fontFamily: 'Manrope',
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: '-0.03em',
        color,
        textAlign: align,
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', columnGap: '0.24em'}}>
          {line.split(' ').map((word, i) => {
            const idx = wi++;
            const t = prog(f, start + idx * stagger, 26, EASE);
            const o = out !== undefined ? prog(f, out + idx * Math.max(2, stagger * 0.6), 18, EASE_IN) : 0;
            const y = (1 - t) * 105 - o * 105;
            const blur = (1 - t) * 9 + o * 9;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  clipPath: 'inset(-0.06em -0.12em -0.16em -0.12em)',
                  paddingBottom: '0.04em',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${y}%) skewY(${(1 - t) * 4}deg)`,
                    filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
                    opacity: clamp(t * 1.6) * (1 - o),
                    color: accentWords?.[idx] ?? undefined,
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Texte de la pub, toujours dans sa zone (au-dessus du téléphone en 9:16, à droite en 16:9) */
export const Caption: React.FC<{
  text: string;
  frame: number;
  start: number;
  out?: number;
  color?: string;
  accentWords?: {[i: number]: string};
  sizeMul?: number;
}> = ({text, frame, start, out, color, accentWords, sizeMul = 1}) => {
  const {caption, portrait} = useLayout();
  return (
    <div
      style={{
        position: 'absolute',
        left: caption.x,
        top: caption.y,
        width: caption.w,
        height: caption.h,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: portrait ? 'flex-start' : 'center',
        zIndex: 100,
      }}
    >
      <KineticText
        text={portrait ? text : text.replace(/\n/g, ' ')}
        frame={frame}
        start={start}
        out={out}
        size={caption.size * sizeMul}
        color={color}
        align={caption.align}
        accentWords={accentWords}
      />
    </div>
  );
};
