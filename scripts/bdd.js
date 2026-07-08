// =============================================================================
// OrienTeen — Base de données des formations professionnelles publiques
// Secteur : bassin de Corbeil-Essonnes / Essonne (91)
// Source  : CIO d'Évry — "Formations professionnelles post-3e en Essonne",
//           "Bacs professionnels en Essonne", "Fiche technique n°21 (coefficients)"
//           et "Fichier formations pro / vœux bassin" — Rentrée 2026.
// NB : établissements PUBLICS uniquement. Données indicatives, à revérifier
//      chaque année sur ONISEP / AFFELNET (offre et coefficients susceptibles d'évoluer).
// =============================================================================

const DOMAINS = {
  relation_client: {
    label: "Métiers de la Relation Client",
    keywords: ["commerce", "vente", "vendre", "client", "clientele", "magasin", "accueil", "boutique", "relation client", "mrc", "mcv", "mcva", "mcvb", "caisse"],
    coeffs: [6, 5, 4, 5, 3, 3, 4],
    formations: [
      {
        nom: "Bac Pro Métiers de l'accueil",
        niveau: "Bac Pro",
        coeffs: [6, 5, 4, 5, 3, 3, 4],
        etablissements: [
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" },
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 30 min)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" },
          { nom: "Lycée Paul Langevin", ville: "Sainte-Geneviève-des-Bois", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Louis Armand", ville: "Yerres", transport: "RER D (env. 35 min)" }
        ]
      },
      {
        nom: "Bac Pro Métiers du Commerce et de la Vente (Options A et B)",
        niveau: "Bac Pro",
        coeffs: [6, 5, 4, 5, 3, 3, 4],
        etablissements: [
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" },
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
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

  gestion_logistique: {
    label: "Métiers de la Gestion, du Transport et de la Logistique",
    keywords: ["gestion", "administration", "administratif", "agora", "secretariat", "bureau", "logistique", "transport", "entrepot", "magasinier", "stock", "conducteur", "routier", "camion"],
    coeffs: [6, 5, 4, 5, 3, 3, 4],
    formations: [
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
        nom: "Bac Pro Logistique",
        niveau: "Bac Pro",
        coeffs: [6, 5, 4, 5, 3, 3, 4],
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" },
          { nom: "Lycée Gaspard Monge", ville: "Savigny-sur-Orge", transport: "RER D puis RER C (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Organisation de transport de marchandises",
        niveau: "Bac Pro",
        coeffs: [6, 5, 4, 5, 3, 3, 4],
        etablissements: [
          { nom: "Lycée Gaspard Monge", ville: "Savigny-sur-Orge", transport: "RER D puis RER C (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Conducteur routier de marchandises",
        niveau: "Bac Pro",
        coeffs: [6, 5, 4, 5, 3, 3, 4],
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" }
        ]
      }
    ]
  },

  sante_social: {
    label: "Santé, Social, Soin et Animation",
    keywords: ["sante", "social", "soin", "enfant", "petite enfance", "personnes agees", "hopital", "medical", "infirmier", "aide", "assp", "animation", "aepa", "hygiene", "proprete", "sterilisation"],
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
        nom: "Bac Pro Animation-enfance et personnes âgées (AEPA)",
        niveau: "Bac Pro",
        coeffs: [5, 4, 3, 3, 4, 4, 7],
        etablissements: [
          { nom: "Lycée Nelson Mandela", ville: "Étampes", transport: "RER D puis RER C (env. 1h15)" },
          { nom: "Lycée Henri Poincaré", ville: "Palaiseau", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Léonard de Vinci", ville: "Saint-Michel-sur-Orge", transport: "RER D puis RER C (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Hygiène, Propreté, Stérilisation",
        niveau: "Bac Pro",
        coeffs: [5, 3, 4, 3, 5, 2, 8],
        etablissements: [
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

  beaute: {
    label: "Métiers de la Beauté et du Bien-être",
    keywords: ["beaute", "bien-etre", "bien etre", "esthetique", "cosmetique", "parfumerie", "coiffure", "coiffeur", "maquillage", "onglerie"],
    coeffs: [5, 4, 3, 3, 4, 4, 7],
    formations: [
      {
        nom: "Bac Pro Esthétique, cosmétique, parfumerie",
        niveau: "Bac Pro",
        coeffs: [5, 4, 3, 3, 4, 4, 7],
        etablissements: [
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" }
        ]
      },
      {
        nom: "Bac Pro Métiers de la coiffure",
        niveau: "Bac Pro",
        coeffs: [5, 4, 3, 3, 4, 4, 7],
        etablissements: [
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" }
        ]
      }
    ]
  },

  numerique_energie: {
    label: "Transitions Numérique et Énergétique",
    keywords: ["informatique", "ordinateur", "numerique", "reseau", "cybersecurite", "electricite", "electricien", "ciel", "melec", "energie", "code", "electronique", "climatisation", "chauffage", "froid", "photonique", "optique"],
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
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
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
        nom: "Bac Pro Installateur en chauffage, climatisation et énergies renouvelables",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" }
        ]
      },
      {
        nom: "Bac Pro Maintenance et efficacité énergétique",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" }
        ]
      },
      {
        nom: "Bac Pro Métiers du froid et des énergies renouvelables",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" }
        ]
      },
      {
        nom: "Bac Pro Optique Photonique - Technologies de la Lumière",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée International Paris-Saclay", ville: "Palaiseau", transport: "RER B puis Bus (env. 1h10)" }
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
    label: "Construction, Bâtiment et Travaux Publics",
    keywords: ["batiment", "construire", "construction", "maçon", "macon", "maçonnerie", "gros oeuvre", "metallerie", "travaux", "chantier", "peintre", "finition", "menuiserie aluminium", "travaux publics"],
    coeffs: [5, 6, 3, 4, 3, 2, 7],
    formations: [
      {
        nom: "Bac Pro Technicien du bâtiment : organisation et réalisation du gros œuvre",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" },
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
        nom: "Bac Pro Interventions sur le patrimoine bâti - Option maçonnerie",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" }
        ]
      },
      {
        nom: "Bac Pro Ouvrages du bâtiment : métallerie",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" }
        ]
      },
      {
        nom: "Bac Pro Menuiserie aluminium-verre",
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

  etudes_batiment: {
    label: "Études et Modélisation Numérique du Bâtiment",
    keywords: ["etudes du batiment", "modelisation", "geometre", "topographe", "dessin batiment", "architecture", "plan", "bureau d'etudes", "economie de la construction"],
    coeffs: [4, 6, 4, 2, 4, 3, 7],
    formations: [
      {
        nom: "Bac Pro Technicien d'études du bâtiment - Option A : études et économie",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        etablissements: [
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" },
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" },
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "Bac Pro Technicien d'études du bâtiment - Option B : assistant en architecture",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        etablissements: [
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" },
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "Bac Pro Géomètre (ex Technicien géomètre-topographe)",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        etablissements: [
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" }
        ]
      }
    ]
  },

  agencement_bois: {
    label: "Agencement, Menuiserie et Ameublement",
    keywords: ["menuiserie", "menuisier", "bois", "agencement", "ameublement", "meuble", "agenceur", "fabrication bois"],
    coeffs: [4, 6, 4, 2, 4, 3, 7],
    formations: [
      {
        nom: "Bac Pro Technicien menuisier agenceur",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        etablissements: [
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" },
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "Bac Pro Technicien de fabrication bois et matériaux associés",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        etablissements: [
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" }
        ]
      },
      {
        nom: "Bac Pro Étude et réalisation d'agencement",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        etablissements: [
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      }
    ]
  },

  realisation_mecanique: {
    label: "Réalisation d'Ensembles Mécaniques et Industriels",
    keywords: ["usinage", "chaudronnerie", "soudure", "soudage", "industrie", "industriel", "mecanique industrielle", "microtechnique", "prototypage", "fabrication mecanique", "production", "tournage", "fraisage"],
    coeffs: [5, 6, 3, 4, 3, 2, 7],
    formations: [
      {
        nom: "Bac Pro Technicien en réalisation de produits mécaniques - Option réalisation et suivi de productions",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Parc de Vilgénis", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" },
          { nom: "Lycée Les Frères Moreau", ville: "Quincy-sous-Sénart", transport: "RER D (env. 40 min)" }
        ]
      },
      {
        nom: "Bac Pro Technicien en chaudronnerie industrielle",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Jean-Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" }
        ]
      },
      {
        nom: "Bac Pro Microtechniques",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Georges Brassens", ville: "Évry-Courcouronnes", transport: "Bus 401 puis Bus 402 (env. 40 min)" },
          { nom: "Lycée Parc de Vilgénis", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "Bac Pro Modélisation et prototypage 3D",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" }
        ]
      }
    ]
  },

  pilotage_maintenance: {
    label: "Pilotage et Maintenance d'Installations Automatisées",
    keywords: ["automatisme", "automatise", "maintenance industrielle", "robot", "pilotage", "installations automatisees", "production connectee", "mspc", "usine"],
    coeffs: [5, 6, 3, 4, 3, 2, 7],
    formations: [
      {
        nom: "Bac Pro Maintenance des systèmes de production connectés",
        niveau: "Bac Pro",
        coeffs: [5, 6, 3, 4, 3, 2, 7],
        etablissements: [
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" },
          { nom: "Lycée Clément Ader", ville: "Athis-Mons", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" }
        ]
      }
    ]
  },

  mecanique_auto: {
    label: "Maintenance des Matériels, Véhicules et Aéronautique",
    keywords: ["voiture", "mecanique", "mecanicien", "auto", "automobile", "garage", "carrosserie", "moteur", "maintenance", "avion", "aeronautique", "materiels", "engins", "agricole"],
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
        nom: "Bac Pro Maintenance des matériels - Option A : matériels agricoles",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" }
        ]
      },
      {
        nom: "Bac Pro Maintenance des matériels - Option B : matériels de construction et de manutention",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" }
        ]
      },
      {
        nom: "Bac Pro Maintenance des matériels - Option C : matériels d'espaces verts",
        niveau: "Bac Pro",
        coeffs: [4, 6, 3, 4, 3, 2, 8],
        etablissements: [
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" }
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
  },

  restauration: {
    label: "Hôtellerie, Restauration et Alimentation",
    keywords: ["cuisine", "cuisinier", "restaurant", "restauration", "chef", "patissier", "patisserie", "boulanger", "boulangerie", "hotellerie", "serveur", "service", "alimentation"],
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

  securite: {
    label: "Métiers de la Sécurité",
    keywords: ["securite", "agent de securite", "surveillance", "gardien", "pompier", "police", "gendarme", "secours", "prevention"],
    coeffs: [5, 3, 4, 3, 5, 2, 8],
    formations: [
      {
        nom: "Bac Pro Métiers de la sécurité",
        niveau: "Bac Pro",
        coeffs: [5, 3, 4, 3, 5, 2, 8],
        etablissements: [
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" }
        ]
      }
    ]
  },

  mode_art: {
    label: "Métiers de la Mode, du Cuir et de l'Artisanat d'Art",
    keywords: ["couture", "confection", "mode", "vetement", "cuir", "maroquinerie", "artisanat", "art", "metiers d'art", "marchandisage", "vitrine", "stylisme", "textile"],
    coeffs: [4, 5, 3, 3, 3, 6, 6],
    formations: [
      {
        nom: "Bac Pro Métiers de la couture et de la confection",
        niveau: "Bac Pro",
        coeffs: [4, 5, 3, 3, 3, 6, 6],
        etablissements: [
          { nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 30 min)" },
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "Bac Pro Métiers du cuir - Option maroquinerie",
        niveau: "Bac Pro",
        coeffs: [4, 5, 3, 3, 3, 6, 6],
        etablissements: [
          { nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 30 min)" }
        ]
      },
      {
        nom: "Bac Pro Artisanat et métiers d'art - Option marchandisage visuel",
        niveau: "Bac Pro",
        coeffs: [4, 6, 4, 2, 4, 3, 7],
        etablissements: [
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
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
  "Lycée International Paris-Saclay|Palaiseau": 30,
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
