import React from 'react';
import {BEZEL, PHONE_H, PHONE_W, Pose, SCREEN_H, SCREEN_W} from '../layout';

const R_OUT = 60;
const R_IN = R_OUT - BEZEL;

/**
 * Smartphone générique : bords fins, coins très arrondis, reflet léger, ombre douce.
 * Aucune marque, aucune encoche, aucune barre d'état.
 */
export const Phone: React.FC<{
  pose: Pose;
  children?: React.ReactNode;
  screenBg?: string;
  shadow?: number;
  opacity?: number;
  glare?: number;
  /** Opacité du cadre (0 = seul l'écran est visible, utilisé pour la transformation du logo) */
  frame?: number;
  screenRadius?: number;
  zIndex?: number;
}> = ({pose, children, screenBg = '#f2f3f6', shadow = 1, opacity = 1, glare = 1, frame = 1, screenRadius, zIndex}) => {
  const {x, y, scale, rx = 0, ry = 0, rz = 0} = pose;
  const sh = shadow * opacity;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex}}>
      {/* ombre portée au sol */}
      {sh > 0 && (
        <div
          style={{
            position: 'absolute',
            left: -PHONE_W * scale * 0.42 + ry * scale * 2,
            top: (PHONE_H / 2) * scale - 30 * scale + rx * scale * 1.2,
            width: PHONE_W * scale * 0.84,
            height: 70 * scale,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(17,19,26,0.34), rgba(17,19,26,0) 70%)',
            filter: `blur(${16 * scale}px)`,
            opacity: sh,
          }}
        />
      )}
      <div style={{position: 'absolute', left: 0, top: 0, perspective: 2800 * scale}}>
        <div
          style={{
            position: 'absolute',
            left: -PHONE_W / 2,
            top: -PHONE_H / 2,
            width: PHONE_W,
            height: PHONE_H,
            transform: `scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
            opacity,
          }}
        >
          {/* coque */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: R_OUT,
              background: 'linear-gradient(150deg, #3a3d47 0%, #16171c 22%, #0d0e12 60%, #23252d 100%)',
              boxShadow:
                sh > 0
                  ? `0 0 0 1px rgba(10,11,15,0.9), 0 ${60 * sh}px ${110 * sh}px -30px rgba(17,19,26,${0.55 * sh}), 0 ${24 * sh}px ${44 * sh}px -14px rgba(17,19,26,${0.3 * sh})`
                  : '0 0 0 1px rgba(10,11,15,0.9)',
              opacity: frame,
            }}
          >
            {/* liseré métallique */}
            <div
              style={{
                position: 'absolute',
                inset: 1.5,
                borderRadius: R_OUT - 1.5,
                border: '1.5px solid rgba(255,255,255,0.13)',
              }}
            />
            {/* boutons latéraux discrets */}
            <div style={{position: 'absolute', right: -3, top: 210, width: 3.5, height: 92, borderRadius: 3, background: '#24262d'}} />
            <div style={{position: 'absolute', left: -3, top: 180, width: 3.5, height: 58, borderRadius: 3, background: '#24262d'}} />
          </div>
          {/* écran */}
          <div
            style={{
              position: 'absolute',
              left: BEZEL,
              top: BEZEL,
              width: SCREEN_W,
              height: SCREEN_H,
              borderRadius: screenRadius ?? R_IN,
              overflow: 'hidden',
              background: screenBg,
              isolation: 'isolate',
            }}
          >
            {children}
            {/* reflet */}
            {glare > 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: -40,
                  pointerEvents: 'none',
                  background: `linear-gradient(${118 + ry * 1.5}deg, rgba(255,255,255,0) ${28 + ry}%, rgba(255,255,255,${0.16 * glare}) ${42 + ry}%, rgba(255,255,255,0) ${58 + ry}%)`,
                  mixBlendMode: 'screen',
                  zIndex: 50,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
