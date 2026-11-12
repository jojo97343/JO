import {createContext, useContext} from 'react';

export interface Layout {
  w: number;
  h: number;
  portrait: boolean;
  /** Position et échelle du téléphone principal (centre) */
  phone: {x: number; y: number; scale: number};
  /** Deux téléphones côte à côte */
  duo: {x1: number; x2: number; y: number; scale: number};
  /** Zone de texte de la pub (jamais par-dessus l'écran du téléphone) */
  caption: {x: number; y: number; w: number; h: number; size: number; align: 'left' | 'center'};
  /** Taille des grands titres (kinetic type) */
  title: number;
  safe: number;
}

// 9:16 — zone de sécurité de 120 px en haut et en bas
export const L916: Layout = {
  w: 1080,
  h: 1920,
  portrait: true,
  phone: {x: 540, y: 1206, scale: 1.29},
  duo: {x1: 284, x2: 796, y: 1222, scale: 1.0},
  caption: {x: 60, y: 168, w: 960, h: 440, size: 80, align: 'center'},
  title: 140,
  safe: 120,
};

// 16:9 — téléphone à gauche, texte à droite
export const L169: Layout = {
  w: 1920,
  h: 1080,
  portrait: false,
  phone: {x: 600, y: 540, scale: 1.0},
  duo: {x1: 330, x2: 800, y: 540, scale: 0.98},
  caption: {x: 1080, y: 0, w: 740, h: 1080, size: 96, align: 'left'},
  title: 156,
  safe: 60,
};

export const LayoutCtx = createContext<Layout>(L916);
export const useLayout = () => useContext(LayoutCtx);

// Géométrie du téléphone (unités logiques de l'écran de l'appli)
export const SCREEN_W = 390;
export const SCREEN_H = 844;
export const BEZEL = 12;
export const PHONE_W = SCREEN_W + BEZEL * 2;
export const PHONE_H = SCREEN_H + BEZEL * 2;

export interface Pose {
  x: number;
  y: number;
  scale: number;
  rx?: number;
  ry?: number;
  rz?: number;
}

/** Pose de caméra qui place le point (sx, sy) de l'écran en (tx, ty) à l'échelle donnée */
export const focusOn = (sx: number, sy: number, scale: number, tx: number, ty: number): Pose => ({
  scale,
  x: tx - (sx + BEZEL - PHONE_W / 2) * scale,
  y: ty - (sy + BEZEL - PHONE_H / 2) * scale,
});

/** Position sur le canevas d'un point de l'écran pour une pose donnée (sans rotation) */
export const screenToCanvas = (p: Pose, sx: number, sy: number) => ({
  x: p.x + (sx + BEZEL - PHONE_W / 2) * p.scale,
  y: p.y + (sy + BEZEL - PHONE_H / 2) * p.scale,
});

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  rx: (a.rx ?? 0) + ((b.rx ?? 0) - (a.rx ?? 0)) * t,
  ry: (a.ry ?? 0) + ((b.ry ?? 0) - (a.ry ?? 0)) * t,
  rz: (a.rz ?? 0) + ((b.rz ?? 0) - (a.rz ?? 0)) * t,
});
