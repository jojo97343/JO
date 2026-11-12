import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, EASE_IN_OUT, clamp, keys, lerp, press, prog, spr} from '../anim';
import {Sfx} from '../components/Audio';
import {Background} from '../components/Background';
import {Finger} from '../components/Finger';
import {Icon} from '../components/Icons';
import {Caption} from '../components/Kinetic';
import {Phone} from '../components/Phone';
import {AppScreen, Toast, enterFrom} from '../components/ui';
import {Pose, lerpPose, useLayout} from '../layout';
import {ArchivesScreen, ClotureModal} from '../screens/Archives';
import {BudgetScreen} from '../screens/Budget';
import {FOLDER_POS, HomeScreen} from '../screens/Home';
import {PdfReport} from '../screens/PdfReport';
import {ACCENTS, makeTheme} from '../theme';
import {budgetScroll} from './S06Budget';

export const T7 = {archiver: 140, navArchives: 214, pdf: 392};
export const archivesScroll = (f: number) => keys(f, [296, 322, 356, 382], [0, 420, 420, 700]);

/** Petite séquence calendrier : la date avance jusqu'au jour de paie */
const CalendarCard: React.FC<{f: number}> = ({f}) => {
  const L = useLayout();
  const inP = spr(f, 6, {damping: 14, stiffness: 120});
  const out = prog(f, 138, 20, EASE_IN_OUT);
  const day = Math.round(lerp(5, 25, prog(f, 24, 58, EASE_IN_OUT)));
  const pay = spr(f, 84, {damping: 10, stiffness: 160});
  const s = L.portrait ? 1 : 1.15;
  const cx = L.portrait ? L.w / 2 : L.caption.x + L.caption.w / 2;
  const cy = L.portrait ? 390 : L.h / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - 230 * s,
        top: cy - 150 * s,
        width: 460 * s,
        height: 300 * s,
        borderRadius: 40 * s,
        background: '#fff',
        border: '1px solid rgba(17,19,26,0.08)',
        boxShadow: '0 40px 80px -30px rgba(17,19,26,0.35)',
        overflow: 'hidden',
        fontFamily: 'Manrope',
        opacity: clamp(inP * 1.5) * (1 - out),
        transform: `translateY(${(1 - inP) * 60 - out * 80}px) scale(${lerp(0.9, 1, inP)}) rotate(${-3 * (1 - inP)}deg)`,
        zIndex: 120,
      }}
    >
      <div style={{height: 78 * s, background: ACCENTS.indigo, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 * s, fontSize: 34 * s, fontWeight: 800}}>
        <Icon name="calendar" size={34 * s} stroke={2.2} />
        Septembre
      </div>
      <div style={{height: 222 * s, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26 * s}}>
        <span style={{fontSize: 150 * s, fontWeight: 800, letterSpacing: '-0.04em', color: '#11131a', fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{day}</span>
        <span
          style={{
            fontSize: 30 * s,
            fontWeight: 800,
            color: '#0b7a53',
            background: 'rgba(11,122,83,0.12)',
            padding: `${10 * s}px ${18 * s}px`,
            borderRadius: 999,
            opacity: clamp(pay * 1.4),
            transform: `scale(${lerp(0.6, 1, pay)})`,
            whiteSpace: 'nowrap',
          }}
        >
          Jour de paie
        </span>
      </div>
    </div>
  );
};

/** Scène 7 — Clôture et Archives (0:32 → 0:40) */
export const S07Archives: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const base: Pose = {...L.phone};
  const theme = makeTheme('light');

  const swipe = prog(f, 0, 26, EASE_IN_OUT);
  const modal = spr(f, 96, {damping: 16, stiffness: 120});
  const fold = prog(f, T7.archiver + 6, 42, EASE_IN_OUT);
  const toArc = prog(f, T7.navArchives + 4, 22, EASE_IN_OUT);

  // la feuille A4 sort du téléphone
  const pdfUp = prog(f, T7.pdf + 4, 36, EASE);
  const pdfLay = prog(f, T7.pdf + 26, 46, EASE_IN_OUT);
  const phoneBack = prog(f, T7.pdf + 4, 40, EASE);
  const pose = lerpPose(base, {...base, scale: base.scale * 0.9, y: base.y + (L.portrait ? 60 : 0), rx: 8}, phoneBack);
  const pdfScale0 = (390 * base.scale) / 794 * 0.6;
  const pdfScaleF = L.portrait ? 0.96 : 0.8;
  const pdfX = L.portrait ? L.w / 2 : base.x + 120;
  const pdfY0 = base.y - 200 * base.scale;
  const pdfYF = L.portrait ? 1230 : 560;
  return (
    <AbsoluteFill>
      <Background variant="light" frameOffset={1620} blur={phoneBack * 6} />
      <Phone pose={pose} opacity={1 - 0.45 * pdfLay}>
        <AppScreen theme={theme}>
          {toArc < 1 && (
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${-40 * toArc}px)`, opacity: 1 - toArc}}>
              {swipe < 1 && (
                <div style={{position: 'absolute', inset: 0, transform: `translateX(${-390 * swipe}px)`}}>
                  <BudgetScreen scrollY={budgetScroll(300)} />
                </div>
              )}
              <div style={{position: 'absolute', inset: 0, transform: `translateX(${390 * (1 - swipe)}px)`}}>
                <HomeScreen folder={prog(f, 184, 24)} />
                <ClotureModal p={modal} archivePress={press(f, T7.archiver)} fold={fold} />
                <Toast text="« Septembre 2026 » archivé ! +240€ au coffre 🎉" p={prog(f, 192, 16, EASE) * (1 - prog(f, 262, 14))} />
              </div>
            </div>
          )}
          {toArc > 0 && (
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${40 * (1 - toArc)}px)`, opacity: toArc}}>
              <ArchivesScreen
                enter={enterFrom(f, T7.navArchives + 6, 5)}
                catDraw={prog(f, 236, 60, EASE_IN_OUT)}
                globalDraw={prog(f, 306, 52, EASE_IN_OUT)}
                cardsEnter={enterFrom(f, 300, 6)}
                ring={prog(f, 356, 40, EASE)}
                pdfPress={press(f, T7.pdf)}
                scrollY={archivesScroll(f)}
              />
            </div>
          )}
          <Finger
            frame={f}
            path={[
              {f: 112, x: 330, y: 640},
              {f: 136, x: 282, y: 788},
              {f: 160, x: 300, y: 700},
              {f: 196, x: 330, y: 760},
              {f: 211, x: 345, y: 794},
              {f: 236, x: 300, y: 700},
              {f: 370, x: 260, y: 600},
              {f: 389, x: 170, y: 363},
            ]}
            taps={[T7.archiver, T7.navArchives, T7.pdf]}
            show={[108, 400]}
          />
        </AppScreen>
      </Phone>
      <CalendarCard f={f} />
      {pdfUp > 0 && (
        <div style={{position: 'absolute', left: pdfX, top: lerp(pdfY0, pdfYF, pdfUp), width: 0, height: 0, perspective: 2400, zIndex: 110}}>
          <div
            style={{
              position: 'absolute',
              left: -397,
              top: -561,
              width: 794,
              height: 1123,
              transform: `scale(${lerp(pdfScale0, pdfScaleF, pdfUp)}) rotateX(${22 * pdfLay}deg) rotateZ(${lerp(-8, -3, pdfLay) * pdfUp}deg) rotateY(${6 * pdfLay}deg)`,
              boxShadow: `0 ${30 + 60 * pdfLay}px ${60 + 80 * pdfLay}px -20px rgba(17,19,26,${0.25 + 0.15 * pdfLay})`,
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <PdfReport reveal={prog(f, T7.pdf + 6, 56)} />
          </div>
        </div>
      )}
      <Caption text={'Chaque mois, archivé.\nComparé. Imprimable.'} frame={f} start={176} out={466} sizeMul={L.portrait ? 0.92 : 1} accentWords={{3: '#4f46e5', 4: '#4f46e5'}} />
      <Sfx at={0} name="whoosh" volume={0.5} />
      <Sfx at={84} name="pop" />
      <Sfx at={96} name="whoosh" volume={0.5} />
      <Sfx at={T7.archiver} name="tap" />
      <Sfx at={186} name="pop" />
      <Sfx at={T7.navArchives} name="tap" />
      <Sfx at={T7.pdf} name="tap" />
      <Sfx at={T7.pdf + 6} name="whoosh" />
    </AbsoluteFill>
  );
};

export {FOLDER_POS};
