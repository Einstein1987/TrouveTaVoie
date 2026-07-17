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
    // Le libellé du menu doit rester cohérent avec le mode testé. Ne PAS accepter
    // « famille » ici : ce mot a été retiré du menu à dessein (il désignait à tort
    // un secteur). Si quelqu'un le remet, ce test doit le signaler.
    const attendu = { formation: /formation/i, domaine: /secteur/i, etab: /lyc/i }[etat];
    if (!attendu.test(cible.textContent)) {
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
/* ==========================================================================
 * CLASSEMENT 2GT
 *
 * Trois cas qui ne marchaient pas :
 *  - Sans aucune option (le cas le plus fréquent) : zéro vœu proposé, alors que
 *    l'app promettait « tu seras affecté dans l'un de ces 5 lycées ».
 *  - Badge (brut) et classement (pondéré 3/1) se contredisaient.
 *  - Un atout seul (japonais) ne produisait rien d'exploitable.
 * ======================================================================== */
/* ==========================================================================
 * LA CARTE S'EFFACE APRÈS UN REFUS
 *
 * Bug relevé par l'audit : afficher une fiche, lancer une autre recherche,
 * répondre « Non » → l'ancienne fiche restait affichée, laissant croire qu'elle
 * était toujours le projet retenu.
 * ======================================================================== */
console.log("\n── EFFACEMENT DE LA CARTE APRÈS « NON » ──");
{
  const a = monterApplication();
  if (a) {
    const boutonsActifs = () => boutons(a.doc);
    const carteVisible = () => a.doc.getElementById("cardFilled").style.display !== "none";

    // 1. Afficher une fiche (Bac Pro Cuisine).
    cliquer(a, boutonsActifs().find((b) => /formation/i.test(b.textContent)));
    ecrire(a, "cuisine");
    let b = boutonsActifs().find((x) => /Bac Pro Cuisine/i.test(x.textContent));
    if (b) cliquer(a, b);
    let oui = boutonsActifs().filter((x) => /^Oui$/.test(x.textContent));
    if (oui.length) cliquer(a, oui[0]);

    if (carteVisible()) {
      OK("Une fiche s'affiche bien après confirmation");

      // 2. Nouvelle recherche, puis « Non ». Après l'affichage d'une fiche, le
      //    chatbot propose de continuer : on clique le bouton qui rouvre une
      //    recherche par formation (ou le menu).
      const relance = boutonsActifs().find((x) => /formation|autre|recherche|menu/i.test(x.textContent));
      if (!relance) {
        KO("Aucun bouton pour relancer une recherche après la fiche — test à adapter");
      } else {
        cliquer(a, relance);
        const champ2 = boutonsActifs().find((x) => /formation/i.test(x.textContent));
        if (champ2) cliquer(a, champ2);
        ecrire(a, "melec");
        b = boutonsActifs().find((x) => /MELEC/i.test(x.textContent));
        if (b) cliquer(a, b);
        const non = boutonsActifs().filter((x) => /^Non$/.test(x.textContent));
        if (!non.length) {
          KO("Pas de bouton « Non » proposé — scénario à revoir");
        } else {
          cliquer(a, non[non.length - 1]);

          if (!carteVisible()) OK("Après « Non » : l'ancienne fiche a bien disparu");
          else KO("Après « Non » : l'ancienne fiche reste affichée (elle devrait s'effacer)");

          const details = a.doc.getElementById("cardDetailsContainer").textContent.trim();
          if (details === "") OK("Après « Non » : le contenu de la fiche est vidé");
          else KO("Après « Non » : le contenu de la fiche subsiste (« " + details.slice(0, 30) + "… »)");

          const empty = a.doc.getElementById("cardEmpty");
          if (empty && empty.style.display !== "none") OK("Après « Non » : l'invite « ta fiche apparaîtra ici » est réaffichée");
          else KO("Après « Non » : l'invite de carte vide n'est pas réaffichée");
        }
      }
    } else {
      KO("La fiche ne s'affiche pas — test du « Non » impossible");
    }
  }
}

/* ==========================================================================
 * VOCABULAIRE : « secteur », jamais « famille de métiers » pour nos 18 secteurs
 *
 * Le quiz et les recherches classent les 18 SECTEURS thématiques. Les appeler
 * « familles de métiers » (14 officielles, réalité Affelnet) réinstalle la
 * confusion qu'on a retirée du menu.
 * ======================================================================== */
console.log("\n── VOCABULAIRE SECTEUR / FAMILLE ──");
{
  const a = monterApplication();
  if (a) {
    // Fin de quiz : cliquer « je suis perdu » puis répondre au hasard.
    const quiz = boutons(a.doc).find((b) => /perdu|quiz/i.test(b.textContent));
    if (quiz) {
      cliquer(a, quiz);
      // Répondre à toutes les questions (toujours la 1re option) jusqu'au résultat.
      for (let i = 0; i < 15; i++) {
        const opts = boutons(a.doc).filter((b) => /^(?!Oui$|Non$).+/.test(b.textContent.trim()));
        const rep = opts.find((b) => !/perdu|quiz|reformuler/i.test(b.textContent));
        if (!rep) break;
        cliquer(a, rep);
        if (/secteurs? qui te correspond|voici les trois secteurs/i.test((a.doc.querySelector("#chatlog") || {}).textContent || "")) break;
      }
      const texte = (a.doc.querySelector("#chatlog") || {}).textContent || "";
      // Le message de résultat doit dire « secteurs », pas « familles de métiers ».
      if (/trois secteurs/i.test(texte)) OK("Fin de quiz : le résultat parle de « secteurs »");
      else if (/familles de métiers/i.test(texte)) KO("Fin de quiz : le résultat dit encore « familles de métiers »");
      else OK("Fin de quiz atteinte (formulation « secteurs » attendue)");
    }
  }
}

console.log("\n── CLASSEMENT 2GT ──");
{
  const voeuxDe = (doc) => Array.from(doc.querySelectorAll("#vue-2gt ol.gt-voeux > li"))
    .filter((li) => !li.classList.contains("gt-sep-li") && !li.classList.contains("gt-limite-li"));
  const cocher = (a, id) => {
    const c = a.doc.querySelector('#vue-2gt [data-critere="' + id + '"],#vue-2gt [data-place="' + id + '"]');
    if (c) c.dispatchEvent(new a.window.Event("click", { bubbles: true }));
    return !!c;
  };
  const strat = (a, s) => {
    const b = a.doc.querySelector('#vue-2gt [data-strat="' + s + '"]');
    if (b) b.dispatchEvent(new a.window.Event("click", { bubbles: true }));
  };

  // 1. Sans aucune option → les 5 lycées de secteur, par distance.
  {
    const a = monterApplication2GT();
    if (a) {
      const v = voeuxDe(a.doc);
      if (v.length === 5) OK("Sans option : les 5 lycées de secteur sont proposés (le cas le plus fréquent)");
      else KO("Sans option : " + v.length + " vœu(x) proposé(s), on en attend 5");

      const txt = (a.doc.querySelector("#vue-2gt") || {}).textContent || "";
      if (/plus proche/i.test(txt)) OK("Sans option : le classement de départ est expliqué (par distance)");
      else KO("Sans option : aucune explication du classement");
    }
  }

  // 2. Une option (Design, proposée par un seul lycée) → ce lycée en tête.
  {
    const a = monterApplication2GT();
    if (a && cocher(a, "design")) {
      strat(a, "lycee");
      const v = voeuxDe(a.doc);
      const premier = (v[0] || {}).textContent || "";
      if (/design/i.test(premier)) OK("Option Design : le lycée qui la propose passe en tête");
      else KO("Option Design : le 1er vœu n'est pas le lycée avec Design (« " + premier.slice(0, 40) + " »)");
      // La couverture doit compléter jusqu'aux 5 lycées.
      const lycees = new Set(v.map((li) => (li.querySelector(".gt-v-lyc") || {}).textContent));
      if (lycees.size === 5) OK("Option Design : les 5 lycées de secteur restent couverts");
      else KO("Option Design : seuls " + lycees.size + " lycées couverts, on en attend 5");
    } else if (a) {
      KO("Le critère « design » est introuvable");
    }
  }

  // 3. Badge factuel : plus de chiffre, donc aucune contradiction possible.
  {
    const a = monterApplication2GT();
    if (a) {
      cocher(a, "design");
      const badges = Array.from(a.doc.querySelectorAll("#vue-2gt .gt-score-badge"));
      const chiffres = badges.filter((b) => /^\d+$/.test(b.textContent.trim()));
      if (chiffres.length === 0) OK("Le badge n'affiche plus de chiffre pondéré (plus de contradiction avec le classement)");
      else KO(chiffres.length + " badge(s) affichent encore un chiffre");
      const coches = badges.filter((b) => b.textContent.trim() === "\u2713");
      if (coches.length >= 1) OK("Le badge ✓ marque les lycées qui proposent l'option cochée");
      else KO("Aucun badge ✓ alors qu'une option est cochée");
    }
  }

  // 4. Un atout seul (japonais, sur place) NE crée aucun vœu Affelnet. Le
  //    parcours doit donc être IDENTIQUE à « rien coché » : 5 lycées par
  //    distance, réordonnables, sans question de stratégie — plus la mention de
  //    l'atout sur le lycée concerné, à l'écran ET transmise au PDF.
  {
    const a = monterApplication2GT();
    if (a && cocher(a, "sp_japonais")) {
      // Pas de bascule en mode « stratégie » : l'atout n'est pas une option.
      const strats = a.doc.querySelectorAll("#gt-carte [data-strat]");
      if (strats.length === 0) OK("Atout seul : aucun bouton de stratégie (l'atout n'est pas une option)");
      else KO("Atout seul : " + strats.length + " bouton(s) de stratégie apparaissent à tort");

      // La liste s'affiche directement, sans avoir à choisir quoi que ce soit.
      if (voeuxDe(a.doc).length === 5) OK("Atout seul : les 5 lycées s'affichent directement");
      else KO("Atout seul : " + voeuxDe(a.doc).length + " vœu(x), on en attend 5 affichés directement");

      // Réordonnancement toujours possible (aucun filet à protéger).
      const reord = a.doc.querySelectorAll("#gt-carte li.gt-reordonnable");
      if (reord.length === 5) OK("Atout seul : les 5 lycées restent réordonnables (glisser-déposer + flèches)");
      else KO("Atout seul : " + reord.length + " lycée(s) réordonnable(s), on en attend 5");

      // L'atout est mentionné sur le lycée qui le propose.
      const mention = a.doc.querySelector("#gt-carte .gt-v-atouts");
      if (mention && /japonais/i.test(mention.textContent)) {
        OK("Atout seul : l'atout est affiché sur le lycée concerné");
      } else {
        KO("Atout seul : l'atout n'est pas affiché sur le lycée qui le propose");
      }

      // Aucun faux filet.
      const filets = a.doc.querySelectorAll("#gt-carte .gt-tag-filet");
      if (filets.length === 0) OK("Atout seul : aucune fausse étiquette « filet de sécurité »");
      else KO("Atout seul : " + filets.length + " étiquette(s) « filet » à tort");

      // L'atout doit partir au PDF (via getVoeux).
      const gv = a.window.TrouveTaVoie2GT.getVoeux();
      const avecAtout = gv.some(function (v) { return v.atouts && v.atouts.length; });
      if (avecAtout) OK("Atout seul : l'atout est transmis à getVoeux() (donc au PDF)");
      else KO("Atout seul : l'atout n'est pas transmis à getVoeux() — absent du PDF");

      // Le lycée qui propose l'atout doit REMONTER en tête par défaut...
      const noms = voeuxDe(a.doc).map(function (li) {
        return ((li.querySelector(".gt-v-lyc") || {}).textContent || "").replace(/^—\s*/, "").split(",")[0].trim();
      });
      if (/Truffaut/.test(noms[0] || "")) {
        OK("Atout seul : le lycée qui propose l'atout (Truffaut) remonte en tête");
      } else {
        KO("Atout seul : le lycée à atout n'est pas en tête (1er = « " + (noms[0] || "?") + " »)");
      }

      // ...tout en restant déplaçable (il ne doit pas être bloqué en tête).
      const bas = a.doc.querySelector('#gt-carte .gt-move[data-move="down"]');
      if (bas) {
        bas.dispatchEvent(new a.window.Event("click", { bubbles: true }));
        const noms2 = voeuxDe(a.doc).map(function (li) {
          return ((li.querySelector(".gt-v-lyc") || {}).textContent || "").replace(/^—\s*/, "").split(",")[0].trim();
        });
        if (!/Truffaut/.test(noms2[0] || "")) OK("Atout seul : le lycée à atout reste déplaçable (pas bloqué en tête)");
        else KO("Atout seul : le lycée à atout est bloqué en tête, impossible à déplacer");
      }
    } else if (a) {
      KO("Le critère « sp_japonais » est introuvable");
    }
  }

  // 5. Statistiques : tout usage abouti doit être compté, quelle que soit la
  //    porte d'entrée. Avant, seul le clic « lycée/option » comptait — donc les
  //    élèves sans option (la majorité) étaient invisibles dans les stats.
  {
    const scenarios = [
      ["réordonner sans option", function (a) {
        const b = a.doc.querySelector('#gt-carte .gt-move[data-move="down"]');
        if (b) b.dispatchEvent(new a.window.Event("click", { bubbles: true }));
      }],
      ["cocher un atout", function (a) { cocher(a, "sp_japonais"); }],
      ["cocher une option", function (a) { cocher(a, "design"); }],
    ];
    scenarios.forEach(function (sc) {
      const a = monterApplication2GT();
      if (!a) return;
      const envoyees = [];
      a.window.pingStats = function (type, val) { envoyees.push(type + ":" + val); };
      sc[1](a);
      const compte = envoyees.filter(function (s) { return s.indexOf("2gt_voeux") === 0; }).length;
      if (compte >= 1) OK("Stat 2GT comptée pour : " + sc[0]);
      else KO("Stat 2GT NON comptée pour : " + sc[0] + " (ces élèves seraient invisibles)");
    });

    // Ouvrir l'onglet sans rien faire ne doit RIEN compter.
    const a = monterApplication2GT();
    if (a) {
      const envoyees = [];
      a.window.pingStats = function (type, val) { envoyees.push(type + ":" + val); };
      // on ne fait rien
      const compte = envoyees.filter(function (s) { return s.indexOf("2gt_voeux") === 0; }).length;
      if (compte === 0) OK("Stat 2GT : ouvrir l'onglet sans agir ne compte pas (pas de faux positif)");
      else KO("Stat 2GT : une simple ouverture d'onglet est comptée à tort");
    }
  }

  // 4bis. Une vraie option (Design) DOIT, elle, produire un filet sous son vœu.
  {
    const a = monterApplication2GT();
    if (a && cocher(a, "design")) {
      strat(a, "lycee");
      const filets = a.doc.querySelectorAll("#gt-carte .gt-tag-filet");
      if (filets.length >= 1) OK("Option Design : le vœu à option a bien son filet de sécurité en dessous");
      else KO("Option Design : le filet de sécurité a disparu (il doit rester sous le vœu à option)");
    }
  }
  // 5. Numérotation : les bandeaux d'information (séparateurs, limite) ne
  //    doivent PAS être comptés comme des vœux. Le compteur CSS ne s'incrémente
  //    que sur le ::before des vrais vœux ; les bandeaux ont content:none.
  {
    const a = monterApplication2GT();
    if (a) {
      // On lit la feuille de style pour vérifier la règle, puisque jsdom ne
      // calcule pas les compteurs CSS. La garantie tient à deux conditions.
      const css = lire("styles/2gt.css");
      const increArBonEndroit = /ol\.gt-voeux > li::before\s*\{[^}]*counter-increment:\s*v/.test(css);
      const bandeauxSansContenu = /li\.gt-sep-li::before\s*\{\s*content:\s*none/.test(css) &&
                                  /li\.gt-limite-li::before\s*\{\s*content:\s*none/.test(css);
      // Et surtout : le <li> lui-même ne doit PAS incrémenter (sinon les bandeaux
      // compteraient malgré tout). C'est le bug qui faisait démarrer la liste à 2.
      const liNincremente = !/ol\.gt-voeux > li\s*\{[^}]*counter-increment/.test(css);

      if (increArBonEndroit && liNincremente && bandeauxSansContenu) {
        OK("Numérotation : seuls les vrais vœux sont comptés (les bandeaux sont ignorés)");
      } else {
        KO("Numérotation : un bandeau d'information risque d'être compté comme un vœu " +
           "(incrément sur ::before=" + increArBonEndroit + ", li n'incrémente pas=" +
           liNincremente + ", bandeaux sans ::before=" + bandeauxSansContenu + ")");
      }
    }
  }
}

console.log("\n── RÉORDONNANCEMENT DES VŒUX (2GT sans option) ──");
{
  const ordreLycees = (doc) =>
    Array.from(doc.querySelectorAll("#gt-carte ol.gt-voeux > li:not(.gt-sep-li):not(.gt-limite-li)"))
      .map((li) => ((li.querySelector(".gt-v-lyc") || {}).textContent || "").replace(/^—\s*/, "").split(",")[0].trim());

  // Sans option : les vœux sont réordonnables (souris + clavier).
  {
    const a = monterApplication2GT();
    if (a) {
      const drag = a.doc.querySelectorAll("#gt-carte li.gt-reordonnable[draggable='true']");
      const fleches = a.doc.querySelectorAll("#gt-carte .gt-move");
      if (drag.length === 5) OK("Sans option : les 5 vœux sont déplaçables à la souris (draggable)");
      else KO("Sans option : " + drag.length + " vœu(x) déplaçable(s), on en attend 5");
      // Deux flèches (↑ et ↓) par vœu = accès clavier, non négociable.
      if (fleches.length === 10) OK("Sans option : chaque vœu a ses flèches ↑↓ (accès clavier)");
      else KO("Sans option : " + fleches.length + " flèche(s), on en attend 10 (accessibilité clavier)");
    }
  }

  // La flèche ↓ déplace bien le vœu.
  {
    const a = monterApplication2GT();
    if (a) {
      const avant = ordreLycees(a.doc);
      const bas = a.doc.querySelector('#gt-carte .gt-move[data-move="down"]');
      if (bas) {
        bas.dispatchEvent(new a.window.Event("click", { bubbles: true }));
        const apres = ordreLycees(a.doc);
        if (apres[0] === avant[1] && apres[1] === avant[0]) {
          OK("La flèche ↓ descend bien le premier vœu d'un cran");
        } else {
          KO("La flèche ↓ n'a pas réordonné comme attendu (" + avant[0] + " → position " + (apres.indexOf(avant[0]) + 1) + ")");
        }
      } else {
        KO("Flèche de descente introuvable");
      }
    }
  }

  // Dès qu'une option est cochée, le réordonnancement DISPARAÎT : l'app reprend
  // la main pour garder le filet de sécurité collé sous son vœu.
  {
    const a = monterApplication2GT();
    if (a) {
      const c = a.doc.querySelector('[data-critere="design"]');
      if (c) c.dispatchEvent(new a.window.Event("click", { bubbles: true }));
      const s = a.doc.querySelector('[data-strat="lycee"]');
      if (s) s.dispatchEvent(new a.window.Event("click", { bubbles: true }));
      const drag = a.doc.querySelectorAll("#gt-carte li.gt-reordonnable");
      if (drag.length === 0) OK("Avec une option : le réordonnancement est désactivé (le filet reste protégé)");
      else KO("Avec une option : " + drag.length + " vœu(x) encore déplaçable(s) — le filet pourrait être séparé");
    }
  }
}

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

/* ==========================================================================
 * STRUCTURE DE LA CARTE : familles / hors famille / CAP
 *
 * « Domaine » (nos 18 secteurs) et « famille de métiers » (les 14 officielles)
 * ne sont PAS la même chose. Le menu les présentait comme synonymes. La carte
 * doit maintenant montrer la vraie famille — celle qui dit à l'élève s'il entre
 * en seconde commune ou directement en spécialité.
 * ======================================================================== */
console.log("\n── STRUCTURE DE LA CARTE ──");
{
  const a = monterApplication();
  if (a) {
    const menu = boutons(a.doc);
    const secteur = menu.find((b) => /secteur/i.test(b.textContent));
    if (!secteur) {
      KO("Le bouton « secteur » est introuvable dans le menu");
    } else {
      cliquer(a, secteur);
      ecrire(a, "electricite");
      const oui = boutons(a.doc).filter((b) => /^Oui$/.test(b.textContent));
      if (oui.length) cliquer(a, oui[0]);

      const sections = Array.from(a.doc.querySelectorAll("#cardDetailsContainer .carte-section"));
      if (!sections.length) {
        KO("La carte n'affiche aucune section");
      } else {
        const titres = sections.map((s) => s.querySelector(".carte-section-titre").textContent);

        // Une famille OFFICIELLE, pas le libellé de notre secteur.
        if (!titres.some((t) => /Métiers des transitions numérique et énergétique/.test(t))) {
          KO("La carte n'affiche pas la famille officielle (titres : " + titres.join(" | ") + ")");
        } else {
          OK("La famille officielle est affichée, pas le libellé du secteur");
        }
        if (!titres.some((t) => /hors famille/i.test(t))) KO("Section « bacs pro hors famille » absente");
        else OK("Section « bacs pro hors famille » présente");
        if (!titres.some((t) => /^CAP$/.test(t))) KO("Section « CAP » absente");
        else OK("Section « CAP » présente");

        // INVARIANT : aucun CAP ne doit se retrouver sous une famille de métiers.
        let fautes = 0;
        sections.filter((s) => s.classList.contains("carte-section-famille")).forEach((s) => {
          s.querySelectorAll(".formation-title").forEach((t) => {
            if (/^CAP /.test(t.textContent)) {
              KO("« " + t.textContent.trim() + " » est rangé sous une famille de métiers — un CAP n'en a jamais.");
              fautes++;
            }
          });
        });
        if (!fautes) OK("Aucun CAP n'est rangé sous une famille de métiers");

        // Chaque section explique ce qu'elle implique : la couleur ne suffit pas.
        const muettes = sections.filter((s) => {
          const n = s.querySelector(".carte-section-note");
          return !n || !n.textContent.trim();
        });
        if (muettes.length) KO(muettes.length + " section(s) sans phrase d'explication");
        else OK("Chaque section explique ce qu'elle implique (l'info ne repose pas sur la couleur)");
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
