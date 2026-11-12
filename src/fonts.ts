import {continueRender, delayRender, staticFile} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Manrope';

/**
 * Manrope 400 → 800.
 * Par défaut : @remotion/google-fonts/Manrope.
 * Rendu hors ligne (navigateur sans accès à Google Fonts) : lancer avec REMOTION_FONTS=local
 * pour utiliser la copie locale de public/fonts (Manrope, licence SIL OFL).
 */
const LOCAL = typeof process !== 'undefined' && process.env && process.env.REMOTION_FONTS === 'local';

if (LOCAL) {
  const handle = delayRender('Chargement de Manrope (local)');
  const faces = [
    {file: 'fonts/manrope-latin.woff2', range: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'},
    {file: 'fonts/manrope-latin-ext.woff2', range: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'},
  ];
  Promise.all(
    faces.map((f) => {
      const face = new FontFace('Manrope', `url(${staticFile(f.file)}) format('woff2')`, {weight: '200 800', unicodeRange: f.range});
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
} else {
  loadFont('normal', {weights: ['400', '500', '600', '700', '800'], subsets: ['latin', 'latin-ext']});
}
