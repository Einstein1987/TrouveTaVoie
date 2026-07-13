// compute-distances.mjs
// -----------------------------------------------------------------------------
// Recalcule les distances entre le Collège La Nacelle (Corbeil-Essonnes) et
// chaque lycée, pour la table DISTANCES_CORBEIL_ESSONNES de scripts/bdd.js.
//
// Géocodage : Annuaire de l'Éducation Nationale (data.education.gouv.fr),
// avec repli automatique sur la Base Adresse Nationale (api-adresse.data.gouv.fr).
// Deux services publics, gratuits, sans clé d'API.
//
// Node 18+ (fetch natif). Lancement : node compute-distances.mjs
// Sortie « propre » (le bloc à coller) sur stdout, diagnostics sur stderr :
//   node compute-distances.mjs > bloc.txt   (bloc.txt = objet prêt à coller)
// -----------------------------------------------------------------------------

const ORIGIN_NOM   = "Collège La Nacelle";
const ORIGIN_VILLE = "Corbeil-Essonnes";
const ROAD_FACTOR  = 1.3;   // 1 = distance à vol d'oiseau ; ~1.3 ≈ estimation routière

const ETABLISSEMENTS = [
  "Lycée Robert Doisneau|Corbeil-Essonnes",
  "Lycée Château des Coudraies|Étiolles",
  "Lycée Auguste Perret|Évry-Courcouronnes",
  "Lycée Charles Baudelaire|Évry-Courcouronnes",
  "Lycée Georges Brassens|Évry-Courcouronnes",
  "Lycée Parc des Loges|Évry-Courcouronnes",
  "Lycée Pierre Mendès France|Ris-Orangis",
  "Lycée François Truffaut|Bondoufle",
  "Lycée Marie Laurencin|Mennecy",
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
  "Lycée Nikola Tesla|Dourdan"
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function geocodeAnnuaire(nom, ville) {
  const q = `${nom} ${ville}`;
  const url = "https://data.education.gouv.fr/api/records/1.0/search/"
            + "?dataset=fr-en-annuaire-education&rows=1&q=" + encodeURIComponent(q);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Annuaire HTTP " + res.status);
  const data = await res.json();
  const rec = data.records && data.records[0] && data.records[0].fields;
  if (!rec) return null;
  const lat = Number(rec.latitude), lon = Number(rec.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    lat, lon, src: "annuaire",
    label: `${rec.nom_etablissement || "?"} — ${rec.nom_commune || "?"}`
  };
}

async function geocodeBAN(nom, ville) {
  const url = "https://api-adresse.data.gouv.fr/search/?limit=1&q="
            + encodeURIComponent(`${nom} ${ville}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error("BAN HTTP " + res.status);
  const data = await res.json();
  const f = data.features && data.features[0];
  if (!f) return null;
  const [lon, lat] = f.geometry.coordinates;
  return {
    lat, lon, src: "BAN",
    label: `${f.properties.label} (score ${Number(f.properties.score).toFixed(2)})`
  };
}

async function geocode(nom, ville) {
  try {
    const a = await geocodeAnnuaire(nom, ville);
    if (a) return a;
  } catch (_) { /* on bascule sur la BAN */ }
  return geocodeBAN(nom, ville);
}

function haversineKm(a, b) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2
          + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

async function main() {
  process.stderr.write(`Départ : ${ORIGIN_NOM}, ${ORIGIN_VILLE}\n`);
  const origin = await geocode(ORIGIN_NOM, ORIGIN_VILLE);
  if (!origin) { process.stderr.write("ÉCHEC : collège introuvable.\n"); process.exit(1); }
  process.stderr.write(`  -> ${origin.label} [${origin.src}]\n\n`);

  const rows = [];
  const warnings = [];
  for (const key of ETABLISSEMENTS) {
    const [nom, ville] = key.split("|");
    let g = null;
    try { g = await geocode(nom, ville); }
    catch (e) { warnings.push(`${key} : ${e.message}`); }
    await sleep(150); // courtoisie envers les API publiques
    if (!g) { rows.push({ key, km: 999, g: null }); warnings.push(`${key} : introuvable`); continue; }
    const km = Math.round(haversineKm(origin, g) * ROAD_FACTOR);
    rows.push({ key, km, g });
  }

  rows.sort((a, b) => a.km - b.km);

  const lines = rows.map((r, i) =>
    `  ${JSON.stringify(r.key)}: ${r.km}${i < rows.length - 1 ? "," : ""}`);
  console.log("const DISTANCES_CORBEIL_ESSONNES = {");
  console.log(lines.join("\n"));
  console.log("};");

  process.stderr.write("\n--- Contrôle visuel (à vérifier à l'œil) ---\n");
  rows.forEach(r => {
    if (r.g) process.stderr.write(`${String(r.km).padStart(3)} km  ${r.key}\n         ${r.g.label} [${r.g.src}]\n`);
  });
  if (warnings.length) {
    process.stderr.write("\n⚠ À vérifier à la main :\n");
    warnings.forEach(w => process.stderr.write("  - " + w + "\n"));
  }
  process.stderr.write("\nAstuce : mets ROAD_FACTOR=1 pour la distance à vol d'oiseau.\n");
}

main().catch(e => { console.error(e); process.exit(1); });
