import React from 'react';
import {appear, clamp, lerp} from '../anim';
import {CATS, DEPENSE, NEW_OP, cat} from '../data';
import {num} from '../format';
import {cmix} from '../theme';
import {Icon} from '../components/Icons';
import {ALL, Card, Enter, Field, HEADER_H, Header, Muted, NavBar, OpRow, PrimaryBtn, Scroll, SecHead, Sheet, Switch, useT} from '../components/ui';
import {GroupedOps, SearchField, opRowProps} from './Home';

export const ExpenseScreen: React.FC<{
  enter?: Enter;
  amount?: {ch: string; p: number}[];
  amountFocus?: number;
  objet?: React.ReactNode;
  objetFocus?: number;
  catSel?: number;
  catPress?: number;
  recOn?: number;
  jourBox?: number;
  jourLabel?: string;
  jourPress?: number;
  submitPress?: number;
  scrollY?: number;
  newRow?: number;
  histEnter?: Enter;
}> = ({
  enter = ALL,
  amount = [],
  amountFocus = 0,
  objet,
  objetFocus = 0,
  catSel = 0,
  catPress = 0,
  recOn = 0,
  jourBox = 0,
  jourLabel = 'Choisir le jour',
  jourPress = 0,
  submitPress = 0,
  scrollY = 0,
  newRow = 0,
  histEnter = ALL,
}) => {
  const t = useT();
  const c0 = CATS[0];
  const c1 = cat('alim');
  const cur = catSel > 0.5 ? c1 : c0;
  const dot = catSel > 0 && catSel < 1 ? cmix(c1.color, catSel * 100, c0.color) : cur.color;
  const total = 80 + 27.5 * clamp(newRow * 3);
  return (
    <>
      <Scroll y={scrollY} top={HEADER_H}>
        <div style={appear(enter(0), 16)}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            <span style={{fontSize: 15, fontWeight: 800}}>Nouvelle dépense</span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '14px 0 18px',
                borderRadius: 18,
                background: t.soft,
                boxShadow: amountFocus > 0 ? `0 0 0 ${2 * amountFocus}px ${t.main}` : undefined,
                ...appear(enter(1), 14),
              }}
            >
              <span style={{fontSize: 12, fontWeight: 700, color: t.softText}}>Montant</span>
              <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6}}>
                <div style={{width: 170, height: 60, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em'}}>
                  {amount.length === 0 ? (
                    <span style={{color: t.hint}}>0,00</span>
                  ) : (
                    amount.map((a, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-block',
                          transform: `translateY(${(1 - a.p) * 18}px) scale(${lerp(1.35, 1, a.p)})`,
                          opacity: clamp(a.p * 2),
                          color: a.p < 0.6 ? t.main : t.text,
                        }}
                      >
                        {a.ch}
                      </span>
                    ))
                  )}
                  {amountFocus > 0.5 && <span style={{width: 3, height: 44, background: t.main, marginLeft: 2, borderRadius: 2}} />}
                </div>
                <b style={{fontSize: 28, fontWeight: 800, color: t.softText}}>€</b>
              </div>
            </div>
            <div style={appear(enter(2), 14)}>
              <Field label="Objet" focus={objetFocus}>
                {objet ?? <span style={{color: t.hint, fontWeight: 500}}>Ex : Courses Lidl</span>}
              </Field>
            </div>
            <div style={appear(enter(3), 14)}>
              <Field label="Catégorie" focus={catPress} style={{transform: `scale(${1 - 0.02 * catPress})`}}>
                <i style={{width: 10, height: 10, borderRadius: '50%', background: dot, flexShrink: 0}} />
                <span style={{flex: 1}}>
                  {cur.emoji} {cur.name}
                </span>
                <Icon name="chevDown" size={14} stroke={2.5} color={t.hint} />
              </Field>
            </div>
            <div style={appear(enter(4), 14)}>
              <Field label={<>Note <em style={{fontStyle: 'normal', fontWeight: 500, color: t.muted}}>(optionnel)</em></>}>
                <span style={{color: t.hint, fontWeight: 500}}>Ex : remboursement prévu</span>
              </Field>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 14,
                background: t.bg,
                border: `1px solid ${t.line}`,
                ...appear(enter(5), 14),
              }}
            >
              <span style={{display: 'flex', flexDirection: 'column', gap: 1}}>
                <strong style={{fontSize: 14, fontWeight: 700}}>🔄 Dépense récurrente</strong>
                <small style={{fontSize: 12, color: t.muted}}>Reportée automatiquement le mois suivant</small>
              </span>
              <Switch on={recOn} />
            </div>
            {jourBox > 0 && (
              <div style={{height: 115 * jourBox - 14 * (1 - jourBox), overflow: 'hidden', opacity: clamp(jourBox * 1.4)}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                  <span style={{fontSize: 13, fontWeight: 700}}>Jour du prélèvement</span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      height: 50,
                      padding: '0 14px',
                      borderRadius: 14,
                      border: `1px solid ${t.line}`,
                      background: t.bg,
                      fontSize: 15,
                      fontWeight: 600,
                      transform: `scale(${1 - 0.03 * jourPress})`,
                    }}
                  >
                    <Icon name="calendar" size={16} stroke={2} color={t.softText} />
                    <span>{jourLabel}</span>
                  </div>
                  <small style={{fontSize: 12, color: t.muted, fontWeight: 500, lineHeight: 1.45}}>
                    Tant que le jour n'est pas passé, la dépense est « à venir » et n'est pas encore déduite de ton solde.
                  </small>
                </div>
              </div>
            )}
            <div style={appear(enter(6), 14)}>
              <PrimaryBtn h={54} pressed={submitPress}>
                Ajouter la dépense
              </PrimaryBtn>
            </div>
          </Card>
        </div>
        <div style={appear(enter(7), 12)}>
          <SecHead
            title="Historique"
            right={
              <Muted>
                {8 + (newRow > 0.3 ? 1 : 0)} opérations · {num(DEPENSE)} € dépensés
              </Muted>
            }
          />
        </div>
        <div style={appear(enter(8), 14)}>
          <Card style={{paddingBottom: 6}}>
            <SearchField placeholder="Rechercher une dépense, une catégorie, une note…" />
            <GroupedOps
              enter={histEnter}
              maxGroups={3}
              avenirTotal={num(total, 2) + ' €'}
              extraAvenir={
                newRow > 0 ? (
                  <div style={{height: 63 * clamp(newRow * 1.6), overflow: 'visible'}}>
                    <div style={{opacity: clamp(newRow * 4), transform: `translateY(${(1 - newRow) * -60}px) scale(${lerp(1.08, 1, newRow)})`}}>
                      <OpRow {...opRowProps(NEW_OP)} style={{background: newRow < 1 ? undefined : undefined}} />
                    </div>
                  </div>
                ) : null
              }
            />
          </Card>
        </div>
      </Scroll>
      <Header />
      <NavBar active="none" />
    </>
  );
};

export const EXP_Y = {amount: 150, amountCenter: 210, objet: 276, catField: 382, rec: 540, recSwitch: 569, jourBtn: 652, submitNoJour: 640, submitJour: 769, hist: 830};

/** Liste des catégories (ouverture du sélecteur) */
export const CategorySheet: React.FC<{p: number; selected: number; pressIdx?: number; press?: number}> = ({p, selected, pressIdx = -1, press = 0}) => {
  const t = useT();
  return (
    <Sheet p={p}>
      <div style={{fontSize: 17, fontWeight: 800, margin: '0 4px 12px'}}>Catégorie</div>
      {CATS.map((c, i) => {
        const on = i === selected;
        return (
          <div
            key={c.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 54,
              padding: '0 14px',
              marginBottom: 6,
              borderRadius: 14,
              background: on ? t.soft : t.bg,
              border: `1px solid ${on ? t.main : t.line}`,
              transform: `scale(${i === pressIdx ? 1 - 0.03 * press : 1})`,
              ...appear(clamp(p * 1.6 - i * 0.12), 10),
            }}
          >
            <i style={{width: 12, height: 12, borderRadius: '50%', background: c.color}} />
            <span style={{flex: 1, fontSize: 15, fontWeight: 700}}>
              {c.emoji} {c.name}
            </span>
            {on && <Icon name="check" size={18} stroke={2.6} color={t.softText} />}
          </div>
        );
      })}
    </Sheet>
  );
};

/** Panneau « Jour du prélèvement » : grille 1 → 31 */
export const DaySheet: React.FC<{p: number; value: number | null; pickP?: number; gridEnter?: number; okPress?: number}> = ({
  p,
  value,
  pickP = 1,
  gridEnter = 1,
  okPress = 0,
}) => {
  const t = useT();
  const resume = value === null ? ['Déjà prélevée ce mois-ci', 'Déduite tout de suite, puis reportée chaque mois'] : [`Prélevée chaque mois le ${value === 1 ? '1er' : value}`, 'Déduite automatiquement ce jour-là'];
  return (
    <Sheet p={p} pad="10px 18px 24px">
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <span style={{fontSize: 18, fontWeight: 800}}>Jour du prélèvement</span>
          <span style={{fontSize: 13, color: t.muted, lineHeight: 1.45}}>
            Tant que ce jour n'est pas passé, la dépense reste « à venir » et n'est pas déduite de ton solde.
          </span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', gap: 6}}>
          {Array.from({length: 31}, (_, i) => i + 1).map((n) => {
            const on = n === value;
            const k = clamp(gridEnter * 2.2 - (n - 1) * 0.035);
            const fill = on ? pickP : 0;
            return (
              <div
                key={n}
                style={{
                  aspectRatio: '1',
                  borderRadius: 12,
                  border: `1px solid ${fill > 0.5 ? t.main : t.line}`,
                  background: fill > 0 ? cmix(t.main, fill * 100, t.card) : t.card,
                  color: fill > 0.5 ? '#fff' : t.text,
                  fontSize: 15,
                  fontWeight: fill > 0.5 ? 800 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: k,
                  transform: `scale(${lerp(0.6, 1, k) * (on ? 1 + Math.sin(Math.PI * clamp(pickP)) * 0.14 : 1)})`,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div
          style={{
            height: 46,
            borderRadius: 14,
            border: `1px solid ${value === null ? t.main : t.line}`,
            background: value === null ? t.main : t.card,
            color: value === null ? '#fff' : t.text,
            fontSize: 14,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Déjà prélevée
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: t.soft}}>
          <span style={{width: 36, height: 36, borderRadius: 10, background: t.card, color: t.softText, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="calendar" size={18} stroke={2} />
          </span>
          <span style={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <strong style={{fontSize: 14, fontWeight: 800, color: t.softText}}>{resume[0]}</strong>
            <small style={{fontSize: 12, color: t.muted, fontWeight: 600}}>{resume[1]}</small>
          </span>
        </div>
        <PrimaryBtn pressed={okPress}>Valider</PrimaryBtn>
      </div>
    </Sheet>
  );
};
