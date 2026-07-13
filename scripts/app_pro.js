/*
 * TrouveTaVoie — Application d'aide à l'orientation pour les élèves de 3e.
 * Copyright (C) 2026 Jérémy Violette
 *
 * Ce programme est un logiciel libre : vous pouvez le redistribuer et/ou le
 * modifier selon les termes de la GNU Affero General Public License telle que
 * publiée par la Free Software Foundation, soit la version 3 de la licence,
 * soit (à votre choix) toute version ultérieure.
 *
 * Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS AUCUNE
 * GARANTIE ; sans même la garantie implicite de QUALITÉ MARCHANDE ou
 * D'ADÉQUATION À UN USAGE PARTICULIER. Voir la GNU Affero General Public
 * License pour plus de détails.
 *
 * Vous devriez avoir reçu une copie de la GNU Affero General Public License
 * avec ce programme. Si ce n'est pas le cas, voir <https://www.gnu.org/licenses/>.
 *
 * Code source : https://github.com/Einstein1987/TrouveTaVoie
 */
// L'ordre compte : les négations sont testées EN PREMIER.
// « pas exactement » contient « exact » : sans cette précaution, la réponse
// serait interprétée comme un oui. Même piège avec « pas vraiment » / « vraiment ».
const NO_WORDS  = ["non", "nan", "pas vraiment", "pas trop", "pas exactement",
                   "pas du tout", "pas ca", "plutot pas", "negatif"];
const YES_WORDS = ["oui", "ouais", "ouaip", "yes", "exact", "exactement", "voila",
                   "c'est ca", "cest ca", "tout a fait", "carrement", "ok", "d'accord",
                   "daccord", "affirmatif", "parfait"];

function normalize(str){
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
}

// La compréhension du texte libre est déléguée à dico_chatbot.js : vocabulaire
// d'élève, tolérance aux fautes, notation des domaines. Le bot reste
// entièrement déterministe — rien n'est inventé, tout vient des dictionnaires.
function matchDomains(text){
  if (typeof domainesSurs === "function") return domainesSurs(text);
  // Repli si dico_chatbot.js n'a pas été chargé
  const n = normalize(text);
  const matches = [];
  for(const key in DOMAINS) {
    if(DOMAINS[key].keywords.some(k => n.includes(k))) matches.push(key);
  }
  return matches;
}

// Recherche par formation : on renvoie CHAQUE formation dont le nom correspond,
// avec le domaine auquel elle appartient. Granularité = la formation (et non le domaine).
function matchFormationsDetailed(text){
  const n = normalize(text);
  // Garde-fou : une saisie trop courte ferait correspondre TOUTES les formations
  // (« a » est contenu dans presque tous les intitulés).
  if (n.length < 3) return [];
  const results = [];
  for(const key in DOMAINS) {
    DOMAINS[key].formations.forEach(formation => {
      const nf = normalize(formation.nom);
      if(nf.includes(n) || n.includes(nf)){
        results.push({ domainKey: key, formation });
      }
    });
  }
  return results;
}

// Recherche par établissement : on regroupe par lycée (nom + ville) et, pour chaque
// lycée, on liste TOUTES les formations qu'il propose, tous domaines confondus.
function matchEtablissementsDetailed(text){
  const n = normalize(text);
  if (n.length < 3) return [];   // même garde-fou que pour les formations
  const groups = new Map();
  for(const key in DOMAINS) {
    DOMAINS[key].formations.forEach(formation => {
      formation.etablissements.forEach(etab => {
        const ne = normalize(etab.nom);
        const nv = normalize(etab.ville);
        if (ne.includes(n) || n.includes(ne) || nv.includes(n) || n.includes(nv)) {
          const id = etab.nom + '|' + etab.ville;
          if(!groups.has(id)){
            groups.set(id, { nom: etab.nom, ville: etab.ville, items: [] });
          }
          groups.get(id).items.push({ domainKey: key, formation, etab });
        }
      });
    });
  }
  return Array.from(groups.values());
}

// --- Construction des "sélections" affichées dans la carte -------------------
// Une sélection décrit ce qu'on va afficher : un libellé + une liste de formations.
function domainSelection(domainKey){
  const d = DOMAINS[domainKey];
  return { type: 'domaine', label: d.label, formations: d.formations, statKey: domainKey };
}

function formationSelection(domainKey, formation){
  return { type: 'formation', label: DOMAINS[domainKey].label, formations: [formation], statKey: domainKey };
}

function etablissementSelection(group){
  // Pour un lycée donné, on ne garde que CE lycée dans chaque bloc formation.
  const formations = group.items.map(item => ({
    ...item.formation,
    etablissements: [item.etab]
  }));
  return {
    type: 'etab',
    label: `${group.nom} — ${group.ville}`,
    establishment: `${group.nom} (${group.ville})`,
    formations,
    statKey: group.items[0].domainKey
  };
}

// Cherche une expression en respectant les frontières de mot : « non » ne doit
// pas se déclencher dans « nonobstant », ni « ok » dans « okapi ».
function contientExpression(phrase, expr){
  const e = expr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|[^a-z0-9])" + e + "([^a-z0-9]|$)").test(phrase);
}

function matchYesNo(text){
  const n = normalize(text);
  // 1) Les négations d'abord, sinon « pas exactement » passerait pour un oui.
  if(NO_WORDS.some(w => contientExpression(n, w))) return 'no';
  // 2) Puis les affirmations.
  if(YES_WORDS.some(w => contientExpression(n, w))) return 'yes';
  return null;
}

let state = 'start'; 
let pendingSelection = null;

const chatlog = document.getElementById('chatlog');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  window.speechSynthesis.speak(u);
}

/* -----------------------------------------------------------------------------
 * Verrouillage des lignes de boutons.
 *
 * Le fil de discussion défile : sans verrouillage, un élève peut recliquer sur
 * une réponse de la question 3 alors que la question 7 est affichée — et le clic
 * serait interprété comme une réponse à la question 7.
 *
 * Seules les lignes marquées `reutilisable` échappent au verrouillage
 * automatique : les trois pistes du quiz, que l'élève doit pouvoir explorer
 * l'une après l'autre.
 * -------------------------------------------------------------------------- */
function verrouillerLigne(row, choisi){
  Array.prototype.forEach.call(row.children, function (btn) {
    btn.disabled = true;
    if (choisi) btn.classList.toggle('optbtn-choisi', btn === choisi);
  });
  row.classList.add('optrow-done');
}

// Verrouille toutes les lignes SAUF les réutilisables.
function verrouillerAnciennesLignes(){
  const lignes = chatlog.querySelectorAll('.optrow');
  Array.prototype.forEach.call(lignes, function (row) {
    if (row.dataset.reutilisable === "1") return;
    if (row.dataset.repondu === "1") return;      // déjà traitée
    row.dataset.repondu = "1";
    verrouillerLigne(row, null);
  });
}

// Verrouille TOUT, y compris les réutilisables. Appelé quand l'élève quitte
// vraiment le contexte : retour au menu, ou nouveau quiz.
function verrouillerToutesLesLignes(){
  const lignes = chatlog.querySelectorAll('.optrow');
  Array.prototype.forEach.call(lignes, function (row) {
    row.dataset.repondu = "1";
    row.removeAttribute('data-reutilisable');
    verrouillerLigne(row, null);
  });
}

function addBotMessage(text, options, config){
  const row = document.createElement('div');
  row.className = 'msg-row';
  const bubble = document.createElement('div');
  bubble.className = 'msg bot';
  bubble.textContent = text;
  
  const speakBtn = document.createElement('button');
  speakBtn.className = 'speakbtn';
  speakBtn.title = 'Écouter';
  speakBtn.setAttribute('aria-label','Écouter la question');
  speakBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>';
  speakBtn.addEventListener('click', () => speak(text));
  
  row.appendChild(bubble);
  row.appendChild(speakBtn);
  chatlog.appendChild(row);

  if(options && options.length){
    // Toute nouvelle question rend les anciennes obsolètes : on verrouille les
    // lignes précédentes. Exception : les lignes marquées « réutilisables »
    // (les trois pistes du quiz), que l'élève doit pouvoir reconsulter.
    verrouillerAnciennesLignes();

    const optRow = document.createElement('div');
    optRow.className = 'optrow';
    if (config && config.reutilisable) optRow.dataset.reutilisable = "1";

    options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'optbtn';
      if (opt.style === "help") b.classList.add('opt-help');
      b.textContent = opt.label;

      b.addEventListener('click', () => {
        if (optRow.dataset.reutilisable === "1") {
          // Ligne réutilisable : on met en évidence le choix, sans la verrouiller.
          Array.prototype.forEach.call(optRow.children, function (btn) {
            btn.classList.toggle('optbtn-choisi', btn === b);
          });
        } else {
          if (optRow.dataset.repondu === "1") return;   // déjà répondu
          optRow.dataset.repondu = "1";
          verrouillerLigne(optRow, b);
        }
        handleUserChoice(opt.label, opt.action, opt.payload);
      });

      optRow.appendChild(b);
    });
    chatlog.appendChild(optRow);
  }
  chatlog.appendChild(row);
  chatlog.scrollTop = chatlog.scrollHeight;
}

function pingStats(type, valeur) {
    const FORM_ID = "1FAIpQLSfG2xzc8VM2r52ae0MVS--AuzaHgFO6Mth6csdnuetRXi0cYw"; 
    const ENTRY_TYPE   = "entry.1851976194";
    const ENTRY_VALEUR = "entry.721362482"; 
    const url = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
    const formData = new FormData();
    formData.append(ENTRY_TYPE, type);
    formData.append(ENTRY_VALEUR, valeur || "");
    fetch(url, { 
      method: 'POST', 
      mode: 'no-cors', 
      body: formData 
    })
    .catch(err => console.error("Erreur stats :", err));
}

function pingStatsForSelection(selection) {
    if (typeof pingStats !== "function" || !selection) return;
    if (selection.sansStat) return;   // piste de quiz déjà comptée : on n'envoie rien
    if (selection.fromQuiz) {
        pingStats('quiz_resultat', selection.statKey || selection.label);
    } else if (selection.type === 'formation') {
        pingStats('formation', selection.formations[0]?.nom || selection.label);
    } else if (selection.type === 'etab') {
        pingStats('etablissement', selection.establishment || selection.label);
    } else {
        pingStats('domaine', selection.statKey || selection.label);
    }
}
function fillCardCustom(selection) {
    if (!selection || !selection.formations || !selection.formations.length) return;

    document.getElementById("cardEmpty").style.display = "none";
    const filled = document.getElementById("cardFilled");
    filled.style.display = "block";
    document.getElementById("cardDate").textContent =
        new Date().toLocaleDateString("fr-FR");

    // Le libellé au-dessus s'adapte : "Établissement" pour une recherche par lycée,
    // "Famille de métiers / Domaine" sinon.
    const metierLabel = document.getElementById("cardMetierLabel");
    if (metierLabel) {
        metierLabel.textContent =
            selection.type === 'etab' ? "Établissement" : "Famille de métiers / Domaine";
    }
    document.getElementById("cardMetier").textContent = selection.label;

    const container = document.getElementById("cardDetailsContainer");
    container.innerHTML = "";
    selection.formations.forEach(formation => {
        container.appendChild(createFormationBlock(formation));
    });

    const cardActions = document.getElementById("cardActions");
    if (cardActions) {
        cardActions.style.display = "flex";
    }
  
    const psyNote = document.getElementById("psyNote");
    if (psyNote) {
      psyNote.style.display = "block";
    }
  
    pingStatsForSelection(selection);
}

function createFormationBlock(formation) {
    const block = document.createElement("div");
    block.className = "formation-block";
    const title = document.createElement("h3");
    title.className = "formation-title";
    title.textContent = formation.nom;
    if (formation.niveau) {
        const level = document.createElement("span");
        level.className = "formation-level";
        level.textContent = " — " + formation.niveau;
        title.appendChild(level);
    }
    block.appendChild(title);
    if (formation.aVerifier) {
        const warning = document.createElement("p");
        warning.className = "formation-warning";
        warning.textContent = "À vérifier : " + formation.aVerifier;
        block.appendChild(warning);
    }
    if (formation.coeffs && Array.isArray(formation.coeffs)) {
        block.appendChild(createCoefficientsTable(formation.coeffs));
    }
    const schoolsTitle = document.createElement("div");
    schoolsTitle.className = "schools-title";
    schoolsTitle.textContent = "Établissements publics en Essonne";
    block.appendChild(schoolsTitle);
    formation.etablissements.forEach(etablissement => {
        block.appendChild(createSchoolElement(etablissement));
    });
    return block;
}

function createCoefficientsTable(coeffs) {
    const subjects = [
        "Français",
        "Maths",
        "Hist.-Géo",
        "Langues",
        "EPS",
        "Arts",
        "Sciences-Techno"
    ];
    const wrapper = document.createElement("div");
    wrapper.className = "coeffs-wrapper";
    const label = document.createElement("div");
    label.className = "coeffs-title";
    label.textContent = "Coefficients AFFELNET";
    wrapper.appendChild(label);
    const table = document.createElement("table");
    table.className = "coeffs-table";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    subjects.forEach(subject => {
        const th = document.createElement("th");
        th.textContent = subject;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    const coeffRow = document.createElement("tr");
    coeffs.forEach(coeff => {
        const td = document.createElement("td");
        td.textContent = coeff;
        coeffRow.appendChild(td);
    });
    tbody.appendChild(coeffRow);
    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
}

function createSchoolElement(etablissement) {
    const card = document.createElement("div");
    card.className = "estab";
    const school = document.createElement("strong");
    school.textContent = etablissement.nom;
    card.appendChild(school);
    const city = document.createElement("div");
    city.className = "school-location";
    if (
        typeof etablissement.distanceKm === "number" &&
        etablissement.distanceKm !== 999
    ) {
        city.textContent = `${etablissement.ville} — environ ${etablissement.distanceKm} km`;
    } else {
        city.textContent = etablissement.ville;
    }
    card.appendChild(city);
    const ligne = etablissement.trajet || etablissement.transport;
    if (ligne || typeof etablissement.dureeMin === "number") {
      const transport = document.createElement("div");
      transport.className = "school-transport";
      const morceaux = [];
      if (typeof etablissement.dureeMin === "number") morceaux.push(`environ ${etablissement.dureeMin} min`);
      if (ligne) morceaux.push(ligne);
      transport.textContent = "Trajet : " + morceaux.join(" — ");
      card.appendChild(transport);
    }
    return card;
}

// `message` permet de revenir au menu en cours de conversation sans redire
// « Bonjour ! » à un élève qui discute depuis dix questions.
// `garderCarte` évite d'effacer la fiche que l'élève vient d'obtenir.
function startMenu(message, garderCarte){
  verrouillerToutesLesLignes();
  state = 'start';
  pendingSelection = null;
  if (!garderCarte) {
    const psyNote = document.getElementById("psyNote");
    if (psyNote) {
      psyNote.style.display = "none";
    }
  }
  addBotMessage(message || "Bonjour ! Je suis là pour t'aider. Où en es-tu ?", [
    {label: "Je connais déjà la formation que je veux faire", action: "set_state", payload: "search_formation"},
    {label: "Je connais la famille de métiers ou le domaine qui m'intéresse", action: "set_state", payload: "search_domaine"},
    {label: "Je connais un lycée et je veux voir ses formations", action: "set_state", payload: "search_etab"},
    {label: "Je suis perdu, j'ai besoin d'aide, je veux faire le quiz", action: "start_quiz", payload: null, style: "help"}
  ]);
}

/* -----------------------------------------------------------------------------
 * Affiche directement la fiche d'orientation, SANS demander confirmation.
 *
 * À utiliser chaque fois que l'élève a CLIQUÉ sur un bouton : il a déjà choisi,
 * lui redemander « c'est bien ça ? » est un tour de parole inutile.
 * La confirmation (askConfirm) reste réservée aux cas où c'est le BOT qui a
 * deviné à partir d'un texte libre — là, vérifier a du sens.
 * -------------------------------------------------------------------------- */
function afficherFiche(selection){
  if(!selection || !selection.formations || !selection.formations.length){
    startMenu("Je n'ai rien trouvé pour cette piste. Reprenons : que veux-tu faire ?");
    return;
  }
  pendingSelection = null;
  addBotMessage(
    "Très bien ! Voici ta fiche d'orientation, dans le panneau de droite. " +
    "Pense à la télécharger en PDF pour la garder ou la montrer chez toi.",
    [
      { label: "Faire une autre recherche", action: "menu",       payload: null },
      { label: "Faire le quiz",             action: "start_quiz", payload: null }
    ]
  );
  fillCardCustom(selection);
  state = 'start';
}

function askConfirm(selection){
  if(!selection || !selection.formations || !selection.formations.length){
    startMenu("Je n'ai rien trouvé pour cette piste. Reprenons : que veux-tu faire ?");
    return;
  }
  state = 'confirm';
  pendingSelection = selection;

  let message;
  if(selection.type === 'formation'){
    message = `Il me semble que tu penses à la formation « ${selection.formations[0].nom} ». C'est bien ça ?`;
  } else if(selection.type === 'etab'){
    message = `Tu veux voir toutes les formations proposées au ${selection.establishment} ?`;
  } else {
    message = `Il me semble que tu penses à : ${selection.label}. C'est bien ça ?`;
  }

  addBotMessage(message, [
    {label: "Oui", action: "confirm", payload: "yes"},
    {label: "Non", action: "confirm", payload: "no"}
  ]);
}

/* =============================================================================
 * QUIZ D'ORIENTATION
 * Questions et barème : scripts/quiz_pro.js
 *
 * Le quiz ne DÉSIGNE pas un métier : il propose TROIS pistes à explorer, et
 * c'est l'élève qui tranche. Un questionnaire d'intérêts ouvre des portes, il
 * ne décide pas d'une orientation.
 * ========================================================================== */

let quizIndex        = 0;      // question en cours
let quizReponses     = [];     // réponses choisies, dans l'ordre
let quizStatEnvoyee  = false;  // le quiz n'est compté qu'UNE fois, à la première piste consultée

function startQuiz() {
  verrouillerToutesLesLignes();
  if (typeof pingStats === "function") pingStats('quiz_lance', '');
  quizIndex       = 0;
  quizReponses    = [];
  quizStatEnvoyee = false;
  state = 'quiz';
  addBotMessage(
    "Pas de souci, c'est fait pour ça. Je vais te poser " + QUIZ_PRO.length +
    " questions sur ce que tu aimes — pas sur des métiers, tu n'as pas besoin " +
    "de les connaître. À la fin, je te proposerai trois pistes à explorer.",
    [{ label: "C'est parti !", action: "quiz_next", payload: null }]
  );
}

// Affiche la question courante, ou le résultat s'il n'y en a plus.
function poserQuestionQuiz() {
  if (quizIndex >= QUIZ_PRO.length) { afficherResultatQuiz(); return; }

  const q = QUIZ_PRO[quizIndex];
  const progression = "Question " + (quizIndex + 1) + " / " + QUIZ_PRO.length;

  addBotMessage(
    progression + " — " + q.question,
    q.reponses.map(function (rep, i) {
      return { label: rep.label, action: "quiz_answer", payload: i };
    })
  );
}

// L'élève a cliqué sur une réponse.
function nextQuizStep(indexReponse) {
  const q = QUIZ_PRO[quizIndex];
  if (q && q.reponses[indexReponse]) quizReponses.push(q.reponses[indexReponse]);
  quizIndex++;
  poserQuestionQuiz();
}

// Trois pistes, jamais une seule : c'est l'élève qui choisit celle qu'il veut voir.
function afficherResultatQuiz() {
  const top = calculerResultatQuiz(quizReponses);

  if (!top.length) {           // ne devrait pas arriver, mais on ne plante pas
    addBotMessage("Je n'arrive pas à dégager de piste claire. Reprenons depuis le début.",
      [{ label: "Retour au menu", action: "set_state", payload: "start" }]);
    state = 'start';
    return;
  }

  state = 'quiz_resultat';
  addBotMessage(
    "Voilà, c'est fini ! D'après tes réponses, voici les trois familles de métiers " +
    "qui te correspondent le mieux. Rien n'est figé : clique sur celle que tu veux " +
    "découvrir, tu pourras revenir voir les autres ensuite.",
    top.map(function (o) {
      const pct = Math.round(o.affinite * 100);
      return {
        label: DOMAINS[o.domainKey].label + " — " + pct + " %",
        action: "quiz_choix",
        payload: o.domainKey
      };
    }).concat([
      { label: "Aucune ne me parle, refaire le quiz", action: "start_quiz", payload: null }
    ]),
    // Cette ligne reste CLIQUABLE : l'élève doit pouvoir consulter les trois
    // pistes l'une après l'autre, comme le message le lui promet.
    { reutilisable: true }
  );
}

// L'élève a choisi l'une des trois pistes.
// Pas de confirmation : il vient de cliquer, lui redemander « c'est bien ça ? »
// serait un tour de parole inutile. La fiche s'affiche directement.
function choisirPisteQuiz(domainKey) {
  const selection = domainSelection(domainKey);
  selection.fromQuiz = true;      // distingue quiz_resultat de domaine dans les statistiques

  // L'élève peut consulter les trois pistes l'une après l'autre : on ne compte
  // que la première, sinon le taux de complétion du quiz dépasserait 100 %.
  selection.sansStat = quizStatEnvoyee;
  quizStatEnvoyee    = true;
  addBotMessage(
    "Très bien ! Voici ce que propose cette famille de métiers, dans le panneau de droite. " +
    "Tu peux la télécharger en PDF — ou remonter un peu dans la discussion pour cliquer " +
    "sur l'une des deux autres pistes, elles restent disponibles.",
    [
      { label: "Refaire le quiz",  action: "start_quiz", payload: null },
      { label: "Retour au menu",   action: "menu",       payload: null }
    ]
  );
  fillCardCustom(selection);      // envoie aussi la statistique quiz_resultat
  state = 'quiz_resultat';
}

/* -----------------------------------------------------------------------------
 * Quand la recherche échoue, on ne répond plus « je n'ai pas compris ».
 * On propose les TROIS domaines les plus proches de ce que l'élève a écrit.
 * Ces pistes ne sont pas inventées : ce sont les mieux notés par dico_chatbot.js.
 * -------------------------------------------------------------------------- */
function searchNotFound(text){
  const proches = (typeof pistesProches === "function" && text)
    ? pistesProches(text, 3)
    : [];

  if (proches.length) {
    const options = proches.map(function (o) {
      return {
        label: DOMAINS[o.domainKey].label,
        action: "confirm_selection",
        payload: domainSelection(o.domainKey)
      };
    });
    options.push({ label: "Aucune ne correspond, faire le quiz", action: "start_quiz", payload: null });

    addBotMessage(
      "Je ne suis pas certain d'avoir bien compris. Mais d'après ce que tu as écrit, " +
      "ces familles de métiers pourraient s'en rapprocher — dis-moi si l'une d'elles te parle :",
      options
    );
    return;
  }

  // Vraiment rien : on ne bluffe pas, on propose le quiz.
  addBotMessage(
    "Là, je ne vois pas à quoi rattacher ce que tu m'as écrit. Ce n'est pas grave ! " +
    "Tu peux reformuler avec d'autres mots, ou faire le quiz : il te posera des questions " +
    "simples sur ce que tu aimes.",
    [
      { label: "Reformuler ma recherche", action: "set_state", payload: "search_domaine" },
      { label: "Faire le quiz",           action: "start_quiz", payload: null }
    ]
  );
}

function processSearch(text, type) {
  if (type === 'domaine') {
    // Recherche par domaine : on affiche tout le domaine (comportement voulu).
    const keys = matchDomains(text);
    if (keys.length === 1) {
      askConfirm(domainSelection(keys[0]));
    } else if (keys.length > 1) {
      const opts = keys.map(k => ({label: DOMAINS[k].label, action: "confirm_selection", payload: domainSelection(k)}));
      addBotMessage("Plusieurs pistes correspondent. Laquelle te parle le plus ?", opts);
    } else {
      searchNotFound(text);
    }
  }
  else if (type === 'formation') {
    // Recherche par formation : on n'affiche QUE la formation trouvée (pas ses voisines).
    const results = matchFormationsDetailed(text);
    if (results.length === 1) {
      askConfirm(formationSelection(results[0].domainKey, results[0].formation));
    } else if (results.length > 1) {
      const opts = results.map(r => ({
        label: `${r.formation.nom}${r.formation.niveau ? ' (' + r.formation.niveau + ')' : ''}`,
        action: "confirm_selection",
        payload: formationSelection(r.domainKey, r.formation)
      }));
      addBotMessage("Plusieurs formations correspondent. Laquelle veux-tu voir ?", opts);
    } else {
      searchNotFound(text);
    }
  }
  else if (type === 'etab') {
    // Recherche par lycée : on affiche TOUTES les formations de ce lycée, tous domaines confondus.
    const groups = matchEtablissementsDetailed(text);
    if (groups.length === 1) {
      askConfirm(etablissementSelection(groups[0]));
    } else if (groups.length > 1) {
      const opts = groups.map(g => ({
        label: `${g.nom} (${g.ville})`,
        action: "confirm_selection",
        payload: etablissementSelection(g)
      }));
      addBotMessage("Plusieurs établissements correspondent. Lequel veux-tu ?", opts);
    } else {
      searchNotFound(text);
    }
  }
}

function handleUserChoice(displayText, action, payload){
  addUserMessage(displayText);
  applyChoice(action, payload);
}

// Toute la logique de traitement d'un choix, SANS afficher le message de l'élève.
function applyChoice(action, payload){
  
  if (action === "set_state") {
    state = payload;
    if(state === 'search_domaine') addBotMessage("Quel domaine ou métier t'intéresse ? (ex: commerce, informatique, santé...)");
    if(state === 'search_formation') addBotMessage("Quel est le nom de la formation ? (ex: MELEC, ASSP, Accueil...)");
    if(state === 'search_etab') addBotMessage("Dans quel établissement souhaites-tu aller ? (ex: Doisneau, Baudelaire...)");
    if(state === 'start') startMenu();
  }
  else if (action === "start_quiz") {
    startQuiz();
  }
  else if (action === "quiz_next") {
    poserQuestionQuiz();
  }
  else if (action === "quiz_answer") {
    nextQuizStep(payload);
  }
  else if (action === "quiz_choix") {
    choisirPisteQuiz(payload);
  }
  else if (action === "menu") {
    startMenu("Pas de problème. Que veux-tu faire maintenant ?", true);
  }
  else if (action === "confirm_selection") {
    afficherFiche(payload);      // l'élève a cliqué : pas de confirmation
  }
  else if (action === "confirm") {
    if (payload === 'yes') {
      addBotMessage("Parfait ! Voici ton projet d'orientation, juste à droite. Pense à le télécharger en PDF.");
      fillCardCustom(pendingSelection);
      state = 'start'; 
    } else {
      startMenu("D'accord, reprenons. Que veux-tu faire ?");
    }
  }
}

function handleFreeText(text){
  addUserMessage(text);

  if (state === 'confirm') {
    const yn = matchYesNo(text);
    // Le message de l'élève est déjà affiché ci-dessus : on ne repasse PAS par
    // handleUserChoice(), qui le réafficherait ("oui" puis "Oui" en double).
    if (yn === 'yes') applyChoice("confirm", "yes");
    else if (yn === 'no') applyChoice("confirm", "no");
    else addBotMessage("Je n'ai pas bien compris, réponds par Oui ou par Non.", [
      {label:"Oui", action:"confirm", payload:"yes"},
      {label:"Non", action:"confirm", payload:"no"}
    ]);
    return;
  }

  // Pendant le quiz, le champ de saisie ne doit pas lancer une recherche : cela
  // laisserait la conversation dans un état incohérent, au milieu du questionnaire.
  if (state === 'quiz') {
    addBotMessage("Pour cette question, choisis l'une des réponses proposées ci-dessus. " +
                  "Tu pourras écrire librement après le quiz.");
    return;
  }
  if (state === 'quiz_resultat') {
    addBotMessage("Choisis l'une des trois pistes ci-dessus, ou reviens au menu pour " +
                  "faire une autre recherche.",
      [{ label: "Retour au menu", action: "menu", payload: null }]);
    return;
  }

  if (state === 'search_domaine') processSearch(text, 'domaine');
  else if (state === 'search_formation') processSearch(text, 'formation');
  else if (state === 'search_etab') processSearch(text, 'etab');
  else {
    processSearch(text, 'domaine');
  }
}

sendBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  handleFreeText(text);
});
input.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    const text = input.value.trim();
    if(!text) return;
    input.value = '';
    handleFreeText(text);
  }
});

const micBtn = document.getElementById('micBtn');
const micNote = document.getElementById('micNote');
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognitionAPI){
  micBtn.disabled = true;
  micNote.textContent = "Micro non dispo. sur ce navigateur.";
} else {
  const recognition = new SpeechRecognitionAPI();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  let listening = false;

  micBtn.addEventListener('click', () => {
    if(listening) return;
    recognition.start();
  });
  recognition.addEventListener('start', () => {
    listening = true;
    micBtn.classList.add('listening');
    micNote.textContent = "Je t'écoute…";
  });
  recognition.addEventListener('result', (event) => {
    input.value = event.results[0][0].transcript;
    input.focus();
  });
  recognition.addEventListener('end', () => {
    listening = false;
    micBtn.classList.remove('listening');
    micNote.textContent = "";
  });
  recognition.addEventListener('error', () => {
    listening = false;
    micBtn.classList.remove('listening');
    micNote.textContent = "Je n'ai pas réussi à t'entendre.";
  });
}

// Lancement automatique du script
setTimeout(startMenu, 400);
