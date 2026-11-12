// Tokens de l'application Mon Coach Finance (repris de mon-coach-finance.html)

export type Mode = 'light' | 'dark';

export const ACCENTS = {
  indigo: '#4f46e5',
  bleu: '#1d4ed8',
  vert: '#047857',
  rose: '#be185d',
  turquoise: '#0e7490',
} as const;

export const CAT_COLORS = ['#4f46e5', '#0e7490', '#d97706', '#be185d', '#047857', '#9333ea', '#64748b'];

export const VACANCES = '#0e7490';
export const PARTNER = '#be185d';
export const DARK_BG = '#0e0f13';
export const LIGHT_BG = '#f2f3f6';

// ── couleurs ───────────────────────────────────────────────
const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};
const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');

/** Équivalent de color-mix(in srgb, a pct%, b) */
export const cmix = (a: string, pct: number, b: string) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const t = pct / 100;
  return toHex(A[0] * t + B[0] * (1 - t), A[1] * t + B[1] * (1 - t), A[2] * t + B[2] * (1 - t));
};

/** Interpolation entre deux couleurs (t = 0 → a, t = 1 → b) */
export const lerpColor = (a: string, b: string, t: number) => cmix(b, Math.max(0, Math.min(1, t)) * 100, a);

export const alpha = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

// ── thème de l'appli ───────────────────────────────────────
export interface Theme {
  mode: Mode;
  main: string;
  bg: string;
  bg2: string;
  card: string;
  line: string;
  track: string;
  text: string;
  muted: string;
  hint: string;
  success: string;
  danger: string;
  warning: string;
  warnBar: string;
  soft: string;
  softText: string;
}

export const makeTheme = (mode: Mode = 'light', main: string = ACCENTS.indigo): Theme => {
  if (mode === 'dark') {
    const card = '#1a1b21';
    return {
      mode,
      main,
      bg: DARK_BG,
      bg2: '#24252c',
      card,
      line: 'rgba(255,255,255,0.08)',
      track: 'rgba(255,255,255,0.10)',
      text: '#eceef3',
      muted: '#9ea3ae',
      hint: '#7a7f8a',
      success: '#34d399',
      danger: '#f87171',
      warning: '#fbbf24',
      warnBar: '#d97706',
      soft: cmix(main, 24, card),
      softText: cmix(main, 50, '#ffffff'),
    };
  }
  const card = '#ffffff';
  return {
    mode,
    main,
    bg: LIGHT_BG,
    bg2: '#e7e9ef',
    card,
    line: 'rgba(17,19,26,0.08)',
    track: 'rgba(17,19,26,0.07)',
    text: '#11131a',
    muted: '#5d6270',
    hint: '#8a8f9b',
    success: '#0b7a53',
    danger: '#c2410c',
    warning: '#b45309',
    warnBar: '#d97706',
    soft: cmix(main, 11, card),
    softText: main,
  };
};

/** Teinte légère d'une couleur de catégorie sur la carte (pastilles, anneaux) */
export const tint = (t: Theme, c: string, light = 11, dark = 22) => cmix(c, t.mode === 'dark' ? dark : light, t.card);

export const FONT = 'Manrope';
