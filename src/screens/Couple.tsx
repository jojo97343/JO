import React from 'react';
import {appear, clamp, lerp} from '../anim';
import {COUPLE_CATS, COUPLE_NEW, COUPLE_OPS, JOURS_RESTANTS, PARTNER_NAME, USER} from '../data';
import {eur, num} from '../format';
import {PARTNER, cmix, tint} from '../theme';
import {Icon} from '../components/Icons';
import {Card, HEADER_H, Header, Muted, NavBar, OpIco, PrimaryBtn, RoundBtn, Scroll, SecHead, useT} from '../components/ui';
import {Hero} from './Home';

const Avatar: React.FC<{who: 'moi' | 'elle'; letter: string; size?: number; onHero?: boolean}> = ({who, letter, size = 30, onHero}) => {
  const t = useT();
  const moi = who === 'moi';
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        fontSize: size * 0.43,
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: moi ? (onHero ? '#fff' : t.soft) : onHero ? PARTNER : tint(t, PARTNER, 14, 24),
        color: moi ? (onHero ? t.main : t.softText) : onHero ? '#fff' : PARTNER,
      }}
    >
      {letter}
    </span>
  );
};

export const CoupleHead: React.FC<{pulse?: number}> = ({pulse = 0}) => {
  const t = useT();
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, margin: '4px 4px 14px'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 1}}>
        <Muted>Budget à deux</Muted>
        <span style={{fontSize: 22, fontWeight: 800}}>Couple</span>
      </div>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 38,
          padding: '0 14px',
          borderRadius: 999,
          border: `1px solid ${t.line}`,
          background: t.card,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.02em',
        }}
      >
        <span style={{position: 'relative', width: 8, height: 8}}>
          <span style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#0b7a53'}} />
          {pulse > 0 && <span style={{position: 'absolute', inset: -10 * pulse, borderRadius: '50%', border: '2px solid #0b7a53', opacity: 1 - pulse}} />}
        </span>
        TOM-2026
        <Icon name="copy" size={14} stroke={2.2} color={t.muted} />
      </span>
    </div>
  );
};

/** Écran Couple, vu par `me` (Tom ou Léa) */
export const CoupleScreen: React.FC<{
  me: 'Tom' | 'Léa';
  sync?: number; // 0 → 1 : la dépense de Léa est arrivée
  tile?: number;
  newRow?: number;
  scrollY?: number;
  pulse?: number;
  // formulaire (téléphone de Léa)
  desc?: React.ReactNode;
  amount?: React.ReactNode;
  catPicked?: number;
  addPress?: number;
  enter?: (i: number) => number;
}> = ({me, sync = 0, tile = 0, newRow = 0, scrollY = 0, pulse = 0, desc, amount, catPicked = 0, addPress = 0, enter = () => 1}) => {
  const t = useT();
  const moiName = me;
  const elleName = me === 'Tom' ? PARTNER_NAME : USER;
  const s = clamp(sync);
  const totalBudget = COUPLE_CATS.reduce((a, c) => a + c.budget, 0);
  const baseDep = COUPLE_CATS.reduce((a, c) => a + c.dep, 0);
  const dep = baseDep + COUPLE_NEW.mt * s;
  const moiPaid = me === 'Tom' ? 166 : 64 + COUPLE_NEW.mt * s;
  const ellePaid = me === 'Tom' ? 64 + COUPLE_NEW.mt * s : 166;
  const ops = COUPLE_OPS;
  const fmt = (n: number) => eur(Math.round(n));
  return (
    <>
      <Scroll y={scrollY} top={HEADER_H}>
        <div style={appear(enter(0), 12)}>
          <CoupleHead pulse={pulse} />
        </div>
        <div style={appear(enter(1), 16, 0.97)}>
          <Hero
            label="Reste du budget commun"
            amount={fmt(totalBudget - dep)}
            sub={
              <>
                {fmt(dep)} dépensés sur {fmt(totalBudget)}
              </>
            }
            stats={[]}
            extra={
              <>
                <div style={{height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.22)', overflow: 'hidden', margin: '10px 0 4px'}}>
                  <div style={{height: '100%', width: `${(dep / totalBudget) * 100}%`, borderRadius: 999, background: '#fff'}} />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8, marginTop: 8}}>
                  {[
                    {w: 'moi' as const, n: moiName, v: moiPaid},
                    {w: 'elle' as const, n: elleName, v: ellePaid},
                  ].map((p) => (
                    <div key={p.w} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.14)'}}>
                      <Avatar who={p.w} letter={p.n.charAt(0)} onHero />
                      <span style={{display: 'flex', flexDirection: 'column', gap: 1}}>
                        <span style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)'}}>{p.n} a payé</span>
                        <b style={{fontSize: 15, fontWeight: 800}}>{fmt(p.v)}</b>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            }
          />
        </div>
        <div style={appear(enter(2), 12)}>
          <SecHead title="Catégories communes" right={<span style={{color: t.softText, fontWeight: 800, fontSize: 13}}>Modifier</span>} />
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginBottom: 12, ...appear(enter(3), 14)}}>
          {COUPLE_CATS.map((c) => {
            const isNew = c.id === COUPLE_NEW.cat;
            const d = c.dep + (isNew ? COUPLE_NEW.mt * clamp(tile) : 0);
            const p = Math.min(d / c.budget, 1);
            const on = isNew && tile > 0 && tile < 1.6;
            return (
              <div
                key={c.id}
                style={{
                  borderRadius: 18,
                  background: on ? cmix(c.color, 10 * clamp(tile * 2), t.card) : t.card,
                  border: `2px solid ${on ? c.color : t.line}`,
                  padding: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  minWidth: 0,
                  transform: isNew ? `scale(${1 + Math.sin(Math.PI * clamp(tile)) * 0.05})` : undefined,
                }}
              >
                <div style={{position: 'relative', width: 42, height: 42, flexShrink: 0}}>
                  <svg width={42} height={42} style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
                    <circle cx={21} cy={21} r={18.5} fill="none" stroke={cmix(c.color, 18, t.card)} strokeWidth={5} />
                    {p > 0 && <circle cx={21} cy={21} r={18.5} fill="none" stroke={c.color} strokeWidth={5} strokeDasharray={`${2 * Math.PI * 18.5 * p} 999`} />}
                  </svg>
                  <span style={{position: 'absolute', inset: 5, borderRadius: '50%', background: t.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: c.color}}>
                    {c.name.charAt(0)}
                  </span>
                </div>
                <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1}}>
                  <span style={{fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{c.name}</span>
                  <span style={{fontSize: 12, color: t.muted, fontWeight: 600, whiteSpace: 'nowrap'}}>
                    <strong style={{color: t.text, fontWeight: 800}}>{fmt(d)}</strong> / {fmt(c.budget)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={appear(enter(4), 14)}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <span style={{fontSize: 15, fontWeight: 800}}>Dépense commune</span>
            <div style={{display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 8}}>
              <div style={{height: 48, borderRadius: 14, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 15, fontWeight: 600}}>
                {desc ?? <span style={{color: t.hint, fontWeight: 500}}>Ex : Courses</span>}
              </div>
              <div style={{height: 48, borderRadius: 14, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 15, fontWeight: 600}}>
                {amount ?? <span style={{color: t.hint, fontWeight: 500}}>0 €</span>}
              </div>
            </div>
            <div style={{height: 48, borderRadius: 14, background: t.bg, border: `1px solid ${catPicked > 0 && catPicked < 1 ? t.main : t.line}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontSize: 15, fontWeight: 600}}>
              <i style={{width: 10, height: 10, borderRadius: '50%', background: catPicked > 0.5 ? COUPLE_CATS[3].color : COUPLE_CATS[0].color}} />
              <span style={{flex: 1}}>{catPicked > 0.5 ? COUPLE_CATS[3].name : COUPLE_CATS[0].name}</span>
              <Icon name="chevDown" size={14} stroke={2.5} color={t.hint} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              <span style={{fontSize: 13, fontWeight: 700}}>Payé par</span>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 4, padding: 4, borderRadius: 14, background: t.track}}>
                {[
                  {w: 'moi' as const, n: moiName, on: true},
                  {w: 'elle' as const, n: elleName, on: false},
                ].map((b) => (
                  <div
                    key={b.w}
                    style={{
                      height: 40,
                      borderRadius: 10,
                      background: b.on ? t.card : 'transparent',
                      boxShadow: b.on ? '0 1px 3px rgba(0,0,0,0.08)' : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    <Avatar who={b.w === 'moi' ? (me === 'Léa' ? 'elle' : 'moi') : me === 'Léa' ? 'moi' : 'elle'} letter={b.n.charAt(0)} size={22} />
                    {b.n}
                  </div>
                ))}
              </div>
            </div>
            <PrimaryBtn h={50} pressed={addPress}>
              Ajouter
            </PrimaryBtn>
          </Card>
        </div>
        <div style={appear(enter(5), 12)}>
          <SecHead title="Historique" />
        </div>
        <div style={appear(enter(6), 14)}>
          <Card style={{paddingTop: 4, paddingBottom: 4}}>
            {newRow > 0 && (
              <div style={{height: 65 * clamp(newRow * 1.8), overflow: 'hidden'}}>
                <div style={{opacity: clamp(newRow * 2), transform: `translateX(${(1 - newRow) * 40}px)`}}>
                  <CoupleRow op={COUPLE_NEW} me={me} highlight={1 - clamp((newRow - 1) * 2)} />
                </div>
              </div>
            )}
            {ops.map((o, i) => (
              <CoupleRow key={i} op={o} me={me} last={i === ops.length - 1} />
            ))}
          </Card>
        </div>
      </Scroll>
      <Header title={`Bonjour ${me}`} />
      <NavBar active="none" />
    </>
  );
};

const CoupleRow: React.FC<{op: typeof COUPLE_NEW; me: string; last?: boolean; highlight?: number}> = ({op, me, last, highlight = 0}) => {
  const t = useT();
  const c = COUPLE_CATS.find((x) => x.id === op.cat)!;
  const qui = op.qui === 'L' ? PARTNER_NAME : USER;
  const isMe = qui === me;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 8px',
        margin: '0 -8px',
        borderRadius: 12,
        borderBottom: last ? 'none' : `1px solid ${t.line}`,
        background: highlight > 0 ? tint(t, c.color, 10 * highlight, 18 * highlight) : undefined,
      }}
    >
      <OpIco
        c={c.color}
        icon={c.name.charAt(0)}
        emoji={false}
        badge={
          <span
            style={{
              position: 'absolute',
              right: -4,
              bottom: -4,
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: `2px solid ${t.card}`,
              fontSize: 10,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              background: isMe ? t.main : PARTNER,
            }}
          >
            {qui.charAt(0)}
          </span>
        }
      />
      <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2}}>
        <span style={{fontSize: 14, fontWeight: 700}}>{op.nom}</span>
        <span style={{fontSize: 12, color: t.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {c.name} · {qui} · {op.date}
        </span>
      </div>
      <span style={{fontSize: 14, fontWeight: 800}}>−{eur(op.mt)}</span>
      <span style={{width: 28, color: t.hint, display: 'flex', justifyContent: 'center'}}>
        <Icon name="x" size={12} stroke={2.6} />
      </span>
    </div>
  );
};

/** Paramètres → Profil : saisie du code de synchro de Léa */
export const SettingsScreen: React.FC<{code: React.ReactNode; codeFocus?: number; enter?: (i: number) => number; backPress?: number}> = ({
  code,
  codeFocus = 0,
  enter = () => 1,
  backPress = 0,
}) => {
  const t = useT();
  const rows = [
    {ico: 'users', l: 'Prénom', v: USER},
    {ico: 'users', l: 'Ton nom (Couple)', v: USER},
    {ico: 'heart', l: 'Partenaire', v: PARTNER_NAME, pink: true},
    {ico: 'key', l: 'Code de sa synchro', v: code, pink: true, focus: true},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, padding: '30px 16px', background: t.bg}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, ...appear(enter(0), 10)}}>
        <span style={{transform: `scale(${1 - 0.08 * backPress})`}}>
          <RoundBtn>
            <Icon name="chevRight" size={20} stroke={2} style={{transform: 'rotate(180deg)'}} />
          </RoundBtn>
        </span>
        <span style={{fontSize: 16, fontWeight: 800}}>Paramètres</span>
        <span style={{width: 44}} />
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, background: t.card, border: `1px solid ${t.line}`, marginBottom: 22, ...appear(enter(1), 12)}}>
        <div style={{width: 56, height: 56, borderRadius: '50%', background: t.soft, color: t.softText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800}}>T</div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
          <span style={{fontSize: 17, fontWeight: 800}}>{USER}</span>
          <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>
            Code widget · <span style={{letterSpacing: '0.08em', color: t.text}}>TOM-4F2A</span>
          </span>
        </div>
        <span style={{height: 36, padding: '0 14px', borderRadius: 999, border: `1px solid ${t.line}`, background: t.bg, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center'}}>Copier</span>
      </div>
      <div style={{fontSize: 12, fontWeight: 700, color: t.muted, letterSpacing: '0.04em', margin: '0 6px 8px', ...appear(enter(2), 10)}}>PROFIL</div>
      <div style={{borderRadius: 20, background: t.card, border: `1px solid ${t.line}`, overflow: 'hidden', ...appear(enter(2), 14)}}>
        {rows.map((r, i) => (
          <div
            key={r.l}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              minHeight: 58,
              boxSizing: 'border-box',
              borderBottom: i < rows.length - 1 ? `1px solid ${t.line}` : 'none',
              background: r.focus && codeFocus > 0 ? tint(t, PARTNER, 6 * codeFocus, 12 * codeFocus) : undefined,
            }}
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: r.pink ? tint(t, PARTNER, 12, 22) : t.soft,
                color: r.pink ? PARTNER : t.softText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={r.ico} size={18} stroke={2} />
            </span>
            <span style={{flex: 1, fontSize: 14, fontWeight: 600}}>{r.l}</span>
            <span style={{fontSize: 14, fontWeight: r.focus ? 800 : 600, color: r.focus ? t.text : t.muted, letterSpacing: r.focus ? '0.08em' : 0}}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Écran Partenaire : budget de Léa en lecture seule */
export const PartnerScreen: React.FC<{enter?: (i: number) => number; counter?: number}> = ({enter = () => 1, counter = 1}) => {
  const t = useT();
  const cats = [
    {l: '🛒 Alimentation', r: 196.4, p: 220},
    {l: '🎉 Sorties', r: 74, p: 90},
    {l: '🏠 Loyer & charges', r: 640, p: 700},
    {l: '📱 Abonnements', r: 117.2, p: 160},
  ];
  return (
    <>
      <Scroll top={HEADER_H}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: '4px 4px 14px', ...appear(enter(0), 10)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 42, height: 42, borderRadius: '50%', background: tint(t, PARTNER, 12, 22), color: PARTNER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16}}>L</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 1}}>
              <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>Lecture seule</span>
              <span style={{fontSize: 17, fontWeight: 800}}>Budget de {PARTNER_NAME}</span>
            </div>
          </div>
          <span style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: t.card, border: `1px solid ${t.line}`, fontSize: 12, fontWeight: 700, color: t.muted}}>
            <span style={{width: 8, height: 8, borderRadius: '50%', background: '#0b7a53'}} />
            Màj 18:42
          </span>
        </div>
        <div style={appear(enter(1), 16, 0.97)}>
          <Hero
            color={PARTNER}
            label="Son solde du mois"
            amount={<>{num(612.4 * counter, 2)}&nbsp;€</>}
            sub={<>sur {num(1820, 2)}&nbsp;€ de revenus</>}
            stats={[
              {l: 'Dépensé', v: num(1027.6, 2) + ' €'},
              {l: 'Épargné', v: num(180, 2) + ' €'},
              {l: 'Coffre', v: num(950, 2) + ' €'},
            ]}
          />
        </div>
        <div style={appear(enter(2), 14)}>
          <Card>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <span style={{fontSize: 15, fontWeight: 800}}>Budget utilisé</span>
              <Muted>1&nbsp;028 € / 1&nbsp;250 €</Muted>
            </div>
            <div style={{height: 8, borderRadius: 999, background: t.track, overflow: 'hidden', margin: '12px 0 8px'}}>
              <div style={{height: '100%', width: `${82 * clamp(enter(2) * 1.3 - 0.3)}%`, background: PARTNER, borderRadius: 999}} />
            </div>
            <Muted>82 % du budget prévu</Muted>
          </Card>
        </div>
        <div style={appear(enter(3), 12)}>
          <SecHead title="Fin de mois" right={<Muted>{JOURS_RESTANTS} jours restants</Muted>} />
        </div>
        <div style={appear(enter(4), 14)}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>{PARTNER_NAME} peut dépenser</span>
            <div style={{fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1}}>
              32&nbsp;€ <small style={{fontSize: 15, fontWeight: 700, color: t.muted, letterSpacing: 0}}>/ jour</small>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${t.line}`}}>
              <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>{PARTNER_NAME} dépense en moyenne</span>
              <span style={{fontSize: 15, fontWeight: 800, color: t.success}}>21&nbsp;€ / jour</span>
            </div>
          </Card>
        </div>
        <div style={appear(enter(5), 12)}>
          <SecHead title="Par catégorie" />
        </div>
        <div style={appear(enter(6), 14)}>
          <Card style={{paddingTop: 4, paddingBottom: 4}}>
            {cats.map((c, i) => {
              const p = c.r / c.p;
              const warn = p >= 0.85;
              return (
                <div key={c.l} style={{padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 8, borderBottom: i < cats.length - 1 ? `1px solid ${t.line}` : 'none'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <span style={{fontSize: 14, fontWeight: 700}}>{c.l}</span>
                    <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>
                      <strong style={{color: t.text, fontWeight: 800}}>{num(c.r, 2)} €</strong> / {c.p} €
                    </span>
                  </div>
                  <div style={{height: 6, borderRadius: 999, background: t.track, overflow: 'hidden'}}>
                    <div style={{height: '100%', borderRadius: 999, width: `${p * 100 * clamp(enter(6) * 1.4 - 0.4)}%`, background: warn ? '#d97706' : PARTNER}} />
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

export {lerp};
