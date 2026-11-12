import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN_OUT, keys, lerp, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {Finger} from '../components/Finger';
import {Caption} from '../components/Kinetic';
import {Phone} from '../components/Phone';
import {AppScreen, Spotlight, enterFrom} from '../components/ui';
import {Pose, focusOn, lerpPose, useLayout} from '../layout';
import {HomeScreen} from '../screens/Home';
import {makeTheme} from '../theme';
import {s3StartPose} from './S02Revelation';

export const FAB = {x: 195, y: 844 - 16 - 34};

/** Scène 3 — Accueil (0:07 → 0:12) */
export const S03Accueil: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const base: Pose = {...L.phone};
  const theme = makeTheme('light');

  const settle = spr(f, 0, {damping: 16, stiffness: 90});
  let pose = lerpPose(s3StartPose(base), base, settle);
  // zoom caméra sur « Fin de mois »
  const zoomIn = prog(f, 108, 40, EASE_IN_OUT);
  const zoomOut = prog(f, 205, 40, EASE_IN_OUT);
  const zoomPose = focusOn(195, 688, base.scale * 1.7, base.x, base.y + (L.portrait ? 150 : 0));
  const z = zoomIn * (1 - zoomOut);
  pose = lerpPose(pose, zoomPose, z);

  const solde = lerp(0, 517, prog(f, 18, 60, EASE));
  const scrollY = keys(f, [205, 250], [0, 540]);
  return (
    <AbsoluteFill>
      <Background variant="light" blur={z * 12} drift={{x: 0, y: -z * 60}} />
      <Phone pose={pose}>
        <AppScreen theme={theme}>
          <HomeScreen
            enter={enterFrom(f, 4, 4)}
            opsEnter={enterFrom(f, 222, 4, 24)}
            solde={solde}
            aVenir={prog(f, 74, 16)}
            paceHL={prog(f, 150, 26, EASE)}
            scrollY={scrollY}
            navEnter={prog(f, 10, 30)}
          />
          <Spotlight x={14} y={616} w={362} h={142} p={z} />
          <Finger
            frame={f}
            path={[
              {f: 258, x: 270, y: 640},
              {f: 288, x: FAB.x, y: FAB.y},
            ]}
            show={[250, 330]}
          />
        </AppScreen>
      </Phone>
      <Caption text={'Combien tu peux\nencore dépenser.\nChaque jour.'} frame={f} start={40} out={268} accentWords={{5: '#0b7a53', 6: '#0b7a53'}} />
      <Sfx at={0} name="whoosh" volume={0.5} />
      <Sfx at={78} name="pop" />
      <Sfx at={108} name="whoosh" volume={0.6} />
      <Sfx at={152} name="pop" volume={0.8} />
      <Sfx at={205} name="whoosh" volume={0.5} />
    </AbsoluteFill>
  );
};
