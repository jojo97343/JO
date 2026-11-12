import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN, keys, prog} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {Caption} from '../components/Kinetic';
import {Phone} from '../components/Phone';
import {AppScreen, enterFrom} from '../components/ui';
import {Pose, useLayout} from '../layout';
import {BilanScreen} from '../screens/Bilan';
import {BudgetScreen} from '../screens/Budget';
import {makeTheme} from '../theme';
import {bilanFinal} from './S05Bilan';

export const budgetScroll = (f: number) => keys(f, [176, 226], [0, 600]);

/** Scène 6 — Budget (0:27 → 0:32) */
export const S06Budget: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const base: Pose = {...L.phone};
  const theme = makeTheme('light');
  // le téléphone pivote (retournement 3D, changement d'écran quand il est de profil)
  const a = prog(f, 0, 18, EASE_IN);
  const b = prog(f, 18, 26, EASE);
  const ry = f < 18 ? -90 * a : 90 * (1 - b);
  const lift = Math.sin(Math.PI * Math.min(1, f / 44)) * 0.06;
  const pose: Pose = {...base, ry, scale: base.scale * (1 - lift), x: base.x + (L.portrait ? 0 : -20 * Math.sin(Math.PI * Math.min(1, f / 44)))};
  const fb = bilanFinal(480);
  return (
    <AbsoluteFill>
      <Background variant="light" frameOffset={1140} drift={{x: ry * 1.2, y: 0}} />
      <Phone pose={pose}>
        <AppScreen theme={theme}>
          {f < 18 ? (
            <BilanScreen rowFill={fb.rowFill} rowY={fb.rowY} open={fb.open} scrollY={fb.scrollY} />
          ) : (
            <BudgetScreen
              enter={enterFrom(f, 20, 4)}
              revenu={prog(f, 24, 56, EASE)}
              stack={(i) => prog(f, 66 + i * 14, 24, EASE)}
              rowEnter={enterFrom(f, 96, 5)}
              prevEnter={enterFrom(f, 204, 6)}
              scrollY={budgetScroll(f)}
            />
          )}
        </AppScreen>
      </Phone>
      <Caption text={"Tu planifies.\nL'appli calcule."} frame={f} start={30} out={276} accentWords={{2: '#4f46e5', 3: '#4f46e5'}} />
      <Sfx at={0} name="whoosh" />
      <Sfx at={80} name="pop" volume={0.6} />
      <Sfx at={176} name="whoosh" volume={0.4} />
    </AbsoluteFill>
  );
};
