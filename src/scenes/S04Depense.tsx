import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN_OUT, keys, press, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {Finger} from '../components/Finger';
import {Caption} from '../components/Kinetic';
import {Phone} from '../components/Phone';
import {AppScreen, Spotlight, Toast, Typed, enterFrom} from '../components/ui';
import {Pose, focusOn, lerpPose, useLayout} from '../layout';
import {CategorySheet, DaySheet, ExpenseScreen} from '../screens/Expense';
import {HomeScreen} from '../screens/Home';
import {makeTheme} from '../theme';
import {FAB} from './S03Accueil';

// Repères (images locales)
export const T4 = {
  fab: 6,
  digits: [52, 62, 72, 82, 92],
  objet: 108,
  catTap: 150,
  alimTap: 186,
  switchTap: 222,
  jourTap: 254,
  dayTap: 300,
  okTap: 326,
  submitTap: 372,
};

const AMOUNT = ['2', '7', ',', '5', '0'];

export const expenseFinalProps = (f: number) => ({
  amount: AMOUNT.map((ch) => ({ch, p: 1})),
  objet: <>Panier de légumes</>,
  catSel: 1,
  recOn: 1,
  jourBox: 1,
  jourLabel: 'Le 6 du mois',
  scrollY: keys(f, [338, 362, 380, 412], [0, 140, 140, 560]),
  newRow: spr(f, 388, {damping: 12, stiffness: 120}),
});

/** Scène 4 — Ajouter une dépense (0:12 → 0:19) */
export const S04Depense: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const base: Pose = {...L.phone};
  const theme = makeTheme('light');

  // zoom sur le montant pendant la saisie
  const zIn = prog(f, 36, 26, EASE_IN_OUT);
  const zOut = prog(f, 98, 28, EASE_IN_OUT);
  const z = zIn * (1 - zOut);
  const pose = lerpPose(base, focusOn(195, 206, base.scale * 1.75, base.x, base.y + (L.portrait ? 110 : 0)), z);

  // le bouton + grossit et devient l'écran Dépense
  const expand = prog(f, 10, 26, EASE_IN_OUT);
  const reveal = prog(f, 22, 26, EASE_IN_OUT);
  const R = 940;

  const amount = AMOUNT.map((ch, i) => ({ch, p: prog(f, T4.digits[i], 14, EASE)})).filter((_, i) => f >= T4.digits[i]);
  const catSheet = prog(f, T4.catTap + 2, 20, EASE) * (1 - prog(f, T4.alimTap + 8, 18, EASE_IN_OUT));
  const daySheet = prog(f, T4.jourTap + 2, 24, EASE) * (1 - prog(f, T4.okTap + 2, 18, EASE_IN_OUT));
  const fin = expenseFinalProps(f);

  return (
    <AbsoluteFill>
      <Background variant="light" blur={z * 12} drift={{x: 0, y: -z * 50}} frameOffset={300} />
      <Phone pose={pose}>
        <AppScreen theme={theme}>
          {reveal < 1 && <HomeScreen scrollY={540} fabPress={press(f, T4.fab)} />}
          {expand > 0 && reveal < 1 && (
            <div
              style={{
                position: 'absolute',
                left: FAB.x - R,
                top: FAB.y - R,
                width: R * 2,
                height: R * 2,
                borderRadius: '50%',
                background: theme.main,
                transform: `scale(${Math.max(27 / R, expand)})`,
                zIndex: 60,
                opacity: 1 - prog(f, 34, 14),
              }}
            />
          )}
          {reveal > 0 && (
            <div style={{position: 'absolute', inset: 0, zIndex: 70, clipPath: `circle(${reveal * 950}px at ${FAB.x}px ${FAB.y}px)`, background: theme.bg}}>
              <ExpenseScreen
                enter={enterFrom(f, 24, 3, 22)}
                amount={amount}
                amountFocus={f >= 44 && f < 104 ? 1 : 0}
                objet={<Typed text="Panier de légumes" f={f} start={T4.objet} speed={2} />}
                objetFocus={f >= T4.objet - 2 && f < T4.objet + 44 ? 1 : 0}
                catSel={prog(f, T4.alimTap + 2, 8)}
                catPress={press(f, T4.catTap)}
                recOn={prog(f, T4.switchTap, 14, EASE)}
                jourBox={prog(f, T4.switchTap + 6, 22, EASE)}
                jourLabel={f > T4.okTap + 6 ? 'Le 6 du mois' : 'Choisir le jour'}
                jourPress={press(f, T4.jourTap)}
                submitPress={press(f, T4.submitTap)}
                scrollY={fin.scrollY}
                newRow={f >= 388 ? fin.newRow : 0}
              />
              <Spotlight x={16} y={150} w={358} h={112} r={18} p={z} />
              <CategorySheet p={catSheet} selected={f > T4.alimTap ? 2 : 0} pressIdx={2} press={press(f, T4.alimTap)} />
              <DaySheet
                p={daySheet}
                value={f >= T4.dayTap ? 6 : null}
                pickP={prog(f, T4.dayTap, 16, EASE)}
                gridEnter={prog(f, T4.jourTap + 8, 34)}
                okPress={press(f, T4.okTap)}
              />
              <Toast text="Panier de légumes — prélèvement prévu le 06/09 🔄" p={prog(f, 380, 16, EASE) * (1 - prog(f, 412, 10))} />
            </div>
          )}
          <Finger frame={f} path={[{f: 0, x: FAB.x, y: FAB.y}, {f: 8, x: FAB.x, y: FAB.y}, {f: 30, x: FAB.x + 40, y: FAB.y - 60}]} taps={[T4.fab]} show={[0, 34]} />
          <Finger
            frame={f}
            path={[
              {f: 128, x: 300, y: 470},
              {f: 146, x: 220, y: 413},
              {f: 172, x: 220, y: 413},
              {f: 184, x: 230, y: 662},
              {f: 200, x: 250, y: 700},
              {f: 218, x: 318, y: 569},
              {f: 236, x: 300, y: 600},
              {f: 251, x: 170, y: 674},
              {f: 280, x: 200, y: 520},
              {f: 297, x: 298, y: 386},
              {f: 312, x: 260, y: 600},
              {f: 324, x: 195, y: 794},
              {f: 350, x: 230, y: 720},
              {f: 369, x: 195, y: 629},
            ]}
            taps={[T4.catTap, T4.alimTap, T4.switchTap, T4.jourTap, T4.dayTap, T4.okTap, T4.submitTap]}
            show={[124, 392]}
          />
        </AppScreen>
      </Phone>
      <Caption text={'Tes prélèvements,\nau bon jour.'} frame={f} start={48} out={404} accentWords={{2: '#4f46e5', 3: '#4f46e5', 4: '#4f46e5'}} />
      <Sfx at={T4.fab} name="tap" />
      <Sfx at={12} name="whoosh" />
      {T4.digits.map((d) => (
        <Sfx key={d} at={d} name="pop" volume={0.6} />
      ))}
      {[T4.catTap, T4.alimTap, T4.switchTap, T4.jourTap, T4.dayTap, T4.okTap, T4.submitTap].map((d) => (
        <Sfx key={d} at={d} name="tap" />
      ))}
      <Sfx at={388} name="whoosh" volume={0.6} />
      <Sfx at={380} name="pop" />
    </AbsoluteFill>
  );
};
