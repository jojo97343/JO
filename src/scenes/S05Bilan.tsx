import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN, EASE_IN_OUT, keys, lerp, press, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {Finger} from '../components/Finger';
import {Caption} from '../components/Kinetic';
import {Phone} from '../components/Phone';
import {AppScreen} from '../components/ui';
import {CATS} from '../data';
import {Pose, focusOn, lerpPose, useLayout} from '../layout';
import {BilanScreen, DONUT_CENTER_Y, ROW_H} from '../screens/Bilan';
import {ExpenseScreen} from '../screens/Expense';
import {cmix, makeTheme} from '../theme';
import {expenseFinalProps} from './S04Depense';

const INIT = [0, 1, 2, 3, 4];
const FINAL = [3, 2, 0, 4, 1]; // loyer, abo, alim, sorties, épargne → dépassements en premier
export const NEW_ICON = {x: 52, y: 460};
const CUT = 26;

export const bilanFinal = (f: number) => {
  const reorder = spr(f, 300, {damping: 11, stiffness: 120});
  const open = prog(f, 354, 30, EASE);
  return {
    rowFill: (i: number) => prog(f, 232 + i * 8, 56, EASE),
    rowY: (i: number) => lerp(INIT[i], FINAL[i], reorder) * ROW_H + (FINAL[i] > 0 ? 344 * open : 0),
    open,
    scrollY: keys(f, [205, 245, 396, 440], [0, 262, 262, 400]),
  };
};

/** Scène 5 — Bilan (0:19 → 0:27) */
export const S05Bilan: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const base: Pose = {...L.phone};
  const theme = makeTheme('light');
  const alim = CATS[2];

  // 1) fin de la scène 4 : la caméra plonge dans la pastille de la nouvelle dépense
  if (f < CUT) {
    const z = prog(f, 0, CUT, EASE_IN);
    const pose = lerpPose(base, focusOn(NEW_ICON.x, NEW_ICON.y, base.scale * 4.5, base.x, base.y), z);
    return (
      <AbsoluteFill>
        <Background variant="light" blur={z * 16} frameOffset={720} />
        <Phone pose={pose}>
          <AppScreen theme={theme}>
            <ExpenseScreen {...expenseFinalProps(420)} newRow={1} />
          </AppScreen>
        </Phone>
        <Sfx at={0} name="whoosh" />
      </AbsoluteFill>
    );
  }

  // 2) match cut : la pastille devient le donut du Bilan
  const zOut = prog(f, 50, 50, EASE_IN_OUT);
  const pose = lerpPose(focusOn(195, DONUT_CENTER_Y, base.scale * 2.2, base.x, base.y), base, zOut);
  const m = prog(f, CUT, 26, EASE);
  const discR = lerp((20 * 4.5) / 2.2, 116, m); // même taille que la pastille au moment de la coupe
  const inner = lerp(0, 83.5, prog(f, CUT + 4, 24, EASE));
  const ringFade = 1 - prog(f, 46, 16);
  const fin = bilanFinal(f);
  const centerT = prog(f, 152, 18, EASE) * (1 - prog(f, 214, 16, EASE));
  const alimRatio = (alim.reel / alim.prevu) * fin.rowFill(2);
  return (
    <AbsoluteFill>
      <Background variant="light" blur={(1 - zOut) * 12} frameOffset={720} />
      <Phone pose={pose}>
        <AppScreen theme={theme}>
          <BilanScreen
            donutDraw={prog(f, 40, 70, EASE_IN_OUT)}
            center={centerT}
            centerIn={prog(f, 70, 24, EASE)}
            counter={prog(f, 70, 50, EASE)}
            pop={prog(f, 152, 16, EASE) * (1 - prog(f, 214, 16, EASE))}
            rowFill={fin.rowFill}
            rowY={fin.rowY}
            rowEnter={(i) => prog(f, 214 + i * 4, 24)}
            open={fin.open}
            pressed={press(f, 350)}
            scrollY={fin.scrollY}
            alimPct={f < 300 ? Math.round(alimRatio * 100) + ' %' : undefined}
            headerEnter={1}
          />
          {ringFade > 0 && (
            <div
              style={{
                position: 'absolute',
                left: 195 - discR,
                top: DONUT_CENTER_Y - discR,
                width: discR * 2,
                height: discR * 2,
                boxSizing: 'border-box',
                borderRadius: `${lerp(35, 50, prog(f, CUT, 10))}%`,
                border: `${discR - inner}px solid ${cmix(alim.color, lerp(11, 100, prog(f, CUT, 14)), '#ffffff')}`,
                opacity: ringFade,
                zIndex: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{fontSize: 18 * (discR / 20) * (1 - m), opacity: 1 - prog(f, CUT, 10), position: 'absolute'}}>🛒</span>
            </div>
          )}
          <Finger
            frame={f}
            path={[
              {f: 128, x: 280, y: 330},
              {f: 148, x: 137, y: 168},
              {f: 175, x: 170, y: 300},
              {f: 330, x: 250, y: 300},
              {f: 347, x: 230, y: 176},
            ]}
            taps={[150, 350]}
            show={[124, 380]}
          />
        </AppScreen>
      </Phone>
      <Caption text={'Tu vois où part\nchaque euro.'} frame={f} start={64} out={452} accentWords={{4: '#4f46e5', 5: '#4f46e5'}} />
      <Sfx at={CUT} name="pop" />
      <Sfx at={50} name="whoosh" volume={0.5} />
      <Sfx at={150} name="tap" />
      <Sfx at={300} name="pop" />
      <Sfx at={350} name="tap" />
    </AbsoluteFill>
  );
};
