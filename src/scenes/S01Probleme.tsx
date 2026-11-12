import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {EASE_IN, clamp, lerp, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {KineticText} from '../components/Kinetic';
import {useLayout} from '../layout';
import {DARK_BG} from '../theme';

const AMOUNTS = ['−650 €', '−88,80 €', '−13,49 €', '−62,40 €', '−80 €', '−8,60 €', '−15 €', '−65 €', '−233 €', '−41,20 €', '−29,99 €', '−37,80 €', '−11,99 €', '−19,99 €', '−34,90 €', '−27,50 €', '−120 €', '−54 €'];

/** Scène 1 — Le problème (0:00 → 0:04) */
export const S01Probleme: React.FC = () => {
  const f = useCurrentFrame();
  const {w, h, portrait, title} = useLayout();
  const freeze = 150;
  const fz = Math.min(f, freeze);
  // secousse de caméra (décroît jusqu'au gel)
  const amp = f < freeze ? 9 * (0.6 + 0.4 * Math.sin(f / 9)) * clamp((f - 8) / 20) : 0;
  const shakeX = (Math.sin(fz * 1.9) + Math.sin(fz * 3.7 + 1.3) * 0.5) * amp;
  const shakeY = (Math.cos(fz * 2.3) + Math.sin(fz * 4.1 + 0.4) * 0.5) * amp;
  // aspiration vers le centre
  const suck = prog(f, 168, 52, EASE_IN);
  const dot = prog(f, 206, 26);

  const chips = AMOUNTS.map((txt, i) => {
    const r = (k: string) => random(`chip-${i}-${k}`);
    const delay = 6 + i * 7 + r('d') * 6;
    const size = (portrait ? 54 : 48) + r('s') * (portrait ? 56 : 44);
    const x = (0.08 + r('x') * 0.84) * w;
    const layer = Math.floor(i / (portrait ? 5 : 7));
    const landY = h - (portrait ? 230 : 120) - layer * (portrait ? 150 : 120) - r('y') * (portrait ? 110 : 70);
    const s = spr(fz, delay, {damping: 9, stiffness: 110, mass: 0.8});
    const y = lerp(-180, landY, s);
    const rot = lerp(r('r0') * 80 - 40, r('r1') * 36 - 18, s);
    return {txt, x, y, size, rot, vis: fz >= delay ? 1 : 0, boxed: i % 3 === 0};
  });

  const sx = w / 2;
  const sy = h / 2;
  return (
    <AbsoluteFill style={{background: DARK_BG, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <AbsoluteFill
          style={{
            transformOrigin: `${sx}px ${sy}px`,
            transform: `scale(${lerp(1, 0.01, suck)}) rotate(${suck * 40}deg)`,
            filter: suck > 0.02 ? `blur(${suck * 10}px)` : undefined,
            opacity: 1 - prog(f, 205, 16),
          }}
        >
          {chips.map((c, i) =>
            c.vis ? (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: c.x,
                  top: c.y,
                  transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
                  fontFamily: 'Manrope',
                  fontWeight: 800,
                  fontSize: c.size,
                  letterSpacing: '-0.03em',
                  color: '#f87171',
                  whiteSpace: 'nowrap',
                  padding: c.boxed ? '0.12em 0.42em' : 0,
                  borderRadius: 999,
                  background: c.boxed ? 'rgba(248,113,113,0.12)' : undefined,
                  border: c.boxed ? '2px solid rgba(248,113,113,0.35)' : undefined,
                  fontVariantNumeric: 'tabular-nums',
                  opacity: 0.55 + (i % 4) * 0.15,
                }}
              >
                {c.txt}
              </div>
            ) : null,
          )}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: portrait ? h * 0.3 : h * 0.26,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <KineticText text="Fin du mois." frame={f} start={30} size={title} color="#ffffff" />
            <KineticText text="Encore." frame={f} start={90} size={title} color="#f87171" />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* point blanc */}
      {dot > 0 && (
        <div
          style={{
            position: 'absolute',
            left: sx - 11,
            top: sy - 11,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#fff',
            transform: `scale(${dot})`,
            boxShadow: `0 0 ${40 * dot}px ${10 * dot}px rgba(255,255,255,0.35)`,
          }}
        />
      )}
      <Sfx at={30} name="whoosh" volume={0.6} />
      <Sfx at={90} name="pop" />
      <Sfx at={168} name="whoosh" />
    </AbsoluteFill>
  );
};
