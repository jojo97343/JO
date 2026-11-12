import React from 'react';
import {Audio, Sequence, getStaticFiles, interpolate, staticFile, useVideoConfig} from 'remotion';

/** Volume de la musique (0 → 1) */
export const MUSIC_VOLUME = 0.8;
/** Volume des bruitages (0 → 1) */
export const SFX_VOLUME = 0.55;

export type SfxName = 'tap' | 'whoosh' | 'pop';

const exists = (path: string) => {
  try {
    return getStaticFiles().some((f) => f.name === path);
  } catch {
    return false;
  }
};

/** Musique optionnelle : public/music.mp3 (la vidéo se rend sans elle) */
export const Music: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  if (!exists('music.mp3')) return null;
  return (
    <Audio
      src={staticFile('music.mp3')}
      volume={(f) =>
        MUSIC_VOLUME *
        interpolate(f, [0, 20, durationInFrames - 50, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};

/** Bruitage optionnel déclenché à l'image `at` (relative à la séquence courante) */
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number}> = ({at, name, volume = 1}) => {
  const file = `sfx/${name}.mp3`;
  if (!exists(file)) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none">
      <Audio src={staticFile(file)} volume={SFX_VOLUME * volume} />
    </Sequence>
  );
};
