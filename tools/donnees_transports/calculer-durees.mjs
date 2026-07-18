// =============================================================================
// TrouveTaVoie — Pré-calcul des durées ET des lignes de transport (collège -> lycées)
// via le calculateur d'itinéraires Île-de-France Mobilités (portail PRIM, Navitia).
//
// À lancer À LA MAIN, une fois par an (quand l'offre change) :
//   PRIM_API_KEY=ta_cle  node calculer-durees.mjs
//
// Il produit "durees.generated.json" : un objet
//   { "Nom|Ville": { "dureeMin": 71, "trajet": "RER D puis Bus 402" } }
// à recopier dans bdd.js (table DUREES_TRANSPORT_CORBEIL).
//
// Données © Île-de-France Mobilités (licence OdBL) — attribution obligatoire.
// =============================================================================

import fs from "node:fs";

const API_KEY = process.env.PRIM_API_KEY;
if (!API_KEY) {
  console.error("❌ Définis la variable d'environnement PRIM_API_KEY.");
  process.exit(1);
}

const BASE = "https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia";
const AUTH_HEADERS = { apikey: API_KEY };

// --- Origine : le collège La Nacelle (Corbeil-Essonnes) ----------------------
const ORIGINE_QUERY = "Collège La Nacelle Corbeil-Essonnes";
const ORIGINE_FALLBACK = [48.6109, 2.4823]; // [lat, lon] approximatif, à ajuster

// --- Destinations : la liste des lycées (Nom|Ville) --------------------------
const LYCEES = [
  "Lycée Robert Doisneau|Corbeil-Essonnes",
  "Lycée Auguste Perret|Évry-Courcouronnes",
  "Lycée Charles Baudelaire|Évry-Courcouronnes",
  "Lycée Georges Brassens|Évry-Courcouronnes",
  "Lycée Parc des Loges|Évry-Courcouronnes",
  "Lycée Pierre Mendès France|Ris-Orangis",
  "Lycée Château des Coudraies|Étiolles",
  "Lycée Marie Laurencin|Mennecy",
  "Lycée François Truffaut|Bondoufle",
  "Lycée Les Frères Moreau|Quincy-sous-Sénart",
  "Lycée Nadar|Draveil",
  "EREA Jean Isoard|Montgeron",
  "Lycée André-Marie Ampère|Morsang-sur-Orge",
  "Lycée Paul Langevin|Sainte-Geneviève-des-Bois",
  "Lycée Jean Monnet|Juvisy-sur-Orge",
  "Lycée Gaspard Monge|Savigny-sur-Orge",
  "Lycée Louis Armand|Yerres",
  "Lycée Clément Ader|Athis-Mons",
  "Lycée Léonard de Vinci|Saint-Michel-sur-Orge",
  "Lycée Jean-Pierre Timbaud|Brétigny-sur-Orge",
  "Lycée Marguerite Yourcenar|Morangis",
  "Lycée Jean Perrin|Longjumeau",
  "Lycée Alexandre Denis|Cerny",
  "Lycée Paul Belmondo|Arpajon",
  "EREA Le Château du Lac|Ollainville",
  "Lycée Gustave Eiffel|Massy",
  "Lycée Parc de Vilgénis|Massy",
  "Lycée Henri Poincaré|Palaiseau",
  "Lycée International Paris-Saclay|Palaiseau",
  "Lycée L'Essouriau|Les Ulis",
  "Lycée Nelson Mandela|Étampes",
  "Lycée Geoffroy Saint-Hilaire|Étampes",
  "Lycée Nikola Tesla|Dourdan",
];

// Corrections manuelles si le géocodage tombe à côté : "Nom|Ville" -> [lat, lon]
const OVERRIDES = {
  // "Lycée X|Ville": [48.xxxx, 2.yyyy],
};

// Libellés de mode « propres » (Navitia dit parfois "Tramway", "Rer"…)
const MODE_LABELS = {
  Tramway: "Tram",
  Rer: "RER",
  Metro: "Métro",
  Métro: "Métro"
};

// --- Helpers -----------------------------------------------------------------

// Navitia attend les coordonnées au format "lon;lat" (⚠️ lon d'abord).
const toNavitia = ([lat, lon]) => `${lon};${lat}`;

async function callNavitia(path) {
  const res = await fetch(`${BASE}${path}`, { headers: AUTH_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${await res.text()}`);
  return res.json();
}

async function geocode(query) {
  const data = await callNavitia(`/places?q=${encodeURIComponent(query)}&count=1`);
  const place = data.places?.[0];
  if (!place) return null;
  const coord = place[place.embedded_type]?.coord;
  if (!coord) return null;
  return [parseFloat(coord.lat), parseFloat(coord.lon)];
}

function prochainLundi8h() {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T080000`;
}

// Reconstruit "RER D puis Bus 402" à partir des sections en transport en commun.
function resumeTrajet(journey) {
  const segments = (journey.sections || [])
    .filter((s) => s.type === "public_transport" && s.display_informations)
    .map((s) => {
      const di = s.display_informations;
      let mode = di.commercial_mode || di.physical_mode || "";
      mode = MODE_LABELS[mode] || mode;
      const code = di.code || di.label || "";
      // Évite "RER RER" quand mode et code se recoupent.
      return code && code !== mode ? `${mode} ${code}`.trim() : mode;
    })
    .filter(Boolean);
  return segments.join(" puis ") || "Trajet direct / à pied";
}

// Meilleur trajet (le plus court) : renvoie { dureeMin, trajet }.
async function trajet(fromLatLon, toLatLon) {
  const params = new URLSearchParams({
    from: toNavitia(fromLatLon),
    to: toNavitia(toLatLon),
    datetime: prochainLundi8h(),
    datetime_represents: "arrival",
    count: "3"
  });
  const data = await callNavitia(`/journeys?${params}`);
  const journeys = (data.journeys || []).filter((j) => typeof j.duration === "number");
  if (!journeys.length) return null;
  const best = journeys.reduce((a, b) => (a.duration <= b.duration ? a : b));
  return {
    dureeMin: Math.round(best.duration / 60),
    trajet: resumeTrajet(best)
  };
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Programme principal -----------------------------------------------------
(async () => {
  console.log("Géocodage de l'origine…");
  const origine = (await geocode(ORIGINE_QUERY).catch(() => null)) || ORIGINE_FALLBACK;
  console.log(`  origine = [${origine}]`);

  const resultats = {};
  for (const key of LYCEES) {
    const [nom, ville] = key.split("|");
    try {
      const dest = OVERRIDES[key] || (await geocode(`${nom} ${ville}`));
      if (!dest) throw new Error("géocodage introuvable (ajoute un OVERRIDE)");

      const t = await trajet(origine, dest);
      if (!t) throw new Error("aucun itinéraire trouvé");
      resultats[key] = t;
      console.log(`✅ ${key.padEnd(48)} ${String(t.dureeMin).padStart(3)} min — ${t.trajet}`);
    } catch (e) {
      resultats[key] = null;
      console.error(`⚠️  ${key.padEnd(48)} ÉCHEC — ${e.message}`);
    }
    await pause(300);
  }

  // Chemin construit depuis l'emplacement du script, et non depuis le dossier
  // courant : le fichier atterrit toujours dans tools/, où qu'on lance la commande.
  const sortie = new URL("transports.generated.json", import.meta.url);
  fs.writeFileSync(sortie, JSON.stringify(resultats, null, 2));
  console.log("\n→ transports.generated.json écrit. Recopie-le dans bdd.js.");
})();
