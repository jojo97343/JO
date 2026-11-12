import React from 'react';
import {appear, clamp, lerp} from '../anim';
import {ALIM_DEPS, BUDGET, CATS, Cat, DEPENSE} from '../data';
import {eur, num} from '../format';
import {cmix, tint} from '../theme';
import {Donut} from '../components/Charts';
import {Icon} from '../components/Icons';
import {Card, HEADER_H, Header, NavBar, Pill, PillKind, Ring, Scroll, useT} from '../components/ui';

export const ROW_H = 93;
export const DONUT_CENTER_Y = 246;
export const ROWS_TOP = 389;

const statusOf = (c: Cat, ratio: number) => {
  const over = ratio > 1.0001;
  const done = !over && Math.abs(ratio - 1) < 0.0001;
  const pctv = ratio * 100;
  const warn = !over && !done && pctv >= 85;
  const kind: PillKind = over ? 'over' : done ? 'done' : warn ? 'warn' : 'ok';
  const status = over ? 'Dépassé' : done ? 'Atteint' : warn ? 'Attention' : Math.round(pctv) + ' %';
  const reel = c.prevu * ratio;
  const reste = over ? 'Dépassé de ' + eur(reel - c.prevu) : done ? 'Budget atteint' : 'Reste ' + eur(Math.round(c.prevu - reel));
  return {over, done, warn, kind, status, reste, reel};
};

export const BilanRow: React.FC<{c: Cat; fill: number; open?: number; y: number; enter: number; pressed?: number; pctOverride?: string}> = ({
  c,
  fill,
  open = 0,
  y,
  enter,
  pressed = 0,
  pctOverride,
}) => {
  const t = useT();
  const ratio = (c.reel / c.prevu) * fill;
  const s = statusOf(c, ratio);
  const reelShown = fill >= 0.999 ? c.reel : Math.round(c.reel * fill);
  const col = s.over ? t.danger : c.color;
  const visPct = Math.min(ratio, 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        ...appear(enter, 18),
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          padding: '14px 0',
          borderBottom: `1px solid ${open > 0.1 ? 'transparent' : t.line}`,
          transform: `scale(${1 - 0.02 * pressed})`,
        }}
      >
        <Ring size={56} thick={6} value={visPct} color={col} track={tint(t, c.color, 18, 18)} hole={t.card}>
          <span style={{fontSize: 22, lineHeight: 1}}>{c.emoji}</span>
        </Ring>
        <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
            <span style={{fontSize: 14, fontWeight: 800}}>{c.name}</span>
            <Pill kind={s.kind}>{pctOverride ?? s.status}</Pill>
          </div>
          <div style={{height: 12, borderRadius: 999, background: tint(t, c.color, 14, 14), overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${visPct * 100}%`, borderRadius: 999, background: col}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: t.muted}}>
            <span>
              <strong style={{color: t.text, fontWeight: 800}}>{eur(reelShown)}</strong> sur {eur(c.prevu)}
            </span>
            <span style={{fontWeight: 700, color: s.over ? t.danger : s.done ? t.muted : t.success, whiteSpace: 'nowrap'}}>{s.reste}</span>
          </div>
        </div>
        <Icon name="chevDown" size={16} stroke={2.4} color={open > 0.5 ? c.color : t.hint} style={{transform: `rotate(${180 * open}deg)`}} />
      </div>
      {open > 0 && (
        <div
          style={{
            margin: '-4px 0 6px 68px',
            padding: '4px 12px',
            borderRadius: 14,
            background: t.bg,
            borderLeft: `3px solid ${c.color}`,
            maxHeight: 344 * open,
            overflow: 'hidden',
            opacity: clamp(open * 1.5),
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0 4px', fontSize: 12, fontWeight: 700, color: t.muted}}>
            <span>{ALIM_DEPS.length} dépenses</span>
            <span>{num(215, 2)} €</span>
          </div>
          {ALIM_DEPS.map((d, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 0',
                borderTop: `1px solid ${t.line}`,
                ...appear(clamp(open * 2.2 - i * 0.18), 10),
              }}
            >
              <span style={{width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0}} />
              <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2}}>
                <span style={{fontSize: 13, fontWeight: 700}}>{d.desc}</span>
                <span style={{fontSize: 12, color: t.muted}}>{d.meta}</span>
              </div>
              <span style={{fontSize: 14, fontWeight: 800}}>{num(d.mt, 2)} €</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const BilanScreen: React.FC<{
  donutDraw?: number;
  center?: number; // 0 = total, 1 = Alimentation
  pop?: number;
  centerIn?: number;
  counter?: number;
  rowFill?: (i: number) => number;
  rowY?: (i: number) => number;
  rowEnter?: (i: number) => number;
  open?: number;
  pressed?: number;
  scrollY?: number;
  alimPct?: string;
  headerEnter?: number;
}> = ({
  donutDraw = 1,
  center = 0,
  pop = 0,
  centerIn = 1,
  counter = 1,
  rowFill = () => 1,
  rowY = (i) => i * ROW_H,
  rowEnter = () => 1,
  open = 0,
  pressed = 0,
  scrollY = 0,
  alimPct,
  headerEnter = 1,
}) => {
  const t = useT();
  const parts = CATS.filter((c) => c.id !== 'epargne').map((c) => ({v: c.reel, c: c.color}));
  const reste = Math.round((BUDGET - DEPENSE) * counter);
  const dep = Math.round(DEPENSE * counter);
  const pctTot = Math.round((DEPENSE / BUDGET) * 100 * counter);
  const alim = CATS[2];
  const total = (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, opacity: (1 - center) * centerIn, transform: `scale(${lerp(0.9, 1, centerIn)})`}}>
      <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>Reste</span>
      <span style={{fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, color: t.success}}>{eur(reste)}</span>
      <span style={{fontSize: 12, color: t.muted, fontWeight: 600, lineHeight: 1.35, textAlign: 'center'}}>
        {eur(dep)} dépensés
        <br />
        sur {eur(BUDGET)}
      </span>
      <Pill kind="ok" style={{marginTop: 6}}>
        {pctTot} % du budget
      </Pill>
    </div>
  );
  const catC = (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        opacity: center,
        transform: `scale(${lerp(0.9, 1, center)})`,
      }}
    >
      <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>{alim.name}</span>
      <span style={{fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15}}>{eur(alim.reel)}</span>
      <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>sur {eur(alim.prevu)}</span>
      <Pill color={alim.color} style={{marginTop: 6, background: cmix(alim.color, t.mode === 'dark' ? 26 : 14, t.card)}}>
        18 % des dépenses
      </Pill>
    </div>
  );
  return (
    <>
      <Scroll y={scrollY} top={HEADER_H}>
        <Card style={{padding: 16}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0 16px', borderBottom: `1px solid ${t.line}`, marginBottom: 4}}>
            <Donut size={248} parts={parts} draw={donutDraw} pop={{i: 2, t: pop}}>
              <div style={{width: 168, height: 168, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                {total}
                {catC}
              </div>
            </Donut>
          </div>
          <div style={{position: 'relative', height: ROW_H * 5 + 344 * open}}>
            {CATS.map((c, i) => (
              <BilanRow
                key={c.id}
                c={c}
                fill={rowFill(i)}
                y={rowY(i)}
                enter={rowEnter(i)}
                open={c.id === 'alim' ? open : 0}
                pressed={c.id === 'alim' ? pressed : 0}
                pctOverride={c.id === 'alim' ? alimPct : undefined}
              />
            ))}
          </div>
        </Card>
      </Scroll>
      <Header enter={headerEnter} />
      <NavBar active="bilan" />
    </>
  );
};
