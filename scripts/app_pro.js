const YES_WORDS = ["oui", "ouais", "exact", "voila", "c'est ca", "cest ca", "tout a fait", "carrement"];
const NO_WORDS = ["non", "pas vraiment", "pas trop", "pas exactement"];

function normalize(str){
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
}

function matchDomains(text){
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

function matchYesNo(text){
  const n = normalize(text);
  if(YES_WORDS.some(w => n.includes(w))) return 'yes';
  if(NO_WORDS.some(w => n.includes(w))) return 'no';
  return null;
}

let state = 'start'; 
let pendingSelection = null;
let quizScores = {};

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

function addBotMessage(text, options){
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
    const optRow = document.createElement('div');
    optRow.className = 'optrow';
    options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'optbtn';
      if (opt.style === "help") {
        b.classList.add('opt-help');
      }
      b.textContent = opt.label;
      b.addEventListener('click', () => handleUserChoice(opt.label, opt.action, opt.payload));
      optRow.appendChild(b);
    });
    chatlog.appendChild(optRow);
  }
  chatlog.scrollTop = chatlog.scrollHeight;
}

function addUserMessage(text){
  const row = document.createElement('div');
  row.className = 'msg-row user';
  const bubble = document.createElement('div');
  bubble.className = 'msg user';
  bubble.textContent = text;
  row.appendChild(bubble);
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

function startMenu(){
  state = 'start';
  pendingSelection = null;
  const psyNote = document.getElementById("psyNote");
  if (psyNote) {
    psyNote.style.display = "none";
  }
  addBotMessage("Bonjour ! Je suis là pour t'aider. Où en es-tu ?", [
    {label: "Je connais déjà la formation que je veux faire", action: "set_state", payload: "search_formation"},
    {label: "Je connais la famille de métiers ou le domaine qui m'intéresse", action: "set_state", payload: "search_domaine"},
    {label: "Je connais un lycée et je veux voir ses formations", action: "set_state", payload: "search_etab"},
    {label: "Je suis perdu, j'ai besoin d'aide, je veux faire le quiz", action: "start_quiz", payload: null, style: "help"}
  ]);
}

function askConfirm(selection){
  if(!selection || !selection.formations || !selection.formations.length){ startMenu(); return; }
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

function startQuiz() {
  if (typeof pingStats === "function") pingStats('quiz_lance', '');
  state = 'quiz_q1';
  quizScores = { relation_client: 0, sante_social: 0, numerique_energie: 0, batiment: 0, restauration: 0, mecanique_auto: 0 };
  addBotMessage("D'accord, procédons par élimination. Préfères-tu :", [
    {label: "Le travail sur ordinateur / au bureau", action: "quiz_answer", payload: ["numerique_energie", "relation_client"]},
    {label: "Le travail manuel / bouger", action: "quiz_answer", payload: ["batiment", "mecanique_auto", "restauration", "sante_social"]}
  ]);
}

function nextQuizStep(answerPayload) {
  answerPayload.forEach(domain => { if(quizScores[domain] !== undefined) quizScores[domain]++; });

  if (state === 'quiz_q1') {
    state = 'quiz_q2';
    addBotMessage("Question 2 : Aimes-tu être en contact avec le public ou des clients ?", [
      {label: "Oui, j'aime aider ou conseiller les autres", action: "quiz_answer", payload: ["relation_client", "sante_social", "restauration"]},
      {label: "Non, je préfère la technique ou travailler seul/en équipe", action: "quiz_answer", payload: ["numerique_energie", "batiment", "mecanique_auto"]}
    ]);
  } else if (state === 'quiz_q2') {
    let bestDomain = Object.keys(quizScores).reduce((a, b) => quizScores[a] > quizScores[b] ? a : b);
    const selection = domainSelection(bestDomain);
    selection.fromQuiz = true;
    askConfirm(selection);
  }
}

function searchNotFound(){
  addBotMessage("Je n'ai rien trouvé de précis dans ma base. Veux-tu essayer une autre recherche ou faire le quiz ?", [
    {label: "Refaire une recherche", action: "set_state", payload: "start"},
    {label: "Faire le quiz", action: "start_quiz", payload: null}
  ]);
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
      searchNotFound();
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
      searchNotFound();
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
      searchNotFound();
    }
  }
}

function handleUserChoice(displayText, action, payload){
  addUserMessage(displayText);
  
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
  else if (action === "quiz_answer") {
    nextQuizStep(payload);
  }
  else if (action === "confirm_selection") {
    askConfirm(payload);
  }
  else if (action === "confirm") {
    if (payload === 'yes') {
      addBotMessage("Parfait ! Voici ton projet d'orientation, juste à droite. N'oublie pas de l'imprimer.");
      fillCardCustom(pendingSelection);
      state = 'start'; 
    } else {
      startMenu();
    }
  }
}

function handleFreeText(text){
  addUserMessage(text);

  if (state === 'confirm') {
    const yn = matchYesNo(text);
    if (yn === 'yes') handleUserChoice("Oui", "confirm", "yes");
    else if (yn === 'no') handleUserChoice("Non", "confirm", "no");
    else addBotMessage("Je n'ai pas bien compris, réponds par Oui ou par Non.", [
      {label:"Oui", action:"confirm", payload:"yes"},
      {label:"Non", action:"confirm", payload:"no"}
    ]);
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
