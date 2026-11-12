import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN_OUT, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {Finger} from '../components/Finger';
import {Caption} from '../components/Kinetic';
import {Phone} from '../components/Phone';
import {AppScreen} from '../components/ui';
import {Pose, lerpPose, screenToCanvas, useLayout} from '../layout';
import {HomeScreen} from '../screens/Home';
import {ACCENTS, lerpColor, makeTheme} from '../theme';

export const TOGGLE = {x: 294, y: 51};
const TAP = 24;
const CHANGES = [90, 120, 150];
const COLORS = [ACCENTS.indigo, ACCENTS.bleu, ACCENTS.vert, ACCENTS.rose];

export const accentAt = (f: number) => {
  let c: string = COLORS[0];
  CHANGES.forEach((cf, i) => {
    c = lerpColor(c, COLORS[i + 1], prog(f, cf - 4, 12, EASE_IN_OUT));
  });
  return c;
};

/** Scène 10 — Ton style (0:52 → 0:55) */
export const S10Style: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const base: Pose = {...L.phone};
  const s = spr(f, 0, {damping: 18, stiffness: 120});
  const pose = lerpPose({...base, ry: 14, scale: base.scale * 0.96}, {...base, ry: -4}, s);
  const dark = prog(f, TAP + 2, 40, EASE_IN_OUT);
  const accent = accentAt(f);
  const light = makeTheme('light', accent);
  const night = makeTheme('dark', accent);
  const tg = screenToCanvas(pose, TOGGLE.x, TOGGLE.y);
  const diag = Math.hypot(L.w, L.h) * 1.1;
  const knob = prog(f, TAP + 2, 14, EASE);
  const beat = CHANGES.reduce((m, cf) => Math.max(m, 1 - Math.min(1, Math.abs(f - cf) / 8)), 0);
  return (
    <AbsoluteFill>
      <Background variant="light" accent={accent} frameOffset={2820} />
      <AbsoluteFill style={{clipPath: `circle(${dark * diag}px at ${tg.x}px ${tg.y}px)`}}>
        <Background variant="dark" frameOffset={2820} />
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 60%, ${accent}33, transparent 60%)`}} />
      </AbsoluteFill>
      <Phone pose={{...pose, scale: pose.scale * (1 + beat * 0.012)}}>
        <AppScreen theme={light}>
          <HomeScreen dark={knob} />
        </AppScreen>
        <div style={{position: 'absolute', inset: 0, clipPath: `circle(${dark * 1000}px at ${TOGGLE.x}px ${TOGGLE.y}px)`}}>
          <AppScreen theme={night}>
            <HomeScreen dark={knob} />
          </AppScreen>
        </div>
        <div style={{position: 'absolute', inset: 0}}>
          <Finger frame={f} path={[{f: 4, x: 230, y: 220}, {f: 20, x: TOGGLE.x, y: TOGGLE.y}, {f: 40, x: 330, y: 160}]} taps={[TAP]} show={[0, 50]} />
        </div>
      </Phone>
      <Caption text="À ta couleur." frame={f} start={56} out={170} color={dark > 0.5 ? '#ffffff' : '#11131a'} accentWords={{2: accent}} sizeMul={1.25} />
      <Sfx at={TAP} name="tap" />
      <Sfx at={TAP + 4} name="whoosh" />
      {CHANGES.map((c) => (
        <Sfx key={c} at={c} name="pop" volume={0.7} />
      ))}
    </AbsoluteFill>
  );
};
