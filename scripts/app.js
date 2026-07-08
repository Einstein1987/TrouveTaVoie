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

function fillCard(domainKey){
  const data = DOMAINS[domainKey];
  if (!data) return;

  document.getElementById('cardEmpty').style.display = 'none';
  const filled = document.getElementById('cardFilled');
  if (filled) filled.style.display = 'block';
  
  const dateEl = document.getElementById('cardDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('fr-FR');
  
  const metierEl = document.getElementById('cardMetier');
  if (metierEl) metierEl.textContent = data.label;

  const fWrap = document.getElementById('cardFormations');
  const eWrap = document.getElementById('cardEtabs');
  if (fWrap) fWrap.innerHTML = '';
  if (eWrap) eWrap.innerHTML = '';

  if (data.formations) {
    data.formations.forEach(f => {
      // 1. Remplissage des puces de formations
      const c = document.createElement('span');
      c.className = 'chip';
      c.textContent = f.nom + (f.niveau ? ' (' + f.niveau + ')' : '');
      if (fWrap) fWrap.appendChild(c);

      // 2. Remplissage de la liste des lycées DANS chaque formation
      if (f.etablissements && f.etablissements.length > 0) {
        f.etablissements.forEach(e => {
          const row = document.createElement('div');
          row.className = 'estab';
          row.innerHTML = `<strong>${e.nom}</strong> — ${e.ville} <span style="font-size:11px; color:var(--brass-dark);">[Pour : ${f.nom}]</span>
                           <div class="t">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                             Trajet : ${e.transport}
                           </div>`;
          if (eWrap) eWrap.appendChild(row);
        });
      }
    });
  }

  // 3. Coefficients Affelnet
  const tr = document.getElementById('cardCoeffs');
  if (tr) {
    tr.innerHTML = '';
    if (data.coeffs) {
      data.coeffs.forEach(c => {
        const td = document.createElement('td');
        td.textContent = c;
        tr.appendChild(td);
      });
    }
  }

  const printBtn = document.getElementById('printBtn');
  if (printBtn) printBtn.style.display = 'block';
  
  // 4. Envoi statistique invisible
  if (typeof pingStats === "function") {
      pingStats(domainKey);
  }
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
  state = 'confirm';
  pendingDomain = domainKey;
  addBotMessage(`Il me semble que tu penses à : ${DOMAINS[domainKey].label}. C'est bien ça ?`, [
    {label: "Oui", action: "confirm", payload: "yes"},
    {label: "Non", action: "confirm", payload: "no"}
  ]);
}

function startQuiz() {
  state = 'quiz_q1';
  quizScores = { relation_client: 0, sante_social: 0, numerique_energie: 0, construction_batiment: 0, restauration_alimentation: 0, mecanique_maintenance: 0 };
  addBotMessage("D'accord, procédons par élimination. Préfères-tu :", [
    {label: "Le travail sur ordinateur / au bureau", action: "quiz_answer", payload: ["numerique_energie", "relation_client"]},
    {label: "Le travail manuel / bouger", action: "quiz_answer", payload: ["construction_batiment", "mecanique_maintenance", "restauration_alimentation", "sante_social"]}
  ]);
}

function nextQuizStep(answerPayload) {
  answerPayload.forEach(domain => { if(quizScores[domain] !== undefined) quizScores[domain]++; });

  if (state === 'quiz_q1') {
    state = 'quiz_q2';
    addBotMessage("Question 2 : Aimes-tu être en contact avec le public ou des clients ?", [
      {label: "Oui, j'aime aider ou conseiller les autres", action: "quiz_answer", payload: ["relation_client", "sante_social", "restauration_alimentation"]},
      {label: "Non, je préfère la technique ou travailler seul/en équipe", action: "quiz_answer", payload: ["numerique_energie", "construction_batiment", "mecanique_maintenance"]}
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
document.getElementById('printBtn').addEventListener('click', () => window.print());

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
