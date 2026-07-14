#!/usr/bin/env node
/* =============================================================================
 * VÉRIFICATION DES COEFFICIENTS AFFELNET
 *
 *     node tools/verifier-coefficients.mjs
 *
 * SOURCE QUI FAIT FOI : « FICHE TECHNIQUE N°21 — Tableau des coefficients des
 * évaluations par champs disciplinaires pour les élèves relevant du palier 3e »
 * (académie de Versailles). Retranscrite ci-dessous, formation par formation.
 *
 * POURQUOI CE FICHIER EXISTE
 * --------------------------
 * En juillet 2026, un contrôle croisé a révélé 18 coefficients faux. Tous
 * suivaient le MÊME schéma : la formation portait les coefficients de son
 * DOMAINE d'affichage au lieu des siens.
 *
 *   CAP Maçon      → [5,6,3,4,3,2,7] (coeffs de la famille « Bâtiment »)
 *   Fiche n°21     → [4,6,4,2,4,3,7]
 *
 * La cause est structurelle et vaut d'être retenue : UN CAP N'APPARTIENT À
 * AUCUNE FAMILLE DE MÉTIERS. Les familles ne concernent que la seconde pro.
 * Ranger un CAP sous une famille pour l'affichage est utile à l'élève ; lui
 * faire hériter des coefficients de cette famille est une faute.
 *
 * Un coefficient faux, c'est un élève qui calcule mal ses chances et se
 * retrouve sans affectation. C'est la donnée la plus lourde de l'application.
 *
 * ENTRETIEN
 * ---------
 * Les coefficients changent à chaque campagne. Quand une nouvelle fiche n°21
 * paraît, c'est CE fichier qu'on met à jour — puis bdd_pro.js suit, jamais
 * l'inverse.
 * ========================================================================== */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createContext, runInContext } from "node:vm";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const ctx = createContext({});
const DOMAINS = runInContext(
  readFileSync(join(RACINE, "scripts", "bdd_pro.js"), "utf8") + "\n;DOMAINS", ctx);

/* --- Fiche technique n°21 : une ligne par formation ---------------------- */

const FICHE_21 = {
"CAP Équipier polyvalent du commerce":[6,5,4,5,3,3,4],
"CAP Opérateur/opératrice logistique":[6,5,4,5,3,3,4],
"CAP Conducteur Agent d'accueil en Autobus et Autocar":[6,5,4,5,3,3,4],
"CAP Accompagnant éducatif petite enfance":[5,4,3,3,4,4,7],
"CAP Agent accompagnant au grand âge":[5,4,3,3,4,4,7],
"CAP Esthétique, cosmétique, parfumerie":[5,4,3,3,4,4,7],
"CAP Électricien":[4,6,3,4,3,2,8],
"CAP Installateur en froid et conditionnement d'air":[4,6,3,3,3,3,8],
"CAP Monteur en installations thermiques":[4,6,3,3,3,3,8],
"CAP Monteur en installations sanitaires":[4,6,4,2,4,3,7],
"CAP Interventions en maintenance technique des bâtiments":[4,6,4,2,4,3,7],
"CAP Maçon":[4,6,4,2,4,3,7],
"CAP Carreleur mosaïste":[4,6,4,2,4,3,7],
"CAP Peintre applicateur de revêtements":[4,6,4,2,4,3,7],
"CAP Menuisier aluminium-verre":[4,6,4,2,4,3,7],
"CAP Menuisier fabricant":[4,6,4,2,4,3,7],
"CAP Charpentier bois":[4,6,4,2,4,3,7],
"CAP Réalisations industrielles en chaudronnerie ou soudage - Option A : chaudronnerie":[4,6,3,4,3,2,8],
"CAP Conducteur d'installations de production":[5,6,3,4,3,2,7],
"CAP Maintenance des véhicules - Option véhicules légers":[4,6,3,4,3,2,8],
"CAP Carrossier automobile":[4,6,3,4,3,2,8],
"CAP Maintenance des matériels - Option C : matériels d'espaces verts":[4,6,3,4,3,2,8],
"CAP Aéronautique - Option avionique":[4,6,3,4,3,2,8],
"CAP Cuisine":[4,6,3,3,3,3,8],
"CAP Commercialisation et services en hôtel-café-restaurant":[5,4,3,3,4,4,7],
"CAP Production et service en restaurations (rapide, collective, cafétéria)":[4,6,3,3,3,3,8],
"CAP Pâtissier":[4,6,3,3,3,3,8],
"CAP Agent de sécurité":[5,3,4,3,5,2,8],
"CAP Maroquinerie":[4,5,3,3,3,6,6],
"CAP Métiers de la mode - vêtement flou":[4,5,3,3,3,6,6],
"CAP Métiers de l'entretien des textiles - Option B : pressing":[4,5,3,3,3,6,6],
"CAP Jardinier paysagiste":[4,5,3,3,4,3,8],
// Bac Pro : coefficients de la 2NDPRO (famille commune, ou ligne propre si hors famille)
"Bac Pro Métiers de l'accueil":[6,5,4,5,3,3,4],
"Bac Pro Métiers du Commerce et de la Vente (Options A et B)":[6,5,4,5,3,3,4],
"Bac Pro AGORA (Assistance à la Gestion des Organisations et de leurs Activités)":[6,5,4,5,3,3,4],
"Bac Pro Logistique":[6,5,4,5,3,3,4],
"Bac Pro Organisation de transport de marchandises":[6,5,4,5,3,3,4],
"Bac Pro Conducteur routier de marchandises":[6,5,4,5,3,3,4],
"Bac Pro Accompagnement, soins et services à la personne (ASSP)":[5,4,3,3,4,4,7],
"Bac Pro Animation-enfance et personnes âgées (AEPA)":[5,4,3,3,4,4,7],
"Bac Pro Hygiène, Propreté, Stérilisation":[5,3,4,3,5,2,8],
"Bac Pro Esthétique, cosmétique, parfumerie":[5,4,3,3,4,4,7],
"Bac Pro Métiers de la coiffure":[5,4,3,3,4,4,7],
"Bac Pro Métiers de l'électricité et de ses environnements connectés (MELEC)":[5,6,3,4,3,2,7],
"Bac Pro Cybersécurité, Informatique et Réseaux, Électronique (CIEL)":[5,6,3,4,3,2,7],
"Bac Pro Installateur en chauffage, climatisation et énergies renouvelables":[5,6,3,4,3,2,7],
"Bac Pro Maintenance et efficacité énergétique":[5,6,3,4,3,2,7],
"Bac Pro Métiers du froid et des énergies renouvelables":[5,6,3,4,3,2,7],
"Bac Pro Optique Photonique - Technologies de la Lumière":[4,6,3,4,3,2,8],
"Bac Pro Technicien du bâtiment : organisation et réalisation du gros œuvre":[5,6,3,4,3,2,7],
"Bac Pro Aménagement et finition du bâtiment":[5,6,3,4,3,2,7],
"Bac Pro Interventions sur le patrimoine bâti - Option maçonnerie":[5,6,3,4,3,2,7],
"Bac Pro Ouvrages du bâtiment : métallerie":[5,6,3,4,3,2,7],
"Bac Pro Menuiserie aluminium-verre":[5,6,3,4,3,2,7],
"Bac Pro Technicien d'études du bâtiment - Option A : études et économie":[4,6,4,2,4,3,7],
"Bac Pro Technicien d'études du bâtiment - Option B : assistant en architecture":[4,6,4,2,4,3,7],
"Bac Pro Géomètre (ex Technicien géomètre-topographe)":[4,6,4,2,4,3,7],
"Bac Pro Technicien menuisier agenceur":[4,6,4,2,4,3,7],
"Bac Pro Technicien de fabrication bois et matériaux associés":[4,6,4,2,4,3,7],
"Bac Pro Étude et réalisation d'agencement":[4,6,4,2,4,3,7],
"Bac Pro Technicien en réalisation de produits mécaniques - Option réalisation et suivi de productions":[5,6,3,4,3,2,7],
"Bac Pro Technicien en chaudronnerie industrielle":[5,6,3,4,3,2,7],
"Bac Pro Microtechniques":[5,6,3,4,3,2,7],
"Bac Pro Modélisation et prototypage 3D":[5,6,3,4,3,2,7],
"Bac Pro Maintenance des systèmes de production connectés":[5,6,3,4,3,2,7],
"Bac Pro Maintenance des véhicules - Option véhicules légers":[4,6,3,4,3,2,8],
"Bac Pro Maintenance des matériels - Option A : matériels agricoles":[4,6,3,4,3,2,8],
"Bac Pro Maintenance des matériels - Option B : matériels de construction et de manutention":[4,6,3,4,3,2,8],
"Bac Pro Maintenance des matériels - Option C : matériels d'espaces verts":[4,6,3,4,3,2,8],
"Bac Pro Carrossier peintre automobile":[4,6,3,4,3,2,8],
"Bac Pro Aéronautique - Option avionique":[4,6,3,4,3,2,8],
"Bac Pro Aéronautique - Option systèmes":[4,6,3,4,3,2,8],
"Bac Pro Aviation générale":[4,6,3,4,3,2,8],
"Bac Pro Commercialisation et services en restauration":[5,4,3,3,4,4,7],
"Bac Pro Cuisine":[5,4,3,3,4,4,7],
"Bac Pro Boulanger-pâtissier":[4,6,3,3,3,3,8],
"Bac Pro Métiers de la sécurité":[5,3,4,3,5,2,8],
"Bac Pro Métiers de la couture et de la confection":[4,5,3,3,3,6,6],
"Bac Pro Métiers du cuir - Option maroquinerie":[4,5,3,3,3,6,6],
"Bac Pro Artisanat et métiers d'art - Option marchandisage visuel":[4,6,4,2,4,3,7],
};

/* Formations ABSENTES de la fiche n°21 : on ne peut pas les vérifier.
 * Les taire serait pire que les signaler. */
const ABSENTES_DE_LA_FICHE = ["CAP Métallier"];

/* Coefficients des FAMILLES DE MÉTIERS (lignes « 2NDPRO … 2NDE COMMUNE (FM) »).
 * Seuls les domaines qui correspondent à une vraie famille figurent ici : les
 * autres (sécurité, santé-social, mode, conduite, paysage) sont des
 * regroupements thématiques propres à l'application, pas des familles Affelnet. */
const FAMILLES = {
  relation_client:         [6, 5, 4, 5, 3, 3, 4],
  gestion_logistique:      [6, 5, 4, 5, 3, 3, 4],
  beaute:                  [5, 4, 3, 3, 4, 4, 7],
  numerique_energie:       [5, 6, 3, 4, 3, 2, 7],
  batiment:                [5, 6, 3, 4, 3, 2, 7],
  etudes_batiment:         [4, 6, 4, 2, 4, 3, 7],
  agencement_bois:         [4, 6, 4, 2, 4, 3, 7],
  realisation_mecanique:   [5, 6, 3, 4, 3, 2, 7],
  pilotage_maintenance:    [5, 6, 3, 4, 3, 2, 7],
  maintenance_vehicules:   [4, 6, 3, 4, 3, 2, 8],
  aeronautique:            [4, 6, 3, 4, 3, 2, 8],
  hotellerie_restauration: [5, 4, 3, 3, 4, 4, 7],
  alimentation:            [4, 6, 3, 3, 3, 3, 8],
};

/* -------------------------------------------------------------------------- */
const eq = (a, b) => Array.isArray(a) && a.length === b.length && a.every((v, i) => v === b[i]);
let echecs = 0;
const OK = (m) => { if (process.env.VERBEUX) console.log("  \u2713 " + m); };
const KO = (m) => { console.error("  \u2717 " + m); echecs++; };

console.log("Coefficients Affelnet \u2014 contr\u00f4le contre la fiche technique n\u00b021\n");

console.log("\u2500\u2500 FORMATIONS \u2500\u2500");
let nb = 0, absentes = [];
for (const cle in DOMAINS) {
  for (const f of DOMAINS[cle].formations) {
    nb++;
    if (ABSENTES_DE_LA_FICHE.includes(f.nom)) {
      absentes.push(f.nom);
      if (!f.aVerifier) KO(f.nom + " est absente de la fiche n\u00b021 et ne porte pas de mention \u00ab \u00e0 v\u00e9rifier \u00bb.");
      continue;
    }
    const attendu = FICHE_21[f.nom];
    if (!attendu) {
      KO(f.nom + " n'est pas dans la fiche n\u00b021. Ajoute-la ici, ou d\u00e9clare-la absente.");
      continue;
    }
    if (!eq(f.coeffs, attendu)) {
      const memeQueDomaine = eq(f.coeffs, DOMAINS[cle].coeffs)
        ? "  \u2190 identique aux coeffs du domaine : l'erreur classique"
        : "";
      KO(f.nom + "\n      base       [" + f.coeffs.join(",") + "]" + memeQueDomaine +
         "\n      fiche n\u00b021 [" + attendu.join(",") + "]");
    } else {
      OK(f.nom);
    }
  }
}
console.log("  " + (nb - echecs - absentes.length) + " formation(s) conforme(s) sur " + nb);
if (absentes.length) console.log("  " + absentes.length + " absente(s) de la fiche, signal\u00e9e(s) \u00e0 l'\u00e9l\u00e8ve : " + absentes.join(", "));

console.log("\n\u2500\u2500 COEFFICIENTS DES FAMILLES (2de commune) \u2500\u2500");
for (const cle in FAMILLES) {
  if (!DOMAINS[cle]) { KO("Domaine \u00ab " + cle + " \u00bb introuvable dans bdd_pro.js."); continue; }
  if (!eq(DOMAINS[cle].coeffs, FAMILLES[cle])) {
    KO(DOMAINS[cle].label + "\n      base       [" + DOMAINS[cle].coeffs.join(",") + "]" +
       "\n      fiche n\u00b021 [" + FAMILLES[cle].join(",") + "]");
  } else {
    OK(DOMAINS[cle].label);
  }
}
console.log("  " + Object.keys(FAMILLES).length + " famille(s) v\u00e9rifi\u00e9e(s)");

/* ==========================================================================
 * FAMILLES DE MÉTIERS — les invariants
 *
 * Source : DGESCO, « L'organisation de la classe de seconde professionnelle
 * par famille de métiers », mai 2024. 14 familles officielles.
 * ======================================================================== */
const FAMILLES_OFFICIELLES = [
  "Métiers de la construction durable, du bâtiment et des travaux publics",
  "Métiers de la gestion administrative, du transport et de la logistique",
  "Métiers de la relation client",
  "Métiers de l'aéronautique",
  "Métiers des industries graphiques et de la communication",
  "Métiers de l'hôtellerie-restauration",
  "Métiers de l'alimentation",
  "Métiers des études et de la modélisation numérique du bâtiment",
  "Métiers de la beauté et du bien-être",
  "Métiers de la réalisation d'ensembles mécaniques et industriels",
  "Métiers des transitions numérique et énergétique",
  "Métiers de la maintenance des matériels et des véhicules",
  "Métiers du pilotage et de la maintenance d'installations automatisées",
  "Métiers de l'agencement, de la menuiserie et de l'ameublement",
];

console.log("\n\u2500\u2500 RATTACHEMENT AUX FAMILLES (DGESCO) \u2500\u2500");
{
  let secteursAvecFamille = 0;
  for (const cle in DOMAINS) {
    const d = DOMAINS[cle];

    // Le champ doit exister explicitement — un oubli ne doit pas passer pour un « null ».
    if (!("famille" in d)) {
      KO("Le secteur « " + cle + " » n'a pas de champ `famille`. Mets `famille: null` si ce n'en est pas une.");
      continue;
    }

    // Une famille déclarée doit être l'une des 14 officielles, au caractère près.
    if (d.famille !== null) {
      secteursAvecFamille++;
      if (!FAMILLES_OFFICIELLES.includes(d.famille)) {
        KO("« " + d.famille + " » n'est pas une famille de m\u00e9tiers officielle (secteur " + cle + ").");
      }
    }

    for (const f of d.formations) {
      // INVARIANT 1 : un CAP n'est jamais dans une famille. C'est la confusion
      // qui avait produit 13 coefficients faux.
      if (f.niveau === "CAP" && f.horsFamille) {
        KO(f.nom + " : `horsFamille` sur un CAP n'a pas de sens \u2014 aucun CAP n'est dans une famille.");
      }

      // INVARIANT 2 : un bac pro dans un secteur SANS famille est forcément
      // hors famille. Sinon la carte l'afficherait sous une famille inexistante.
      if (f.niveau !== "CAP" && d.famille === null && !f.horsFamille) {
        KO(f.nom + " : le secteur « " + d.label + " » n'a pas de famille officielle, " +
           "donc cette formation doit porter `horsFamille: true`.");
      }
    }
  }
  if (secteursAvecFamille !== 13) {
    KO("On attendait 13 secteurs rattach\u00e9s \u00e0 une famille, il y en a " + secteursAvecFamille + ".");
  } else {
    OK("13 secteurs rattach\u00e9s \u00e0 une famille officielle, 5 sans famille");
  }
  console.log("  " + Object.keys(DOMAINS).length + " secteur(s) v\u00e9rifi\u00e9(s)");
}

console.log("\n" + "\u2500".repeat(52));
if (echecs) {
  console.error("\u2717 " + echecs + " coefficient(s) faux. Un \u00e9l\u00e8ve calculerait mal ses chances.");
  process.exit(1);
}
console.log("\u2713 Tous les coefficients correspondent \u00e0 la fiche technique n\u00b021.");
console.log("  (VERBEUX=1 pour le d\u00e9tail.)");
