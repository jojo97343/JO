import React from 'react';
import {appear, clamp, lerp} from '../anim';
import {ARCHIVES, CATS, REVENUS} from '../data';
import {eur, num} from '../format';
import {LineChart} from '../components/Charts';
import {Icon} from '../components/Icons';
import {ALL, Card, Enter, HEADER_H, Header, Muted, NavBar, Pill, Scroll, SecHead, useT} from '../components/ui';
import {tint} from '../theme';

/** Petit anneau de répartition (cartes de mois) */
export const SegRing: React.FC<{size: number; thick: number; parts: {v: number; c: string}[]; draw: number; children?: React.ReactNode; hole: string; track: string}> = ({
  size,
  thick,
  parts,
  draw,
  children,
  hole,
  track,
}) => {
  const r = (size - thick) / 2;
  const C = 2 * Math.PI * r;
  const tot = parts.reduce((s, p) => s + p.v, 0);
  let acc = 0;
  return (
    <div style={{position: 'relative', width: size, height: size, flexShrink: 0}}>
      <svg width={size} height={size} style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thick} />
        {parts.map((p, i) => {
          const a0 = acc / tot;
          acc += p.v;
          const a1 = acc / tot;
          const shown = Math.min(a1, draw) - a0 - 0.006;
          if (shown <= 0) return null;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={p.c}
              strokeWidth={thick}
              strokeDasharray={`${C * shown} ${C}`}
              strokeDashoffset={-C * a0}
            />
          );
        })}
      </svg>
      <div style={{position: 'absolute', inset: thick + 1, borderRadius: '50%', background: hole, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    </div>
  );
};

export const monthParts = (alim: number, dep: number) => {
  const others = dep - alim - 15;
  return [
    {v: others * 0.76, c: CATS[0].color},
    {v: others * 0.24, c: CATS[1].color},
    {v: alim, c: CATS[2].color},
    {v: 15, c: CATS[3].color},
    {v: 240, c: CATS[4].color},
  ];
};

export const MonthCard: React.FC<{i: number; ring?: number; pdfPress?: number; style?: React.CSSProperties}> = ({i, ring = 1, pdfPress = 0, style}) => {
  const t = useT();
  const a = ARCHIVES[i];
  const over = a.dep > a.budget;
  const pc = Math.round((a.dep / a.budget) * 100);
  const solde = REVENUS - a.dep - a.ep;
  return (
    <div style={{background: t.card, border: `1px solid ${t.line}`, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 12, ...style}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <SegRing size={64} thick={9} parts={monthParts(a.alim, a.dep)} draw={ring} hole={t.card} track={t.track}>
          <span style={{fontSize: 12, fontWeight: 800, color: over ? t.danger : t.text}}>{Math.round(pc * clamp(ring * 1.2))}%</span>
        </SegRing>
        <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3}}>
          <span style={{fontSize: 16, fontWeight: 800, lineHeight: 1.25}}>{a.nom}</span>
          <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>
            {eur(a.dep)} sur {eur(a.budget)}
          </span>
          <span style={{display: 'flex', marginTop: 3}}>
            <Pill kind={over ? 'over' : 'ok'}>{over ? 'Dépassé' : 'Dans le budget'}</Pill>
          </span>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6}}>
        {[
          {l: 'Revenus', v: eur(REVENUS), c: t.text},
          {l: 'Dépensé', v: eur(a.dep), c: t.text},
          {l: 'Épargné', v: eur(a.ep), c: t.success},
          {l: 'Solde', v: '+' + eur(solde), c: t.success},
        ].map((s) => (
          <div key={s.l} style={{padding: '9px 8px', borderRadius: 12, background: t.bg, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0}}>
            <span style={{fontSize: 10, color: t.muted, fontWeight: 600}}>{s.l}</span>
            <strong style={{fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap', color: s.c}}>{s.v}</strong>
          </div>
        ))}
      </div>
      <div style={{display: 'flex', gap: 8}}>
        <div
          style={{
            flex: 1,
            height: 42,
            borderRadius: 12,
            background: pdfPress > 0 ? tint(t, t.main, lerp(11, 24, pdfPress), 30) : t.soft,
            color: t.softText,
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${1 - 0.04 * pdfPress})`,
          }}
        >
          Exporter en PDF
        </div>
        <span style={{width: 42, height: 42, borderRadius: 12, background: t.track, color: t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="trash" size={17} stroke={2} />
        </span>
      </div>
    </div>
  );
};

const Legend: React.FC<{items: {l: string; c: string; dash?: boolean; line?: boolean}[]}> = ({items}) => {
  const t = useT();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px 14px'}}>
      {items.map((it) => (
        <span key={it.l} style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: t.muted}}>
          {it.dash ? (
            <i style={{width: 14, height: 0, borderTop: `2px dashed ${it.c}`}} />
          ) : it.line ? (
            <i style={{width: 14, height: 3, borderRadius: 2, background: it.c}} />
          ) : (
            <i style={{width: 10, height: 10, borderRadius: '50%', background: it.c}} />
          )}
          {it.l}
        </span>
      ))}
    </div>
  );
};

export const ArchivesScreen: React.FC<{
  enter?: Enter;
  catDraw?: number;
  globalDraw?: number;
  cardsEnter?: Enter;
  ring?: number;
  pdfPress?: number;
  scrollY?: number;
}> = ({enter = ALL, catDraw = 1, globalDraw = 1, cardsEnter = ALL, ring = 1, pdfPress = 0, scrollY = 0}) => {
  const t = useT();
  const labels = ARCHIVES.map((a) => a.court);
  const alim = CATS[2];
  const alimData = ARCHIVES.map((a) => a.alim);
  const moy = Math.round(alimData.reduce((s, v) => s + v, 0) / alimData.length);
  const hint = t.mode === 'dark' ? '#6b707b' : '#a3a8b3';
  return (
    <>
      <Scroll y={scrollY} top={HEADER_H}>
        <div style={appear(enter(0), 16)}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            <span style={{fontSize: 15, fontWeight: 800}}>Évolution par catégorie</span>
            <div style={{height: 50, borderRadius: 14, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15, fontWeight: 600, justifyContent: 'space-between'}}>
              <span>
                {alim.emoji} {alim.name}
              </span>
              <Icon name="chevDown" size={14} stroke={2.5} color={t.hint} />
            </div>
            <Legend
              items={[
                {l: 'Réel', c: alim.color, line: true},
                {l: 'Prévu', c: t.hint, dash: true},
              ]}
            />
            <LineChart
              id="cat"
              w={326}
              h={190}
              labels={labels}
              max={300}
              ticks={[0, 100, 200, 300]}
              draw={catDraw}
              series={[
                {data: ARCHIVES.map(() => 200), color: hint, dash: true, width: 2, straight: true},
                {
                  data: alimData,
                  color: alim.color,
                  width: 3,
                  area: true,
                  points: true,
                  values: true,
                  pointColors: alimData.map((v) => (v > 200 ? t.danger : alim.color)),
                },
              ]}
            />
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, opacity: clamp(catDraw * 2 - 1)}}>
              {[
                {l: 'Prévu', v: '200 €', k: ''},
                {l: 'Moyenne', v: moy + ' €', k: ''},
                {l: 'vs août', v: '↑ 20 €', k: 'neg'},
              ].map((s) => (
                <div
                  key={s.l}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 14,
                    background: s.k === 'neg' ? tint(t, t.danger, 11, 11) : t.bg,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    color: s.k === 'neg' ? t.danger : undefined,
                  }}
                >
                  <span style={{fontSize: 11, fontWeight: 600, color: s.k === 'neg' ? t.danger : t.muted}}>{s.l}</span>
                  <strong style={{fontSize: 14, fontWeight: 800}}>{s.v}</strong>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={appear(enter(1), 16)}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            <span style={{fontSize: 15, fontWeight: 800}}>Évolution globale</span>
            <Legend
              items={[
                {l: 'Revenus', c: '#64748b'},
                {l: 'Dépenses', c: t.main},
                {l: 'Épargne', c: t.success},
                {l: 'Solde', c: '#d97706'},
              ]}
            />
            <LineChart
              id="glob"
              w={326}
              h={200}
              labels={labels}
              max={2000}
              ticks={[0, 500, 1000, 1500, 2000]}
              draw={globalDraw}
              series={[
                {data: ARCHIVES.map(() => REVENUS), color: '#64748b', points: true},
                {data: ARCHIVES.map((a) => a.dep), color: t.main, points: true},
                {data: ARCHIVES.map((a) => a.ep), color: t.success, points: true},
                {data: ARCHIVES.map((a) => REVENUS - a.dep - a.ep), color: '#d97706', dash: true, points: true},
              ]}
            />
          </Card>
        </div>
        <div style={appear(enter(2), 12)}>
          <SecHead title="Mois archivés" right={<Muted>{ARCHIVES.length} mois</Muted>} style={{marginTop: 8}} />
        </div>
        {[5, 4, 3].map((idx, k) => (
          <div key={idx} style={appear(cardsEnter(k), 22)}>
            <MonthCard i={idx} ring={ring} pdfPress={k === 0 ? pdfPress : 0} />
          </div>
        ))}
      </Scroll>
      <Header />
      <NavBar active="archives" />
    </>
  );
};

/** Fenêtre de clôture automatique (proposée le jour de paie) */
export const ClotureModal: React.FC<{p: number; archivePress?: number; fold?: number}> = ({p, archivePress = 0, fold = 0}) => {
  const t = useT();
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 160}}>
      <div style={{position: 'absolute', inset: 0, background: `rgba(10,11,15,${0.45 * p * (1 - fold)})`, backdropFilter: `blur(${6 * p * (1 - fold)}px)`}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: t.card,
          border: `1px solid ${t.line}`,
          borderRadius: '24px 24px 0 0',
          padding: '24px 16px 30px',
          transform: `translate(${157 * fold}px, ${(1 - p) * 100 + 0}%) translateY(${64 * fold}px) scale(${1 - 0.94 * fold}, ${1 - 0.97 * Math.min(1, fold * 1.3)}) rotate(${10 * fold}deg)`,
          transformOrigin: '50% 50%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          opacity: fold > 0.85 ? (1 - fold) / 0.15 : 1,
        }}
      >
        <div style={{fontSize: 20.8, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 8}}>📅 Le mois de septembre est terminé</div>
        <p style={{color: t.muted, fontSize: 13.6, lineHeight: 1.6, margin: '0 0 20px'}}>
          Ton nouveau mois budgétaire a commencé. Ajoute d'abord tes dernières dépenses si besoin, puis archive le mois : l'épargne part au coffre et tes récurrentes sont reportées.
        </p>
        <span style={{fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6}}>Nom du mois</span>
        <div style={{height: 50, borderRadius: 14, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 16, fontWeight: 600, marginBottom: 12}}>Septembre 2026</div>
        <div style={{display: 'flex', gap: 10, marginTop: 4}}>
          <div style={{flex: 1, height: 52, borderRadius: 16, background: t.track, color: t.text, fontWeight: 700, fontSize: 14.4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Plus tard</div>
          <div
            style={{
              flex: 1,
              height: 52,
              borderRadius: 16,
              background: t.main,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${1 - 0.05 * archivePress})`,
            }}
          >
            ✅ Archiver
          </div>
        </div>
      </div>
    </div>
  );
};

export {num};
