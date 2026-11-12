// Formats français : 1 193 € · 27,50 € · 84 %
const NBSP = ' ';

export const num = (n: number, dec = 0) => {
  const s = Math.abs(n).toFixed(dec);
  const [i, d] = s.split('.');
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return (n < 0 ? '−' : '') + int + (d ? ',' + d : '');
};

/** Montant en euros ; décimales auto (0 si entier, sinon 2) */
export const eur = (n: number, dec?: number) => {
  const d = dec !== undefined ? dec : Math.abs(n % 1) > 0.004 ? 2 : 0;
  return num(n, d) + NBSP + '€';
};

/** Montant signé pour une ligne d'opération : −13,49 € */
export const opAmt = (n: number, sign: '−' | '+' = '−') => sign + num(n, 2) + NBSP + '€';

export const pct = (n: number) => Math.round(n) + NBSP + '%';
