#!/usr/bin/env node
/* =============================================================================
 * Vérification des contrastes (WCAG 2.1, niveau AA).
 *
 *     node tools/verifier-contrastes.mjs
 *
 * POURQUOI
 * --------
 * Un élève qui distingue mal les couleurs, un vidéoprojecteur délavé, un
 * Chromebook au soleil : le contraste n'est pas un détail esthétique, c'est la
 * différence entre une information lue et une information perdue. Le bouton
 * d'aide — celui des élèves les plus perdus — était à 2,54:1. Il fallait 4,5.
 *
 * CE QUE CET OUTIL FAIT
 * ---------------------
 * Il lit les variables de `styles/styles.css` (:root) et vérifie une liste de
 * paires texte/fond DÉCLARÉE À LA MAIN ci-dessous. Si quelqu'un change une
 * couleur de la palette, la CI casse immédiatement.
 *
 * CE QUE CET OUTIL NE FAIT PAS — À LIRE
 * -------------------------------------
 * Il ne résout PAS la cascade CSS. Il ne découvre pas tout seul qu'un nouveau
 * sélecteur pose problème. Une paire non déclarée n'est pas vérifiée : elle est
 * simplement invisible pour lui.
 * => Quand tu ajoutes une règle qui pose du texte sur un fond, AJOUTE LA PAIRE.
 * Un validateur qui donne l'impression de tout couvrir sans le faire est pire
 * que pas de validateur du tout. (Cf. le validateur qui cherchait `f.coefficients`
 * au lieu de `f.coeffs` et ne vérifiait aucun coefficient.)
 * ========================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');

/* --- Seuils WCAG 2.1 ------------------------------------------------------ */
const AA_NORMAL = 4.5;  // texte courant
const AA_GRAND  = 3.0;  // ≥ 24px, ou ≥ 18,66px en gras (1.4.3)
const AA_UI     = 3.0;  // bordures, icônes, éléments d'interface (1.4.11)

/* --- Lecture de la palette dans :root ------------------------------------ */
const css = readFileSync(join(RACINE, 'styles', 'styles.css'), 'utf8');
const bloc = css.match(/:root\s*\{([^}]*)\}/);
if (!bloc) {
  console.error('✗ Bloc :root introuvable dans styles/styles.css.');
  process.exit(1);
}
const V = {};
for (const [, nom, val] of bloc[1].matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/g)) {
  V[nom] = val;
}
const BLANC = '#FFFFFF';

/* --- Lecture de la palette du PDF ----------------------------------------
 * jsPDF ne lit pas le CSS : scripts/pdf.js recopie la palette à la main, en
 * RVB. Les deux peuvent donc diverger en silence — et c'est arrivé : l'écran
 * affichait les nouvelles couleurs pendant que le PDF téléchargé gardait les
 * anciennes, dont le vert à 2,54:1. On les vérifie ici aussi.
 * ------------------------------------------------------------------------- */
const js = readFileSync(join(RACINE, 'scripts', 'pdf.js'), 'utf8');
const P = {};
for (const [, nom, r, g, b] of js.matchAll(/const\s+([A-Z_]+)\s*=\s*\[\s*(\d+),\s*(\d+),\s*(\d+)\s*\]/g)) {
  P[nom] = '#' + [r, g, b].map(n => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/* --- Calcul du ratio (formule officielle WCAG) ---------------------------- */
function luminance(hex) {
  const h = hex.replace('#', '');
  const plein = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4]
    .map(i => parseInt(plein.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// Calcule le ratio de contraste WCAG entre une couleur de texte et son fond.
function ratio(avant, arriere) {
  const a = luminance(avant), b = luminance(arriere);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/* --- Les paires à vérifier ------------------------------------------------
 * [ couleur du texte, couleur du fond, seuil, où ça se voit ]
 * Utiliser V.xxx pour les variables : elles suivront tout changement de palette.
 * ------------------------------------------------------------------------- */
const PAIRES = [
  // Corps de page
  [V.ink,          V.paper,        AA_NORMAL, 'texte courant sur le fond de page'],
  [V.ink,          V.paper2,       AA_NORMAL, 'texte dans les panneaux et bulles'],
  [V.muted,        V.paper,        AA_NORMAL, 'texte secondaire sur le fond de page'],
  [V.muted,        V.paper2,       AA_NORMAL, 'texte secondaire sur blanc'],
  [V.muted,        V.soft,         AA_NORMAL, 'codes vœux, aides discrètes (.gt-v-code)'],
  [V['muted-strong'], V.paper2,    AA_NORMAL, 'trajets, lycées, coefficients (.school-location)'],
  [V['muted-strong'], V.soft,      AA_NORMAL, 'notes de vœu (.gt-v-note)'],

  // Voie pro — le chatbot
  [V.brass,        V.paper2,       AA_NORMAL, 'bouton de choix (.optbtn, texte indigo sur blanc)'],
  [BLANC,          V.brass,        AA_NORMAL, 'bouton de choix survolé (.optbtn:hover)'],
  [BLANC,          V['brass-dark'],AA_NORMAL, 'bouton d\'envoi survolé (.composer .send:hover)'],
  [V.teal,         V.paper2,       AA_NORMAL, 'BOUTON D\'AIDE (.opt-help) — le plus important'],
  [BLANC,          V.teal,         AA_NORMAL, 'bouton d\'aide survolé (.opt-help:hover)'],
  [BLANC,          V.teal,         AA_NORMAL, 'micro en écoute (.iconbtn.listening)'],
  [V.teal,         V.paper2,       AA_NORMAL, 'liens du pied de page (.app-footer-minimal a)'],
  [V['brass-dark'],V.paper,        AA_NORMAL, 'renvoi vers le PsyEN (.psy-note)'],
  [BLANC,          V.ink,          AA_NORMAL, 'en-tête de la fiche (.card-top)'],
  [BLANC,          V.ink,          AA_NORMAL, 'boutons d\'export (.card-action-btn)'],

  // Voie 2GT — le comparateur
  [BLANC,          V.ink,          AA_NORMAL, 'en-tête du tableau (table.gt-table thead th)'],
  [V.brass,        V.paper2,       AA_NORMAL, 'critère présent, le point ● (.gt-yes)'],
  [V.muted,        V.paper2,       AA_NORMAL, 'critère absent, le tiret — (.gt-no)'],
  [V['brass-dark'],V['brass-soft'],AA_NORMAL, 'ligne cochée (.is-checked .gt-row-head)'],
  [V.brass,        V.paper2,       AA_NORMAL, 'puce de critère au repos (.gt-chip)'],
  [BLANC,          V.brass,        AA_NORMAL, 'puce de critère active (.gt-chip[aria-pressed])'],
  [BLANC,          V.brass,        AA_NORMAL, 'bouton principal (.gt-btn)'],
  [BLANC,          V.brass,        AA_NORMAL, 'badge du meilleur score (.gt-score-badge.is-top)'],
  [BLANC,          V.brass,        AA_NORMAL, 'onglet actif (.tab.is-active)'],
  [BLANC,          V.brass,        AA_NORMAL, 'numéro de vœu (ol.gt-voeux ::before)'],
  [V['muted-strong'], V.line,      AA_NORMAL, 'badge de score ordinaire (.gt-score-badge)'],

  // Encadrés d'alerte (littéraux assumés : palette ambre/rouge, hors :root)
  ['#6b4e00', '#fff3cd', AA_NORMAL, 'avertissement de formation (.formation-warning)'],
  ['#7A4A00', '#FFF6E5', AA_NORMAL, 'bandeau « hors famille de métiers »'],
  ['#92400E', '#FFFBEB', AA_NORMAL, 'trajet long, atouts du vœu (.gt-v-atouts)'],
  ['#92400E', '#FEF3C7', AA_NORMAL, 'encadré « un seul lycée » (.gt-unseul)'],
  ['#B45309', '#FEF3C7', AA_NORMAL, 'mention « sur dossier » (.gt-pass)'],
  ['#991B1B', '#FEF2F2', AA_NORMAL, 'dépassement des 10 vœux (.gt-compteur.is-trop)'],
  ['#065F46', '#ECFDF5', AA_NORMAL, 'étiquette « filet de sécurité » (.gt-tag-filet)'],

  // ---- PDF (scripts/pdf.js) — fond blanc, souvent imprimé, parfois en N&B ----
  [P.INK,   BLANC,     AA_NORMAL, 'PDF : texte courant'],
  [P.MUTED, BLANC,     AA_NORMAL, 'PDF : texte secondaire'],
  [P.MUTED, P.SOFT,    AA_NORMAL, 'PDF : texte secondaire sur bandeau clair'],
  [P.BRASS, BLANC,     AA_NORMAL, 'PDF : accents indigo'],
  [BLANC,   P.INK,     AA_NORMAL, 'PDF : titre en tête de page'],
  [BLANC,   P.BRASS,   AA_NORMAL, 'PDF : chiffre sur pastille de vœu'],
  [BLANC,   P.TEAL,    AA_NORMAL, 'PDF : chiffre sur pastille « filet de sécurité »'],
  [BLANC,   P.MUTED,   AA_NORMAL, 'PDF : chiffre sur pastille « complément »'],
  [P.ROUGE_SOMBRE, '#FCA5A5', AA_NORMAL, 'PDF : chiffre sur pastille « hors limite »'],
  [P.ROUGE, '#FEF2F2', AA_NORMAL, 'PDF : encadré de dépassement des 10 vœux'],
  [P.AMBRE, '#FEF3C7', AA_NORMAL, 'PDF : encadré d\'avertissement'],

  // ---- Cohérence écran ↔ PDF ------------------------------------------------
  // Pas un contraste : une égalité. Si elles divergent, l'élève voit une
  // couleur à l'écran et en imprime une autre.
  [P.BRASS, V.brass, 1, 'ÉGALITÉ écran/PDF : indigo primaire'],
  [P.TEAL,  V.teal,  1, 'ÉGALITÉ écran/PDF : vert de succès'],
  [P.MUTED, V.muted, 1, 'ÉGALITÉ écran/PDF : texte secondaire'],
  [P.INK,   V.ink,   1, 'ÉGALITÉ écran/PDF : encre'],

  // ---- Sections de la carte d'orientation ----------------------------------
  [V['brass-dark'], V['brass-soft'],  AA_NORMAL, 'carte : titre de famille de métiers'],
  [V['muted-strong'], V['brass-soft'], AA_NORMAL, 'carte : note de famille de métiers'],
  ['#92400E', '#FFFBEB', AA_NORMAL, 'carte : titre « bacs pro hors famille »'],
  ['#78350F', '#FFFBEB', AA_NORMAL, 'carte : note « bacs pro hors famille »'],
  [V.teal,   V['success-soft'], AA_NORMAL, 'carte : titre « CAP »'],
  ['#065F46', '#ECFDF5', AA_NORMAL, 'carte : note « CAP »'],

  // Bordures et éléments d'interface : seuil 3:1 (WCAG 1.4.11)
  [V.brass,        V.paper2,       AA_UI, 'bordure des boutons de choix'],
  [V.teal,         V['success-soft'], AA_UI, 'bordure du filet de sécurité'],
];

/* --- Contrôle ------------------------------------------------------------- */
let echecs = 0;
console.log('Contrastes — WCAG 2.1 AA\n');
for (const [avant, arriere, seuil, ou] of PAIRES) {
  if (!avant || !arriere) {
    console.error(`✗ Couleur non résolue pour « ${ou} » — variable :root manquante ?`);
    echecs++;
    continue;
  }
  // Seuil 1 : convention interne. On ne teste pas un contraste mais une ÉGALITÉ
  // (la même couleur des deux côtés). Le ratio d'une couleur avec elle-même
  // vaut exactement 1 ; s'il en diffère, c'est que les palettes ont divergé.
  const egalite = seuil === 1;
  const r = ratio(avant, arriere);
  const ok = egalite ? avant.toUpperCase() === arriere.toUpperCase() : r >= seuil;
  if (egalite) {
    if (!ok) {
      console.error(`✗ DIVERGENCE  ${avant} (pdf.js) ≠ ${arriere} (styles.css)  — ${ou}`);
      echecs++;
    } else if (process.env.VERBEUX) {
      console.log(`✓ identiques   ${avant}  — ${ou}`);
    }
    continue;
  }
  if (!ok) echecs++;
  const ligne = `${ok ? '✓' : '✗'} ${r.toFixed(2).padStart(5)}:1 (min ${seuil})  ${avant} sur ${arriere}  — ${ou}`;
  if (ok) { if (process.env.VERBEUX) console.log(ligne); }
  else console.error(ligne);
}

if (echecs) {
  console.error(`\n✗ ${echecs} contraste(s) insuffisant(s). Un élève ne pourra pas lire ça.`);
  process.exit(1);
}
console.log(`✓ ${PAIRES.length} paires vérifiées, toutes conformes.`);
console.log('  (VERBEUX=1 pour voir le détail.)');
console.log('\nRappel : seules les paires DÉCLARÉES dans ce fichier sont vérifiées.');
console.log('Nouvelle règle CSS avec du texte sur un fond ? Ajoute la paire.');
