/*
 * verifier-donnees.mjs — Contrôle de cohérence des bases de TrouveTaVoie.
 *
 * À lancer après CHAQUE mise à jour annuelle des données :
 *     node tools/verifier-donnees.mjs
 *
 * Ce script ne teste pas le code, il teste les DONNÉES — là où les erreurs sont
 * silencieuses et les conséquences réelles pour un élève : un code vœu erroné,
 * un critère qui ne pointe plus vers rien, un lycée sans temps de trajet, un
 * domaine devenu inatteignable par le quiz.
 *
 * Sort en code 1 si une erreur est trouvée (utilisable en intégration continue).
 */

import { readFileSync } from "node:fs";

const lire = (f) => readFileSync(new URL("../scripts/" + f, import.meta.url), "utf8");

// Les fichiers de l'application sont des scripts de navigateur (variables
// globales, pas de modules). On les évalue dans un contexte isolé.
const evaluer = (src, noms) => {
  const retour = "return {" + noms.map((n) => `${n}: typeof ${n} !== "undefined" ? ${n} : undefined`).join(", ") + "};";
  return new Function(src + "\n" + retour)();
};

let erreurs = 0;
let alertes = 0;
const KO = (m) => { erreurs++; console.log("  ✗ " + m); };
const WARN = (m) => { alertes++; console.log("  ! " + m); };
const OK = (m) => console.log("  ✓ " + m);

/* ====================================================================== */
console.log("\n── VOIE PROFESSIONNELLE ──");
const { DOMAINS } = evaluer(lire("bdd_pro.js"), ["DOMAINS"]);
const clesDom = Object.keys(DOMAINS);
OK(clesDom.length + " domaines");

let nbForm = 0;
let nbEtab = 0;
clesDom.forEach((k) => {
  const d = DOMAINS[k];
  if (!d.label) KO(`domaine "${k}" sans label`);
  if (!d.keywords || !d.keywords.length) WARN(`domaine "${k}" sans mots-clés`);
  if (!d.formations || !d.formations.length) { KO(`domaine "${k}" sans formation`); return; }

  d.formations.forEach((f) => {
    nbForm++;
    if (!f.nom) KO(`formation sans nom dans "${k}"`);
    if (f.coefficients && Object.keys(f.coefficients).length !== 7) {
      WARN(`"${f.nom}" : ${Object.keys(f.coefficients).length} coefficients au lieu de 7`);
    }
    if (!f.etablissements || !f.etablissements.length) { WARN(`"${f.nom}" : aucun établissement`); return; }
    f.etablissements.forEach((e) => {
      nbEtab++;
      if (!e.nom || !e.ville) KO(`établissement incomplet dans "${f.nom}"`);
    });
  });
});
OK(nbForm + " formations, " + nbEtab + " offres d'établissement");

/* ====================================================================== */
console.log("\n── QUIZ ──");
const { QUIZ_PRO } = evaluer(
  "const DOMAINS = " + JSON.stringify(DOMAINS) + ";\n" + lire("quiz_pro.js"),
  ["QUIZ_PRO"]
);
OK(QUIZ_PRO.length + " questions");

const atteints = new Set();
QUIZ_PRO.forEach((q) => {
  if (!q.question) KO(`question "${q.id}" sans intitulé`);
  if (!q.reponses || q.reponses.length < 2) KO(`question "${q.id}" : moins de 2 réponses`);
  (q.reponses || []).forEach((r) => {
    Object.keys(r.scores || {}).forEach((d) => {
      if (!DOMAINS[d]) KO(`quiz "${q.id}" : domaine inconnu "${d}"`);
      atteints.add(d);
    });
  });
});
const orphelins = clesDom.filter((d) => !atteints.has(d));
if (orphelins.length) KO("domaines INATTEIGNABLES par le quiz : " + orphelins.join(", "));
else OK("les " + clesDom.length + " domaines sont atteignables");

/* ====================================================================== */
console.log("\n── DICTIONNAIRE DU CHATBOT ──");
const { VOCABULAIRE } = evaluer(
  "const DOMAINS = " + JSON.stringify(DOMAINS) + ";\nfunction normalize(s){ return s; }\n" + lire("dico_chatbot.js"),
  ["VOCABULAIRE"]
);

Object.keys(VOCABULAIRE).forEach((d) => {
  if (!DOMAINS[d]) KO(`dictionnaire : domaine inconnu "${d}"`);
});
const sansVoc = clesDom.filter((d) => !VOCABULAIRE[d] || !VOCABULAIRE[d].length);
if (sansVoc.length) WARN("domaines sans vocabulaire d'élève : " + sansVoc.join(", "));
else OK("les " + clesDom.length + " domaines ont un vocabulaire");

// Un terme présent dans deux domaines rend la recherche ambiguë : à surveiller.
const provenance = {};
Object.entries(VOCABULAIRE).forEach(([d, mots]) => {
  mots.forEach((m) => { (provenance[m] = provenance[m] || []).push(d); });
});
const ambigus = Object.entries(provenance).filter(([, ds]) => ds.length > 1);
if (ambigus.length) {
  WARN(ambigus.length + " terme(s) partagé(s) par plusieurs domaines :");
  ambigus.slice(0, 10).forEach(([m, ds]) => console.log("      « " + m + " » → " + ds.join(", ")));
}

/* ====================================================================== */
console.log("\n── VOIE GÉNÉRALE ET TECHNOLOGIQUE ──");
const { LYCEES_2GT, CRITERES_2GT, CRITERES_SUR_PLACE, SERIES_TECHNO_2GT } =
  evaluer(lire("bdd_gt.js"), ["LYCEES_2GT", "CRITERES_2GT", "CRITERES_SUR_PLACE", "SERIES_TECHNO_2GT"]);

const idsLyc = Object.keys(LYCEES_2GT);
OK(idsLyc.length + " lycées de secteur");

const codes = new Set();
let nbVoeux = 0;
idsLyc.forEach((id) => {
  const l = LYCEES_2GT[id];
  if (!l.trajet || l.trajet.minutes == null || l.trajet.km == null) {
    KO(`${l.nom} : trajet non renseigné`);
  }
  if (!l.voeux.some((v) => v.categorie === "base")) {
    KO(`${l.nom} : aucun vœu « sans option » — le filet de sécurité serait impossible`);
  }
  l.voeux.forEach((v) => {
    nbVoeux++;
    if (!/^\d{8}$/.test(v.code)) KO(`${l.nom} : code vœu mal formé « ${v.code} »`);
    if (codes.has(v.code)) KO(`code vœu EN DOUBLE : ${v.code}`);
    codes.add(v.code);
    if (v.categorie !== "base" && (!v.criteres || !v.criteres.length)) {
      KO(`${l.nom} / ${v.libelle} : aucun identifiant de critère`);
    }
    (v.criteres || []).forEach((c) => {
      if (!CRITERES_2GT.some((x) => x.id === c)) KO(`critère inconnu « ${c} » sur le vœu ${v.code}`);
    });
  });
});
OK(nbVoeux + " vœux, tous les codes uniques et bien formés");

// Le point critique : un critère annoncé dans un lycée doit y trouver un vœu.
CRITERES_2GT.forEach((c) => {
  c.lycees.forEach((id) => {
    if (!LYCEES_2GT[id]) { KO(`critère « ${c.id} » : lycée inconnu "${id}"`); return; }
    const n = LYCEES_2GT[id].voeux.filter((v) => (v.criteres || []).includes(c.id)).length;
    if (n === 0) KO(`critère « ${c.id} » annoncé au ${LYCEES_2GT[id].nom}, mais AUCUN vœu ne le porte`);
  });
});
OK(CRITERES_2GT.length + " critères Affelnet vérifiés");

CRITERES_SUR_PLACE.forEach((c) => {
  c.lycees.forEach((id) => { if (!LYCEES_2GT[id]) KO(`atout « ${c.id} » : lycée inconnu "${id}"`); });
});
Object.entries(SERIES_TECHNO_2GT).forEach(([s, ls]) => {
  ls.forEach((id) => { if (!LYCEES_2GT[id]) KO(`série ${s} : lycée inconnu "${id}"`); });
});
OK(CRITERES_SUR_PLACE.length + " atouts et " + Object.keys(SERIES_TECHNO_2GT).length + " séries vérifiés");

/* ====================================================================== */
console.log("\n" + "─".repeat(52));
if (erreurs) {
  console.log(`✗ ${erreurs} erreur(s), ${alertes} alerte(s). À corriger avant déploiement.`);
  process.exit(1);
}
console.log(`✓ Aucune erreur. ${alertes} alerte(s) à examiner.`);
