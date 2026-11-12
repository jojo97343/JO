import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN_OUT, clamp, lerp, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {KineticText} from '../components/Kinetic';
import {Logo} from '../components/Logo';
import {Phone} from '../components/Phone';
import {Pose, SCREEN_H, SCREEN_W, lerpPose, useLayout} from '../layout';
import {ACCENTS, DARK_BG, LIGHT_BG, lerpColor} from '../theme';

export const s3StartPose = (base: Pose): Pose => ({x: base.x, y: base.y + 40, scale: base.scale * 0.84, rx: 12, ry: -20, rz: 0});

const NAME = 'Mon Coach Finance';

/** Scène 2 — Révélation (0:04 → 0:07) */
export const S02Revelation: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const {w, h, portrait} = L;
  const base: Pose = {...L.phone};
  const cx = w / 2;
  const logoY = portrait ? h * 0.36 : h * 0.4;
  const logoX = portrait ? cx : w * 0.5;

  // ouverture du fond clair depuis le centre
  const reveal = prog(f, 0, 34, EASE_IN_OUT);
  const diag = Math.hypot(w, h);
  // le point devient un carré arrondi
  const grow = spr(f, 2, {damping: 13, stiffness: 120});
  const logoSize = lerp(22, portrait ? 250 : 220, grow);
  const logoColor = lerpColor('#ffffff', ACCENTS.indigo, prog(f, 4, 20));
  const pY = lerp(h / 2, logoY, prog(f, 6, 30));

  // transformation en écran de téléphone
  const morph = prog(f, 128, 32, EASE_IN_OUT);
  const textOut = 122;
  const morphW = lerp(logoSize, SCREEN_W * base.scale, morph);
  const morphH = lerp(logoSize, SCREEN_H * base.scale, morph);
  const morphR = lerp(logoSize * 0.27, 48 * base.scale, morph);
  const morphX = lerp(logoX, base.x, morph);
  const morphY = lerp(pY, base.y, morph);
  const phoneOn = f >= 156;
  const recede = prog(f, 156, 24, EASE);
  const pose = lerpPose(base, s3StartPose(base), recede);
  const screenColor = lerpColor(ACCENTS.indigo, LIGHT_BG, prog(f, 150, 22));

  const nameSize = portrait ? 128 : 124;
  const nameLines = portrait ? ['Mon Coach', 'Finance'] : [NAME];
  let li = 0;
  return (
    <AbsoluteFill style={{background: DARK_BG}}>
      <AbsoluteFill style={{clipPath: `circle(${reveal * diag * 0.6 + 11}px at ${cx}px ${h / 2}px)`}}>
        <Background variant="light" />
      </AbsoluteFill>

      {!phoneOn && morph <= 0 && (
        <div style={{position: 'absolute', left: logoX - logoSize / 2, top: pY - logoSize / 2}}>
          <Logo size={logoSize} frame={f} drawStart={22} color={logoColor} />
        </div>
      )}
      {!phoneOn && morph > 0 && (
        <div
          style={{
            position: 'absolute',
            left: morphX - morphW / 2,
            top: morphY - morphH / 2,
            width: morphW,
            height: morphH,
            borderRadius: morphR,
            background: ACCENTS.indigo,
            boxShadow: '0 30px 80px -20px rgba(79,70,229,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{opacity: 1 - prog(f, 128, 14), transform: `scale(${1 + morph})`}}>
            <Logo size={logoSize} color="transparent" />
          </div>
        </div>
      )}
      {phoneOn && <Phone pose={pose} screenBg={screenColor} frame={prog(f, 156, 14)} shadow={prog(f, 156, 20)} />}

      {/* nom lettre par lettre + sous-titre */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: logoY + (portrait ? 170 : 150),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: 1 - prog(f, textOut, 14),
          transform: `translateY(${-prog(f, textOut, 18) * 30}px)`,
        }}
      >
        {nameLines.map((line, k) => (
          <div key={k} style={{display: 'flex', fontFamily: 'Manrope', fontWeight: 800, fontSize: nameSize, letterSpacing: '-0.03em', lineHeight: 1.02, color: '#11131a'}}>
            {line.split('').map((ch, i) => {
              const idx = li++;
              const t = prog(f, 46 + idx * 2.4, 22, EASE);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    opacity: clamp(t * 1.5),
                    transform: `translateY(${(1 - t) * 40}px)`,
                    filter: t < 0.98 ? `blur(${(1 - t) * 8}px)` : undefined,
                    color: k === nameLines.length - 1 && (portrait || i >= 10) ? ACCENTS.indigo : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
        <div style={{marginTop: portrait ? 34 : 24}}>
          <KineticText text="Ton budget. Enfin clair." frame={f} start={92} size={portrait ? 68 : 64} color="#5d6270" weight={700} stagger={6} />
        </div>
      </div>
      <Sfx at={2} name="pop" />
      <Sfx at={46} name="whoosh" volume={0.5} />
      <Sfx at={128} name="whoosh" />
    </AbsoluteFill>
  );
};
