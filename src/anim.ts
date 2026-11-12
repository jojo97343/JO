import {Easing, interpolate, spring} from 'remotion';

export const FPS = 60;
/** 120 BPM : un temps = 30 images à 60 fps */
export const BEAT = 30;

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 0.9, 0.3);

/** Progression 0 → 1 entre start et start + dur, avec easing (par défaut : entrée) */
export const prog = (f: number, start: number, dur: number, easing: (t: number) => number = EASE) =>
  dur <= 0
    ? f >= start
      ? 1
      : 0
    : interpolate(f, [start, start + dur], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing,
      });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export type SpringCfg = {damping?: number; stiffness?: number; mass?: number};
/** Ressort amorti (léger rebond) */
export const spr = (f: number, start: number, cfg: SpringCfg = {}) =>
  spring({
    frame: f - start,
    fps: FPS,
    config: {damping: cfg.damping ?? 15, stiffness: cfg.stiffness ?? 140, mass: cfg.mass ?? 0.9},
  });

/** Entrée standard : opacité + léger mouvement vertical (+ échelle optionnelle) */
export const appear = (t: number, dy = 14, scaleFrom = 1): React.CSSProperties => ({
  opacity: clamp(t * 1.4),
  transform: `translateY(${(1 - t) * dy}px) scale(${lerp(scaleFrom, 1, t)})`,
});

/** Décalage en cascade : progression de l'élément i (stagger de 4 images par défaut) */
export const stag = (f: number, start: number, i: number, step = 4, dur = 26) => prog(f, start + i * step, dur);

/** Interpolation par images clés [image, valeur] avec easing entre chaque paire */
export const keys = (f: number, frames: number[], values: number[], easing: (t: number) => number = EASE_IN_OUT) =>
  interpolate(f, frames, values, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

/** Pression d'un tap (0 → 1 → 0) autour de l'image tf */
export const press = (f: number, tf: number) => {
  if (f < tf - 6 || f > tf + 12) return 0;
  if (f <= tf) return prog(f, tf - 6, 6);
  return 1 - prog(f, tf, 12);
};
