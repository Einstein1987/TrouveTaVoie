<script>
/* ==========================================================================
   DEBUT DU FICHIER JS (À extraire dans data.js ou app.js plus tard)
   BASE DE DONNÉES RESTRUCTUREE (Liaison stricte Formation -> Etablissement)
   ========================================================================== */
const DOMAINS = {
  relation_client: {
    label: "Métiers de la Relation Client (Commerce, Vente, Accueil)",
    keywords: ["commerce", "vente", "vendre", "client", "magasin", "accueil", "boutique", "relation client", "mrc", "mcva", "mcvb", "epc"],
    coeffs: [6, 5, 4, 5, 3, 3, 4], // FR, MATH, HG, LV, EPS, ARTS, SCI
    formations: [
      {
        nom: "2de Pro Métiers de la Relation Client (MRC)",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 (env. 15 min)"},
          {nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 ou 402 (env. 30 min)"},
          {nom: "Lycée Pierre Mendès-France", ville: "Ris-Orangis", transport: "RER D ou Bus 402 (env. 45 min)"},
          {nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 45 min)"}
        ]
      },
      {
        nom: "CAP Équipier Polyvalent du Commerce (EPC)",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 ou 402 (env. 30 min)"},
          {nom: "Lycée Pierre Mendès-France", ville: "Ris-Orangis", transport: "RER D ou Bus 402 (env. 45 min)"}
        ]
      }
    ]
  },
  sante_social: {
    label: "Santé, Social et Soins (ASSP, AEPE, AAGA)",
    keywords: ["sante", "social", "soin", "enfant", "personnes agees", "hopital", "medical", "infirmier", "aide", "assp", "petite enfance", "aepe", "aaga"],
    coeffs: [5, 4, 3, 3, 4, 4, 7], 
    formations: [
      {
        nom: "Bac Pro Accompagnement, soins et services à la personne (ASSP)",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 ou 402 (env. 30 min)"},
          {nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 45 min)"},
          {nom: "Lycée Léonard de Vinci", ville: "Saint-Michel-sur-Orge", transport: "RER D puis Bus (env. 55 min)"}
        ]
      },
      {
        nom: "CAP Accompagnant Éducatif Petite Enfance (AEPE)",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 ou 402 (env. 30 min)"}
        ]
      },
      {
        nom: "CAP Agent Accompagnant au Grand Age (AAGA)",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 ou 402 (env. 30 min)"},
          {nom: "Lycée Léonard de Vinci", ville: "Saint-Michel-sur-Orge", transport: "RER D puis Bus (env. 55 min)"}
        ]
      }
    ]
  },
  numerique_energie: {
    label: "Transitions Numérique et Énergétique (Électricité, Info, MELEC)",
    keywords: ["informatique", "ordinateur", "numerique", "electricite", "electricien", "ciel", "melec", "energie", "code", "technologie", "chauffage", "climatisation"],
    coeffs: [5, 6, 3, 4, 3, 2, 7], 
    formations: [
      {
        nom: "Bac Pro Cybersécurité, Informatique et Réseaux, Électronique (CIEL)",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Georges Brassens", ville: "Évry-Courcouronnes", transport: "Bus 402 (env. 25 min)"}
        ]
      },
      {
        nom: "Bac Pro Métiers de l'électricité et de ses environnements connectés (MELEC)",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 (env. 15 min)"},
          {nom: "Lycée Pierre Mendès-France", ville: "Ris-Orangis", transport: "RER D ou Bus 402 (env. 45 min)"}
        ]
      },
      {
        nom: "CAP Électricien",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 (env. 15 min)"},
          {nom: "Lycée Pierre Mendès-France", ville: "Ris-Orangis", transport: "RER D ou Bus 402 (env. 45 min)"}
        ]
      }
    ]
  },
  construction_batiment: {
    label: "Métiers du Bâtiment et de la Construction Durable",
    keywords: ["batiment", "construire", "construction", "menuisier", "menuiserie", "maçon", "travaux", "chantier", "architecture", "peintre", "carreleur"],
    coeffs: [5, 6, 3, 4, 3, 2, 7],
    formations: [
      {
        nom: "Bac Pro Technicien du Bâtiment (TBORGO)",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)"},
          {nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)"}
        ]
      },
      {
        nom: "CAP Maçon",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)"},
          {nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)"}
        ]
      },
      {
        nom: "CAP Menuisier Fabricant",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)"}
        ]
      }
    ]
  },
  restauration_alimentation: {
    label: "Hôtellerie, Restauration et Alimentation",
    keywords: ["cuisine", "cuisinier", "cuisiniere", "restaurant", "restauration", "chef", "patissier", "patisserie", "boulanger", "manger", "hotellerie"],
    coeffs: [5, 4, 3, 3, 4, 4, 7],
    formations: [
      {
        nom: "2de Pro Métiers de l'Hôtellerie-Restauration (MHR)",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)"}
        ]
      },
      {
        nom: "CAP Cuisine",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)"}
        ]
      },
      {
        nom: "Bac Pro Boulanger-Pâtissier",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)"}
        ]
      },
      {
        nom: "CAP Pâtissier",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)"}
        ]
      }
    ]
  },
  mecanique_maintenance: {
    label: "Maintenance des Véhicules et Mécanique",
    keywords: ["voiture", "mecanique", "mecanicien", "auto", "automobile", "garage", "carrosserie", "moteur", "maintenance", "remi"],
    coeffs: [4, 6, 3, 4, 3, 2, 8],
    formations: [
      {
        nom: "Bac Pro Maintenance des Véhicules (MVA)",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D puis Bus (env. 1h10)"}
        ]
      },
      {
        nom: "CAP Maintenance des Véhicules (Voitures Particulières)",
        niveau: "CAP",
        etablissements: [
          {nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D puis Bus (env. 1h10)"}
        ]
      },
      {
        nom: "2de Pro Réalisation d'Ensembles Mécaniques et Industriels (REMI)",
        niveau: "Bac Pro",
        etablissements: [
          {nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 (env. 15 min)"},
          {nom: "Lycée Georges Brassens", ville: "Évry-Courcouronnes", transport: "Bus 402 (env. 25 min)"}
        ]
      }
    ]
  }
};

const YES_WORDS = ["oui", "ouais", "exact", "voila", "c'est ca", "cest ca", "tout a fait", "carrement"];
const NO_WORDS = ["non", "pas vraiment", "pas trop", "pas exactement"];

function normalize(str){
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
}


/* ==========================================================================
   MOTEURS DE RECHERCHE LOCAUX
   ========================================================================== */
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
    // Vérifier si un des établissements de n'importe quelle formation de ce domaine correspond
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

/* ==========================================================================
   LOGIQUE D'ÉTAT DU BOT
   ========================================================================== */
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


// ---- API STATISTIQUES SANS PHP (Astuce Netlify / Google Form) ----
function pingStats(domainKey) {
  /* 
   * POUR NETLIFY: L'astuce est de créer un Google Form avec un champ texte "domaine".
   * Tu récupères l'URL d'action du formulaire (regarde dans le code source du Google Form)
   * et le nom de l'input (ex: entry.123456789).
   * Tu peux ainsi envoyer des données silencieusement sans aucun backend PHP !
   * 
   * Exemple de code :
   * const formURL = "https://docs.google.com/forms/d/e/TON_ID_DE_FORMULAIRE/formResponse";
   * const formData = new FormData();
   * formData.append("entry.123456789", domainKey); // Remplace par ton ID d'input
   * fetch(formURL, { method: "POST", body: formData, mode: "no-cors" });
   */
   
  console.log("Statistique enregistrée localement pour le domaine : " + domainKey);
  // Le code ci-dessus remplacera ton ancien appel PHP pour être compatible Netlify.
}

function fillCard(domainKey){
  const data = DOMAINS[domainKey];
  document.getElementById('cardEmpty').style.display = 'none';
  const filled = document.getElementById('cardFilled');
  filled.style.display = 'block';
  
  document.getElementById('cardDate').textContent = new Date().toLocaleDateString('fr-FR');
  document.getElementById('cardMetier').textContent = data.label;

  // Nouvelle structure : Formations liées à leurs Établissements
  const container = document.getElementById('cardDetailsContainer');
  container.innerHTML = '';
  
  data.formations.forEach(f => {
    let block = document.createElement('div');
    block.className = 'formation-block';
    
    let html = `<div class="formation-name">${f.nom} <span class="chip">${f.niveau}</span></div>`;
    
    f.etablissements.forEach(e => {
      html += `<div class="estab">
                 <strong>${e.nom}</strong> — ${e.ville}
                 <div class="t">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                   Trajet : ${e.transport}
                 </div>
               </div>`;
    });
    
    block.innerHTML = html;
    container.appendChild(block);
  });

  // Coefficients
  const tr = document.getElementById('cardCoeffs');
  tr.innerHTML = '';
  data.coeffs.forEach(c => {
    const td = document.createElement('td');
    td.textContent = c;
    tr.appendChild(td);
  });

  document.getElementById('printBtn').style.display = 'block';
  
  // Enregistrement de la stat
  pingStats(domainKey);
}


// ---- SCÉNARIOS DE CONVERSATION ----

function startMenu(){
  state = 'start';
  pendingDomain = null;
  addBotMessage("Bonjour ! Je suis là pour t'aider. Comment veux-tu procéder ?", [
    {label: "Chercher un domaine/métier", action: "set_state", payload: "search_domaine"},
    {label: "Je connais déjà une formation", action: "set_state", payload: "search_formation"},
    {label: "Rechercher par Lycée", action: "set_state", payload: "search_etab"},
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
  // Réinitialisation des scores avec les vraies clés
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


// ---- GESTION DES ENTRÉES ----

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

// ---- Reconnaissance vocale (micro) ----
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

// Initialisation
setTimeout(startMenu, 400);

</script>
