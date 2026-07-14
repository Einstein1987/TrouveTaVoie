#!/usr/bin/env node
/* =============================================================================
 * TEST DU PDF
 *
 *     npm install jsdom      (une seule fois)
 *     node tools/test-pdf.mjs
 *
 * POURQUOI CE FICHIER EXISTE
 * --------------------------
 * Le PDF n'était testé par RIEN. `test-parcours.mjs` remplace jsPDF par un
 * bouchon qui lève une erreur — c'est volontaire, il teste le chatbot, pas le
 * PDF. Résultat : personne ne savait si la bibliothèque pouvait être mise à
 * jour, ni ce qui casserait. La 2.5.1 est restée en place par prudence, faute
 * de moyen de vérifier.
 *
 * Ce test charge la VRAIE bibliothèque, remplit une VRAIE fiche, produit un
 * VRAI PDF, et vérifie ce qu'il contient. C'est ce qui a permis la bascule
 * 2.5.1 → 4.2.1 : les deux versions produisaient un contenu rigoureusement
 * identique (seuls /Producer et l'horodatage diffèrent).
 *
 * Il couvre les DEUX chemins — la fiche d'orientation (voie pro) et la liste
 * de vœux (2GT) — parce qu'ils ne partagent pas le même code : l'un qui marche
 * ne prouve rien sur l'autre.
 * ========================================================================== */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(RACINE, f), "utf8");

let echecs = 0;
const OK = (m) => console.log("  \u2713 " + m);
const KO = (m) => { console.error("  \u2717 " + m); echecs++; };

/* -------------------------------------------------------------------------- */
/* Montage de l'application, avec la vraie bibliothèque jsPDF                  */
/* -------------------------------------------------------------------------- */
const dom = new JSDOM(lire("index.html"), { runScripts: "outside-only", pretendToBeVisual: true });
const { window } = dom;
const doc = window.document;
const erreurs = [];
window.addEventListener("error", (e) => erreurs.push(String(e.error || e.message)));

// API absentes de jsdom mais utilisées par l'application.
window.scrollTo = () => {};
window.fetch = () => Promise.resolve({ ok: true });
window.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [] };
window.SpeechSynthesisUtterance = function () {};
window.alert = () => {};
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
window.btoa = (s) => Buffer.from(s, "binary").toString("base64");
window.atob = (s) => Buffer.from(s, "base64").toString("binary");

// jsdom n'implémente pas innerText — or pdf.js s'en sert pour lire les lycées
// depuis la fiche. Sans ce complément, le test échouerait pour une mauvaise raison.
Object.defineProperty(window.HTMLElement.prototype, "innerText", {
  get() { return this.textContent.replace(/\u00a0/g, " "); },
  set(v) { this.textContent = v; },
});

console.log("\n\u2500\u2500 CHARGEMENT DE jsPDF \u2500\u2500");
try {
  window.eval(lire("scripts/vendor/jspdf.umd.min.js"));
} catch (e) {
  KO("jsPDF ne se charge pas : " + e.message);
  process.exit(1);
}
if (!window.jspdf || !window.jspdf.jsPDF) {
  KO("window.jspdf.jsPDF est absent — l'UMD ne s'expose plus de la même fa\u00e7on.");
  process.exit(1);
}
const version = window.jspdf.jsPDF.version || "inconnue";
OK("jsPDF " + version + " charg\u00e9 depuis scripts/vendor/ (aucun r\u00e9seau)");

// Tous les scripts partagent le même scope global : c'est le choix du projet
// (aucun build). Les charger séparément les isolerait et fausserait le test.
const FICHIERS = ["scripts/bdd_pro.js", "scripts/dico_chatbot.js", "scripts/quiz_pro.js",
                  "scripts/app_pro.js", "scripts/export.js", "scripts/bdd_gt.js",
                  "scripts/app_gt.js", "scripts/pdf.js", "scripts/tabs.js"];
try {
  window.eval(FICHIERS.map(lire).join("\n;\n"));
  window.eval("startMenu();");
  doc.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
} catch (e) {
  KO("Chargement de l'application : " + e.message);
  process.exit(1);
}
erreurs.length = 0;   // les grincements de jsdom au démarrage (canvas…) ne nous concernent pas

/* -------------------------------------------------------------------------- */
/* Interception de save() : on récupère les octets au lieu de télécharger       */
/* -------------------------------------------------------------------------- */
let octets = null;
let nomFichier = null;
window.jspdf.jsPDF.API.save = function (nom) {
  nomFichier = nom;
  octets = this.output("arraybuffer");
  return this;
};

const clic = (b) => b.dispatchEvent(new window.Event("click", { bubbles: true }));
const boutons = () => Array.from(doc.querySelectorAll("#chatlog .optbtn:not([disabled])"));

function genererPDF(quoi) {
  octets = null; nomFichier = null; erreurs.length = 0;
  try { window.telechargerPDF(); }
  catch (e) { KO(quoi + " : " + e.message); return null; }
  if (erreurs.length) { KO(quoi + " : " + erreurs[0]); return null; }
  if (!octets) { KO(quoi + " : aucun PDF produit (save() jamais appel\u00e9)"); return null; }
  return Buffer.from(octets);
}

const pagesDe = (buf) => (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

/* ==========================================================================
 * CHEMIN 1 — la fiche d'orientation (voie professionnelle)
 * ======================================================================== */
console.log("\n\u2500\u2500 PDF DE LA FICHE D'ORIENTATION \u2500\u2500");
{
  // On remplit la fiche comme le ferait un élève : domaine → recherche → oui.
  const menu = boutons();
  const domaine = menu.find((b) => /secteur/i.test(b.textContent));
  if (!domaine) {
    KO("Le bouton « secteur » est introuvable dans le menu");
  } else {
    clic(domaine);
    doc.getElementById("userInput").value = "electricite";
    clic(doc.getElementById("sendBtn"));
    const oui = boutons().filter((b) => /^Oui$/.test(b.textContent));
    if (oui.length) clic(oui[0]);

    const blocs = doc.querySelectorAll("#cardDetailsContainer .formation-block").length;
    if (!blocs) {
      KO("La fiche ne se remplit pas — impossible de tester le PDF");
    } else {
      OK("Fiche remplie : " + blocs + " bloc(s) de formation");

      const buf = genererPDF("PDF de la fiche");
      if (buf) {
        if (buf.slice(0, 5).toString() !== "%PDF-") KO("Le fichier produit n'est pas un PDF");
        else OK("PDF valide : " + buf.length + " octets, " + pagesDe(buf) + " page(s)");

        if (!/^mon-projet-orientation-\d{4}-\d{2}-\d{2}\.pdf$/.test(nomFichier || "")) {
          KO("Nom de fichier inattendu : " + nomFichier);
        } else {
          OK("Nom du fichier : " + nomFichier);
        }

        // Le contenu doit vraiment contenir ce qu'on a demandé. Un PDF de 4 pages
        // parfaitement vide passerait les contrôles ci-dessus.
        const brut = buf.toString("latin1");
        if (buf.length < 5000) KO("PDF suspicieusement petit : " + buf.length + " octets");
        else OK("Le PDF a une taille plausible (contenu non vide)");
        if (!/\/Producer\s*\(jsPDF/.test(brut)) KO("Le PDF ne semble pas produit par jsPDF");
        else OK("Produit par jsPDF " + (brut.match(/\/Producer \(jsPDF ([\d.]+)\)/) || [])[1]);

        // Les TROIS SECTIONS doivent survivre à l'export. Le PDF est ce que
        // l'élève imprime et montre à ses parents : s'il n'y retrouve pas la
        // distinction famille / hors famille / CAP, il perd exactement ce que
        // la carte lui apprenait. (jsPDF n'encode pas les flux de texte : les
        // chaînes sont lisibles telles quelles dans le fichier.)
        const attendus = [
          ["Métiers des transitions numérique et énergétique", "titre de la famille de métiers"],
          ["seconde commune", "l'explication de la seconde commune"],
          ["hors famille",    "la section « bacs pro hors famille »"],
          ["CAP",             "la section « CAP »"],
        ];
        attendus.forEach(function (a) {
          if (brut.indexOf(a[0]) === -1) KO("Le PDF ne contient pas " + a[1] + " (« " + a[0] + " »)");
          else OK("Le PDF contient " + a[1]);
        });
      }
    }
  }
}

/* ==========================================================================
 * CHEMIN 2 — la liste de vœux (2GT)
 *
 * Code entièrement distinct de celui de la fiche : un PDF pro qui marche ne
 * prouve rien sur celui-ci.
 * ======================================================================== */
console.log("\n\u2500\u2500 PDF DE LA LISTE DE V\u0152UX (2GT) \u2500\u2500");
{
  const onglet = doc.getElementById("tab-2gt");
  if (!onglet) {
    KO("L'onglet 2GT est introuvable");
  } else {
    clic(onglet);
    const chips = Array.from(doc.querySelectorAll("#vue-2gt .gt-chip")).slice(0, 2);
    if (!chips.length) {
      KO("Aucun crit\u00e8re \u00e0 cocher dans l'onglet 2GT");
    } else {
      chips.forEach(clic);
      OK(chips.length + " crit\u00e8re(s) coch\u00e9(s)");

      const buf = genererPDF("PDF 2GT");
      if (buf) {
        if (buf.slice(0, 5).toString() !== "%PDF-") KO("Le fichier produit n'est pas un PDF");
        else OK("PDF valide : " + buf.length + " octets, " + pagesDe(buf) + " page(s)");

        if (!/^mes-voeux-2GT-\d{4}-\d{2}-\d{2}\.pdf$/.test(nomFichier || "")) {
          KO("Nom de fichier inattendu : " + nomFichier);
        } else {
          OK("Nom du fichier : " + nomFichier);
        }
        if (buf.length < 3000) KO("PDF suspicieusement petit : " + buf.length + " octets");
        else OK("Le PDF a une taille plausible (contenu non vide)");
      }
    }
  }
}

/* ==========================================================================
 * GARDE-FOU : les API vulnérables ne doivent pas réapparaître.
 *
 * La ReDoS de jsPDF concernait addImage() et html(). L'application n'y touche
 * pas — elle ne dessine que du texte et des formes. Si quelqu'un les introduit
 * un jour, il faut qu'il le fasse en connaissance de cause.
 * ======================================================================== */
console.log("\n\u2500\u2500 SURFACE D'EXPOSITION \u2500\u2500");
{
  const src = lire("scripts/pdf.js");
  const risquees = ["addImage", "addSvgAsImage", ".html("];
  const trouvees = risquees.filter((f) => src.indexOf(f) !== -1);
  if (trouvees.length) {
    KO("pdf.js utilise d\u00e9sormais : " + trouvees.join(", ") +
       " \u2014 v\u00e9rifie les avis de s\u00e9curit\u00e9 de jsPDF avant de continuer.");
  } else {
    OK("pdf.js ne dessine que du texte et des formes (ni addImage, ni html)");
  }
}

/* -------------------------------------------------------------------------- */
console.log("\n" + "\u2500".repeat(52));
if (echecs) {
  console.error("\u2717 " + echecs + " test(s) en \u00e9chec.");
  process.exit(1);
}
console.log("\u2713 Le PDF est produit correctement, sur les deux chemins.");
