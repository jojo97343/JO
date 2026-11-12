import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN, EASE_IN_OUT, clamp, keys, lerp, press, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {Finger} from '../components/Finger';
import {Caption} from '../components/Kinetic';
import {Phone} from '../components/Phone';
import {AppScreen, Typed, enterFrom} from '../components/ui';
import {Pose, lerpPose, screenToCanvas, useLayout} from '../layout';
import {CoupleScreen, PartnerScreen, SettingsScreen} from '../screens/Couple';
import {ACCENTS, PARTNER, VACANCES, makeTheme} from '../theme';

export const T8 = {cat: 92, add: 122, sync: 162, back: 352};

/** Balayage turquoise (transition vers les Vacances) */
export const Swipe: React.FC<{p: number; dir: 'in' | 'out'}> = ({p, dir}) => {
  const {w} = useLayout();
  if (p <= 0 || p >= 1) return null;
  const x = dir === 'in' ? lerp(w * 1.3, 0, p) : lerp(0, -w * 1.3, p);
  return (
    <AbsoluteFill style={{zIndex: 300, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: -100, bottom: -100, left: x - w * 0.15, width: w * 1.3, background: VACANCES, transform: 'skewX(-12deg)'}} />
      <div style={{position: 'absolute', top: -100, bottom: -100, left: x - w * 0.15 + (dir === 'in' ? -w * 0.12 : w * 1.3), width: w * 0.12, background: '#22d3ee', opacity: 0.5, transform: 'skewX(-12deg)'}} />
    </AbsoluteFill>
  );
};

/** Scène 8 — Couple et Partenaire (0:40 → 0:47) */
export const S08Couple: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const theme = makeTheme('light');
  const d = L.duo;
  const inL = spr(f, 0, {damping: 16, stiffness: 100});
  const inE = spr(f, 6, {damping: 16, stiffness: 100});
  const exitL = prog(f, 286, 30, EASE_IN);
  const center = prog(f, 290, 40, EASE_IN_OUT);
  const poseL: Pose = {x: d.x1 - exitL * L.w * 0.7, y: d.y + (1 - inL) * 900, scale: d.scale, ry: 9, rz: -1.5 * (1 - exitL)};
  const poseE0: Pose = {x: d.x2, y: d.y + (1 - inE) * 900, scale: d.scale, ry: -9, rz: 1.5};
  const poseE = lerpPose(poseE0, {...L.phone}, center);

  // onde de synchronisation
  const wave = prog(f, T8.add + 4, 40, EASE_IN_OUT);
  const a = screenToCanvas(poseL, 195, 495);
  const b = screenToCanvas(poseE0, 300, 124);
  const mx = (a.x + b.x) / 2;
  const my = Math.min(a.y, b.y) - (L.portrait ? 360 : 260);
  const qx = (t: number) => (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
  const qy = (t: number) => (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;
  const waveVis = Math.min(prog(f, T8.add + 2, 8), 1 - prog(f, T8.sync + 8, 18));

  const sync = prog(f, T8.sync, 34, EASE);
  const enzoScroll = keys(f, [214, 252], [0, 742]);
  const toSettings = prog(f, 296, 24, EASE_IN_OUT);
  const toPartner = prog(f, T8.back + 4, 24, EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <Background variant="light" frameOffset={2100} />
      {exitL < 1 && (
        <Phone pose={poseL}>
          <AppScreen theme={theme}>
            <CoupleScreen
              me="Léa"
              scrollY={400}
              desc={<Typed text="Courses" f={f} start={36} speed={3} />}
              amount={f >= 62 ? <Typed text="54 €" f={f} start={62} speed={4} /> : undefined}
              catPicked={prog(f, T8.cat + 2, 8)}
              addPress={press(f, T8.add)}
              sync={f >= T8.add + 4 ? 1 : 0}
            />
            <Finger
              frame={f}
              path={[
                {f: 24, x: 230, y: 420},
                {f: 34, x: 128, y: 294},
                {f: 58, x: 128, y: 300},
                {f: 64, x: 300, y: 294},
                {f: 80, x: 300, y: 300},
                {f: 90, x: 200, y: 354},
                {f: 104, x: 220, y: 430},
                {f: 120, x: 195, y: 495},
              ]}
              taps={[34, 64, T8.cat, T8.add]}
              show={[20, 146]}
            />
          </AppScreen>
        </Phone>
      )}
      <Phone pose={poseE}>
        <AppScreen theme={theme}>
          {toPartner < 1 && (
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${-60 * toPartner}px)`, opacity: 1 - toPartner}}>
              {toSettings < 1 && (
                <div style={{position: 'absolute', inset: 0, transform: `translateX(${-60 * toSettings}px)`}}>
                  <CoupleScreen
                    me="Tom"
                    sync={sync}
                    tile={prog(f, T8.sync + 8, 36, EASE)}
                    newRow={f > 250 ? prog(f, 250, 30, EASE) + prog(f, 280, 40) : 0}
                    scrollY={enzoScroll}
                    pulse={prog(f, T8.sync - 4, 26)}
                  />
                </div>
              )}
              {toSettings > 0 && (
                <div style={{position: 'absolute', inset: 0, transform: `translateX(${390 * (1 - toSettings)}px)`, boxShadow: '-20px 0 40px rgba(0,0,0,0.08)'}}>
                  <SettingsScreen code={<Typed text="LEA-7K2Q" f={f} start={318} speed={3} />} codeFocus={prog(f, 312, 10)} backPress={press(f, T8.back)} />
                </div>
              )}
            </div>
          )}
          {toPartner > 0 && (
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${80 * (1 - toPartner)}px)`, opacity: toPartner}}>
              <PartnerScreen enter={enterFrom(f, T8.back + 8, 4)} counter={prog(f, T8.back + 10, 40, EASE)} />
            </div>
          )}
          <Finger
            frame={f}
            path={[
              {f: 330, x: 220, y: 300},
              {f: 349, x: 38, y: 52},
            ]}
            taps={[T8.back]}
            show={[326, 370]}
          />
        </AppScreen>
      </Phone>
      {waveVis > 0 && (
        <svg width={L.w} height={L.h} style={{position: 'absolute', inset: 0, zIndex: 150, overflow: 'visible'}}>
          <defs>
            <linearGradient id="wv" x1="0" x2="1">
              <stop offset="0" stopColor={PARTNER} />
              <stop offset="1" stopColor={ACCENTS.indigo} />
            </linearGradient>
          </defs>
          <path
            d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
            fill="none"
            stroke="url(#wv)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="1 1"
            pathLength={1}
            strokeDashoffset={1 - wave}
            opacity={0.85 * waveVis}
          />
          {[0, 1, 2].map((k) => {
            const t = clamp(wave - k * 0.08);
            return <circle key={k} cx={qx(t)} cy={qy(t)} r={(16 - k * 4) * (L.portrait ? 1.2 : 1)} fill={k ? '#ffffff' : ACCENTS.indigo} stroke={ACCENTS.indigo} strokeWidth={3} opacity={waveVis * (1 - k * 0.3)} />;
          })}
          {[0, 1, 2].map((k) => {
            const t = prog(f, T8.add + k * 8, 30);
            return t > 0 && t < 1 ? <circle key={`a${k}`} cx={a.x} cy={a.y} r={20 + t * 120} fill="none" stroke={PARTNER} strokeWidth={4} opacity={(1 - t) * 0.6} /> : null;
          })}
          {[0, 1, 2].map((k) => {
            const t = prog(f, T8.sync - 2 + k * 8, 30);
            return t > 0 && t < 1 ? <circle key={`b${k}`} cx={b.x} cy={b.y} r={20 + t * 120} fill="none" stroke={ACCENTS.indigo} strokeWidth={4} opacity={(1 - t) * 0.6} /> : null;
          })}
        </svg>
      )}
      <Caption text={'À deux,\nen temps réel.'} frame={f} start={30} out={392} accentWords={{2: '#be185d', 3: '#be185d', 4: '#be185d'}} />
      <Swipe p={prog(f, 396, 24, EASE_IN)} dir="in" />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={34} name="tap" />
      <Sfx at={64} name="tap" />
      <Sfx at={T8.cat} name="tap" />
      <Sfx at={T8.add} name="tap" />
      <Sfx at={T8.add + 6} name="whoosh" />
      <Sfx at={T8.sync} name="pop" />
      <Sfx at={T8.back} name="tap" />
      <Sfx at={396} name="whoosh" />
    </AbsoluteFill>
  );
};
