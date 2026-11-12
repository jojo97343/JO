import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN_OUT, keys, press, prog} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {Finger} from '../components/Finger';
import {Caption} from '../components/Kinetic';
import {Phone} from '../components/Phone';
import {AppScreen, Spotlight, Typed, enterFrom} from '../components/ui';
import {Pose, focusOn, lerpPose, useLayout} from '../layout';
import {VacancesScreen} from '../screens/Vacances';
import {VACANCES, makeTheme} from '../theme';
import {Swipe} from './S08Couple';

export const T9 = {amount: 40, digits: [52, 60, 68, 76], add: 190};
export const VAC_FORM = {y: 416, amountY: 492};
const STEPS = ['4', '45', '450', '4 500'];

/** Scène 9 — Vacances (0:47 → 0:52) */
export const S09Vacances: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const base: Pose = {...L.phone};
  const theme = makeTheme('light');
  const z = prog(f, 36, 28, EASE_IN_OUT) * (1 - prog(f, 132, 30, EASE_IN_OUT));
  const pose = lerpPose(base, focusOn(195, 520, base.scale * 1.6, base.x, base.y + (L.portrait ? 130 : 0)), z);
  const step = T9.digits.filter((d) => f >= d).length;
  const amount = step ? (
    <span style={{display: 'inline-flex', alignItems: 'baseline'}}>
      <span style={{display: 'inline-block', transform: `scale(${1 + 0.15 * (1 - prog(f, T9.digits[step - 1], 10))})`, transformOrigin: 'left center'}}>{STEPS[step - 1]}</span>
      {f < 130 && <span style={{width: 2, height: 26, background: VACANCES, marginLeft: 3, opacity: Math.floor(f / 15) % 2 ? 0.3 : 1}} />}
    </span>
  ) : undefined;
  return (
    <AbsoluteFill>
      <Background variant="light" accent={VACANCES} blur={z * 12} frameOffset={2520} />
      <Phone pose={pose}>
        <AppScreen theme={theme}>
          <VacancesScreen
            enter={enterFrom(f, 4, 4)}
            amount={f > T9.add + 4 ? undefined : amount}
            amountFocus={f >= T9.amount && f < 132 ? 1 : 0}
            conv={f > T9.add + 4 ? 0 : prog(f, 84, 44, EASE)}
            desc={f > T9.add + 4 ? undefined : <Typed text="Ramen à Shinjuku" f={f} start={136} speed={2} />}
            catPicked={prog(f, 172, 6)}
            addPress={press(f, T9.add)}
            added={prog(f, T9.add + 4, 40, EASE)}
            scrollY={keys(f, [214, 252], [0, 470])}
            repEnter={enterFrom(f, 236, 6)}
          />
          <Spotlight x={16} y={VAC_FORM.y} w={358} h={170} r={20} p={z} />
          <Finger
            frame={f}
            path={[
              {f: 22, x: 240, y: 640},
              {f: 38, x: 100, y: VAC_FORM.amountY},
              {f: 110, x: 140, y: 620},
              {f: 160, x: 220, y: 680},
              {f: 186, x: 195, y: 727},
            ]}
            taps={[T9.amount, T9.add]}
            show={[18, 206]}
          />
        </AppScreen>
      </Phone>
      <Caption text={"Même à l'autre\nbout du monde."} frame={f} start={30} out={276} accentWords={{3: VACANCES, 4: VACANCES, 5: VACANCES}} />
      <Swipe p={prog(f, 0, 26, EASE)} dir="out" />
      <Sfx at={T9.amount} name="tap" />
      {T9.digits.map((d) => (
        <Sfx key={d} at={d} name="pop" volume={0.5} />
      ))}
      <Sfx at={90} name="whoosh" volume={0.5} />
      <Sfx at={T9.add} name="tap" />
      <Sfx at={T9.add + 8} name="pop" />
    </AbsoluteFill>
  );
};
