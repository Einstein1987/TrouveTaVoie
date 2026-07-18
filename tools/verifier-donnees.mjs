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

// Un « ✓ rassurant » juste après une croix rouge serait trompeur.
// On mémorise le nombre d'erreurs au début d'un bloc, et OK() ne s'affiche que
// si rien n'a échoué entre-temps.
let jalon = 0;
const debutBloc = () => { jalon = erreurs; };
const OK = (m) => {
  if (erreurs > jalon) console.log("  ✗ " + m + " → CONTRÔLE ÉCHOUÉ, voir ci-dessus");
  else console.log("  ✓ " + m);
  jalon = erreurs;
};

/* ====================================================================== */
console.log("\n── VOIE PROFESSIONNELLE ──");
const { DOMAINS } = evaluer(lire("bdd_pro.js"), ["DOMAINS"]);
const clesDom = Object.keys(DOMAINS);
OK(clesDom.length + " domaines");

// Les coefficients Affelnet existent à DEUX niveaux : sur le domaine (valeur par
// défaut) et sur chaque formation. Les deux doivent être contrôlés : sept entiers.
const verifierCoeffs = (coeffs, ou) => {
  if (!Array.isArray(coeffs)) { KO(`${ou} : aucun tableau de coefficients (coeffs)`); return; }
  if (coeffs.length !== 7)    { KO(`${ou} : ${coeffs.length} coefficients au lieu de 7`); return; }
  coeffs.forEach((c, i) => {
    if (!Number.isInteger(c) || c < 1 || c > 20) KO(`${ou} : coefficient n°${i + 1} invalide (${c})`);
  });
};

let nbForm = 0;
let nbEtab = 0;
let nbCoeffs = 0;
clesDom.forEach((k) => {
  const d = DOMAINS[k];
  if (!d.label) KO(`domaine "${k}" sans label`);
  if (!d.keywords || !d.keywords.length) WARN(`domaine "${k}" sans mots-clés`);
  if (d.coeffs) { verifierCoeffs(d.coeffs, `domaine "${k}"`); nbCoeffs++; }
  if (!d.formations || !d.formations.length) { KO(`domaine "${k}" sans formation`); return; }

  d.formations.forEach((f) => {
    nbForm++;
    if (!f.nom) KO(`formation sans nom dans "${k}"`);
    verifierCoeffs(f.coeffs, `"${f.nom}"`);
    nbCoeffs++;
    if (!f.etablissements || !f.etablissements.length) { WARN(`"${f.nom}" : aucun établissement`); return; }
    f.etablissements.forEach((e) => {
      nbEtab++;
      if (!e.nom || !e.ville) KO(`établissement incomplet dans "${f.nom}"`);
    });
  });
});
OK(nbForm + " formations, " + nbEtab + " offres d'établissement");
OK(nbCoeffs + " jeux de coefficients Affelnet (7 entiers chacun)");

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
// Contrôle inverse : un vœu portant un critère doit voir son lycée déclaré
// dans ce critère. Sinon la donnée est incohérente sans que rien ne le signale.
idsLyc.forEach((id) => {
  LYCEES_2GT[id].voeux.forEach((v) => {
    (v.criteres || []).forEach((c) => {
      const critere = CRITERES_2GT.find((x) => x.id === c);
      if (critere && !critere.lycees.includes(id)) {
        KO(`vœu ${v.code} (${LYCEES_2GT[id].nom}) porte le critère « ${c} », `
           + `mais ce lycée n'est pas déclaré dans CRITERES_2GT`);
      }
    });
  });
});
OK(CRITERES_2GT.length + " critères Affelnet vérifiés dans les deux sens");

CRITERES_SUR_PLACE.forEach((c) => {
  c.lycees.forEach((id) => { if (!LYCEES_2GT[id]) KO(`atout « ${c.id} » : lycée inconnu "${id}"`); });
});
Object.entries(SERIES_TECHNO_2GT).forEach(([s, ls]) => {
  ls.forEach((id) => { if (!LYCEES_2GT[id]) KO(`série ${s} : lycée inconnu "${id}"`); });
});
OK(CRITERES_SUR_PLACE.length + " atouts et " + Object.keys(SERIES_TECHNO_2GT).length + " séries vérifiés");

/* ======================================================================
 * LE WORKFLOW GITHUB ACTIONS LUI-MÊME
 *
 * Rien ne vérifiait le YAML de la CI. Résultat : une insertion maladroite a
 * laissé un « run: | » vide suivi de lignes orphelines — YAML invalide, et
 * TOUTE la CI a cessé de tourner en silence (« Invalid workflow file »).
 * C'est le défaut le plus sournois : le garde-fou qui tombe sans prévenir.
 *
 * Node n'a pas de parseur YAML natif et on refuse d'ajouter une dépendance pour
 * ça. On fait donc un contrôle ciblé sur les pièges réellement rencontrés,
 * ligne à ligne. Ce n'est pas un validateur YAML complet — juste de quoi
 * empêcher que la CI reparte cassée.
 * ====================================================================== */
{
  const fs = await import("node:fs");
  const chemin = new URL("../.github/workflows/verifier-donnees.yml", import.meta.url);
  let lignes;
  try { lignes = fs.readFileSync(chemin, "utf8").split("\n"); }
  catch { lignes = null; KO("Workflow introuvable : .github/workflows/verifier-donnees.yml"); }

  if (lignes) {
    let etapes = 0, avecRun = 0, pb = 0;
    lignes.forEach((ligne, i) => {
      // Tabulations : interdites en YAML, cassent tout en silence.
      if (/\t/.test(ligne)) { KO(`Workflow ligne ${i + 1} : tabulation (YAML n'accepte que des espaces)`); pb++; }
    });
    for (let i = 0; i < lignes.length; i++) {
      const l = lignes[i];
      if (/^\s*-\s+name:/.test(l)) etapes++;
      // Un « run: | » (bloc multi-lignes) doit être suivi d'au moins une ligne
      // indentée plus profondément. C'est exactement ce qui manquait.
      const m = l.match(/^(\s*)run:\s*\|?\s*$/);
      if (m) {
        avecRun++;
        const indent = m[1].length;
        const suite = lignes[i + 1] || "";
        const vide = suite.trim() === "";
        const moinsIndente = suite.search(/\S/) <= indent && suite.trim() !== "";
        if (vide || moinsIndente) {
          KO(`Workflow ligne ${i + 1} : « run: » n'est suivi d'aucune commande indentée`);
          pb++;
        }
      }
    }
    if (etapes < 5) { KO(`Workflow : seulement ${etapes} étapes détectées, la CI en attend plus`); pb++; }

    // Les fichiers dont la CI a BESOIN pour tourner doivent exister. Sans
    // eslint.config.mjs, ESLint 9 ne vérifie rien (ou casse selon la version) ;
    // c'est précisément ce fichier qui manquait au dépôt et faisait échouer la
    // CI, alors qu'il était présent en local. Un fichier requis mais non commité
    // est un piège : tout marche chez soi, tout casse en ligne.
    const requisParLaCI = [
      ["tools/eslint.config.mjs", "la config ESLint (étape « variables non déclarées »)"],
    ];
    // On n'exige un fichier que si une étape le référence vraiment.
    const texteWorkflow = lignes.join("\n");
    requisParLaCI.forEach(([fichier, role]) => {
      const utilise = /eslint/i.test(texteWorkflow);   // l'étape ESLint est-elle présente ?
      if (!utilise) return;
      try { fs.readFileSync(new URL("../" + fichier, import.meta.url)); }
      catch {
        KO(`Fichier requis par la CI manquant : ${fichier} — ${role}. ` +
           `Présent en local ne suffit pas : il doit être commité.`);
        pb++;
      }
    });

    if (!pb) OK(`Workflow GitHub Actions : ${etapes} étapes, structure valide, fichiers requis présents`);
  }
}

/* ======================================================================
 * TRAJETS : aucun segment successif dupliqué après nettoyage
 *
 * Le calculateur d'itinéraires produisait « RER D puis RER D » (correspondance
 * sur la même ligne) et parfois « Bus X puis Bus X » (artefact). nettoyerTrajet
 * fusionne ces doublons — en signalant « (avec correspondance) » pour les RER.
 * On vérifie ici que, une fois nettoyé, PLUS AUCUN trajet ne contient de segment
 * successif identique. Si un nouveau trajet à triple doublon échappait à la
 * fonction, on le saurait.
 * ====================================================================== */
{
  // On récupère nettoyerTrajet depuis bdd_pro.js (fonction globale).
  const { nettoyerTrajet } = evaluer(lire("bdd_pro.js"), ["nettoyerTrajet"]);
  let doublons = 0;
  const dejaVus = new Set();
  for (const k of clesDom) {
    for (const f of DOMAINS[k].formations) {
      for (const e of f.etablissements) {
        if (!e.trajet) continue;
        const propre = nettoyerTrajet(e.trajet);
        const base = propre.replace(" (avec correspondance)", "");
        const segs = base.split(" puis ").map((s) => s.trim());
        for (let i = 1; i < segs.length; i++) {
          if (segs[i] === segs[i - 1]) {
            if (!dejaVus.has(e.trajet)) {
              KO(`Trajet à segment dupliqué même après nettoyage : « ${e.trajet} » (${e.nom})`);
              dejaVus.add(e.trajet);
            }
            doublons++;
            break;
          }
        }
      }
    }
  }
  if (!doublons) OK("Trajets : aucun segment successif dupliqué après nettoyage");
}

/* ====================================================================== */
console.log("\n" + "─".repeat(52));
if (erreurs) {
  console.log(`✗ ${erreurs} erreur(s), ${alertes} alerte(s). À corriger avant déploiement.`);
  process.exit(1);
}
console.log(`✓ Aucune erreur. ${alertes} alerte(s) à examiner.`);
