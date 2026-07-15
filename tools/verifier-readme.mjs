#!/usr/bin/env node
/* =============================================================================
 * VÉRIFICATION DU README
 *
 *     node tools/verifier-readme.mjs
 *
 * POURQUOI
 * --------
 * Le README annonçait « 15 familles de métiers » (il y a 18 secteurs et 14
 * familles), « jsPDF 2.5.1 » (on est en 4.2.1), « la distance réelle » (c'est
 * une estimation), « Google Fonts, à internaliser » (c'est fait depuis
 * longtemps), et « jamais au clic » à propos des statistiques (faux : le
 * lancement du quiz part bien au clic).
 *
 * Aucune de ces erreurs n'était grave prise isolément. Ensemble, elles rendaient
 * le document intestable : un collègue qui le lit ne peut pas savoir ce qui est
 * encore vrai. Un README faux est pire qu'un README absent — il donne confiance.
 *
 * Ce contrôle relie donc les chiffres annoncés à ceux du code. Il ne vérifie pas
 * la prose : seulement ce qui est vérifiable.
 * ========================================================================== */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createContext, runInContext } from "node:vm";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(RACINE, f), "utf8");

let echecs = 0;
const OK = (m) => console.log("  \u2713 " + m);
const KO = (m) => { console.error("  \u2717 " + m); echecs++; };

const readme = lire("README.md");

/* --- Les chiffres réels, lus dans le code -------------------------------- */
const ctx = createContext({});
const DOMAINS = runInContext(lire("scripts/bdd_pro.js") + "\n;DOMAINS", ctx);

let bacsPro = 0, caps = 0, horsFamille = 0, offres = 0;
const lycees = new Set();
for (const cle in DOMAINS) {
  for (const f of DOMAINS[cle].formations) {
    if (f.niveau === "CAP") caps++; else bacsPro++;
    if (f.horsFamille) horsFamille++;
    for (const e of f.etablissements) { offres++; lycees.add(e.nom + "|" + e.ville); }
  }
}

const ctxGT = createContext({});
const LYCEES_2GT = runInContext(lire("scripts/bdd_gt.js") + "\n;LYCEES_2GT", ctxGT);
const CRITERES_2GT = runInContext("CRITERES_2GT", ctxGT);
let voeux = 0;
for (const cle in LYCEES_2GT) voeux += (LYCEES_2GT[cle].voeux || []).length;

const versionJsPDF = (lire("scripts/vendor/jspdf.umd.min.js").match(/"?4\.\d+\.\d+"?/) || [])[0];

const CHIFFRES = [
  [Object.keys(DOMAINS).length,                                 "secteurs"],
  [Object.values(DOMAINS).filter((d) => d.famille).length,      "familles représentées"],
  [bacsPro,      "bacs pro"],
  [caps,         "CAP"],
  [horsFamille,  "bacs pro hors famille"],
  [offres,       "offres de formation"],
  [lycees.size,  "lycées publics"],
  [Object.keys(LYCEES_2GT).length, "lycées de secteur (2GT)"],
  [voeux,        "codes vœux 2GT"],
  [CRITERES_2GT.length, "critères 2GT"],
];

console.log("README \u2014 les chiffres annonc\u00e9s correspondent-ils au code ?\n");
for (const [valeur, quoi] of CHIFFRES) {
  // Le nombre doit apparaître quelque part dans le README.
  if (new RegExp("\\b" + valeur + "\\b").test(readme)) {
    OK(quoi + " : " + valeur);
  } else {
    KO(quoi + " : le code en compte " + valeur + ", le README ne mentionne pas ce nombre.");
  }
}

/* --- Affirmations qui ont été fausses : elles ne doivent pas revenir ------ */
console.log("\n\u2500\u2500 AFFIRMATIONS INTERDITES \u2500\u2500");
const INTERDITS = [
  [/15 familles de m\u00e9tiers/i,  "« 15 familles de métiers » \u2014 il y a 18 secteurs et 14 familles"],
  [/jsPDF[^)\n]{0,20}2\.5\.1/i,     "« jsPDF 2.5.1 » \u2014 la version livrée est " + versionJsPDF],
  [/distance et (le )?temps de trajet r\u00e9els/i, "« distance réelle » \u2014 c'est du Haversine \u00d7 1,3, une estimation"],
  [/\u00e0 internaliser/i,          "« polices à internaliser » \u2014 c'est fait, elles sont locales"],
  [/jamais au clic/i,               "« jamais au clic » \u2014 faux : quiz_lance part bien au clic"],
];
let interdits = 0;
for (const [motif, explication] of INTERDITS) {
  if (motif.test(readme)) { KO("Affirmation fausse réintroduite : " + explication); interdits++; }
}
if (!interdits) OK("Aucune des cinq affirmations fausses corrigées n'est revenue");

/* --- La version de jsPDF annoncée doit être celle livrée ------------------ */
console.log("\n\u2500\u2500 VERSIONS \u2500\u2500");
if (!versionJsPDF) {
  KO("Impossible de lire la version de jsPDF dans scripts/vendor/.");
} else if (readme.indexOf(versionJsPDF.replace(/"/g, "")) === -1) {
  KO("Le README n'annonce pas jsPDF " + versionJsPDF + ", qui est pourtant la version livrée.");
} else {
  OK("jsPDF " + versionJsPDF.replace(/"/g, "") + " : version livrée = version annoncée");
}

/* --- Les fichiers cités dans l'arbre doivent exister ---------------------- */
console.log("\n\u2500\u2500 ARBRE D'ARCHITECTURE \u2500\u2500");
const CITES = [
  "index.html", "_headers", "styles/styles.css", "styles/2gt.css",
  "scripts/bdd_pro.js", "scripts/dico_chatbot.js", "scripts/quiz_pro.js",
  "scripts/app_pro.js", "scripts/bdd_gt.js", "scripts/app_gt.js",
  "scripts/export.js", "scripts/pdf.js", "scripts/tabs.js",
  "tools/verifier-donnees.mjs", "tools/verifier-coefficients.mjs",
  "tools/verifier-contrastes.mjs", "tools/test-pdf.mjs", "tools/test-parcours.mjs",
  ".github/workflows/verifier-donnees.yml",
];
let manquants = 0;
for (const f of CITES) {
  const nom = f.split("/").pop();
  if (readme.indexOf(nom) === -1) {
    KO("L'arbre du README ne cite pas " + f + ", qui existe pourtant.");
    manquants++;
  }
  try { lire(f); } catch (e) {
    KO("Le README cite " + f + ", qui n'existe pas dans le d\u00e9p\u00f4t.");
    manquants++;
  }
}
if (!manquants) OK(CITES.length + " fichiers : cit\u00e9s dans le README, et pr\u00e9sents dans le d\u00e9p\u00f4t");

console.log("\n" + "\u2500".repeat(52));
if (echecs) {
  console.error("\u2717 " + echecs + " incoh\u00e9rence(s). Un README faux est pire qu'un README absent.");
  process.exit(1);
}
console.log("\u2713 Le README dit la v\u00e9rit\u00e9.");
