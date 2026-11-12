import React from 'react';
import {appear, clamp} from '../anim';
import {A_VENIR, BUDGET, DEPENSE, EPARGNE, GROUPS, JOURS_RESTANTS, Op, PARTNER_NAME, PAR_JOUR, REVENUS, RYTHME, VAC, cat} from '../data';
import {eur, num, opAmt} from '../format';
import {tint} from '../theme';
import {Icon} from '../components/Icons';
import {ALL, Card, DayHead, Enter, HEADER_H, Header, Muted, NavBar, OpRow, Scroll, SecHead, useT} from '../components/ui';

export const opRowProps = (o: Op) => {
  const c = cat(o.ct);
  return {
    c: c.color,
    icon: c.emoji,
    name: o.desc + (o.rec ? ' 🔄' : ''),
    meta: (o.meta ?? '') + c.name,
    amt: opAmt(o.mt),
    avenir: o.avenir,
  };
};

export const Hero: React.FC<{
  label: string;
  amount: React.ReactNode;
  sub: React.ReactNode;
  stats: {l: string; v: string}[];
  color?: string;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  reset?: boolean;
}> = ({label, amount, sub, stats, color, extra, style, reset}) => {
  const t = useT();
  return (
    <div
      style={{
        background: color ?? t.main,
        color: '#fff',
        borderRadius: 24,
        padding: 22,
        marginBottom: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style,
      }}
    >
      <span style={{fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)'}}>{label}</span>
      <div style={{fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05}}>{amount}</div>
      <div style={{fontSize: 13, color: 'rgba(255,255,255,0.88)'}}>{sub}</div>
      {extra}
      {stats.length > 0 && (
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${stats.length}, minmax(0,1fr))`, gap: 8, marginTop: 12}}>
          {stats.map((s, i) => (
            <div key={i} style={{display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.14)', minWidth: 0}}>
              <span style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)'}}>{s.l}</span>
              <span style={{fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap'}}>{s.v}</span>
              {reset && i === stats.length - 1 && (
                <span style={{alignSelf: 'flex-start', marginTop: 4, background: 'rgba(255,255,255,0.18)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999}}>Reset</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const QuickActions: React.FC = () => {
  const t = useT();
  const items = [
    {i: 'calendar', l: 'Prévoir'},
    {i: 'check', l: 'Clôturer'},
    {i: 'heart', l: 'Couple'},
    {i: 'users', l: PARTNER_NAME},
    {i: 'globe', l: VAC.nom},
  ];
  return (
    <div style={{display: 'flex', gap: 8, marginBottom: 18}}>
      {items.map((it) => (
        <div key={it.l} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700}}>
          <span
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: t.card,
              border: `1px solid ${t.line}`,
              color: t.softText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={it.i} size={22} />
          </span>
          <span>{it.l}</span>
        </div>
      ))}
    </div>
  );
};

export const SearchField: React.FC<{placeholder?: string}> = ({placeholder = 'Rechercher une dépense…'}) => {
  const t = useT();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 46,
        padding: '0 14px',
        borderRadius: 14,
        background: t.bg,
        border: `1px solid ${t.line}`,
        color: t.muted,
        marginBottom: 6,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      <Icon name="search" size={17} stroke={2.2} />
      <span style={{color: t.hint}}>{placeholder}</span>
    </div>
  );
};

/** Liste groupée par jour (À venir ce mois-ci, Aujourd'hui, Hier…) */
export const GroupedOps: React.FC<{enter?: Enter; extraAvenir?: React.ReactNode; avenirTotal?: string; maxGroups?: number}> = ({
  enter = ALL,
  extraAvenir,
  avenirTotal,
  maxGroups = 4,
}) => {
  let k = 0;
  return (
    <>
      {GROUPS.slice(0, maxGroups).map((g, gi) => {
        const hi = k++;
        return (
          <div key={gi}>
            <div style={appear(enter(hi), 12)}>
              <DayHead label={g.label} total={g.avenir && avenirTotal ? avenirTotal : g.total} avenir={g.avenir} />
            </div>
            {g.avenir && extraAvenir}
            {g.ops.map((o, oi) => {
              const ri = k++;
              return (
                <div key={oi} style={appear(enter(ri), 16)}>
                  <OpRow {...opRowProps(o)} />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export const HomeScreen: React.FC<{
  enter?: Enter;
  opsEnter?: Enter;
  solde?: number;
  aVenir?: number;
  paceHL?: number;
  scrollY?: number;
  dark?: number;
  fabPress?: number;
  navEnter?: number;
  folder?: number;
}> = ({enter = ALL, opsEnter = ALL, solde = 517, aVenir = 1, paceHL = 0, scrollY = 0, dark = 0, fabPress = 0, navEnter = 1, folder}) => {
  const t = useT();
  const pctBudget = Math.round((DEPENSE / BUDGET) * 100);
  return (
    <>
      <Scroll y={scrollY} top={HEADER_H}>
        <div style={appear(enter(1), 18, 0.97)}>
          <Hero
            label="Solde du mois"
            amount={<>{num(solde, 2)}&nbsp;€</>}
            sub={
              <>
                sur {num(REVENUS, 2)}&nbsp;€ de revenus
                <span style={{opacity: clamp(aVenir)}}> · {num(A_VENIR, 2)}&nbsp;€ à venir</span>
              </>
            }
            stats={[
              {l: 'Dépensé', v: num(DEPENSE, 2) + ' €'},
              {l: 'Épargné', v: num(EPARGNE, 2) + ' €'},
              {l: 'Coffre', v: num(1410, 2) + ' €'},
            ]}
            reset
          />
        </div>
        <div style={appear(enter(2), 14)}>
          <QuickActions />
        </div>
        <div style={appear(enter(3), 14)}>
          <Card>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <span style={{fontSize: 15, fontWeight: 800}}>Budget utilisé</span>
              <Muted>
                {num(DEPENSE)}&nbsp;€ / {num(BUDGET)}&nbsp;€
              </Muted>
            </div>
            <div style={{height: 8, borderRadius: 999, background: t.track, overflow: 'hidden', margin: '12px 0 8px'}}>
              <div style={{height: '100%', width: `${pctBudget * clamp(enter(3) * 1.2 - 0.2)}%`, background: t.main, borderRadius: 999}} />
            </div>
            <Muted>{pctBudget} % du budget prévu</Muted>
          </Card>
        </div>
        <div style={appear(enter(4), 12)}>
          <SecHead title="Fin de mois" right={<Muted>{JOURS_RESTANTS} jours restants</Muted>} />
        </div>
        <div style={appear(enter(5), 14)}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>Tu peux dépenser</span>
            <div style={{fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, position: 'relative', alignSelf: 'flex-start'}}>
              <span
                style={{
                  position: 'absolute',
                  left: -6,
                  right: -8,
                  top: 3,
                  bottom: 1,
                  borderRadius: 8,
                  background: tint(t, t.success, 16, 26),
                  transform: `scaleX(${paceHL})`,
                  transformOrigin: 'left center',
                }}
              />
              <span style={{position: 'relative', color: paceHL > 0.6 ? t.success : t.text}}>
                {PAR_JOUR}&nbsp;€ <small style={{fontSize: 15, fontWeight: 700, color: paceHL > 0.6 ? t.success : t.muted, letterSpacing: 0}}>/ jour</small>
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${t.line}`}}>
              <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>Tu dépenses en moyenne</span>
              <span style={{fontSize: 15, fontWeight: 800, color: t.success}}>{RYTHME}&nbsp;€ / jour</span>
            </div>
          </Card>
        </div>
        <div style={appear(enter(6), 12)}>
          <SecHead title="Dernières opérations" right={<span style={{color: t.softText, fontWeight: 800, fontSize: 13}}>Tout voir</span>} />
        </div>
        <div style={appear(enter(7), 14)}>
          <Card>
            <SearchField />
            <GroupedOps enter={opsEnter} />
          </Card>
        </div>
      </Scroll>
      {folder !== undefined && <FolderFab pulse={folder} enter={navEnter} />}
      <Header dark={dark} enter={enter(0)} />
      <NavBar active="tableau" fabPress={fabPress} enter={navEnter} />
    </>
  );
};

/** Bouton flottant 📁 « Clôturer le mois » (au-dessus de la barre de navigation) */
export const FolderFab: React.FC<{pulse?: number; enter?: number}> = ({pulse = 0, enter = 1}) => {
  const t = useT();
  return (
    <div
      style={{
        position: 'absolute',
        right: 14,
        bottom: 84 + 10,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: t.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 19,
        zIndex: 25,
        boxShadow: `0 4px 20px ${tint(t, t.main, 40, 40)}`,
        transform: `scale(${(1 + Math.sin(Math.PI * clamp(pulse)) * 0.28) * enter})`,
      }}
    >
      📁
    </div>
  );
};
export const FOLDER_POS = {x: 390 - 14 - 24, y: 844 - 94 - 24};

export const HOME_Y = {hero: 100, qa: 327, budget: 423, paceHead: 553, pace: 583, paceAmt: 636, ops: 782};
export {eur};
