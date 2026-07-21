import { Archivo, Fraunces } from 'next/font/google';

// Display : titres, prix, valeurs de cartel. Optical sizing actif, graisses 500–600.
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz']
});

// Texte courant et UI.
export const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo'
});
