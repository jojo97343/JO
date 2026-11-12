import React from 'react';
import {appear, clamp} from '../anim';
import {VAC, VAC_CATS} from '../data';
import {eur, num} from '../format';
import {VACANCES, cmix, tint} from '../theme';
import {Icon} from '../components/Icons';
import {Card, HEADER_H, Header, Muted, NavBar, OpIco, PrimaryBtn, RoundBtn, Scroll, SecHead, useT} from '../components/ui';
import {Hero} from './Home';

/** Chiffres qui roulent (compteur mécanique) */
export const RollNum: React.FC<{text: string; p: number; color?: string}> = ({text, p, color}) => {
  const chars = text.split('');
  let di = 0;
  const nDigits = chars.filter((c) => /\d/.test(c)).length;
  return (
    <span style={{display: 'inline-flex', alignItems: 'baseline', color}}>
      {chars.map((ch, i) => {
        if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
        const k = di++;
        const d = parseInt(ch, 10);
        const local = clamp(p * 1.6 - (k / Math.max(1, nDigits)) * 0.6);
        const spins = 2 + (nDigits - k);
        const v = local * (spins * 10 + d);
        const shown = v % 10;
        return (
          <span key={i} style={{display: 'inline-block', height: '1.15em', overflow: 'hidden', position: 'relative', width: '0.62em'}}>
            <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-shown * 1.15}em)`, lineHeight: '1.15em'}}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, j) => (
                <span key={j} style={{height: '1.15em', textAlign: 'center'}}>
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export const VacancesScreen: React.FC<{
  enter?: (i: number) => number;
  amount?: React.ReactNode;
  amountFocus?: number;
  conv?: number;
  desc?: React.ReactNode;
  catPicked?: number;
  addPress?: number;
  added?: number;
  scrollY?: number;
  repEnter?: (i: number) => number;
}> = ({enter = () => 1, amount, amountFocus = 0, conv = 0, desc, catPicked = 1, addPress = 0, added = 0, scrollY = 0, repEnter = () => 1}) => {
  const t = useT();
  const a = clamp(added);
  const dep = VAC.depAvant + VAC.eurConv * a;
  const reste = VAC.budget - dep;
  const pctU = Math.round((dep / VAC.budget) * 100);
  const nb = VAC.nbAvant + (a > 0.5 ? 1 : 0);
  const totalRep = VAC_CATS.reduce((s, c) => s + c.mt, 0);
  const maxRep = VAC_CATS[0].mt;
  return (
    <>
      <Scroll y={scrollY} top={HEADER_H}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, margin: '4px 4px 14px', ...appear(enter(0), 10)}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <Muted>Séjour en cours · jour {VAC.jour}</Muted>
            <span style={{fontSize: 22, fontWeight: 800}}>🌍 {VAC.nom}</span>
          </div>
          <RoundBtn>
            <Icon name="pencil" size={17} stroke={2} />
          </RoundBtn>
        </div>
        <div style={appear(enter(1), 16, 0.97)}>
          <Hero
            color={VACANCES}
            label="Reste pour le séjour"
            amount={eur(Math.round(reste))}
            sub={
              <>
                {eur(Math.round(dep))} dépensés sur {eur(VAC.budget)}
              </>
            }
            stats={[
              {l: 'Par jour', v: eur(Math.round(dep / VAC.jour))},
              {l: 'Dépenses', v: String(nb)},
              {l: 'Utilisé', v: pctU + ' %'},
            ]}
            extra={
              <div style={{height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.22)', overflow: 'hidden', margin: '10px 0 4px'}}>
                <div style={{height: '100%', width: `${(dep / VAC.budget) * 100}%`, borderRadius: 999, background: '#fff'}} />
              </div>
            }
          />
        </div>
        <div style={appear(enter(2), 14)}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <span style={{fontSize: 15, fontWeight: 800}}>Nouvelle dépense</span>
            <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8}}>
              <div
                style={{
                  height: 56,
                  borderRadius: 14,
                  background: t.bg,
                  border: `1px solid ${amountFocus > 0.5 ? VACANCES : t.line}`,
                  boxShadow: amountFocus > 0 ? `0 0 0 3px ${tint(t, VACANCES, 16 * amountFocus, 30)}` : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                {amount ?? <span style={{color: t.hint, fontWeight: 600}}>0</span>}
              </div>
              <div style={{height: 56, borderRadius: 14, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: 15, fontWeight: 800}}>
                JPY (¥)
                <Icon name="chevDown" size={14} stroke={2.5} color={t.hint} />
              </div>
            </div>
            {conv > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: cmix(VACANCES, t.mode === 'dark' ? 24 : 11, t.card),
                  color: t.mode === 'dark' ? '#67c6d9' : VACANCES,
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: clamp(conv * 3),
                  transform: `translateY(${(1 - clamp(conv * 2)) * -8}px)`,
                }}
              >
                <span style={{display: 'flex', alignItems: 'baseline', gap: 4, fontSize: 17, fontWeight: 800}}>
                  ≈ <RollNum text={num(VAC.eurConv, 2)} p={conv} /> €
                </span>
                <span style={{fontWeight: 600, opacity: 0.85}}>1 € = {VAC.taux} JPY</span>
              </div>
            )}
            <div style={{height: 48, borderRadius: 14, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15, fontWeight: 600}}>
              {desc ?? <span style={{color: t.hint, fontWeight: 500}}>Ex : Dîner à la médina</span>}
            </div>
            <div style={{height: 48, borderRadius: 14, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: 15, fontWeight: 600}}>
              {catPicked > 0.5 ? '🍽️ Restaurants' : '✈️ Transport'}
              <Icon name="chevDown" size={14} stroke={2.5} color={t.hint} />
            </div>
            <PrimaryBtn h={50} color={VACANCES} pressed={addPress}>
              Ajouter
            </PrimaryBtn>
          </Card>
        </div>
        <div style={appear(enter(3), 12)}>
          <SecHead title="Où part l'argent" />
        </div>
        <div style={appear(enter(4), 14)}>
          <Card style={{paddingTop: 4, paddingBottom: 4}}>
            {VAC_CATS.map((c, i) => {
              const mt = c.name === 'Restaurants' ? c.mt - VAC.eurConv * (1 - a) : c.mt;
              const tot = totalRep - VAC.eurConv * (1 - a);
              return (
                <div key={c.name} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', ...appear(repEnter(i), 12)}}>
                  <OpIco c={c.color} icon={c.emoji} size={36} style={{borderRadius: 12}} />
                  <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, fontWeight: 700}}>
                      <span>{c.name}</span>
                      <span>
                        {eur(mt)} <em style={{fontStyle: 'normal', color: t.muted, fontWeight: 600}}>· {Math.round((mt / tot) * 100)} %</em>
                      </span>
                    </div>
                    <div style={{height: 8, borderRadius: 999, background: cmix(c.color, 14, t.card), overflow: 'hidden'}}>
                      <div style={{height: '100%', borderRadius: 999, background: c.color, width: `${(mt / maxRep) * 100 * clamp(repEnter(i) * 1.3 - 0.3)}%`}} />
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </Scroll>
      <Header />
      <NavBar active="none" />
    </>
  );
};
