import React from 'react';
import {appear, clamp} from '../anim';
import {CAF, CATS, PLANIFIE, PREVISIONS, REVENUS, SALAIRE, cat} from '../data';
import {num} from '../format';
import {tint} from '../theme';
import {Icon} from '../components/Icons';
import {ALL, Card, Enter, HEADER_H, Header, Muted, NavBar, PrimaryBtn, Scroll, SecHead, useT} from '../components/ui';
import {Hero} from './Home';

export const BudgetScreen: React.FC<{
  enter?: Enter;
  revenu?: number;
  stack?: (i: number) => number;
  rowEnter?: Enter;
  prevEnter?: Enter;
  scrollY?: number;
}> = ({enter = ALL, revenu = 1, stack = () => 1, rowEnter = ALL, prevEnter = ALL, scrollY = 0}) => {
  const t = useT();
  const reste = REVENUS - PLANIFIE;
  const totalStack = CATS.reduce((s, c, i) => s + c.prevu * stack(i), 0);
  return (
    <>
      <Scroll y={scrollY} top={HEADER_H}>
        <div style={appear(enter(0), 18, 0.97)}>
          <Hero
            label="Revenus du mois"
            amount={<>{num(Math.round(REVENUS * revenu))}&nbsp;€</>}
            sub={null}
            stats={[]}
            style={{gap: 4}}
            extra={
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8, marginTop: 12}}>
                {[
                  {l: 'Salaire', v: SALAIRE},
                  {l: 'CAF / aides', v: CAF},
                ].map((s) => (
                  <div key={s.l} style={{display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.14)'}}>
                    <span style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)'}}>{s.l}</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 17, fontWeight: 800}}>
                      {num(s.v)} <b style={{fontSize: 14, fontWeight: 700}}>€</b>
                    </span>
                  </div>
                ))}
              </div>
            }
          />
        </div>
        <div style={appear(enter(1), 14)}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div>
                <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>Reste à répartir</span>
                <div style={{fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: t.success, lineHeight: 1.2}}>
                  {num(Math.round(REVENUS - totalStack))}&nbsp;€
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>Planifié</span>
                <div style={{fontSize: 16, fontWeight: 800, marginTop: 2}}>{num(Math.round(totalStack))}&nbsp;€</div>
              </div>
            </div>
            <div style={{display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', gap: 2, background: t.track}}>
              {CATS.map((c, i) => (
                <div key={c.id} style={{height: '100%', width: `${((c.prevu * stack(i)) / REVENUS) * 100}%`, background: c.color}} />
              ))}
            </div>
            <Muted>{Math.round((totalStack / REVENUS) * 100)} % de tes revenus sont attribués à une catégorie</Muted>
          </Card>
        </div>
        <div style={appear(enter(2), 12)}>
          <SecHead title="Limites par catégorie" right={<Muted>{CATS.length} catégories</Muted>} />
        </div>
        <div style={appear(enter(3), 14)}>
          <Card style={{paddingTop: 4, paddingBottom: 14}}>
            {CATS.map((c, i) => (
              <div key={c.id} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${t.line}`, ...appear(rowEnter(i), 14)}}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    border: `2px solid ${c.color}`,
                    background: tint(t, c.color, 10, 10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {c.emoji}
                </div>
                <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2}}>
                  <span style={{fontSize: 14, fontWeight: 800}}>{c.name}</span>
                  <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>{Math.round((c.prevu / REVENUS) * 100)} % des revenus</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4, height: 40, padding: '0 12px', borderRadius: 12, background: t.bg, border: `1px solid ${t.line}`}}>
                  <span style={{width: 56, textAlign: 'right', fontSize: 15, fontWeight: 800}}>{c.prevu}</span>
                  <b style={{fontSize: 13, fontWeight: 700, color: t.muted}}>€</b>
                </div>
                <span style={{width: 32, display: 'flex', justifyContent: 'center', color: t.hint}}>
                  <Icon name="trash" size={16} stroke={2} />
                </span>
              </div>
            ))}
            <div style={{display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12}}>
              <div style={{flex: 1, height: 44, borderRadius: 14, border: `1px dashed ${t.hint}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15, color: t.hint, fontWeight: 500}}>
                Nouvelle catégorie…
              </div>
              <span style={{width: 44, height: 44, borderRadius: 12, background: t.main, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name="plus" size={20} stroke={2.4} />
              </span>
            </div>
          </Card>
        </div>
        <div style={appear(enter(4), 12)}>
          <SecHead title="Prévu le mois prochain" right={<Muted>Total {num(PREVISIONS.reduce((s, p) => s + p.mt, 0))} €</Muted>} />
        </div>
        <div style={appear(enter(5), 14)}>
          <Card style={{paddingTop: 4, paddingBottom: 14}}>
            {PREVISIONS.map((p, i) => {
              const c = cat(p.ct);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${t.line}`, ...appear(prevEnter(i), 14)}}>
                  <span style={{width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0}} />
                  <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2}}>
                    <span style={{fontSize: 14, fontWeight: 700}}>{p.desc}</span>
                    <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>
                      {c.emoji} {c.name}
                    </span>
                  </div>
                  <strong style={{fontSize: 14, fontWeight: 800}}>{p.mt} €</strong>
                  <span style={{width: 34, height: 34, borderRadius: 10, background: tint(t, t.success, 12, 12), color: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="check" size={16} stroke={2.6} />
                  </span>
                  <span style={{width: 34, height: 34, borderRadius: 10, background: t.track, color: t.muted, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="x" size={14} stroke={2.6} />
                  </span>
                </div>
              );
            })}
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, ...appear(prevEnter(2), 14)}}>
              <div style={{display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 8}}>
                <div style={{height: 46, borderRadius: 14, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', padding: '0 12px', color: t.hint, fontSize: 14}}>Ex : Assurance</div>
                <div style={{height: 46, borderRadius: 14, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', padding: '0 12px', color: t.hint, fontSize: 14}}>0 €</div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 8}}>
                <div style={{height: 46, borderRadius: 14, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 14, fontWeight: 600}}>
                  🏠 Loyer & charges
                </div>
                <PrimaryBtn h={46} style={{padding: '0 18px', fontSize: 14}}>
                  Ajouter
                </PrimaryBtn>
              </div>
            </div>
            <p style={{fontSize: 12, color: t.muted, fontWeight: 500, lineHeight: 1.5, margin: '12px 2px 0', opacity: clamp(prevEnter(3))}}>
              Ces dépenses sont conservées automatiquement à la clôture du mois.
            </p>
          </Card>
        </div>
      </Scroll>
      <Header />
      <NavBar active="budget" />
    </>
  );
};
