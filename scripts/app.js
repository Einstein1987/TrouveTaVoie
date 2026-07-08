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

function matchFormations(text){
  const n = normalize(text);
  const matches = [];
  for(const key in DOMAINS) {
    let found = DOMAINS[key].formations.some(f => normalize(f.nom).includes(n) || n.includes(normalize(f.nom)));
    if (found && !matches.includes(key)) matches.push(key);
  }
  return matches;
}

function matchEtablissements(text){
  const n = normalize(text);
  const matches = [];
  for(const key in DOMAINS) {
    // On vérifie si l'un des établissements correspond au texte
    let found = DOMAINS[key].formations.some(f => 
       f.etablissements.some(e => normalize(e.nom).includes(n) || n.includes(normalize(e.nom)))
    );
    if (found && !matches.includes(key)) matches.push(key);
  }
  return matches;
}

function matchYesNo(text){
  const n = normalize(text);
  if(YES_WORDS.some(w => n.includes(w))) return 'yes';
  if(NO_WORDS.some(w => n.includes(w))) return 'no';
  return null;
}

let state = 'start'; 
let pendingDomain = null;
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

function pingStats(domainKey) {
  // ASTUCE NETLIFY / GOOGLE FORMS :
  // Pour enregistrer des statistiques sans base de données PHP :
  // 1. Crée un Google Form avec une seule question "Domaine" (Réponse courte).
  // 2. Récupère l'URL d'action du formulaire et le nom de l'input (ex: entry.1234567).
  // 3. Décommente le code ci-dessous et remplace avec tes identifiants.
  
  /*
  const formURL = "https://docs.google.com/forms/d/e/TON_ID_DE_FORMULAIRE/formResponse";
  const formData = new FormData();
  formData.append("entry.123456789", domainKey); 
  fetch(formURL, { method: "POST", body: formData, mode: "no-cors" }).catch(e => console.log(e));
  */
  console.log("Statistique prête à être envoyée (mode local) : " + domainKey);
}

function fillCard(domainKey) {
    const data = DOMAINS[domainKey];
    showFilledCard(data);
    fillDetails(data);
    const cardActions = document.getElementById("cardActions");
    if (cardActions) {
        cardActions.style.display = "flex";
    }
    if (typeof pingStats === "function") {
        pingStats(domainKey);
    }
}

function showFilledCard(data) {
    document.getElementById("cardEmpty").style.display = "none";
    const filled = document.getElementById("cardFilled");
    filled.style.display = "block";
    document.getElementById("cardDate").textContent =
        new Date().toLocaleDateString("fr-FR");
    document.getElementById("cardMetier").textContent = data.label;
}

function fillDetails(data) {
    const container = document.getElementById("cardDetailsContainer");
    container.innerHTML = "";
    data.formations.forEach(formation => {
        container.appendChild(createFormationBlock(formation));
    });
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
    if (etablissement.transport) {
        const transport = document.createElement("div");
        transport.className = "school-transport";
        transport.textContent = "Transport : " + etablissement.transport;
        card.appendChild(transport);
    }
    return card;
}

function startMenu(){
  state = 'start';
  pendingDomain = null;
  addBotMessage("Bonjour ! Je suis là pour t'aider. Où en es-tu ?", [
    {label: "Je connais la famille de métiers ou le domaine qui m'intéresse", action: "set_state", payload: "search_domaine"},
    {label: "Je cherche les lycées qui propose la formation que je souhaite", action: "set_state", payload: "search_formation"},
    {label: "Je souhaite trouver toutes les formations proposé par le lycée souhaité", action: "set_state", payload: "search_etab"},
    {label: "Je suis perdu (Faire le Quiz)", action: "start_quiz", payload: null}
  ]);
}

function askConfirm(domainKey){
  if(!DOMAINS[domainKey]){ startMenu(); return; }
  state = 'confirm';
  pendingDomain = domainKey;
  addBotMessage(`Il me semble que tu penses à : ${DOMAINS[domainKey].label}. C'est bien ça ?`, [
    {label: "Oui", action: "confirm", payload: "yes"},
    {label: "Non", action: "confirm", payload: "no"}
  ]);
}

function startQuiz() {
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
    askConfirm(bestDomain);
  }
}

function processSearch(text, type) {
  let matches = [];
  if (type === 'domaine') matches = matchDomains(text);
  else if (type === 'formation') matches = matchFormations(text);
  else if (type === 'etab') matches = matchEtablissements(text);

  if (matches.length === 1) {
    askConfirm(matches[0]);
  } else if (matches.length > 1) {
    let opts = matches.map(key => ({label: DOMAINS[key].label, action: "direct_confirm", payload: key}));
    addBotMessage("Plusieurs pistes correspondent. Laquelle te parle le plus ?", opts);
  } else {
    addBotMessage("Je n'ai rien trouvé de précis dans ma base. Veux-tu essayer une autre recherche ou faire le quiz ?", [
      {label: "Refaire une recherche", action: "set_state", payload: "start"},
      {label: "Faire le quiz", action: "start_quiz", payload: null}
    ]);
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
  else if (action === "direct_confirm") {
    askConfirm(payload);
  }
  else if (action === "confirm") {
    if (payload === 'yes') {
      addBotMessage("Parfait ! Voici ton projet d'orientation, juste à droite. N'oublie pas de l'imprimer.");
      fillCard(pendingDomain);
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
