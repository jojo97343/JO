import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {Music} from './components/Audio';
import {L169, L916, LayoutCtx} from './layout';
import {S01Probleme} from './scenes/S01Probleme';
import {S02Revelation} from './scenes/S02Revelation';
import {S03Accueil} from './scenes/S03Accueil';
import {S04Depense} from './scenes/S04Depense';
import {S05Bilan} from './scenes/S05Bilan';
import {S06Budget} from './scenes/S06Budget';
import {S07Archives} from './scenes/S07Archives';
import {S08Couple} from './scenes/S08Couple';
import {S09Vacances} from './scenes/S09Vacances';
import {S10Style} from './scenes/S10Style';
import {S11Final} from './scenes/S11Final';

// Découpage (60 fps, 120 BPM → un temps = 30 images ; toutes les coupes tombent sur un temps)
export const SCENES: {id: string; titre: string; dur: number; C: React.FC}[] = [
  {id: 's01', titre: 'Le problème', dur: 240, C: S01Probleme},
  {id: 's02', titre: 'Révélation', dur: 180, C: S02Revelation},
  {id: 's03', titre: 'Accueil', dur: 300, C: S03Accueil},
  {id: 's04', titre: 'Ajouter une dépense', dur: 420, C: S04Depense},
  {id: 's05', titre: 'Bilan', dur: 480, C: S05Bilan},
  {id: 's06', titre: 'Budget', dur: 300, C: S06Budget},
  {id: 's07', titre: 'Clôture et Archives', dur: 480, C: S07Archives},
  {id: 's08', titre: 'Couple et Partenaire', dur: 420, C: S08Couple},
  {id: 's09', titre: 'Vacances', dur: 300, C: S09Vacances},
  {id: 's10', titre: 'Ton style', dur: 180, C: S10Style},
  {id: 's11', titre: 'Final', dur: 300, C: S11Final},
];

export const TOTAL = 3600;

export const Main: React.FC<{format: 'portrait' | 'landscape'}> = ({format}) => (
  <LayoutCtx.Provider value={format === 'portrait' ? L916 : L169}>
    <AbsoluteFill style={{background: '#f2f3f6'}}>
      <Series>
        {SCENES.map((s) => (
          <Series.Sequence key={s.id} durationInFrames={s.dur} name={`${s.id} · ${s.titre}`}>
            <s.C />
          </Series.Sequence>
        ))}
      </Series>
      <Music />
    </AbsoluteFill>
  </LayoutCtx.Provider>
);
