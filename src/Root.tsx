import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Main, TOTAL} from './Main';
import {FPS} from './anim';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Format principal : 9:16, 60 fps, 60 s */}
    <Composition id="Pub9x16" component={Main} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{format: 'portrait' as const}} />
    {/* Variante 16:9 : téléphone à gauche, texte à droite */}
    <Composition id="Pub16x9" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{format: 'landscape' as const}} />
  </>
);
