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

/* =============================================================================
 * COMPRÉHENSION DU TEXTE LIBRE
 *
 * Le bot reste entièrement DÉTERMINISTE : aucune intelligence artificielle,
 * aucun appel réseau, aucune donnée inventée. Tout ce que le bot « comprend »
 * vient des dictionnaires ci-dessous, écrits à la main.
 *
 * Trois améliorations par rapport à la simple recherche de sous-chaîne :
 *
 *   1. UN VOCABULAIRE D'ÉLÈVE. « bagnole », « mécano », « je veux réparer des
 *      voitures » doivent mener à la mécanique auto. Les mots-clés de bdd_pro.js
 *      sont des termes d'adulte ; ceux d'ici sont ceux des élèves.
 *
 *   2. LA TOLÉRANCE AUX FAUTES (distance de Levenshtein). Un élève de 3e écrit
 *      « mécanissien », « estéticienne », « boulangé ». Une faute ne doit pas
 *      faire échouer la recherche.
 *
 *   3. UNE SORTIE DE SECOURS UTILE. Quand rien ne correspond vraiment, on ne
 *      répond plus « je n'ai pas compris » : on propose les trois domaines les
 *      plus proches. L'élève a le sentiment d'être entendu, et rien n'est
 *      inventé — ce sont bien les domaines les mieux notés.
 * ========================================================================== */

/* -----------------------------------------------------------------------------
 * 1. VOCABULAIRE DES ÉLÈVES
 *
 * Métiers, gestes, objets, argot. Volontairement en langue « d'élève » et non
 * en nomenclature officielle : personne ne tape « maintenance des matériels ».
 * Les termes sont écrits SANS ACCENT (le texte saisi est normalisé avant).
 * -------------------------------------------------------------------------- */
const VOCABULAIRE = {

  relation_client: [
    "vendeur", "vendeuse", "vendre", "caissier", "caissiere", "caisse",
    "boutique", "magasin", "commerce", "commercial", "commerciale",
    "conseiller de vente", "rayon", "supermarche", "clientele", "e-commerce"
  ],

  gestion_logistique: [
    "logistique", "entrepot", "cariste", "magasinier", "stock", "stocks",
    "livreur", "livraison", "colis", "secretaire", "secretariat",
    "bureau", "administratif", "paperasse", "gestionnaire"
  ],

  conduite: [
    "conducteur", "conductrice", "conduire", "chauffeur", "chauffeuse", "routier",
    "poids lourd", "poids lourds", "camion", "camions", "semi remorque", "bus",
    "autobus", "autocar", "car", "permis", "permis poids lourd", "route", "routes",
    "livraison", "livreur", "transport de voyageurs", "volant"
  ],

  sante_social: [
    "infirmier", "infirmiere", "aide soignant", "aide soignante", "soignant",
    "hopital", "clinique", "medecin", "docteur", "ambulancier", "pharmacie",
    "creche", "nounou", "puericultrice", "petite enfance", "bebe", "bebes",
    "maison de retraite", "ehpad", "personnes agees", "handicap", "educateur",
    "animateur", "animation", "assistante maternelle", "auxiliaire", "prendre soin",
    "aider les gens", "aider les autres", "s occuper des gens", "soigner"
  ],

  beaute: [
    "coiffeur", "coiffeuse", "coiffure", "salon de coiffure", "couper les cheveux",
    "estheticienne", "estheticien", "esthetique", "institut", "spa",
    "maquillage", "maquilleuse", "make up", "ongles", "onglerie", "manucure",
    "prothesiste ongulaire", "soins", "beaute", "cosmetique", "parfum", "barbier"
  ],

  numerique_energie: [
    "electricien", "electricienne", "electricite", "cablage", "tableau electrique",
    "domotique", "maison connectee", "borne de recharge", "panneau solaire",
    "photovoltaique", "eolienne", "reseau", "reseaux", "fibre", "fibre optique",
    "informatique", "ordinateur", "ordi", "pc", "cyber", "cybersecurite",
    "hacker", "pirate", "code", "coder", "programmer", "programmation",
    "developpeur", "dev", "serveur", "wifi", "internet", "electronique",
    "melec", "ciel", "geek", "technologie"
  ],

  batiment: [
    "macon", "maconnerie", "chantier", "batiment", "btp", "construire",
    "construction", "beton", "brique", "mur", "murs", "plombier", "plomberie",
    "peintre", "peinture", "carreleur", "carrelage", "couvreur", "toit",
    "toiture", "charpente", "platrier", "placo", "grue", "travaux publics",
    "route", "routes", "canalisation", "renovation", "renover"
  ],

  etudes_batiment: [
    "architecte", "architecture", "dessinateur", "dessin technique", "plan",
    "plans", "maquette", "maquette numerique", "bim", "modelisation",
    "geometre", "topographe", "bureau d etudes", "conception", "cao", "dao",
    "3d", "revit", "autocad", "metreur", "economiste de la construction"
  ],

  agencement_bois: [
    "menuisier", "menuiserie", "ebeniste", "ebenisterie", "bois", "meuble",
    "meubles", "agencement", "cuisiniste", "parquet", "escalier", "porte",
    "fenetre", "atelier bois", "scie", "rabot", "poncer", "decoration",
    "amenagement interieur", "tapissier"
  ],

  realisation_mecanique: [
    "soudeur", "soudure", "souder", "chaudronnier", "chaudronnerie", "metal",
    "metallier", "serrurier", "usinage", "usiner", "tourneur", "fraiseur",
    "tour", "fraiseuse", "commande numerique", "cnc", "piece mecanique",
    "pieces", "acier", "inox", "atelier", "industrie", "fabrication"
  ],

  pilotage_maintenance: [
    "maintenance", "maintenir", "depanner", "depannage", "automatisme",
    "automate", "robot", "robotique", "usine", "production", "chaine de production",
    "ligne de production", "operateur", "pilote de ligne", "regleur",
    "machine", "machines", "industriel", "conduite de machine", "mspc", "pilotage"
  ],

  maintenance_vehicules: [
    "mecanicien", "mecanique", "mecano", "garage", "garagiste", "voiture",
    "voitures", "bagnole", "bagnoles", "auto", "automobile", "moteur", "moteurs",
    "reparer des voitures", "reparer les voitures", "carrosserie", "carrossier",
    "peinture auto", "moto", "motos", "scooter", "deux roues", "poids lourds", "engin", "engins", "tracteur", "vehicule", "vehicules",
    "pneu", "pneus", "vidange", "diagnostic", "tuning"
  ],

  hotellerie_restauration: [
    "cuisinier", "cuisiniere", "cuisine", "cuisiner", "cuistot", "chef",
    "chef cuisinier", "restaurant", "restauration", "serveur", "serveuse",
    "service en salle", "brasserie", "hotel", "hotellerie", "reception", "barman", "pizzaiolo",
    "faire a manger", "food"
  ],

  securite: [
    "securite", "agent de securite", "vigile", "gardien", "surveillance",
    "pompier", "pompiers", "policier", "police", "gendarme", "gendarmerie",
    "militaire", "armee", "soldat", "secours", "secourisme", "premiers secours",
    "protection", "proteger", "surveiller", "prevention", "incendie",
    "maitre chien", "penitentiaire", "prison", "douane"
  ],

  mode_art: [
    "couture", "coudre", "couturier", "couturiere", "styliste", "stylisme",
    "mode", "vetement", "vetements", "tissu", "tissus", "textile", "patron",
    "retouche", "retoucherie", "tailleur", "cuir", "maroquinerie", "sac",
    "chaussure", "cordonnier", "bijou", "bijoux", "bijoutier", "joaillier",
    "artisanat", "artisan", "art", "artistique", "creation", "creer", "dessin",
    "dessiner", "tatouage", "tatoueur", "broderie", "fleuriste"
  ],

  aeronautique: [
    "aeronautique", "aero", "avion", "avions", "avionique", "aviation",
    "helicoptere", "aile", "reacteur", "turbine", "cockpit", "aeroport",
    "mecanicien avion", "mecanicien aeronautique", "piste", "hangar",
    "airbus", "boeing", "aerien", "aerienne", "drone", "drones"
  ],

  alimentation: [
    "boulanger", "boulangere", "boulangerie", "pain", "baguette", "viennoiserie",
    "patissier", "patissiere", "patisserie", "gateau", "gateaux", "dessert",
    "desserts", "chocolat", "chocolatier", "boucher", "boucherie", "charcutier",
    "charcuterie", "traiteur", "poissonnier", "fournil", "petrir", "four"
  ],

  nature_paysage: [
    "jardinier", "jardin", "jardinage", "paysagiste", "paysage", "espaces verts",
    "plante", "plantes", "fleur", "fleurs", "arbre", "arbres", "elagage",
    "elagueur", "tondre", "tonte", "pelouse", "nature", "exterieur",
    "plein air", "dehors", "agriculture", "agricole", "ferme", "animaux",
    "horticulture", "pepiniere", "foret", "bucheron", "environnement", "ecologie"
  ]
};

/* -----------------------------------------------------------------------------
 * 2. DISTANCE DE LEVENSHTEIN
 * Nombre minimal de modifications (ajout, suppression, substitution) pour
 * passer d'un mot à l'autre. « mecanissien » -> « mecanicien » : distance 2.
 * -------------------------------------------------------------------------- */
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  // Sortie rapide : une différence de longueur trop grande ne vaut pas le calcul
  if (Math.abs(a.length - b.length) > 3) return 99;

  let prev = new Array(b.length + 1);
  let cur  = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cout);
    }
    const tmp = prev; prev = cur; cur = tmp;
  }
  return prev[b.length];
}

// Tolérance proportionnelle à la longueur du mot : on n'accepte pas la même
// marge d'erreur sur « bus » (3 lettres) que sur « chaudronnier » (12).
function toleranceFautes(mot) {
  if (mot.length <= 4)  return 0;   // trop court : une faute change le sens
  if (mot.length <= 7)  return 1;
  return 2;
}

/* -----------------------------------------------------------------------------
 * 3. NOTATION DES DOMAINES
 *
 * Chaque domaine reçoit un score. Trois sources, par ordre de fiabilité :
 *   - expression exacte trouvée dans la phrase      (le plus sûr)
 *   - mot isolé correspondant exactement à un terme
 *   - mot isolé approchant un terme (faute de frappe)
 * -------------------------------------------------------------------------- */

// Mots vides : présents partout, ils ne disent rien du domaine.
const MOTS_VIDES = new Set([
  "je", "j", "tu", "il", "elle", "on", "nous", "vous", "ils", "veux", "voudrais",
  "aimerais", "souhaite", "cherche", "recherche", "faire", "fais", "etre", "suis",
  "travailler", "metier", "metiers", "domaine", "formation", "un", "une", "des",
  "du", "de", "la", "le", "les", "l", "d", "et", "ou", "avec", "dans", "pour",
  "en", "au", "aux", "mon", "ma", "mes", "plus", "tres", "bien", "beaucoup",
  "aime", "aimer", "adore", "interesse", "passionne", "envie", "plutot", "peut",
  "etre", "que", "qui", "quoi", "comme", "sur", "ce", "ca", "cela", "sais", "pas"
]);

/* -----------------------------------------------------------------------------
 * MOTS DE STRUCTURE
 *
 * « bac », « pro », « CAP », « lycée », « seconde » ne décrivent pas un métier :
 * ils décrivent la CATÉGORIE de ce qu'on cherche. Les laisser dans la recherche
 * produit deux dégâts :
 *
 *   1. Du bruit. « bac » correspond aux 48 intitulés qui commencent par
 *      « Bac Pro… » → 48 boutons dans le fil. Un élève qui tape « bac » ne sait
 *      justement pas quoi chercher : lui jeter 48 boutons, c'est le punir de ne
 *      pas savoir.
 *
 *   2. Des silences. « lycée Doisneau » — la formulation la PLUS naturelle pour
 *      un élève de 3e — ne renvoyait RIEN, alors que « Doisneau » seul
 *      fonctionne. Le mot générique empoisonnait la recherche légitime.
 *
 * On les retire donc de la saisie avant de chercher. S'il ne reste rien, c'est
 * que l'élève n'a pas encore d'idée : on lui pose une question, on ne lui
 * déverse pas la base.
 *
 * ATTENTION : ne mettre ici que des mots qui n'apparaissent JAMAIS seuls comme
 * critère utile. « cuisine » est un métier, « seconde » n'en est pas un.
 * -------------------------------------------------------------------------- */
const MOTS_STRUCTURE = {
  // Niveaux de diplôme
  niveau: ["bac", "bacs", "pro", "professionnel", "professionnelle", "cap",
           "seconde", "2nde", "diplome", "diplomes", "bacpro"],
  // Types d'établissement
  lieu:   ["lycee", "lycees", "etablissement", "etablissements", "ecole", "ecoles",
           "erea", "college", "colleges"],
  // Mots creux de recherche
  vague:  ["formation", "formations", "metier", "metiers", "filiere", "filieres",
           "orientation", "voie", "etude", "etudes", "cursus", "option", "options"]
};

const TOUS_MOTS_STRUCTURE = new Set(
  [].concat(MOTS_STRUCTURE.niveau, MOTS_STRUCTURE.lieu, MOTS_STRUCTURE.vague)
);

/**
 * Retire les mots de structure d'une saisie.
 * Renvoie { reste, categories } :
 *   - `reste`      : la saisie nettoyée, normalisée (peut être vide)
 *   - `categories` : les familles de mots retirés ("niveau", "lieu", "vague"),
 *                    ce qui permet de répondre PRÉCISÉMENT à l'élève plutôt
 *                    que par un « je n'ai pas compris » générique.
 *
 * Exemples :
 *   « lycée Doisneau »   → { reste: "doisneau",  categories: ["lieu"] }
 *   « bac pro cuisine »  → { reste: "cuisine",   categories: ["niveau"] }
 *   « bac »              → { reste: "",          categories: ["niveau"] }
 */
function retirerMotsStructure(texte) {
  const mots = normalize(texte).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const categories = [];
  const gardes = [];

  mots.forEach(function (mot) {
    if (!TOUS_MOTS_STRUCTURE.has(mot)) { gardes.push(mot); return; }
    Object.keys(MOTS_STRUCTURE).forEach(function (cat) {
      if (MOTS_STRUCTURE[cat].indexOf(mot) !== -1 && categories.indexOf(cat) === -1) {
        categories.push(cat);
      }
    });
  });

  return { reste: gardes.join(" ").trim(), categories: categories };
}

// Recherche un mot-clé dans la phrase en respectant les FRONTIÈRES DE MOT.
// Sans cela, « plan » (études du bâtiment) se déclencherait sur « plantes »
// (nature et paysage). Le pluriel reste toléré.
function echappe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Teste un terme simple ou composé dans une phrase normalisée, sans faux positif lexical.
function contientTerme(phrase, terme) {
  if (terme.indexOf(" ") !== -1) return phrase.indexOf(terme) !== -1;  // expression
  return new RegExp("\\b" + echappe(terme) + "(s|es|x)?\\b").test(phrase);
}

// Nombre maximum de mots analysés. Chaque mot est comparé à tout le vocabulaire
// (distance de Levenshtein) : sans plafond, un texte très long ferait ramer les
// téléphones modestes. 30 mots utiles couvrent très largement une réponse
// d'élève ; au-delà, l'intention est déjà claire (voir aussi LIMITE_SAISIE dans
// app_pro.js, qui borne la saisie en amont).
const MAX_MOTS_ANALYSES = 30;

// Extrait les mots significatifs d'une saisie et borne le coût de leur analyse.
function motsDe(texte) {
  return normalize(texte)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(function (m) { return m.length > 1 && !MOTS_VIDES.has(m); })
    .slice(0, MAX_MOTS_ANALYSES);
}

/**
 * Note tous les domaines pour un texte donné.
 * Renvoie un tableau trié : [{ domainKey, score, indices: [...] }]
 * `indices` contient les termes reconnus — utile pour expliquer à l'élève
 * pourquoi on lui propose ce domaine.
 */
function scoreDomaines(texte) {
  const phrase = normalize(texte);
  const mots   = motsDe(texte);
  const res    = {};

  Object.keys(DOMAINS).forEach(function (dom) {
    res[dom] = { domainKey: dom, score: 0, indices: [] };
  });

  // Ajoute des points à un domaine et conserve une seule fois l'indice reconnu.
  function ajouter(dom, points, indice) {
    if (!res[dom]) return;
    res[dom].score += points;
    if (res[dom].indices.indexOf(indice) === -1) res[dom].indices.push(indice);
  }

  // --- a) Les mots-clés officiels de bdd_pro.js (MELEC, ASSP, AGORA…) ---
  Object.keys(DOMAINS).forEach(function (dom) {
    (DOMAINS[dom].keywords || []).forEach(function (kw) {
      const k = normalize(kw);
      if (k.length < 3) return;
      if (contientTerme(phrase, k)) ajouter(dom, 5, kw);
    });
  });

  // --- b) Le vocabulaire des élèves ---
  Object.keys(VOCABULAIRE).forEach(function (dom) {
    VOCABULAIRE[dom].forEach(function (terme) {

      // Expression de plusieurs mots : on la cherche telle quelle
      if (terme.indexOf(" ") !== -1) {
        if (phrase.indexOf(terme) !== -1) ajouter(dom, 6, terme);
        return;
      }

      // Mot isolé : correspondance exacte, puis approchante
      mots.forEach(function (mot) {
        if (mot === terme) { ajouter(dom, 5, terme); return; }

        // Racine commune : « mecanicien » contient « mecanique »… on accepte
        // qu'un mot commence par le terme (pluriels, dérivés) si c'est assez long
        if (terme.length >= 5 && mot.indexOf(terme) === 0) { ajouter(dom, 4, terme); return; }

        const tol = toleranceFautes(terme);
        if (tol > 0 && levenshtein(mot, terme) <= tol) ajouter(dom, 4, terme);
      });
    });
  });

  return Object.keys(res)
    .map(function (k) { return res[k]; })
    .filter(function (o) { return o.score > 0; })
    .sort(function (a, b) { return b.score - a.score; });
}

/* Seuil de confiance : en dessous, on ne prétend pas avoir compris. */
const SEUIL_CONFIANCE = 4;

/** Domaines reconnus avec assez de certitude pour être proposés directement. */
function domainesSurs(texte) {
  const notes = scoreDomaines(texte);
  if (!notes.length) return [];
  const meilleur = notes[0].score;
  if (meilleur < SEUIL_CONFIANCE) return [];
  // On garde ceux qui font jeu égal ou presque : l'élève tranchera.
  return notes
    .filter(function (o) { return o.score >= meilleur * 0.7; })
    .map(function (o) { return o.domainKey; });
}

/** Les trois pistes les plus proches, même si la certitude est faible. */
function pistesProches(texte, n) {
  return scoreDomaines(texte).slice(0, n || 3);
}
