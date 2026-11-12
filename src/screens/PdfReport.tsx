import React from 'react';
import {clamp} from '../anim';
import {BUDGET, CATS, DEPENSE, EPARGNE, REVENUS, SOLDE, USER} from '../data';
import {num} from '../format';
import {ACCENTS} from '../theme';

const POS = '#0b7a53';
const NEG = '#c2410c';
const MUT = '#5d6270';
const LINE = '#e3e5ea';
const eurP = (v: number, dec?: number) => {
  const d = dec !== undefined ? dec : Math.abs(v % 1) > 0.004 ? 2 : 0;
  return num(v, d) + ' €';
};

/** Rapport PDF (A4, 794 × 1123) — reproduction du modèle « Bilan du mois » de l'appli */
export const PdfReport: React.FC<{reveal?: number}> = ({reveal = 1}) => {
  const accent = ACCENTS.indigo;
  const pctBudget = Math.round((DEPENSE / BUDGET) * 100);
  const reste = BUDGET - DEPENSE;
  const C = 2 * Math.PI * 56;
  const ringLen = (C * pctBudget * clamp(reveal * 1.4 - 0.2)) / 100;
  const cats = CATS.filter((c) => c.id !== 'epargne');
  const totPrev = cats.reduce((s, c) => s + c.prevu, 0);
  const totReel = cats.reduce((s, c) => s + c.reel, 0);
  const totE = totPrev - totReel;
  const top = [
    {d: 'Loyer', dt: '05/09', mt: 650, c: CATS[0].color},
    {d: 'Navigo', dt: '03/09', mt: 88.8, c: CATS[1].color},
    {d: 'Lidl', dt: '03/09', mt: 65, c: CATS[2].color},
    {d: 'Carrefour', dt: '04/09', mt: 62.4, c: CATS[2].color},
    {d: 'Marché', dt: '01/09', mt: 41.2, c: CATS[2].color},
  ];
  const sec = (i: number): React.CSSProperties => ({opacity: clamp(reveal * 3 - i * 0.35), transform: `translateY(${(1 - clamp(reveal * 3 - i * 0.35)) * 16}px)`});
  const kpi = (l: string, v: string, c: string, s: string) => (
    <div key={l} style={{border: `1px solid ${LINE}`, borderRadius: 18, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6}}>
      <span style={{fontSize: 12, fontWeight: 700, color: MUT}}>{l}</span>
      <span style={{fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em', whiteSpace: 'nowrap', color: c}}>{v}</span>
      <span style={{fontSize: 12, fontWeight: 600, color: MUT}}>{s}</span>
    </div>
  );
  return (
    <div
      style={{
        width: 794,
        height: 1123,
        background: '#fff',
        fontFamily: 'Manrope',
        color: '#11131a',
        fontVariantNumeric: 'tabular-nums',
        padding: '44px 48px 40px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      <div style={{borderRadius: 24, background: accent, color: '#fff', padding: '26px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, ...sec(0)}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <span style={{fontSize: 12, fontWeight: 700, letterSpacing: '.06em', opacity: 0.9}}>MON COACH FINANCE · BILAN DU MOIS</span>
          <span style={{fontSize: 46, lineHeight: 1, fontWeight: 800, letterSpacing: '-.02em'}}>Septembre 2026</span>
          <span style={{fontSize: 14, fontWeight: 600, opacity: 0.9}}>Archivé le 25/09/2026 · {USER}</span>
          <span style={{alignSelf: 'flex-start', marginTop: 6, fontSize: 12, fontWeight: 800, padding: '6px 12px', borderRadius: 999, background: '#fff', color: accent}}>
            Dans le budget · reste {eurP(reste, 0)}
          </span>
        </div>
        <div style={{position: 'relative', width: 140, height: 140, flexShrink: 0}}>
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={70} cy={70} r={56} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={14} />
            <circle cx={70} cy={70} r={56} fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeDasharray={`${ringLen} ${C}`} transform="rotate(-90 70 70)" />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <b style={{fontSize: 30, fontWeight: 800}}>{pctBudget}&nbsp;%</b>
            <span style={{fontSize: 12, fontWeight: 700, opacity: 0.9}}>du budget</span>
          </div>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12, ...sec(1)}}>
        {kpi('Revenus', eurP(REVENUS, 0), '#11131a', 'ce mois-ci')}
        {kpi('Dépensé', eurP(DEPENSE, 0), '#11131a', '16 opérations')}
        {kpi('Épargné', eurP(EPARGNE, 0), POS, Math.round((EPARGNE / REVENUS) * 100) + ' % des revenus')}
        {kpi('Solde', '+' + eurP(SOLDE, 0), POS, 'reste à la fin')}
      </div>
      <div style={{border: `1px solid ${LINE}`, borderRadius: 18, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, ...sec(2)}}>
        <span style={{fontSize: 16, fontWeight: 800}}>Prévu et réel par catégorie</span>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
          <thead>
            <tr style={{borderBottom: '1.5px solid #11131a'}}>
              {['Catégorie', 'Prévu', 'Réel', 'Écart'].map((h, i) => (
                <th key={h} style={{textAlign: i ? 'right' : 'left', padding: '8px 0', fontSize: 12, fontWeight: 700, color: MUT}}>
                  {h}
                </th>
              ))}
              <th style={{textAlign: 'left', padding: '8px 0 8px 24px', width: 190, fontSize: 12, fontWeight: 700, color: MUT}}>Utilisé</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => {
              const p = Math.round((c.reel / c.prevu) * 100);
              const over = c.reel > c.prevu;
              const e = c.prevu - c.reel;
              return (
                <tr key={c.id} style={{borderBottom: `1px solid ${LINE}`}}>
                  <td style={{padding: '11px 0', fontWeight: 700}}>
                    <i style={{display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 8, background: c.color}} />
                    {c.emoji} {c.name}
                  </td>
                  <td style={{textAlign: 'right', color: MUT, fontWeight: 600}}>{eurP(c.prevu)}</td>
                  <td style={{textAlign: 'right', fontWeight: 800}}>{eurP(c.reel)}</td>
                  <td style={{textAlign: 'right', fontWeight: 800, color: e < 0 ? NEG : POS}}>
                    {e >= 0 ? '+' : '−'}
                    {eurP(Math.abs(e))}
                  </td>
                  <td style={{paddingLeft: 24}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      <div style={{flex: 1, height: 6, borderRadius: 999, background: '#eef0f4', overflow: 'hidden'}}>
                        <div style={{height: '100%', borderRadius: 999, width: `${Math.min(p, 100) * clamp(reveal * 2 - 0.6)}%`, background: over ? NEG : c.color}} />
                      </div>
                      <span style={{width: 40, textAlign: 'right', fontSize: 12, fontWeight: 700, color: over ? NEG : MUT}}>{p}&nbsp;%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td style={{padding: '12px 0 2px', fontWeight: 800}}>Total</td>
              <td style={{textAlign: 'right', color: MUT, fontWeight: 600, paddingTop: 12}}>{eurP(totPrev)}</td>
              <td style={{textAlign: 'right', fontWeight: 800, paddingTop: 12}}>{eurP(totReel)}</td>
              <td style={{textAlign: 'right', fontWeight: 800, color: POS, paddingTop: 12}}>+{eurP(totE)}</td>
              <td style={{textAlign: 'right', fontSize: 12, color: MUT, fontWeight: 800, paddingTop: 12}}>{Math.round((totReel / totPrev) * 100)}&nbsp;%</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 12, ...sec(3)}}>
        <div style={{border: `1px solid ${LINE}`, borderRadius: 18, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10}}>
          <span style={{fontSize: 16, fontWeight: 800}}>Plus grosses dépenses</span>
          {top.map((d, i) => (
            <div key={d.d} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, paddingBottom: 8, borderBottom: i < top.length - 1 ? `1px solid ${LINE}` : 'none'}}>
              <i style={{width: 8, height: 8, borderRadius: '50%', background: d.c}} />
              <span style={{flex: 1, fontWeight: 700}}>{d.d}</span>
              <span style={{fontWeight: 600, color: MUT}}>{d.dt}</span>
              <span style={{width: 84, textAlign: 'right', fontWeight: 800}}>{eurP(d.mt, 2)}</span>
            </div>
          ))}
        </div>
        <div style={{border: `1px solid ${LINE}`, borderRadius: 18, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14}}>
          <span style={{fontSize: 16, fontWeight: 800}}>À retenir</span>
          {[
            {l: 'Par rapport à Août 2026', v: '47 € de moins dépensés', c: POS},
            {l: "Taux d'épargne", v: '12 % des revenus', c: '#11131a'},
            {l: 'À surveiller', v: '🛒 Alimentation +15 €', c: NEG},
          ].map((r) => (
            <div key={r.l} style={{display: 'flex', flexDirection: 'column', gap: 2}}>
              <span style={{fontSize: 12, fontWeight: 700, color: MUT}}>{r.l}</span>
              <b style={{fontSize: 18, fontWeight: 800, color: r.c}}>{r.v}</b>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${LINE}`, fontSize: 12, fontWeight: 600, color: MUT, ...sec(4)}}>
        <span>Généré par Mon Coach Finance le 25/09/2026</span>
        <span>Archivé le 25/09/2026</span>
      </div>
    </div>
  );
};
