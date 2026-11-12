import React, {createContext, useContext} from 'react';
import {clamp, prog} from '../anim';
import {Cat, USER} from '../data';
import {SCREEN_H, SCREEN_W} from '../layout';
import {Theme, makeTheme, tint} from '../theme';
import {Icon} from './Icons';

export const ThemeCtx = createContext<Theme>(makeTheme());
export const useT = () => useContext(ThemeCtx);

/** Écran de l'appli (390 × 844, unités logiques) */
export const AppScreen: React.FC<{theme: Theme; children: React.ReactNode; style?: React.CSSProperties}> = ({theme, children, style}) => (
  <ThemeCtx.Provider value={theme}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: SCREEN_W,
        height: SCREEN_H,
        background: theme.bg,
        color: theme.text,
        fontFamily: 'Manrope',
        fontVariantNumeric: 'tabular-nums',
        WebkitFontSmoothing: 'antialiased',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  </ThemeCtx.Provider>
);

/** Contenu défilant sous l'en-tête */
export const Scroll: React.FC<{y?: number; top?: number; children: React.ReactNode}> = ({y = 0, top = 0, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, transform: `translateY(${-y}px)`, padding: '6px 16px 120px'}}>{children}</div>
);

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; pad?: number}> = ({children, style, pad = 16}) => {
  const t = useT();
  return (
    <div style={{background: t.card, border: `1px solid ${t.line}`, borderRadius: 20, padding: pad, marginBottom: 12, ...style}}>{children}</div>
  );
};

export const SecHead: React.FC<{title: string; right?: React.ReactNode; style?: React.CSSProperties}> = ({title, right, style}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '22px 4px 10px', ...style}}>
    <span style={{fontSize: 15, fontWeight: 800}}>{title}</span>
    {right}
  </div>
);

export const Muted: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => {
  const t = useT();
  return <span style={{fontSize: 12, color: t.muted, fontWeight: 600, ...style}}>{children}</span>;
};

export type PillKind = 'ok' | 'warn' | 'over' | 'done';
export const Pill: React.FC<{kind?: PillKind; children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({kind = 'ok', children, color, style}) => {
  const t = useT();
  const c = color ?? (kind === 'ok' ? t.success : kind === 'warn' ? t.warning : kind === 'over' ? t.danger : t.muted);
  const bg = kind === 'done' && !color ? t.track : tint(t, c, kind === 'warn' ? 14 : 12, 24);
  return (
    <span style={{fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap', background: bg, color: c, flexShrink: 0, ...style}}>
      {children}
    </span>
  );
};

export const Bar: React.FC<{value: number; color?: string; track?: string; h?: number; style?: React.CSSProperties}> = ({value, color, track, h = 8, style}) => {
  const t = useT();
  return (
    <div style={{height: h, borderRadius: 999, background: track ?? t.track, overflow: 'hidden', ...style}}>
      <div style={{height: '100%', width: `${clamp(value) * 100}%`, borderRadius: 999, background: color ?? t.main}} />
    </div>
  );
};

/** Anneau de progression SVG (strokeDasharray / strokeDashoffset) */
export const Ring: React.FC<{
  size: number;
  thick: number;
  value: number;
  color: string;
  track: string;
  children?: React.ReactNode;
  hole?: string;
  round?: boolean;
}> = ({size, thick, value, color, track, children, hole, round = false}) => {
  const r = (size - thick) / 2;
  const C = 2 * Math.PI * r;
  return (
    <div style={{position: 'relative', width: size, height: size, flexShrink: 0}}>
      <svg width={size} height={size} style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thick} />
        {value > 0.001 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={thick}
            strokeLinecap={round ? 'round' : 'butt'}
            strokeDasharray={`${C * clamp(value)} ${C}`}
          />
        )}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: thick,
          borderRadius: '50%',
          background: hole,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Pastille d'opération (icône 40 × 40) */
export const OpIco: React.FC<{c: string; icon: string; emoji?: boolean; size?: number; badge?: React.ReactNode; style?: React.CSSProperties}> = ({
  c,
  icon,
  emoji = true,
  size = 40,
  badge,
  style,
}) => {
  const t = useT();
  return (
    <span
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: size * 0.35,
        background: tint(t, c),
        color: t.mode === 'dark' ? undefined : c,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: emoji ? size * 0.45 : 14,
        fontWeight: 800,
        flexShrink: 0,
        ...style,
      }}
    >
      {icon}
      {badge}
    </span>
  );
};

export const OpRow: React.FC<{
  c: string;
  icon: string;
  emoji?: boolean;
  name: string;
  meta: string;
  amt: string;
  avenir?: boolean;
  pos?: boolean;
  last?: boolean;
  style?: React.CSSProperties;
  badge?: React.ReactNode;
  right?: React.ReactNode;
}> = ({c, icon, emoji = true, name, meta, amt, avenir, pos, last, style, badge, right}) => {
  const t = useT();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: last ? 'none' : `1px solid ${t.line}`, ...style}}>
      <OpIco c={c} icon={icon} emoji={emoji} badge={badge} />
      <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2}}>
        <span style={{fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{name}</span>
        <span style={{fontSize: 12, color: t.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{meta}</span>
      </div>
      <span style={{fontSize: 14, fontWeight: avenir ? 700 : 800, whiteSpace: 'nowrap', color: avenir ? t.muted : pos ? t.success : t.text}}>{amt}</span>
      {right}
    </div>
  );
};

export const DayHead: React.FC<{label: string; total: string; avenir?: boolean; style?: React.CSSProperties}> = ({label, total, avenir, style}) => {
  const t = useT();
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0 4px', fontSize: 12, fontWeight: 700, color: avenir ? t.softText : t.muted, ...style}}>
      <span>{label}</span>
      <span>{total}</span>
    </div>
  );
};

export const catOpProps = (c: Cat) => ({c: c.color, icon: c.emoji, emoji: true});

/** Interrupteur (switch) — progression 0 → 1 */
export const Switch: React.FC<{on: number}> = ({on}) => {
  const t = useT();
  return (
    <span style={{position: 'relative', display: 'inline-block', width: 52, height: 30, flexShrink: 0}}>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          background: on > 0.5 ? t.main : t.track,
          opacity: 1,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          background: t.main,
          opacity: on,
        }}
      />
      <span
        style={{
          position: 'absolute',
          width: 24,
          height: 24,
          left: 3,
          top: 3,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          transform: `translateX(${22 * on}px)`,
        }}
      />
    </span>
  );
};

/** Bouton clair / sombre de l'en-tête (☀️ / 🌙) — progression 0 (clair) → 1 (sombre) */
export const ThemeToggle: React.FC<{dark: number}> = ({dark}) => {
  const t = useT();
  return (
    <span
      style={{
        position: 'relative',
        width: 52,
        height: 28,
        borderRadius: 999,
        background: t.bg2,
        border: `2px solid ${t.line}`,
        flexShrink: 0,
        display: 'inline-block',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 1,
          left: 2,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'white',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${22 * dark}px)`,
        }}
      >
        {dark > 0.5 ? '🌙' : '☀️'}
      </span>
    </span>
  );
};

export const RoundBtn: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 44}) => {
  const t = useT();
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1px solid ${t.line}`,
        background: t.card,
        color: t.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
};

/** En-tête mobile : avatar, « Septembre 2026 », « Bonjour Tom », bascule de thème, paramètres */
export const Header: React.FC<{dark?: number; enter?: number; sub?: string; title?: string}> = ({dark = 0, enter = 1, sub = 'Septembre 2026', title = `Bonjour ${USER}`}) => {
  const t = useT();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 20,
        background: t.bg,
        padding: '30px 16px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: clamp(enter * 1.5),
        transform: `translateY(${(1 - enter) * -10}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: t.soft,
            color: t.softText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          {title.replace('Bonjour ', '').charAt(0)}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 1}}>
          <span style={{fontSize: 12, color: t.muted, fontWeight: 600}}>{sub}</span>
          <span style={{fontSize: 17, fontWeight: 800}}>{title}</span>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <ThemeToggle dark={dark} />
        <RoundBtn>
          <Icon name="gear" size={20} stroke={1.8} />
        </RoundBtn>
      </div>
    </div>
  );
};
export const HEADER_H = 94;

export type NavKey = 'tableau' | 'budget' | 'bilan' | 'archives' | 'none';
/** Barre de navigation : Accueil · Budget · + · Bilan · Archives */
export const NavBar: React.FC<{active: NavKey; fabPress?: number; fabScale?: number; enter?: number}> = ({active, fabPress = 0, fabScale = 1, enter = 1}) => {
  const t = useT();
  const items: {k: NavKey; icon: string; label: string}[] = [
    {k: 'tableau', icon: 'home', label: 'Accueil'},
    {k: 'budget', icon: 'budget', label: 'Budget'},
    {k: 'none', icon: 'plus', label: ''},
    {k: 'bilan', icon: 'bilan', label: 'Bilan'},
    {k: 'archives', icon: 'archives', label: 'Archives'},
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
        background: t.card,
        borderTop: `1px solid ${t.line}`,
        padding: '0 8px 16px',
        transform: `translateY(${(1 - enter) * 90}px)`,
      }}
    >
      <div style={{display: 'flex', height: 68, alignItems: 'center'}}>
        {items.map((it, i) =>
          it.icon === 'plus' ? (
            <div key={i} style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
              <span
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 20,
                  background: t.main,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${(1 - 0.08 * fabPress) * fabScale})`,
                }}
              >
                <Icon name="plus" size={26} stroke={2.2} />
              </span>
            </div>
          ) : (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                color: active === it.k ? t.softText : t.muted,
              }}
            >
              <Icon name={it.icon} size={22} />
              <span style={{fontSize: 11, fontWeight: active === it.k ? 800 : 600}}>{it.label}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

/** Notification (toast) en bas, au-dessus de la barre de navigation */
export const Toast: React.FC<{text: string; p: number; color?: string}> = ({text, p, color = '#0b7a53'}) =>
  p <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 96,
        zIndex: 120,
        background: color,
        color: '#fff',
        borderRadius: 14,
        padding: '10px 14px',
        fontSize: 13,
        fontWeight: 600,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        opacity: clamp(p * 1.5),
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <span>✅</span>
      <span>{text}</span>
    </div>
  );

/** Panneau qui monte du bas (feuille) avec voile */
export const Sheet: React.FC<{p: number; children: React.ReactNode; pad?: string}> = ({p, children, pad = '10px 16px 24px'}) => {
  const t = useT();
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 150}}>
      <div style={{position: 'absolute', inset: 0, background: `rgba(10,11,15,${0.45 * p})`}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: t.card,
          borderRadius: '24px 24px 0 0',
          padding: pad,
          transform: `translateY(${(1 - p) * 105}%)`,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{width: 40, height: 5, borderRadius: 999, background: t.track, margin: '0 auto 14px'}} />
        {children}
      </div>
    </div>
  );
};

export const PrimaryBtn: React.FC<{children: React.ReactNode; h?: number; color?: string; pressed?: number; style?: React.CSSProperties}> = ({
  children,
  h = 52,
  color,
  pressed = 0,
  style,
}) => {
  const t = useT();
  return (
    <div
      style={{
        height: h,
        borderRadius: 16,
        background: color ?? t.main,
        color: '#fff',
        fontSize: 15,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        transform: `scale(${1 - 0.04 * pressed})`,
        filter: pressed > 0 ? `brightness(${1 - 0.08 * pressed})` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Champ de saisie (style appli) */
export const Field: React.FC<{label?: React.ReactNode; children: React.ReactNode; h?: number; focus?: number; style?: React.CSSProperties; bg?: string}> = ({
  label,
  children,
  h = 50,
  focus = 0,
  style,
  bg,
}) => {
  const t = useT();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 6, ...style}}>
      {label && <span style={{fontSize: 13, fontWeight: 700}}>{label}</span>}
      <div
        style={{
          height: h,
          borderRadius: 14,
          border: `1px solid ${focus > 0.5 ? t.main : t.line}`,
          boxShadow: focus > 0 ? `0 0 0 3px ${tint(t, t.main, 16 * focus, 30 * focus)}` : undefined,
          background: bg ?? t.bg,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          fontSize: 15,
          fontWeight: 600,
          gap: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Texte tapé caractère par caractère avec curseur */
export const Typed: React.FC<{text: string; f: number; start: number; speed?: number; caret?: boolean; placeholder?: string}> = ({
  text,
  f,
  start,
  speed = 3,
  caret = true,
  placeholder,
}) => {
  const t = useT();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - start) / speed) + 1));
  const typing = f >= start && f < start + text.length * speed + 30;
  if (f < start && placeholder) return <span style={{color: t.hint, fontWeight: 500}}>{placeholder}</span>;
  return (
    <span>
      {f >= start ? text.slice(0, n) : ''}
      {caret && typing && <span style={{display: 'inline-block', width: 2, height: '1em', background: t.main, marginLeft: 1, verticalAlign: '-0.12em', opacity: Math.floor(f / 15) % 2 ? 0.2 : 1}} />}
    </span>
  );
};

/** Progression d'apparition par index (stagger) avec défaut « affiché » */
export type Enter = (i: number) => number;
export const ALL: Enter = () => 1;
export const enterFrom = (f: number, start: number, step = 4, dur = 26): Enter => (i) => prog(f, start + i * step, dur);

/**
 * Projecteur : floute et atténue tout l'écran sauf un rectangle arrondi (zone mise en avant).
 * Utilisé pendant les zooms caméra.
 */
export const Spotlight: React.FC<{x: number; y: number; w: number; h: number; r?: number; p: number}> = ({x, y, w, h, r = 20, p}) => {
  const t = useT();
  if (p <= 0.001) return null;
  const W = SCREEN_W;
  const H = SCREEN_H;
  const rr = Math.min(r, w / 2, h / 2);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'><rect width='${W}' height='${H}' fill='white'/><rect x='${x}' y='${y}' width='${w}' height='${h}' rx='${rr}' fill='black'/></svg>`;
  const mask = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: '100% 100%',
        maskMode: 'luminance',
        backdropFilter: `blur(${5 * p}px)`,
        background: t.mode === 'dark' ? `rgba(14,15,19,${0.55 * p})` : `rgba(242,243,246,${0.62 * p})`,
      } as React.CSSProperties}
    />
  );
};
