import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, clamp, lerp, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {KineticText} from '../components/Kinetic';
import {Logo} from '../components/Logo';
import {Phone} from '../components/Phone';
import {AppScreen} from '../components/ui';
import {Pose, focusOn, useLayout} from '../layout';
import {BilanScreen} from '../screens/Bilan';
import {CoupleScreen} from '../screens/Couple';
import {DaySheet, ExpenseScreen} from '../screens/Expense';
import {HomeScreen} from '../screens/Home';
import {PdfReport} from '../screens/PdfReport';
import {VacancesScreen} from '../screens/Vacances';
import {ACCENTS, PARTNER, VACANCES, makeTheme} from '../theme';

const SHOT = 10;

/** Scène 11 — Final (0:55 → 1:00) */
export const S11Final: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const base: Pose = {...L.phone};
  const theme = makeTheme('light');

  // ── montage ultra-rapide : 6 plans de 10 images ──
  if (f < SHOT * 6) {
    const i = Math.floor(f / SHOT);
    const lf = f - i * SHOT;
    const punch = lerp(1.07, 1, prog(lf, 0, SHOT, EASE));
    const flash = 1 - prog(lf, 0, 4);
    const fo = (sx: number, sy: number, z: number, rz = 0): Pose => ({...focusOn(sx, sy, base.scale * z * punch, base.x, base.y + (L.portrait ? -60 : 0)), rz});
    const shots = [
      {
        bg: <Background variant="accent" frameOffset={3120} />,
        el: (
          <Phone pose={fo(195, 210, 1.9, -4)}>
            <AppScreen theme={theme}>
              <HomeScreen />
            </AppScreen>
          </Phone>
        ),
      },
      {
        bg: <Background variant="light" frameOffset={3120} />,
        el: (
          <Phone pose={fo(195, 246, 1.9, 3)}>
            <AppScreen theme={theme}>
              <BilanScreen pop={1} center={1} />
            </AppScreen>
          </Phone>
        ),
      },
      {
        bg: <Background variant="accent" frameOffset={3120} />,
        el: (
          <Phone pose={fo(195, 440, 1.75, -3)}>
            <AppScreen theme={theme}>
              <ExpenseScreen />
              <DaySheet p={1} value={6} />
            </AppScreen>
          </Phone>
        ),
      },
      {
        bg: <Background variant="light" frameOffset={3120} />,
        el: (
          <div style={{position: 'absolute', left: L.w / 2, top: L.h / 2, width: 0, height: 0, perspective: 2400}}>
            <div style={{position: 'absolute', left: -397, top: -561, width: 794, height: 1123, transform: `scale(${(L.portrait ? 1.25 : 0.95) * punch}) rotateX(20deg) rotateZ(-5deg)`, boxShadow: '0 60px 120px -30px rgba(17,19,26,0.4)'}}>
              <PdfReport />
            </div>
          </div>
        ),
      },
      {
        bg: <Background variant="accent" accent={PARTNER} frameOffset={3120} />,
        el: (
          <Phone pose={fo(195, 470, 1.75, 3)}>
            <AppScreen theme={theme}>
              <CoupleScreen me="Enzo" sync={1} tile={1} />
            </AppScreen>
          </Phone>
        ),
      },
      {
        bg: <Background variant="accent" accent={VACANCES} frameOffset={3120} />,
        el: (
          <Phone pose={fo(195, 520, 1.85, -3)}>
            <AppScreen theme={theme}>
              <VacancesScreen amount={<>4 500</>} conv={1} />
            </AppScreen>
          </Phone>
        ),
      },
    ];
    return (
      <AbsoluteFill>
        {shots[i].bg}
        {shots[i].el}
        <AbsoluteFill style={{background: '#fff', opacity: flash * 0.35}} />
        <Sfx at={i * SHOT} name="whoosh" volume={0.35} />
      </AbsoluteFill>
    );
  }

  // ── plan final : tout s'arrête ──
  const t = f - SHOT * 6;
  const inP = spr(t, 0, {damping: 18, stiffness: 90});
  const sway = Math.sin(t / 55) * 5;
  const fade = prog(f, 268, 32);
  const P = L.portrait;
  const phonePose: Pose = P
    ? {x: L.w / 2, y: 1124 + (1 - inP) * 300, scale: 0.97 * lerp(0.9, 1, inP), ry: sway, rx: 4}
    : {x: 560, y: 540 + (1 - inP) * 200, scale: 1.0 * lerp(0.9, 1, inP), ry: 8 + sway, rx: 3};
  const col: React.CSSProperties = P
    ? {position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center'}
    : {position: 'absolute', left: 1040, width: 800, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'};
  const logoS = spr(t, 14, {damping: 12, stiffness: 140});
  return (
    <AbsoluteFill>
      <Background variant="light" frameOffset={3180} />
      <Phone pose={phonePose}>
        <AppScreen theme={theme}>
          <HomeScreen enter={(i) => prog(t, i * 3, 20)} solde={lerp(0, 517, prog(t, 10, 50, EASE))} />
        </AppScreen>
      </Phone>
      <div style={col}>
        <div style={{transform: `scale(${logoS})`, opacity: clamp(logoS * 2)}}>
          <Logo size={P ? 132 : 120} frame={t} drawStart={18} />
        </div>
        <div style={{height: P ? 28 : 30}} />
        <KineticText text={'Mon Coach\nFinance'} frame={t} start={24} size={P ? 118 : 120} align={P ? 'center' : 'left'} accentWords={{2: ACCENTS.indigo}} />
        <div style={{height: P ? 18 : 22}} />
        <KineticText text="Ton budget. Enfin clair." frame={t} start={58} size={P ? 66 : 60} color="#5d6270" weight={700} align={P ? 'center' : 'left'} />
        {!P && (
          <>
            <div style={{height: 46}} />
            <KineticText text="Gratuit · À ajouter sur ton écran d'accueil" frame={t} start={92} size={34} color="#11131a" weight={700} stagger={2} align="left" />
          </>
        )}
      </div>
      {P && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 1592}}>
          <KineticText text={"Gratuit · À ajouter sur\nton écran d'accueil"} frame={t} start={92} size={64} color="#11131a" weight={700} stagger={3} />
        </div>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: fade}} />
      <Sfx at={SHOT * 6} name="whoosh" />
      <Sfx at={SHOT * 6 + 14} name="pop" />
    </AbsoluteFill>
  );
};
