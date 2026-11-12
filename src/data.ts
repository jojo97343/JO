// Données fictives cohérentes dans tout le film.
// Aujourd'hui (dans l'appli) : samedi 5 septembre 2026, jour de paie le 25 → 19 jours restants.

export const USER = 'Tom';
export const PARTNER_NAME = 'Léa';
export const MONTH = 'Septembre 2026';

export const REVENUS = 1950;
export const SALAIRE = 1750;
export const CAF = 200;
export const BUDGET = 1413;
export const DEPENSE = 1193;
export const EPARGNE = 240;
export const SOLDE = 517;
export const A_VENIR = 80;
export const JOURS_RESTANTS = 19;
export const PAR_JOUR = 23; // (517 − 80) / 19
export const RYTHME = 18;

export interface Cat {
  id: string;
  emoji: string;
  name: string;
  color: string;
  prevu: number;
  reel: number;
}

export const CATS: Cat[] = [
  {id: 'loyer', emoji: '🏠', name: 'Loyer & charges', color: '#4f46e5', prevu: 800, reel: 730},
  {id: 'abo', emoji: '📱', name: 'Abonnements', color: '#0e7490', prevu: 240, reel: 233},
  {id: 'alim', emoji: '🛒', name: 'Alimentation', color: '#d97706', prevu: 200, reel: 215},
  {id: 'sorties', emoji: '🎉', name: 'Sorties', color: '#be185d', prevu: 100, reel: 15},
  {id: 'epargne', emoji: '💰', name: 'Épargne', color: '#047857', prevu: 240, reel: 240},
];
export const cat = (id: string) => CATS.find((c) => c.id === id)!;
export const PLANIFIE = CATS.reduce((s, c) => s + c.prevu, 0); // 1 580

export interface Op {
  desc: string;
  mt: number;
  ct: string;
  rec?: boolean;
  meta?: string; // préfixe « Prélevé le 05/09 · »
  avenir?: boolean;
}
export interface Group {
  label: string;
  total: string;
  avenir?: boolean;
  ops: Op[];
}

export const GROUPS: Group[] = [
  {
    label: 'À venir ce mois-ci',
    total: '80,00 €',
    avenir: true,
    ops: [{desc: 'EDF', mt: 80, ct: 'loyer', rec: true, meta: 'Sera prélevé le 06/09 · ', avenir: true}],
  },
  {
    label: "Aujourd'hui",
    total: '−658,60 €',
    ops: [
      {desc: 'Loyer', mt: 650, ct: 'loyer', rec: true, meta: 'Prélevé le 05/09 · '},
      {desc: 'Boulangerie', mt: 8.6, ct: 'alim'},
    ],
  },
  {
    label: 'Hier',
    total: '−77,40 €',
    ops: [
      {desc: 'Carrefour', mt: 62.4, ct: 'alim'},
      {desc: 'Cinéma', mt: 15, ct: 'sorties'},
    ],
  },
  {
    label: 'Jeudi 3 septembre',
    total: '−167,29 €',
    ops: [
      {desc: 'Navigo', mt: 88.8, ct: 'abo'},
      {desc: 'Netflix', mt: 13.49, ct: 'abo', rec: true},
      {desc: 'Lidl', mt: 65, ct: 'alim'},
    ],
  },
];

/** Nouvelle dépense saisie dans la scène 4 */
export const NEW_OP: Op = {
  desc: 'Panier de légumes',
  mt: 27.5,
  ct: 'alim',
  rec: true,
  meta: 'Sera prélevé le 06/09 · ',
  avenir: true,
};

/** Détail Alimentation (Bilan) — total effectif 215,00 € */
export const ALIM_DEPS = [
  {desc: 'Panier de légumes 🔄', meta: 'Sera prélevé le 06/09', mt: 27.5},
  {desc: 'Boulangerie', meta: '05/09/2026', mt: 8.6},
  {desc: 'Carrefour', meta: '04/09/2026', mt: 62.4},
  {desc: 'Lidl', meta: '03/09/2026', mt: 65},
  {desc: 'Marché', meta: '01/09/2026', mt: 41.2},
  {desc: 'Monoprix', meta: '28/08/2026', mt: 37.8},
];

export const PREVISIONS = [
  {desc: 'Assurance auto', ct: 'loyer', mt: 46},
  {desc: 'Anniversaire de Léa', ct: 'sorties', mt: 60},
];

// ── Archives (avril → septembre) ───────────────────────────
export interface Arc {
  nom: string;
  court: string;
  dep: number;
  ep: number;
  alim: number;
  budget: number;
}
export const ARCHIVES: Arc[] = [
  {nom: 'Avril 2026', court: 'Avril', dep: 1180, ep: 240, alim: 185, budget: 1380},
  {nom: 'Mai 2026', court: 'Mai', dep: 1320, ep: 240, alim: 210, budget: 1380},
  {nom: 'Juin 2026', court: 'Juin', dep: 1450, ep: 150, alim: 245, budget: 1400},
  {nom: 'Juillet 2026', court: 'Juil.', dep: 1090, ep: 300, alim: 170, budget: 1400},
  {nom: 'Août 2026', court: 'Août', dep: 1240, ep: 240, alim: 195, budget: 1413},
  {nom: 'Septembre 2026', court: 'Sept.', dep: 1193, ep: 240, alim: 215, budget: 1413},
];

// ── Couple ─────────────────────────────────────────────────
export const COUPLE_CATS = [
  {id: 'sorties', name: 'Sorties / Loisirs', budget: 100, dep: 42, color: '#d97706'},
  {id: 'resto', name: 'Restaurants', budget: 80, dep: 68, color: '#be185d'},
  {id: 'vacances', name: 'Vacances', budget: 200, dep: 120, color: '#0e7490'},
  {id: 'courses', name: 'Courses communes', budget: 60, dep: 0, color: '#047857'},
];
export const COUPLE_OPS = [
  {nom: 'Billets de train', cat: 'vacances', qui: 'T', mt: 120, date: '04/09/2026'},
  {nom: 'Pizzeria', cat: 'resto', qui: 'L', mt: 46, date: '03/09/2026'},
  {nom: 'Bowling', cat: 'sorties', qui: 'L', mt: 18, date: '02/09/2026'},
];
export const COUPLE_NEW = {nom: 'Courses', cat: 'courses', qui: 'L', mt: 54, date: '05/09/2026'};

// ── Vacances ───────────────────────────────────────────────
export const VAC = {
  nom: 'Tokyo',
  budget: 1500,
  depAvant: 336.1,
  nbAvant: 12,
  jour: 4,
  yen: 4500,
  eurConv: 27.9,
  taux: '161,29',
};
export const VAC_CATS = [
  {emoji: '🏨', name: 'Hébergement', color: '#4f46e5', mt: 180},
  {emoji: '🍽️', name: 'Restaurants', color: '#d97706', mt: 95.4},
  {emoji: '✈️', name: 'Transport', color: '#0e7490', mt: 58.6},
  {emoji: '🎡', name: 'Activités', color: '#047857', mt: 30},
];
