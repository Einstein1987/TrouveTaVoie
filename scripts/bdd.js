const DOMAINS = {
  relation_client: {
    label: "Métiers de la Relation Client & Gestion",
    keywords: ["commerce", "vente", "vendre", "client", "magasin", "accueil", "boutique", "relation client", "mrc", "mcva", "mcvb", "agora", "gestion", "administration"],
    coeffs: [6, 5, 4, 5, 3, 3, 4], // fallback : les coefficients sont maintenant aussi définis formation par formation
    formations: [
      {
        nom: "Bac Pro Métiers du Commerce et de la Vente (Options A et B)",
        niveau: "Bac Pro",
        coeffs: [6, 5, 4, 5, 3, 3, 4],
        etablissements: [
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" },
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée Nelson Mandela", ville: "Étampes", transport: "RER D puis RER C (env. 1h15)" },
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 30 min)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Marguerite Yourcenar", ville: "Morangis", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Henri Poincaré", ville: "Palaiseau", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" },
          { nom: "Lycée Paul Langevin", ville: "Sainte-Geneviève-des-Bois", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Louis Armand", ville: "Yerres", transport: "RER D (env. 35 min)" }
        ]
      },
      {
        nom: "Bac Pro AGORA (Assistance à la Gestion des Organisations et de leurs Activités)",
        niveau: "Bac Pro",
        coeffs: [6, 5, 4, 5, 3, 3, 4],
        etablissements: [
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" },
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée Geoffroy Saint-Hilaire", ville: "Étampes", transport: "RER D puis RER C (env. 1h15)" },
          { nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 30 min)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Parc de Vilgénis", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" },
          { nom: "Lycée Marie Laurencin", ville: "Mennecy", transport: "RER D (env. 15 min)" },
          { nom: "Lycée Marguerite Yourcenar", ville: "Morangis", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Paul Langevin", ville: "Sainte-Geneviève-des-Bois", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Louis Armand", ville: "Yerres", transport: "RER D (env. 35 min)" }
        ]
      },
      {
        nom: "CAP Équipier polyvalent du commerce",
        niveau: "CAP",
        coeffs: [6, 5, 4, 5, 3, 3, 4],
        etablissements: [
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "Lycée Nelson Mandela", ville: "Étampes", transport: "RER D puis RER C (env. 1h15)" },
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "EREA Jean Isoard", ville: "Montgeron", transport: "RER D (env. 35 min)" },
          { nom: "Lycée Marguerite Yourcenar", ville: "Morangis", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Henri Poincaré", ville: "Palaiseau", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" },
          { nom: "Lycée Paul Langevin", ville: "Sainte-Geneviève-des-Bois", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Louis Armand", ville: "Yerres", transport: "RER D (env. 35 min)" }
        ]
      }
    ]
  },

  sante_social: {
    label: "Santé, Social et Soins",
    keywords: ["sante", "social", "soin", "enfant", "personnes agees", "hopital", "medical", "infirmier", "aide", "assp", "petite enfance", "aepe", "aepa"],
    coeffs: [5, 4, 3, 3, 4, 4, 7],
    formations: [
      {
        nom: "Bac Pro Accompagnement, soins et services à la personne (ASSP)",
        niveau: "Bac Pro",
        coeffs: [5, 4, 3, 3, 4, 4, 7],
        etablissements: [
          { nom: "Lycée Nelson Mandela", ville: "Étampes", transport: "RER D puis RER C (env. 1h15)" },
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 30 min)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Henri Poincaré", ville: "Palaiseau", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Les Frères Moreau", ville: "Quincy-sous-Sénart", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Léonard de Vinci", ville: "Saint-Michel-sur-Orge", transport: "RER D puis RER C (env. 45 min)" }
        ]
      },
      {
        nom: "CAP Accompagnant éducatif petite enfance",
        niveau: "CAP",
        coeffs: [5, 4, 3, 3, 4, 4, 7],
        etablissements: [
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" }
        ]
      }
    ]
  },

  numerique_energie: {
    label: "Transitions Numérique et Énergétique",
    keywords: ["informatique", "ordinateur", "numerique", "electricite", "electricien", "ciel", "melec", "energie", "code", "technologie", "climatisation", "froid"],
    coeffs: [5, 6, 3, 4, 3, 2, 7],
    formations: [
      {
        nom: "Bac Pro Métiers de l'électricité et de ses environnements connectés (MELEC)",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" },
          { nom: "Lycée Clément Ader", ville: "Athis-Mons", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Parc de Vilgénis", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" },
          { nom: "Lycée André-Marie Ampère", ville: "Morsang-sur-Orge", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Les Frères Moreau", ville: "Quincy-sous-Sénart", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" },
          { nom: "Lycée Léonard de Vinci", ville: "Saint-Michel-sur-Orge", transport: "RER D puis RER C (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Cybersécurité, Informatique et Réseaux, Électronique (CIEL)",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée Georges Brassens", ville: "Évry-Courcouronnes", transport: "Bus 401 puis Bus 402 (env. 40 min)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "Lycée Parc de Vilgénis", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" },
          { nom: "Lycée André-Marie Ampère", ville: "Morsang-sur-Orge", transport: "RER D puis Bus (env. 50 min)" }
        ]
      },
      {
        nom: "CAP Électricien",
        niveau: "CAP",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Clément Ader", ville: "Athis-Mons", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "Lycée Nelson Mandela", ville: "Étampes", transport: "RER D puis RER C (env. 1h15)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "EREA Jean Isoard", ville: "Montgeron", transport: "RER D (env. 35 min)" },
          { nom: "Lycée André-Marie Ampère", ville: "Morsang-sur-Orge", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Les Frères Moreau", ville: "Quincy-sous-Sénart", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" }
        ]
      }
    ]
  },

  batiment: {
    label: "Métiers de la Construction, du Bâtiment et Travaux Publics",
    keywords: ["batiment", "construire", "construction", "menuisier", "menuiserie", "maçon", "travaux", "chantier", "architecture", "peintre"],
    coeffs: [5, 6, 3, 4, 3, 2, 7],
    formations: [
      {
        nom: "Bac Pro Technicien d'études du bâtiment - Option A : études et économie",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        aVerifier: "Établissements à confirmer sur ONISEP : le fichier vœux bassin et le tableau CIO Essonne ne donnent pas exactement la même granularité.",
        etablissements: [
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" },
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" },
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "Bac Pro Technicien d'études du bâtiment - Option B : assistant en architecture",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        aVerifier: "Établissements à confirmer sur ONISEP : le fichier vœux bassin et le tableau CIO Essonne ne donnent pas exactement la même granularité.",
        etablissements: [
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" },
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "Bac Pro Aménagement et finition du bâtiment",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" }
        ]
      },
      {
        nom: "CAP Maçon",
        niveau: "CAP",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        etablissements: [
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" },
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" }
        ]
      }
    ]
  },

  restauration: {
    label: "Hôtellerie, Restauration et Alimentation",
    keywords: ["cuisine", "cuisinier", "cuisiniere", "restaurant", "restauration", "chef", "patissier", "patisserie", "boulanger", "manger", "hotellerie", "boulangerie", "serveur"],
    coeffs: [5, 4, 3, 3, 4, 4, 7],
    formations: [
      {
        nom: "Bac Pro Commercialisation et services en restauration",
        niveau: "Bac Pro",
        coeffs: [5, 4, 3, 3, 4, 4, 7],
        etablissements: [
          { nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)" }
        ]
      },
      {
        nom: "Bac Pro Cuisine",
        niveau: "Bac Pro",
        coeffs: [5, 4, 3, 3, 4, 4, 7],
        etablissements: [
          { nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)" }
        ]
      },
      {
        nom: "Bac Pro Boulanger-pâtissier",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 3, 3, 3, 8],
        etablissements: [
          { nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)" }
        ]
      },
      {
        nom: "CAP Cuisine",
        niveau: "CAP",
        coeffs: [4, 6, 3, 3, 3, 3, 8],
        etablissements: [
          { nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)" }
        ]
      },
      {
        nom: "CAP Pâtissier",
        niveau: "CAP",
        coeffs: [4, 6, 3, 3, 3, 3, 8],
        etablissements: [
          { nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)" }
        ]
      }
    ]
  },

  mecanique_auto: {
    label: "Maintenance et Mécanique (Auto & Aéronautique)",
    keywords: ["voiture", "mecanique", "mecanicien", "auto", "automobile", "garage", "carrosserie", "moteur", "maintenance", "avion", "aeronautique"],
    coeffs: [4, 6, 3, 4, 3, 2, 8],
    formations: [
      {
        nom: "Bac Pro Maintenance des véhicules - Option véhicules légers",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" },
          { nom: "Lycée Les Frères Moreau", ville: "Quincy-sous-Sénart", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Gaspard Monge", ville: "Savigny-sur-Orge", transport: "RER D puis RER C (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Carrossier peintre automobile",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" },
          { nom: "Lycée Gaspard Monge", ville: "Savigny-sur-Orge", transport: "RER D puis RER C (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Aéronautique - Option avionique",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Aéronautique - Option systèmes",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Aviation générale",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" }
        ]
      }
    ]
  }
};
// -----------------------------------------------------------------------------
// Distances approximatives depuis Corbeil-Essonnes
// Objectif : trier automatiquement les établissements du plus proche au plus loin.
// Les distances sont indicatives et servent uniquement à ordonner les listes.
// -----------------------------------------------------------------------------

const DISTANCES_CORBEIL_ESSONNES = {
  "Lycée Robert Doisneau|Corbeil-Essonnes": 0,

  "Lycée Château des Coudraies|Étiolles": 5,

  "Lycée Auguste Perret|Évry-Courcouronnes": 6,
  "Lycée Charles Baudelaire|Évry-Courcouronnes": 6,
  "Lycée Georges Brassens|Évry-Courcouronnes": 6,

  "Lycée Pierre Mendès France|Ris-Orangis": 8,
  "Lycée Marie Laurencin|Mennecy": 9,

  "Lycée Les Frères Moreau|Quincy-sous-Sénart": 10,
  "Lycée Nadar|Draveil": 12,
  "EREA Jean Isoard|Montgeron": 13,

  "Lycée André-Marie Ampère|Morsang-sur-Orge": 15,
  "Lycée Paul Langevin|Sainte-Geneviève-des-Bois": 17,

  "Lycée Jean Monnet|Juvisy-sur-Orge": 18,
  "Lycée Gaspard Monge|Savigny-sur-Orge": 18,
  "Lycée Louis Armand|Yerres": 18,

  "Lycée Clément Ader|Athis-Mons": 19,
  "Lycée Léonard de Vinci|Saint-Michel-sur-Orge": 20,

  "Lycée Jean-Pierre Timbaud|Brétigny-sur-Orge": 21,
  "Lycée Marguerite Yourcenar|Morangis": 22,

  "Lycée Jean Perrin|Longjumeau": 23,
  "Lycée Alexandre Denis|Cerny": 23,

  "Lycée Paul Belmondo|Arpajon": 25,
  "Lycée Gustave Eiffel|Massy": 26,
  "Lycée Parc de Vilgénis|Massy": 27,

  "Lycée Henri Poincaré|Palaiseau": 29,
  "Lycée L'Essouriau|Les Ulis": 32,

  "Lycée Nelson Mandela|Étampes": 37,
  "Lycée Geoffroy Saint-Hilaire|Étampes": 37,

  "Lycée Nikola Tesla|Dourdan": 43
};

function normalizeDistanceKey(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const NORMALIZED_DISTANCES_CORBEIL = Object.fromEntries(
  Object.entries(DISTANCES_CORBEIL_ESSONNES).map(([key, distance]) => [
    normalizeDistanceKey(key),
    distance
  ])
);

function getDistanceFromCorbeil(etablissement) {
  const fullKey = normalizeDistanceKey(`${etablissement.nom}|${etablissement.ville}`);
  return NORMALIZED_DISTANCES_CORBEIL[fullKey] ?? 999;
}

function sortEtablissementsByDistance(domains) {
  Object.values(domains).forEach(domain => {
    domain.formations.forEach(formation => {
      formation.etablissements.forEach(etablissement => {
        etablissement.distanceKm = getDistanceFromCorbeil(etablissement);
      });

      formation.etablissements.sort((a, b) => {
        const distanceDifference = a.distanceKm - b.distanceKm;

        if (distanceDifference !== 0) {
          return distanceDifference;
        }

        const cityComparison = a.ville.localeCompare(b.ville, "fr");
        if (cityComparison !== 0) {
          return cityComparison;
        }

        return a.nom.localeCompare(b.nom, "fr");
      });
    });
  });
}

sortEtablissementsByDistance(DOMAINS);





