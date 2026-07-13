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
console.log("\n" + "─".repeat(52));
if (echecs) {
  console.log(`✗ ${echecs} test(s) en échec.`);
  process.exit(1);
}
console.log("✓ Tous les parcours passent.");
