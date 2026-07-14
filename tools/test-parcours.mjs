/*
 * test-parcours.mjs — Tests de parcours utilisateur.
 *
 *     npm install jsdom      (une seule fois)
 *     node tools/test-parcours.mjs
 *
 * POURQUOI CE FICHIER EXISTE
 * --------------------------
 * Le 13 juillet 2026, une refonte a supprimé la fonction addUserMessage() alors
 * qu'elle était encore appelée. `node --check` n'a rien vu : la syntaxe était
 * parfaitement valide. Le validateur de données n'a rien vu non plus : les
 * données étaient intactes. Et pourtant la voie professionnelle était TOTALEMENT
 * inutilisable en production — le premier clic levait une ReferenceError.
 *
 * Ce test charge l'application dans un vrai DOM, clique comme le ferait un élève,
 * et échoue si quoi que ce soit lève une erreur. C'est le seul contrôle qui
 * aurait attrapé ce bug.
 */

import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const racine = new URL("../", import.meta.url);
const lire = (p) => readFileSync(new URL(p, racine), "utf8");

let echecs = 0;
const OK = (m) => console.log("  ✓ " + m);
const KO = (m) => { echecs++; console.log("  ✗ " + m); };

/* -------------------------------------------------------------------------- */
/* Monte l'application dans un DOM, exactement comme le ferait un navigateur.  */
/* -------------------------------------------------------------------------- */
function monterApplication() {
  const html = lire("index.html");
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
  const { window } = dom;

  // Les API absentes de jsdom, mais utilisées par l'application.
  window.scrollTo = () => {};
  window.fetch = () => Promise.resolve({ ok: true });
  window.speechSynthesis = { speak: () => {}, cancel: () => {}, getVoices: () => [] };
  window.SpeechSynthesisUtterance = function () {};
  window.alert = () => {};
  window.jspdf = { jsPDF: function () { throw new Error("PDF non testé ici"); } };

  // Les erreurs non capturées doivent faire échouer le test, pas passer inaperçues.
  const erreurs = [];
  window.addEventListener("error", (e) => erreurs.push(e.error || e.message));

  // On charge les scripts dans l'ordre exact du <head>, sans jsPDF ni les
  // modules 2GT/PDF qui ne concernent pas ce parcours.
  const scripts = ["bdd_pro.js", "dico_chatbot.js", "quiz_pro.js", "app_pro.js"];
  const source = scripts.map((f) => lire("scripts/" + f)).join("\n;\n");

  try {
    window.eval(source);
  } catch (e) {
    KO("Le chargement des scripts a échoué : " + e.message);
    return null;
  }

  // L'application démarre par `setTimeout(startMenu, 400)` en fin de app_pro.js.
  // On force l'exécution des minuteurs en attente, sans attendre 400 ms.
  try { window.eval("startMenu();"); }
  catch (e) { KO("Le menu d'accueil ne s'affiche pas : " + e.message); return null; }

  return { window, doc: window.document, erreurs };
}

/* Le montage ci-dessus ne charge que la voie pro. Pour le 2GT il faut bdd_gt,
 * app_gt et tabs — sinon l'onglet reste vide et le test passerait au vert sans
 * rien tester. */
function monterApplication2GT() {
  const dom = new JSDOM(lire("index.html"), { runScripts: "outside-only", pretendToBeVisual: true });
  const { window } = dom;
  window.scrollTo = () => {};
  window.fetch = () => Promise.resolve({ ok: true });
  window.speechSynthesis = { speak: () => {}, cancel: () => {}, getVoices: () => [] };
  window.SpeechSynthesisUtterance = function () {};
  window.alert = () => {};
  window.jspdf = { jsPDF: function () { throw new Error("PDF non testé ici"); } };
  const scripts = ["bdd_pro.js", "dico_chatbot.js", "quiz_pro.js", "app_pro.js",
                   "export.js", "bdd_gt.js", "app_gt.js", "tabs.js"];
  try {
    window.eval(scripts.map((f) => lire("scripts/" + f)).join("\n;\n"));
    window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
  } catch (e) {
    KO("Chargement du 2GT : " + e.message);
    return null;
  }
  const onglet = window.document.getElementById("tab-2gt");
  if (!onglet) { KO("Onglet 2GT introuvable"); return null; }
  onglet.dispatchEvent(new window.Event("click", { bubbles: true }));
  return { window, doc: window.document };
}

/* -------------------------------------------------------------------------- */
/* Outils de simulation                                                        */
/* -------------------------------------------------------------------------- */
const boutons = (doc) =>
  Array.from(doc.querySelectorAll(".optrow:last-of-type .optbtn:not([disabled])"));

const tousLesBoutons = (doc) => Array.from(doc.querySelectorAll(".optbtn"));

function cliquer(app, bouton) {
  bouton.dispatchEvent(new app.window.Event("click", { bubbles: true }));
  if (app.erreurs.length) {
    KO("ERREUR levée au clic sur « " + bouton.textContent + " » : " + app.erreurs[0]);
    app.erreurs.length = 0;
    return false;
  }
  return true;
}

function ecrire(app, texte) {
  const champ = app.doc.getElementById("userInput");
  const envoyer = app.doc.getElementById("sendBtn") ||
                  app.doc.querySelector('[id*="send" i], .sendbtn');
  champ.value = texte;
  if (envoyer) envoyer.dispatchEvent(new app.window.Event("click", { bubbles: true }));
  else champ.dispatchEvent(new app.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  if (app.erreurs.length) {
    KO('ERREUR levée en écrivant « ' + texte + ' » : ' + app.erreurs[0]);
    app.erreurs.length = 0;
    return false;
  }
  return true;
}

/* ========================================================================== */
console.log("\n── DÉMARRAGE ──");
const app = monterApplication();
if (!app) process.exit(1);

const bulles = app.doc.querySelectorAll("#chatlog .msg.bot");
if (bulles.length) OK("Le bot affiche son message d'accueil");
else KO("Aucun message d'accueil");

const opts = boutons(app.doc);
if (opts.length >= 3) OK(opts.length + " options proposées au menu");
else KO("Menu incomplet : " + opts.length + " option(s)");

/* ========================================================================== */
console.log("\n── ORDRE D'AFFICHAGE (question AVANT les réponses) ──");
{
  const enfants = Array.from(app.doc.getElementById("chatlog").children);
  const iBulle = enfants.findIndex((e) => e.classList.contains("msg-row"));
  const iOpts  = enfants.findIndex((e) => e.classList.contains("optrow"));
  if (iBulle === -1 || iOpts === -1) KO("Structure du fil inattendue");
  else if (iBulle < iOpts) OK("La question du bot précède bien ses boutons de réponse");
  else KO("RÉGRESSION : les boutons sont affichés AVANT la question");
}

/* ========================================================================== */
console.log("\n── PREMIER CLIC (le bug du 13 juillet) ──");
{
  const b = boutons(app.doc);
  const cible = b[b.length - 1];   // « Je suis perdu, faire le quiz »
  if (cliquer(app, cible)) OK("Le premier clic ne lève aucune erreur");
}

/* ========================================================================== */
console.log("\n── QUIZ COMPLET (10 questions) ──");
{
  let b = boutons(app.doc);
  if (b.length) cliquer(app, b[0]);   // « C'est parti ! »

  let n = 0;
  for (let i = 0; i < 15; i++) {
    b = boutons(app.doc);
    if (!b.length) break;
    const label = b[0].textContent;
    if (/%$/.test(label) || /refaire le quiz/i.test(label)) break;   // résultats atteints
    if (!cliquer(app, b[0])) break;
    n++;
  }
  if (n === 10) OK("Les 10 questions s'enchaînent sans erreur");
  else KO("Le quiz s'est arrêté après " + n + " question(s) au lieu de 10");

  const res = boutons(app.doc).filter((x) => /%$/.test(x.textContent));
  if (res.length === 3) OK("Trois pistes proposées, avec leur pourcentage d'affinité");
  else KO(res.length + " piste(s) proposée(s) au lieu de 3");
}

/* ========================================================================== */
console.log("\n── LES TROIS PISTES RESTENT CONSULTABLES ──");
{
  const pistes = () => tousLesBoutons(app.doc).filter((x) => /%$/.test(x.textContent));
  const p = pistes();
  if (!p.length) { KO("Aucune piste à consulter"); }
  else {
    cliquer(app, p[0]);
    const encore = pistes().filter((x) => !x.disabled);
    if (encore.length >= 3) OK("Après avoir cliqué sur une piste, les trois restent cliquables");
    else KO("RÉGRESSION : les pistes sont verrouillées (" + encore.length + " encore actives)");

    // La fiche doit s'afficher sans confirmation
    const carte = app.doc.querySelectorAll("#cardDetailsContainer .formation-block");
    if (carte.length) OK("La fiche d'orientation s'affiche directement (" + carte.length + " formations)");
    else KO("Aucune fiche affichée après le choix d'une piste");

    // Et une deuxième piste doit rester consultable
    const p2 = pistes().filter((x) => !x.disabled);
    if (p2.length > 1 && cliquer(app, p2[1])) OK("Une deuxième piste peut être consultée");
  }
}

/* ========================================================================== */
console.log("\n── SAISIE LIBRE ──");
{
  const app2 = monterApplication();
  if (app2) {
    const b = boutons(app2.doc);
    cliquer(app2, b[1]);                       // « Je connais le domaine »
    if (ecrire(app2, "je veux réparer des voitures")) {
      OK("Une saisie libre ne lève aucune erreur");
      // Le libellé du domaine est « Maintenance des Matériels, Véhicules et
      // Aéronautique » : on teste donc sur le libellé réel, pas sur une intuition.
      const txt = app2.doc.getElementById("chatlog").textContent;
      if (/V[ée]hicules/i.test(txt)) {
        OK("« réparer des voitures » mène bien aux métiers du véhicule");
      } else {
        KO("La compréhension du texte libre n'a rien trouvé");
        console.log("      (fil : " + txt.slice(-160).replace(/\s+/g, " ") + ")");
      }
    }
    // Frappe hasardeuse : ne doit rien casser
    if (ecrire(app2, "azerty qwerty")) OK("Une saisie incompréhensible ne casse rien");
  }
}

/* ========================================================================== */
console.log("\n── CONFIRMATION ÉCRITE (apostrophe courbe des claviers mobiles) ──");
{
  const a = monterApplication();
  if (a) {
    cliquer(a, boutons(a.doc)[1]);              // « Je connais le domaine »
    ecrire(a, "je veux réparer des voitures");  // → confirmation Oui/Non

    const ouiNon = tousLesBoutons(a.doc).filter((b) => /^(Oui|Non)$/.test(b.textContent));
    if (ouiNon.length < 2) {
      KO("Le bot ne demande pas de confirmation");
    } else {
      // L'élève répond au CLAVIER, avec l'apostrophe courbe d'un téléphone.
      if (ecrire(a, "d\u2019accord")) {
        const carte = a.doc.querySelectorAll("#cardDetailsContainer .formation-block");
        if (carte.length) OK("« d\u2019accord » (apostrophe courbe) est compris comme un oui");
        else KO("« d\u2019accord » avec apostrophe courbe n'est PAS reconnu");

        // Les anciens boutons Oui/Non ne doivent plus être cliquables.
        const encoreActifs = tousLesBoutons(a.doc)
          .filter((b) => /^(Oui|Non)$/.test(b.textContent) && !b.disabled);
        if (!encoreActifs.length) OK("Les boutons Oui/Non sont verrouillés après la réponse écrite");
        else KO("RÉGRESSION : " + encoreActifs.length + " bouton(s) Oui/Non encore cliquable(s)");
      }
    }
  }
}

/* ==========================================================================
 * RECHERCHES GÉNÉRIQUES
 *
 * « bac » produisait 48 boutons dans le fil, « pro » 50, « cap » 33,
 * « lycée » 29. Et « lycée Doisneau » — la formulation la plus naturelle pour
 * un élève — n'en produisait AUCUN.
 * ========================================================================== */
console.log("\n── RECHERCHES GÉNÉRIQUES ──");
{
  // Combien de boutons de résultat le bot propose-t-il après une saisie ?
  function chercher(saisie, etat) {
    const a = monterApplication();
    if (!a) return null;
    const menu = boutons(a.doc);
    // Ordre RÉEL du menu (startMenu) : 0 = formation, 1 = domaine, 2 = lycée, 3 = quiz.
    // Un mapping erroné ici envoie la recherche dans le mauvais mode et fait
    // passer les tests au vert sans jamais exécuter le code visé. C'est arrivé.
    const idx = { formation: 0, domaine: 1, etab: 2 }[etat];
    const cible = menu[idx];
    if (!cible) { KO("Menu : bouton « " + etat + " » introuvable — l'ordre a changé ?"); return null; }
    if (!/formation|domaine|famille|lyc/i.test(cible.textContent)) {
      KO("Menu : le bouton " + idx + " ne correspond pas à « " + etat + " » (« " + cible.textContent + " »)");
      return null;
    }
    if (!cliquer(a, cible)) return null;
    if (!ecrire(a, saisie)) return null;
    return {
      app: a,
      boutons: boutons(a.doc).length,
      fiche: a.doc.querySelectorAll("#cardDetailsContainer .formation-block").length,
      dernierMessage: Array.from(a.doc.querySelectorAll("#chatlog .msg.bot")).pop()?.textContent || ""
    };
  }

  const PLAFOND = 8;

  // Après une saisie libre, le bot DEMANDE confirmation (« c'est bien ça ? ») :
  // c'est voulu — il a deviné, il vérifie. Le test doit donc répondre « Oui »
  // avant d'attendre la fiche.
  function confirmerOui(a) {
    const oui = tousLesBoutons(a.doc).filter((b) => /^Oui$/.test(b.textContent) && !b.disabled);
    if (oui.length) cliquer(a, oui[0]);
    return a.doc.querySelectorAll("#cardDetailsContainer .formation-block").length;
  }

  // --- Les saisies purement structurelles ne doivent JAMAIS déverser la base.
  [["bac", "formation"], ["pro", "formation"], ["cap", "formation"],
   ["lycée", "etab"], ["formation", "domaine"]].forEach(function (cas) {
    const r = chercher(cas[0], cas[1]);
    if (!r) { KO("« " + cas[0] + " » : plantage"); return; }
    if (r.boutons > 4) {
      KO("« " + cas[0] + " » génère encore " + r.boutons + " boutons (plafond attendu : une poignée)");
    } else if (r.fiche > 0) {
      KO("« " + cas[0] + " » affiche une fiche alors que l'élève n'a rien précisé");
    } else {
      OK("« " + cas[0] + " » → " + r.boutons + " bouton(s), une question posée, pas de déversement");
    }
  });

  // --- Le mot de structure ne doit plus EMPOISONNER une recherche légitime.
  {
    const r = chercher("lycée Doisneau", "etab");
    if (!r) KO("« lycée Doisneau » : plantage");
    else if (!/Doisneau/i.test(r.dernierMessage)) {
      KO("RÉGRESSION : « lycée Doisneau » ne trouve toujours rien");
    } else if (confirmerOui(r.app) > 0) {
      OK("« lycée Doisneau » trouve bien le lycée, et la fiche s'affiche (bug corrigé)");
    } else {
      KO("« lycée Doisneau » est reconnu mais la fiche ne s'affiche pas");
    }
  }
  {
    // « cuisine » existe en Bac Pro ET en CAP : le bot propose donc les deux.
    // C'est le bon comportement — il ne tranche pas à la place de l'élève.
    const r = chercher("bac pro cuisine", "formation");
    if (!r) KO("« bac pro cuisine » : plantage");
    else {
      const props = tousLesBoutons(r.app.doc)
        .filter((b) => /cuisine/i.test(b.textContent) && !b.disabled);
      if (!props.length) {
        KO("« bac pro cuisine » ne trouve rien");
      } else if (cliquer(r.app, props[0]) &&
                 r.app.doc.querySelectorAll("#cardDetailsContainer .formation-block").length) {
        OK("« bac pro cuisine » propose " + props.length + " formation(s) Cuisine, la fiche s'affiche");
      } else {
        KO("« bac pro cuisine » est reconnu mais la fiche ne s'affiche pas");
      }
    }
  }

  // --- Le plafond : au-delà, on remonte à la famille de métiers.
  {
    const r = chercher("maintenance", "formation");
    if (!r) KO("« maintenance » : plantage");
    else if (r.boutons === 0) KO("« maintenance » ne propose rien");
    else if (r.boutons > PLAFOND) KO("« maintenance » dépasse le plafond : " + r.boutons + " boutons");
    else OK("« maintenance » → " + r.boutons + " famille(s) de métiers, sous le plafond de " + PLAFOND);
  }

  // --- Aucune recherche, quelle qu'elle soit, ne doit dépasser le plafond.
  {
    let pire = 0, pireMot = "";
    ["bac", "pro", "cap", "lycée", "métier", "maintenance", "technicien", "agent",
     "a", "e", "professionnel", "seconde", "études", "option"].forEach(function (mot) {
      ["domaine", "formation", "etab"].forEach(function (etat) {
        const r = chercher(mot, etat);
        if (r && r.boutons > pire) { pire = r.boutons; pireMot = mot + " (" + etat + ")"; }
      });
    });
    if (pire > PLAFOND) KO("Le pire cas dépasse le plafond : « " + pireMot + " » → " + pire + " boutons");
    else OK("Pire cas mesuré : " + pire + " boutons (« " + pireMot + " ») — plafond " + PLAFOND + " respecté");
  }
}

/* ==========================================================================
 * FOCUS CLAVIER DANS LE COMPARATEUR 2GT
 *
 * refresh() reconstruit tout en innerHTML : l'élément focalisé est détruit et
 * le focus retombe sur <body>. Un élève au clavier était renvoyé au début de
 * la page à CHAQUE critère coché.
 * ======================================================================== */
console.log("\n── FOCUS CLAVIER (2GT) ──");
{
  const a = monterApplication2GT();
  if (!a) {
    KO("Impossible de monter l'onglet 2GT");
  } else {
    const { doc } = a;
    // Re-chercher les puces à chaque tour : refresh() reconstruit le DOM, et
    // focus() sur un élément détaché ne fait rien. (Piège vécu.)
    const puces = () => Array.from(doc.querySelectorAll("#vue-2gt [data-critere]"));
    const clic = (el) => el.dispatchEvent(new a.window.Event("click", { bubbles: true }));

    if (!puces().length) {
      KO("Aucune puce de critère dans l'onglet 2GT");
    } else {
      let perdus = 0;
      [0, 3, 7].forEach((i) => {
        const c = puces()[i];
        if (!c) return;
        const id = c.getAttribute("data-critere");
        c.focus();
        clic(c);
        const apres = doc.activeElement === doc.body
          ? null : doc.activeElement.getAttribute("data-critere");
        if (apres !== id) {
          KO("Le focus est perdu après avoir coché « " + id + " » (retombé sur " +
             (apres === null ? "<body>" : "« " + apres + " »") + ")");
          perdus++;
        }
      });
      if (!perdus) OK("Le focus est conservé sur la puce cochée, à chaque reconstruction");

      // Après une remise à zéro l'élément disparaît : ne pas planter.
      const reset = doc.querySelector('#vue-2gt [data-action="reset"]');
      if (reset) {
        try { reset.focus(); clic(reset); OK("Remise à zéro : aucune erreur, focus géré"); }
        catch (e) { KO("La remise à zéro lève une erreur : " + e.message); }
      }
    }
  }
}

/* ========================================================================== */
console.log("\n" + "─".repeat(52));
if (echecs) {
  console.log(`✗ ${echecs} test(s) en échec.`);
  process.exit(1);
}
console.log("✓ Tous les parcours passent.");
