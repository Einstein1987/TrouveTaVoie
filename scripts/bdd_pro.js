// =============================================================================
// TrouveTaVoie — Base des formations professionnelles publiques (Essonne, 91)
// Secteur de référence : bassin de Corbeil-Essonnes.
// Sources : CIO d'Évry — "Formations pro post-3e", "Bacs pro en Essonne",
//           "Les CAP en Essonne", "Fiche technique n°21 (coefficients)" — Rentrée 2026.
// NB : établissements PUBLICS uniquement. Données indicatives, à revérifier
//      chaque année sur ONISEP / AFFELNET (offre et coefficients évoluent).
// =============================================================================

/* =============================================================================
 * COEFFICIENTS AFFELNET — vérifiés le 13 juillet 2026 contre le document
 * officiel « Fichier des formations professionnelles / vœux du bassin »
 * (académie de Versailles, campagne 2026).
 *
 * Deux niveaux : les coefficients du DOMAINE (la famille de métiers) et ceux de
 * chaque FORMATION. Ils diffèrent quand une seconde pro est AUTONOME, c'est-à-dire
 * qu'elle n'appartient à aucune famille : HPS, MP3D, OPTL, Marchandisage visuel
 * ont leur propre barème [4,6,4,2,4,3,7].
 *
 * ⚠ CAP Jardinier paysagiste : absent du document (formation agricole, relevant
 *   du ministère de l'Agriculture). Ses coefficients restent À VÉRIFIER.
 * ========================================================================== */

const DOMAINS = {
  relation_client: {
    label: "Métiers de la Relation Client",
    keywords: [
      "commerce",
      "vente",
      "vendre",
      "client",
      "clientele",
      "magasin",
      "accueil",
      "boutique",
      "relation client",
      "mrc",
      "mcv",
      "mcva",
      "mcvb",
      "caisse"
    ],
    coeffs: [
      6,
      5,
      4,
      5,
      3,
      3,
      4
    ],
    formations: [
      {
        nom: "Bac Pro Métiers de l'accueil",
        niveau: "Bac Pro",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Pierre Mendès France",
            ville: "Ris-Orangis",
            transport: "RER D",
            "distanceKm": 8,
            "dureeMin": 35,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Paul Langevin",
            ville: "Sainte-Geneviève-des-Bois",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 65,
            trajet: "Bus 4245 puis Bus 4504"
          },
          {
            nom: "Lycée Jean Monnet",
            ville: "Juvisy-sur-Orge",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 53,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Louis Armand",
            ville: "Yerres",
            transport: "RER D",
            "distanceKm": 17,
            "dureeMin": 79,
            trajet: "Bus 4245 puis RER D puis RER D"
          },
          {
            nom: "Lycée Paul Belmondo",
            ville: "Arpajon",
            transport: "Bus 91-04",
            "distanceKm": 21,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 9114"
          },
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          },
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "Bac Pro Métiers du Commerce et de la Vente (Options A et B)",
        niveau: "Bac Pro",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Robert Doisneau",
            ville: "Corbeil-Essonnes",
            transport: "Bus 401 ou à pied",
            "distanceKm": 2,
            "dureeMin": 26,
            trajet: "Bus 4245"
          },
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Pierre Mendès France",
            ville: "Ris-Orangis",
            transport: "RER D",
            "distanceKm": 8,
            "dureeMin": 35,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Nadar",
            ville: "Draveil",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 73,
            trajet: "Bus 4245 puis RER D puis Bus 4116"
          },
          {
            nom: "Lycée Paul Langevin",
            ville: "Sainte-Geneviève-des-Bois",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 65,
            trajet: "Bus 4245 puis Bus 4504"
          },
          {
            nom: "Lycée Jean Monnet",
            ville: "Juvisy-sur-Orge",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 53,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Louis Armand",
            ville: "Yerres",
            transport: "RER D",
            "distanceKm": 17,
            "dureeMin": 79,
            trajet: "Bus 4245 puis RER D puis RER D"
          },
          {
            nom: "Lycée Paul Belmondo",
            ville: "Arpajon",
            transport: "Bus 91-04",
            "distanceKm": 21,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 9114"
          },
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          },
          {
            nom: "Lycée Marguerite Yourcenar",
            ville: "Morangis",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 83,
            trajet: "RER D puis RER D puis Bus 399"
          },
          {
            nom: "Lycée Henri Poincaré",
            ville: "Palaiseau",
            transport: "RER D puis Bus",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis RER D puis RER B"
          },
          {
            nom: "Lycée Nelson Mandela",
            ville: "Étampes",
            transport: "RER D puis RER C",
            "distanceKm": 39,
            "dureeMin": 120,
            trajet: "RER D puis RER D puis RER C"
          },
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "CAP Équipier polyvalent du commerce",
        niveau: "CAP",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Pierre Mendès France",
            ville: "Ris-Orangis",
            transport: "RER D",
            "distanceKm": 8,
            "dureeMin": 35,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Nadar",
            ville: "Draveil",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 73,
            trajet: "Bus 4245 puis RER D puis Bus 4116"
          },
          {
            nom: "Lycée Paul Langevin",
            ville: "Sainte-Geneviève-des-Bois",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 65,
            trajet: "Bus 4245 puis Bus 4504"
          },
          {
            nom: "EREA Jean Isoard",
            ville: "Montgeron",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 81,
            trajet: "Bus 4245 puis Bus 4122"
          },
          {
            nom: "Lycée Louis Armand",
            ville: "Yerres",
            transport: "RER D",
            "distanceKm": 17,
            "dureeMin": 79,
            trajet: "Bus 4245 puis RER D puis RER D"
          },
          {
            nom: "Lycée Marguerite Yourcenar",
            ville: "Morangis",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 83,
            trajet: "RER D puis RER D puis Bus 399"
          },
          {
            nom: "Lycée Henri Poincaré",
            ville: "Palaiseau",
            transport: "RER D puis Bus",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis RER D puis RER B"
          },
          {
            nom: "Lycée Nelson Mandela",
            ville: "Étampes",
            transport: "RER D puis RER C",
            "distanceKm": 39,
            "dureeMin": 120,
            trajet: "RER D puis RER D puis RER C"
          }
        ]
      }
    ]
  },
  gestion_logistique: {
    label: "Métiers de la Gestion, du Transport et de la Logistique",
    keywords: [
      "gestion",
      "administration",
      "administratif",
      "agora",
      "secretariat",
      "bureau",
      "logistique",
      "transport",
      "entrepot",
      "magasinier",
      "stock",
      "conducteur",
      "routier",
      "camion",
      "autobus",
      "autocar",
      "chauffeur"
    ],
    coeffs: [
      6,
      5,
      4,
      5,
      3,
      3,
      4
    ],
    formations: [
      {
        nom: "Bac Pro AGORA (Assistance à la Gestion des Organisations et de leurs Activités)",
        niveau: "Bac Pro",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Robert Doisneau",
            ville: "Corbeil-Essonnes",
            transport: "Bus 401 ou à pied",
            "distanceKm": 2,
            "dureeMin": 26,
            trajet: "Bus 4245"
          },
          {
            nom: "Lycée Marie Laurencin",
            ville: "Mennecy",
            transport: "RER D",
            "distanceKm": 5,
            "dureeMin": 41,
            trajet: "Bus 4245 puis Bus 4307"
          },
          {
            nom: "Lycée Paul Langevin",
            ville: "Sainte-Geneviève-des-Bois",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 65,
            trajet: "Bus 4245 puis Bus 4504"
          },
          {
            nom: "Lycée Jean Monnet",
            ville: "Juvisy-sur-Orge",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 53,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Louis Armand",
            ville: "Yerres",
            transport: "RER D",
            "distanceKm": 17,
            "dureeMin": 79,
            trajet: "Bus 4245 puis RER D puis RER D"
          },
          {
            nom: "Lycée Paul Belmondo",
            ville: "Arpajon",
            transport: "Bus 91-04",
            "distanceKm": 21,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 9114"
          },
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          },
          {
            nom: "Lycée Marguerite Yourcenar",
            ville: "Morangis",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 83,
            trajet: "RER D puis RER D puis Bus 399"
          },
          {
            nom: "Lycée Parc de Vilgénis",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 28,
            "dureeMin": 93,
            trajet: "Bus 4245 puis Tram T12 puis Bus 119"
          },
          {
            nom: "Lycée L'Essouriau",
            ville: "Les Ulis",
            transport: "RER D puis Bus",
            "distanceKm": 30,
            "dureeMin": 115,
            trajet: "RER D puis RER D puis Bus 9105 puis Bus 4609"
          },
          {
            nom: "Lycée Geoffroy Saint-Hilaire",
            ville: "Étampes",
            transport: "RER D puis RER C",
            "distanceKm": 38,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis RER C"
          },
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "Bac Pro Logistique",
        niveau: "Bac Pro",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Gaspard Monge",
            ville: "Savigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 17,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "Bac Pro Organisation de transport de marchandises",
        niveau: "Bac Pro",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Gaspard Monge",
            ville: "Savigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 17,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          }
        ]
      },
      {
        nom: "Bac Pro Conducteur routier de marchandises",
        niveau: "Bac Pro",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "CAP Conducteur Agent d'accueil en Autobus et Autocar",
        niveau: "CAP",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "CAP Opérateur/opératrice logistique",
        niveau: "CAP",
        coeffs: [
          6,
          5,
          4,
          5,
          3,
          3,
          4
        ],
        etablissements: [
          {
            nom: "Lycée Gaspard Monge",
            ville: "Savigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 17,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      }
    ]
  },
  sante_social: {
    label: "Santé, Social, Soin et Animation",
    keywords: [
      "sante",
      "social",
      "soin",
      "enfant",
      "petite enfance",
      "personnes agees",
      "grand age",
      "hopital",
      "medical",
      "infirmier",
      "aide",
      "assp",
      "animation",
      "aepa",
      "hygiene",
      "proprete",
      "sterilisation"
    ],
    coeffs: [
      5,
      4,
      3,
      3,
      4,
      4,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Accompagnement, soins et services à la personne (ASSP)",
        niveau: "Bac Pro",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Les Frères Moreau",
            ville: "Quincy-sous-Sénart",
            transport: "RER D",
            "distanceKm": 14,
            "dureeMin": 79,
            trajet: "RER D puis RER D"
          },
          {
            nom: "Lycée Léonard de Vinci",
            ville: "Saint-Michel-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 4501"
          },
          {
            nom: "Lycée Jean Monnet",
            ville: "Juvisy-sur-Orge",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 53,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          },
          {
            nom: "Lycée Henri Poincaré",
            ville: "Palaiseau",
            transport: "RER D puis Bus",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis RER D puis RER B"
          },
          {
            nom: "Lycée Nelson Mandela",
            ville: "Étampes",
            transport: "RER D puis RER C",
            "distanceKm": 39,
            "dureeMin": 120,
            trajet: "RER D puis RER D puis RER C"
          }
        ]
      },
      {
        nom: "Bac Pro Animation-enfance et personnes âgées (AEPA)",
        niveau: "Bac Pro",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Léonard de Vinci",
            ville: "Saint-Michel-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 4501"
          },
          {
            nom: "Lycée Henri Poincaré",
            ville: "Palaiseau",
            transport: "RER D puis Bus",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis RER D puis RER B"
          },
          {
            nom: "Lycée Nelson Mandela",
            ville: "Étampes",
            transport: "RER D puis RER C",
            "distanceKm": 39,
            "dureeMin": 120,
            trajet: "RER D puis RER D puis RER C"
          }
        ]
      },
      {
        nom: "Bac Pro Hygiène, Propreté, Stérilisation",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Léonard de Vinci",
            ville: "Saint-Michel-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 4501"
          }
        ]
      },
      {
        nom: "CAP Accompagnant éducatif petite enfance",
        niveau: "CAP",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          }
        ]
      },
      {
        nom: "CAP Agent accompagnant au grand âge",
        niveau: "CAP",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Léonard de Vinci",
            ville: "Saint-Michel-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 4501"
          },
          {
            nom: "EREA Jean Isoard",
            ville: "Montgeron",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 81,
            trajet: "Bus 4245 puis Bus 4122"
          },
          {
            nom: "Lycée Paul Belmondo",
            ville: "Arpajon",
            transport: "Bus 91-04",
            "distanceKm": 21,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 9114"
          },
          {
            nom: "Lycée Nelson Mandela",
            ville: "Étampes",
            transport: "RER D puis RER C",
            "distanceKm": 39,
            "dureeMin": 120,
            trajet: "RER D puis RER D puis RER C"
          }
        ]
      }
    ]
  },
  beaute: {
    label: "Métiers de la Beauté et du Bien-être",
    keywords: [
      "beaute",
      "bien-etre",
      "bien etre",
      "esthetique",
      "cosmetique",
      "parfumerie",
      "coiffure",
      "coiffeur",
      "maquillage",
      "onglerie"
    ],
    coeffs: [
      5,
      4,
      3,
      3,
      4,
      4,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Esthétique, cosmétique, parfumerie",
        niveau: "Bac Pro",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          }
        ]
      },
      {
        nom: "Bac Pro Métiers de la coiffure",
        niveau: "Bac Pro",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          }
        ]
      },
      {
        nom: "CAP Esthétique, cosmétique, parfumerie",
        niveau: "CAP",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          }
        ]
      }
    ]
  },
  numerique_energie: {
    label: "Transitions Numérique et Énergétique",
    keywords: [
      "informatique",
      "ordinateur",
      "numerique",
      "reseau",
      "cybersecurite",
      "electricite",
      "electricien",
      "ciel",
      "melec",
      "energie",
      "code",
      "electronique",
      "climatisation",
      "chauffage",
      "chauffagiste",
      "thermique",
      "froid",
      "photonique",
      "optique"
    ],
    coeffs: [
      5,
      6,
      3,
      4,
      3,
      2,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Métiers de l'électricité et de ses environnements connectés (MELEC)",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Robert Doisneau",
            ville: "Corbeil-Essonnes",
            transport: "Bus 401 ou à pied",
            "distanceKm": 2,
            "dureeMin": 26,
            trajet: "Bus 4245"
          },
          {
            nom: "Lycée Pierre Mendès France",
            ville: "Ris-Orangis",
            transport: "RER D",
            "distanceKm": 8,
            "dureeMin": 35,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Nadar",
            ville: "Draveil",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 73,
            trajet: "Bus 4245 puis RER D puis Bus 4116"
          },
          {
            nom: "Lycée André-Marie Ampère",
            ville: "Morsang-sur-Orge",
            transport: "RER D puis Bus",
            "distanceKm": 14,
            "dureeMin": 81,
            trajet: "Bus 4245 puis Tram T12 puis Bus 4521"
          },
          {
            nom: "Lycée Les Frères Moreau",
            ville: "Quincy-sous-Sénart",
            transport: "RER D",
            "distanceKm": 14,
            "dureeMin": 79,
            trajet: "RER D puis RER D"
          },
          {
            nom: "Lycée Léonard de Vinci",
            ville: "Saint-Michel-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 4501"
          },
          {
            nom: "Lycée Clément Ader",
            ville: "Athis-Mons",
            transport: "RER D",
            "distanceKm": 18,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée Paul Belmondo",
            ville: "Arpajon",
            transport: "Bus 91-04",
            "distanceKm": 21,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 9114"
          },
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          },
          {
            nom: "Lycée Parc de Vilgénis",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 28,
            "dureeMin": 93,
            trajet: "Bus 4245 puis Tram T12 puis Bus 119"
          },
          {
            nom: "Lycée L'Essouriau",
            ville: "Les Ulis",
            transport: "RER D puis Bus",
            "distanceKm": 30,
            "dureeMin": 115,
            trajet: "RER D puis RER D puis Bus 9105 puis Bus 4609"
          },
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "Bac Pro Cybersécurité, Informatique et Réseaux, Électronique (CIEL)",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Georges Brassens",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401 puis Bus 402",
            "distanceKm": 6,
            "dureeMin": 35,
            trajet: "Bus 4245"
          },
          {
            nom: "Lycée André-Marie Ampère",
            ville: "Morsang-sur-Orge",
            transport: "RER D puis Bus",
            "distanceKm": 14,
            "dureeMin": 81,
            trajet: "Bus 4245 puis Tram T12 puis Bus 4521"
          },
          {
            nom: "Lycée Parc de Vilgénis",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 28,
            "dureeMin": 93,
            trajet: "Bus 4245 puis Tram T12 puis Bus 119"
          },
          {
            nom: "Lycée L'Essouriau",
            ville: "Les Ulis",
            transport: "RER D puis Bus",
            "distanceKm": 30,
            "dureeMin": 115,
            trajet: "RER D puis RER D puis Bus 9105 puis Bus 4609"
          },
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "Bac Pro Installateur en chauffage, climatisation et énergies renouvelables",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Pierre Mendès France",
            ville: "Ris-Orangis",
            transport: "RER D",
            "distanceKm": 8,
            "dureeMin": 35,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "Bac Pro Maintenance et efficacité énergétique",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          }
        ]
      },
      {
        nom: "Bac Pro Métiers du froid et des énergies renouvelables",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Pierre Mendès France",
            ville: "Ris-Orangis",
            transport: "RER D",
            "distanceKm": 8,
            "dureeMin": 35,
            trajet: "Bus 4245 puis RER D"
          }
        ]
      },
      {
        nom: "Bac Pro Optique Photonique - Technologies de la Lumière",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée International Paris-Saclay",
            ville: "Palaiseau",
            transport: "RER B puis Bus",
            "distanceKm": 30,
            "dureeMin": 108,
            trajet: "RER D puis RER D puis Bus 9105"
          }
        ]
      },
      {
        nom: "CAP Électricien",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Robert Doisneau",
            ville: "Corbeil-Essonnes",
            transport: "Bus 401 ou à pied",
            "distanceKm": 2,
            "dureeMin": 26,
            trajet: "Bus 4245"
          },
          {
            nom: "Lycée Pierre Mendès France",
            ville: "Ris-Orangis",
            transport: "RER D",
            "distanceKm": 8,
            "dureeMin": 35,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Nadar",
            ville: "Draveil",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 73,
            trajet: "Bus 4245 puis RER D puis Bus 4116"
          },
          {
            nom: "Lycée André-Marie Ampère",
            ville: "Morsang-sur-Orge",
            transport: "RER D puis Bus",
            "distanceKm": 14,
            "dureeMin": 81,
            trajet: "Bus 4245 puis Tram T12 puis Bus 4521"
          },
          {
            nom: "Lycée Les Frères Moreau",
            ville: "Quincy-sous-Sénart",
            transport: "RER D",
            "distanceKm": 14,
            "dureeMin": 79,
            trajet: "RER D puis RER D"
          },
          {
            nom: "EREA Jean Isoard",
            ville: "Montgeron",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 81,
            trajet: "Bus 4245 puis Bus 4122"
          },
          {
            nom: "Lycée Clément Ader",
            ville: "Athis-Mons",
            transport: "RER D",
            "distanceKm": 18,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée L'Essouriau",
            ville: "Les Ulis",
            transport: "RER D puis Bus",
            "distanceKm": 30,
            "dureeMin": 115,
            trajet: "RER D puis RER D puis Bus 9105 puis Bus 4609"
          },
          {
            nom: "Lycée Nelson Mandela",
            ville: "Étampes",
            transport: "RER D puis RER C",
            "distanceKm": 39,
            "dureeMin": 120,
            trajet: "RER D puis RER D puis RER C"
          }
        ]
      },
      {
        nom: "CAP Installateur en froid et conditionnement d'air",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Pierre Mendès France",
            ville: "Ris-Orangis",
            transport: "RER D",
            "distanceKm": 8,
            "dureeMin": 35,
            trajet: "Bus 4245 puis RER D"
          }
        ]
      },
      {
        nom: "CAP Monteur en installations thermiques",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          }
        ]
      }
    ]
  },
  batiment: {
    label: "Construction, Bâtiment et Travaux Publics",
    keywords: [
      "batiment",
      "construire",
      "construction",
      "maçon",
      "macon",
      "maçonnerie",
      "gros oeuvre",
      "metallerie",
      "metallier",
      "travaux",
      "chantier",
      "peintre",
      "peinture",
      "carrelage",
      "finition",
      "plomberie",
      "sanitaire",
      "charpente",
      "charpentier",
      "menuiserie aluminium",
      "travaux publics"
    ],
    coeffs: [
      5,
      6,
      3,
      4,
      3,
      2,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Technicien du bâtiment : organisation et réalisation du gros œuvre",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "Bac Pro Aménagement et finition du bâtiment",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          }
        ]
      },
      {
        nom: "Bac Pro Interventions sur le patrimoine bâti - Option maçonnerie",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          }
        ]
      },
      {
        nom: "Bac Pro Ouvrages du bâtiment : métallerie",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          }
        ]
      },
      {
        nom: "Bac Pro Menuiserie aluminium-verre",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          }
        ]
      },
      {
        nom: "CAP Maçon",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          },
          {
            nom: "EREA Le Château du Lac",
            ville: "Ollainville",
            transport: "RER D puis Bus",
            "distanceKm": 23,
            "dureeMin": 98,
            trajet: "Bus 4245 puis RER D puis RER C"
          }
        ]
      },
      {
        nom: "CAP Carreleur mosaïste",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "CAP Peintre applicateur de revêtements",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "CAP Charpentier bois",
        niveau: "CAP",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "CAP Menuisier aluminium-verre",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          }
        ]
      },
      {
        nom: "CAP Métallier",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "EREA Le Château du Lac",
            ville: "Ollainville",
            transport: "RER D puis Bus",
            "distanceKm": 23,
            "dureeMin": 98,
            trajet: "Bus 4245 puis RER D puis RER C"
          }
        ]
      },
      {
        nom: "CAP Monteur en installations sanitaires",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "CAP Interventions en maintenance technique des bâtiments",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          }
        ]
      }
    ]
  },
  etudes_batiment: {
    label: "Études et Modélisation Numérique du Bâtiment",
    keywords: [
      "etudes du batiment",
      "modelisation",
      "geometre",
      "topographe",
      "dessin batiment",
      "architecture",
      "plan",
      "bureau d'etudes",
      "economie de la construction"
    ],
    coeffs: [
      4,
      6,
      4,
      2,
      4,
      3,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Technicien d'études du bâtiment - Option A : études et économie",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          },
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "Bac Pro Technicien d'études du bâtiment - Option B : assistant en architecture",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          },
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "Bac Pro Géomètre (ex Technicien géomètre-topographe)",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          }
        ]
      }
    ]
  },
  agencement_bois: {
    label: "Agencement, Menuiserie et Ameublement",
    keywords: [
      "menuiserie",
      "menuisier",
      "bois",
      "agencement",
      "ameublement",
      "meuble",
      "agenceur",
      "fabrication bois",
      "ebeniste"
    ],
    coeffs: [
      4,
      6,
      4,
      2,
      4,
      3,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Technicien menuisier agenceur",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "Bac Pro Technicien de fabrication bois et matériaux associés",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          }
        ]
      },
      {
        nom: "Bac Pro Étude et réalisation d'agencement",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "CAP Menuisier fabricant",
        niveau: "CAP",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Auguste Perret",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          },
          {
            nom: "EREA Le Château du Lac",
            ville: "Ollainville",
            transport: "RER D puis Bus",
            "distanceKm": 23,
            "dureeMin": 98,
            trajet: "Bus 4245 puis RER D puis RER C"
          }
        ]
      }
    ]
  },
  realisation_mecanique: {
    label: "Réalisation d'Ensembles Mécaniques et Industriels",
    keywords: [
      "usinage",
      "chaudronnerie",
      "soudure",
      "soudage",
      "industrie",
      "industriel",
      "mecanique industrielle",
      "microtechnique",
      "prototypage",
      "fabrication mecanique",
      "production",
      "tournage",
      "fraisage"
    ],
    coeffs: [
      5,
      6,
      3,
      4,
      3,
      2,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Technicien en réalisation de produits mécaniques - Option réalisation et suivi de productions",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Robert Doisneau",
            ville: "Corbeil-Essonnes",
            transport: "Bus 401 ou à pied",
            "distanceKm": 2,
            "dureeMin": 26,
            trajet: "Bus 4245"
          },
          {
            nom: "Lycée Les Frères Moreau",
            ville: "Quincy-sous-Sénart",
            transport: "RER D",
            "distanceKm": 14,
            "dureeMin": 79,
            trajet: "RER D puis RER D"
          },
          {
            nom: "Lycée Parc de Vilgénis",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 28,
            "dureeMin": 93,
            trajet: "Bus 4245 puis Tram T12 puis Bus 119"
          }
        ]
      },
      {
        nom: "Bac Pro Technicien en chaudronnerie industrielle",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          },
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          }
        ]
      },
      {
        nom: "Bac Pro Microtechniques",
        niveau: "Bac Pro",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Georges Brassens",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401 puis Bus 402",
            "distanceKm": 6,
            "dureeMin": 35,
            trajet: "Bus 4245"
          },
          {
            nom: "Lycée Parc de Vilgénis",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 28,
            "dureeMin": 93,
            trajet: "Bus 4245 puis Tram T12 puis Bus 119"
          }
        ]
      },
      {
        nom: "Bac Pro Modélisation et prototypage 3D",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          }
        ]
      },
      {
        nom: "CAP Réalisations industrielles en chaudronnerie ou soudage - Option A : chaudronnerie",
        niveau: "CAP",
        coeffs: [
          5,
          6,
          3,
          4,
          3,
          2,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Jean-Pierre Timbaud",
            ville: "Brétigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 64,
            trajet: "Bus 4245 puis Bus 4504"
          }
        ]
      }
    ]
  },
  pilotage_maintenance: {
    label: "Pilotage et Maintenance d'Installations Automatisées",
    keywords: [
      "automatisme",
      "automatise",
      "maintenance industrielle",
      "robot",
      "pilotage",
      "installations automatisees",
      "production connectee",
      "mspc",
      "usine"
    ],
    coeffs: [
      4,
      6,
      4,
      2,
      4,
      3,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Maintenance des systèmes de production connectés",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Nadar",
            ville: "Draveil",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 73,
            trajet: "Bus 4245 puis RER D puis Bus 4116"
          },
          {
            nom: "Lycée Clément Ader",
            ville: "Athis-Mons",
            transport: "RER D",
            "distanceKm": 18,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée Paul Belmondo",
            ville: "Arpajon",
            transport: "Bus 91-04",
            "distanceKm": 21,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 9114"
          },
          {
            nom: "Lycée Jean Perrin",
            ville: "Longjumeau",
            transport: "RER D puis Bus",
            "distanceKm": 21,
            "dureeMin": 90,
            trajet: "Bus 4245 puis RER D puis RER C puis Bus 4501"
          },
          {
            nom: "Lycée L'Essouriau",
            ville: "Les Ulis",
            transport: "RER D puis Bus",
            "distanceKm": 30,
            "dureeMin": 115,
            trajet: "RER D puis RER D puis Bus 9105 puis Bus 4609"
          },
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "CAP Conducteur d'installations de production",
        niveau: "CAP",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée L'Essouriau",
            ville: "Les Ulis",
            transport: "RER D puis Bus",
            "distanceKm": 30,
            "dureeMin": 115,
            trajet: "RER D puis RER D puis Bus 9105 puis Bus 4609"
          }
        ]
      }
    ]
  },
  maintenance_vehicules: {
    label: "Maintenance des Matériels et des Véhicules",
    keywords: [
      "voiture",
      "mecanique",
      "mecanicien",
      "auto",
      "automobile",
      "garage",
      "carrosserie",
      "carrossier",
      "moteur",
      "maintenance",
      "materiels",
      "engins",
      "agricole",
      "poids lourd",
      "camion"
    ],
    coeffs: [
      4,
      6,
      3,
      4,
      3,
      2,
      8
    ],
    formations: [
      {
        nom: "Bac Pro Maintenance des véhicules - Option véhicules légers",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Les Frères Moreau",
            ville: "Quincy-sous-Sénart",
            transport: "RER D",
            "distanceKm": 14,
            "dureeMin": 79,
            trajet: "RER D puis RER D"
          },
          {
            nom: "Lycée Gaspard Monge",
            ville: "Savigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 17,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "Bac Pro Maintenance des matériels - Option A : matériels agricoles",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "Bac Pro Maintenance des matériels - Option B : matériels de construction et de manutention",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "Bac Pro Maintenance des matériels - Option C : matériels d'espaces verts",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Nikola Tesla",
            ville: "Dourdan",
            transport: "RER D puis RER C",
            "distanceKm": 46,
            "dureeMin": 133,
            trajet: "Bus 4245 puis Tram T12 puis Bus 9103"
          }
        ]
      },
      {
        nom: "Bac Pro Carrossier peintre automobile",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Gaspard Monge",
            ville: "Savigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 17,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "CAP Maintenance des véhicules - Option véhicules légers",
        niveau: "CAP",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Les Frères Moreau",
            ville: "Quincy-sous-Sénart",
            transport: "RER D",
            "distanceKm": 14,
            "dureeMin": 79,
            trajet: "RER D puis RER D"
          },
          {
            nom: "Lycée Gaspard Monge",
            ville: "Savigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 17,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "CAP Carrossier automobile",
        niveau: "CAP",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Gaspard Monge",
            ville: "Savigny-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 17,
            "dureeMin": 69,
            trajet: "Bus 4245 puis RER D puis RER C"
          },
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "CAP Maintenance des matériels - Option C : matériels d'espaces verts",
        niveau: "CAP",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "EREA Le Château du Lac",
            ville: "Ollainville",
            transport: "RER D puis Bus",
            "distanceKm": 23,
            "dureeMin": 98,
            trajet: "Bus 4245 puis RER D puis RER C"
          }
        ]
      }
    ]
  },
  aeronautique: {
    label: "Métiers de l'Aéronautique",
    keywords: [
      "aeronautique",
      "avion",
      "avions",
      "avionique",
      "aviation",
      "aile",
      "helicoptere",
      "pilote",
      "aeroport",
      "mecanicien avion",
      "aerien"
    ],
    coeffs: [
      4,
      6,
      3,
      4,
      3,
      2,
      8
    ],
    formations: [
      {
        nom: "Bac Pro Aéronautique - Option avionique",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "Bac Pro Aéronautique - Option systèmes",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "Bac Pro Aviation générale",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      },
      {
        nom: "CAP Aéronautique - Option avionique",
        niveau: "CAP",
        coeffs: [
          4,
          6,
          3,
          4,
          3,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Alexandre Denis",
            ville: "Cerny",
            transport: "RER D jusqu'à Mennecy puis Bus",
            "distanceKm": 20,
            "dureeMin": 59,
            trajet: "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
          }
        ]
      }
    ]
  },
  hotellerie_restauration: {
    label: "Métiers de l'Hôtellerie et de la Restauration",
    keywords: [
      "cuisine",
      "cuisinier",
      "restaurant",
      "restauration",
      "serveur",
      "serveuse",
      "hotel",
      "hotellerie",
      "chef",
      "brasserie",
      "salle",
      "commercialisation",
      "service"
    ],
    coeffs: [
      5,
      4,
      3,
      3,
      4,
      4,
      7
    ],
    formations: [
      {
        nom: "Bac Pro Commercialisation et services en restauration",
        niveau: "Bac Pro",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Château des Coudraies",
            ville: "Étiolles",
            transport: "Bus 7001",
            "distanceKm": 6,
            "dureeMin": 45,
            trajet: "Bus 4245 puis Bus Tzen1 puis Bus 3703"
          }
        ]
      },
      {
        nom: "Bac Pro Cuisine",
        niveau: "Bac Pro",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Château des Coudraies",
            ville: "Étiolles",
            transport: "Bus 7001",
            "distanceKm": 6,
            "dureeMin": 45,
            trajet: "Bus 4245 puis Bus Tzen1 puis Bus 3703"
          }
        ]
      },
      {
        nom: "CAP Cuisine",
        niveau: "CAP",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Château des Coudraies",
            ville: "Étiolles",
            transport: "Bus 7001",
            "distanceKm": 6,
            "dureeMin": 45,
            trajet: "Bus 4245 puis Bus Tzen1 puis Bus 3703"
          }
        ]
      },
      {
        nom: "CAP Commercialisation et services en hôtel-café-restaurant",
        niveau: "CAP",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Château des Coudraies",
            ville: "Étiolles",
            transport: "Bus 7001",
            "distanceKm": 6,
            "dureeMin": 45,
            trajet: "Bus 4245 puis Bus Tzen1 puis Bus 3703"
          }
        ]
      },
      {
        nom: "CAP Production et service en restaurations (rapide, collective, cafétéria)",
        niveau: "CAP",
        coeffs: [
          5,
          4,
          3,
          3,
          4,
          4,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Léonard de Vinci",
            ville: "Saint-Michel-sur-Orge",
            transport: "RER D puis RER C",
            "distanceKm": 14,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 4501"
          },
          {
            nom: "EREA Jean Isoard",
            ville: "Montgeron",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 81,
            trajet: "Bus 4245 puis Bus 4122"
          },
          {
            nom: "Lycée L'Essouriau",
            ville: "Les Ulis",
            transport: "RER D puis Bus",
            "distanceKm": 30,
            "dureeMin": 115,
            trajet: "RER D puis RER D puis Bus 9105 puis Bus 4609"
          },
          {
            nom: "Lycée Nelson Mandela",
            ville: "Étampes",
            transport: "RER D puis RER C",
            "distanceKm": 39,
            "dureeMin": 120,
            trajet: "RER D puis RER D puis RER C"
          }
        ]
      }
    ]
  },
  alimentation: {
    label: "Métiers de l'Alimentation",
    keywords: [
      "boulanger",
      "boulangerie",
      "patissier",
      "patisserie",
      "gateau",
      "gateaux",
      "pain",
      "viennoiserie",
      "boucher",
      "boucherie",
      "charcutier",
      "traiteur",
      "chocolatier"
    ],
    coeffs: [
      4,
      6,
      3,
      3,
      3,
      3,
      8
    ],
    formations: [
      {
        nom: "Bac Pro Boulanger-pâtissier",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          3,
          3,
          3,
          3,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Château des Coudraies",
            ville: "Étiolles",
            transport: "Bus 7001",
            "distanceKm": 6,
            "dureeMin": 45,
            trajet: "Bus 4245 puis Bus Tzen1 puis Bus 3703"
          }
        ]
      },
      {
        nom: "CAP Pâtissier",
        niveau: "CAP",
        coeffs: [
          4,
          6,
          3,
          3,
          3,
          3,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Château des Coudraies",
            ville: "Étiolles",
            transport: "Bus 7001",
            "distanceKm": 6,
            "dureeMin": 45,
            trajet: "Bus 4245 puis Bus Tzen1 puis Bus 3703"
          }
        ]
      }
    ]
  },
  securite: {
    label: "Métiers de la Sécurité",
    keywords: [
      "securite",
      "agent de securite",
      "surveillance",
      "gardien",
      "pompier",
      "police",
      "gendarme",
      "secours",
      "prevention"
    ],
    coeffs: [
      5,
      3,
      4,
      3,
      5,
      2,
      8
    ],
    formations: [
      {
        nom: "Bac Pro Métiers de la sécurité",
        niveau: "Bac Pro",
        coeffs: [
          5,
          3,
          4,
          3,
          5,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Nadar",
            ville: "Draveil",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 73,
            trajet: "Bus 4245 puis RER D puis Bus 4116"
          },
          {
            nom: "Lycée Paul Belmondo",
            ville: "Arpajon",
            transport: "Bus 91-04",
            "distanceKm": 21,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 9114"
          }
        ]
      },
      {
        nom: "CAP Agent de sécurité",
        niveau: "CAP",
        coeffs: [
          5,
          3,
          4,
          3,
          5,
          2,
          8
        ],
        etablissements: [
          {
            nom: "Lycée Nadar",
            ville: "Draveil",
            transport: "RER D puis Bus",
            "distanceKm": 13,
            "dureeMin": 73,
            trajet: "Bus 4245 puis RER D puis Bus 4116"
          },
          {
            nom: "Lycée Paul Belmondo",
            ville: "Arpajon",
            transport: "Bus 91-04",
            "distanceKm": 21,
            "dureeMin": 77,
            trajet: "Bus 4245 puis Bus 4504 puis Bus 9114"
          }
        ]
      }
    ]
  },
  mode_art: {
    label: "Métiers de la Mode, du Cuir et de l'Artisanat d'Art",
    keywords: [
      "couture",
      "confection",
      "mode",
      "vetement",
      "cuir",
      "maroquinerie",
      "artisanat",
      "art",
      "metiers d'art",
      "marchandisage",
      "vitrine",
      "stylisme",
      "textile",
      "pressing",
      "blanchisserie"
    ],
    coeffs: [
      4,
      5,
      3,
      3,
      3,
      6,
      6
    ],
    formations: [
      {
        nom: "Bac Pro Métiers de la couture et de la confection",
        niveau: "Bac Pro",
        coeffs: [
          4,
          5,
          3,
          3,
          3,
          6,
          6
        ],
        etablissements: [
          {
            nom: "Lycée Jean Monnet",
            ville: "Juvisy-sur-Orge",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 53,
            trajet: "Bus 4245 puis RER D"
          },
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "Bac Pro Métiers du cuir - Option maroquinerie",
        niveau: "Bac Pro",
        coeffs: [
          4,
          5,
          3,
          3,
          3,
          6,
          6
        ],
        etablissements: [
          {
            nom: "Lycée Jean Monnet",
            ville: "Juvisy-sur-Orge",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 53,
            trajet: "Bus 4245 puis RER D"
          }
        ]
      },
      {
        nom: "Bac Pro Artisanat et métiers d'art - Option marchandisage visuel",
        niveau: "Bac Pro",
        coeffs: [
          4,
          6,
          4,
          2,
          4,
          3,
          7
        ],
        etablissements: [
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "CAP Maroquinerie",
        niveau: "CAP",
        coeffs: [
          4,
          5,
          3,
          3,
          3,
          6,
          6
        ],
        etablissements: [
          {
            nom: "Lycée Jean Monnet",
            ville: "Juvisy-sur-Orge",
            transport: "RER D",
            "distanceKm": 16,
            "dureeMin": 53,
            trajet: "Bus 4245 puis RER D"
          }
        ]
      },
      {
        nom: "CAP Métiers de la mode - vêtement flou",
        niveau: "CAP",
        coeffs: [
          4,
          5,
          3,
          3,
          3,
          6,
          6
        ],
        etablissements: [
          {
            nom: "Lycée Gustave Eiffel",
            ville: "Massy",
            transport: "RER D puis Tram 12",
            "distanceKm": 26,
            "dureeMin": 110,
            trajet: "RER D puis RER D puis Bus 399 puis Bus 319"
          }
        ]
      },
      {
        nom: "CAP Métiers de l'entretien des textiles - Option B : pressing",
        niveau: "CAP",
        coeffs: [
          4,
          5,
          3,
          3,
          3,
          6,
          6
        ],
        etablissements: [
          {
            nom: "Lycée Charles Baudelaire",
            ville: "Évry-Courcouronnes",
            transport: "Bus 401",
            "distanceKm": 7,
            "dureeMin": 42,
            trajet: "Bus 4245 puis Bus 4204"
          }
        ]
      }
    ]
  },
  nature_paysage: {
    label: "Nature, Jardin et Paysage",
    keywords: [
      "paysage",
      "paysagiste",
      "jardin",
      "jardinier",
      "espaces verts",
      "horticulture",
      "nature",
      "plantes",
      "fleurs",
      "agricole"
    ],
    coeffs: [
      4,
      5,
      3,
      3,
      4,
      3,
      8
    ],
    formations: [
      {
        nom: "CAP Jardinier paysagiste",
        niveau: "CAP",
        coeffs: [
          4,
          5,
          3,
          3,
          4,
          3,
          8
        ],
        etablissements: [
          {
            nom: "EREA Le Château du Lac",
            ville: "Ollainville",
            transport: "RER D puis Bus",
            "distanceKm": 23,
            "dureeMin": 98,
            trajet: "Bus 4245 puis RER D puis RER C"
          }
        ]
      }
    ]
  }
};
const DUREES_TRANSPORT_CORBEIL = {
  "Lycée Robert Doisneau|Corbeil-Essonnes": {
    "dureeMin": 26,
    "trajet": "Bus 4245"
  },
  "Lycée Auguste Perret|Évry-Courcouronnes": {
    "dureeMin": 42,
    "trajet": "Bus 4245 puis Bus 4204"
  },
  "Lycée Charles Baudelaire|Évry-Courcouronnes": {
    "dureeMin": 42,
    "trajet": "Bus 4245 puis Bus 4204"
  },
  "Lycée Georges Brassens|Évry-Courcouronnes": {
    "dureeMin": 35,
    "trajet": "Bus 4245"
  },
  "Lycée Parc des Loges|Évry-Courcouronnes": {
    "dureeMin": 30,
    "trajet": "Bus 4245 puis Bus 4241"
  },
  "Lycée Pierre Mendès France|Ris-Orangis": {
    "dureeMin": 35,
    "trajet": "Bus 4245 puis RER D"
  },
  "Lycée Château des Coudraies|Étiolles": {
    "dureeMin": 45,
    "trajet": "Bus 4245 puis Bus Tzen1 puis Bus 3703"
  },
  "Lycée Marie Laurencin|Mennecy": {
    "dureeMin": 41,
    "trajet": "Bus 4245 puis Bus 4307"
  },
  "Lycée François Truffaut|Bondoufle": {
    "dureeMin": 58,
    "trajet": "Bus 4245 puis Bus 4214"
  },
  "Lycée Les Frères Moreau|Quincy-sous-Sénart": {
    "dureeMin": 79,
    "trajet": "RER D puis RER D"
  },
  "Lycée Nadar|Draveil": {
    "dureeMin": 73,
    "trajet": "Bus 4245 puis RER D puis Bus 4116"
  },
  "EREA Jean Isoard|Montgeron": {
    "dureeMin": 81,
    "trajet": "Bus 4245 puis Bus 4122"
  },
  "Lycée André-Marie Ampère|Morsang-sur-Orge": {
    "dureeMin": 81,
    "trajet": "Bus 4245 puis Tram T12 puis Bus 4521"
  },
  "Lycée Paul Langevin|Sainte-Geneviève-des-Bois": {
    "dureeMin": 65,
    "trajet": "Bus 4245 puis Bus 4504"
  },
  "Lycée Jean Monnet|Juvisy-sur-Orge": {
    "dureeMin": 53,
    "trajet": "Bus 4245 puis RER D"
  },
  "Lycée Gaspard Monge|Savigny-sur-Orge": {
    "dureeMin": 69,
    "trajet": "Bus 4245 puis RER D puis RER C"
  },
  "Lycée Louis Armand|Yerres": {
    "dureeMin": 79,
    "trajet": "Bus 4245 puis RER D puis RER D"
  },
  "Lycée Clément Ader|Athis-Mons": {
    "dureeMin": 69,
    "trajet": "Bus 4245 puis RER D puis RER C"
  },
  "Lycée Léonard de Vinci|Saint-Michel-sur-Orge": {
    "dureeMin": 77,
    "trajet": "Bus 4245 puis Bus 4504 puis Bus 4501"
  },
  "Lycée Jean-Pierre Timbaud|Brétigny-sur-Orge": {
    "dureeMin": 64,
    "trajet": "Bus 4245 puis Bus 4504"
  },
  "Lycée Marguerite Yourcenar|Morangis": {
    "dureeMin": 83,
    "trajet": "RER D puis RER D puis Bus 399"
  },
  "Lycée Jean Perrin|Longjumeau": {
    "dureeMin": 90,
    "trajet": "Bus 4245 puis RER D puis RER C puis Bus 4501"
  },
  "Lycée Alexandre Denis|Cerny": {
    "dureeMin": 59,
    "trajet": "Bus 4243 puis RER D puis Bus 4306 puis Bus 4306"
  },
  "Lycée Paul Belmondo|Arpajon": {
    "dureeMin": 77,
    "trajet": "Bus 4245 puis Bus 4504 puis Bus 9114"
  },
  "EREA Le Château du Lac|Ollainville": {
    "dureeMin": 98,
    "trajet": "Bus 4245 puis RER D puis RER C"
  },
  "Lycée Gustave Eiffel|Massy": {
    "dureeMin": 110,
    "trajet": "RER D puis RER D puis Bus 399 puis Bus 319"
  },
  "Lycée Parc de Vilgénis|Massy": {
    "dureeMin": 93,
    "trajet": "Bus 4245 puis Tram T12 puis Bus 119"
  },
  "Lycée Henri Poincaré|Palaiseau": {
    "dureeMin": 110,
    "trajet": "RER D puis RER D puis RER D puis RER B"
  },
  "Lycée International Paris-Saclay|Palaiseau": {
    "dureeMin": 108,
    "trajet": "RER D puis RER D puis Bus 9105"
  },
  "Lycée L'Essouriau|Les Ulis": {
    "dureeMin": 115,
    "trajet": "RER D puis RER D puis Bus 9105 puis Bus 4609"
  },
  "Lycée Nelson Mandela|Étampes": {
    "dureeMin": 120,
    "trajet": "RER D puis RER D puis RER C"
  },
  "Lycée Geoffroy Saint-Hilaire|Étampes": {
    "dureeMin": 110,
    "trajet": "RER D puis RER D puis RER C"
  },
  "Lycée Nikola Tesla|Dourdan": {
    "dureeMin": 133,
    "trajet": "Bus 4245 puis Tram T12 puis Bus 9103"
  }
}
const NORMALIZED_DUREES_CORBEIL = Object.fromEntries(
  Object.entries(DUREES_TRANSPORT_CORBEIL).map(([k, v]) => [normalizeDistanceKey(k), v])
);
function getDureeFromCorbeil(etablissement) {
  const key = normalizeDistanceKey(`${etablissement.nom}|${etablissement.ville}`);
  return NORMALIZED_DUREES_CORBEIL[key] ?? null;
}
function normalizeDistanceKey(value) {
  return value
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ").toLowerCase()
    .replace(/[^a-z0-9|]+/g, " ").replace(/\s+/g, " ").trim();
}
const DISTANCES_CORBEIL_ESSONNES = {
  "Lycée Robert Doisneau|Corbeil-Essonnes": 2,
  "Lycée Marie Laurencin|Mennecy": 5,
  "Lycée Château des Coudraies|Étiolles": 6,
  "Lycée Georges Brassens|Évry-Courcouronnes": 6,
  "Lycée Auguste Perret|Évry-Courcouronnes": 7,
  "Lycée Charles Baudelaire|Évry-Courcouronnes": 7,
  "Lycée Pierre Mendès France|Ris-Orangis": 8,
  "Lycée Nadar|Draveil": 13,
  "Lycée Paul Langevin|Sainte-Geneviève-des-Bois": 13,
  "Lycée Les Frères Moreau|Quincy-sous-Sénart": 14,
  "Lycée André-Marie Ampère|Morsang-sur-Orge": 14,
  "Lycée Léonard de Vinci|Saint-Michel-sur-Orge": 14,
  "Lycée Jean-Pierre Timbaud|Brétigny-sur-Orge": 14,
  "EREA Jean Isoard|Montgeron": 16,
  "Lycée Jean Monnet|Juvisy-sur-Orge": 16,
  "Lycée Gaspard Monge|Savigny-sur-Orge": 17,
  "Lycée Louis Armand|Yerres": 17,
  "Lycée Clément Ader|Athis-Mons": 18,
  "Lycée Alexandre Denis|Cerny": 20,
  "Lycée Marguerite Yourcenar|Morangis": 21,
  "Lycée Jean Perrin|Longjumeau": 21,
  "Lycée Paul Belmondo|Arpajon": 21,
  "EREA Le Château du Lac|Ollainville": 23,
  "Lycée Gustave Eiffel|Massy": 26,
  "Lycée Henri Poincaré|Palaiseau": 26,
  "Lycée Parc de Vilgénis|Massy": 28,
  "Lycée International Paris-Saclay|Palaiseau": 30,
  "Lycée L'Essouriau|Les Ulis": 30,
  "Lycée Geoffroy Saint-Hilaire|Étampes": 38,
  "Lycée Nelson Mandela|Étampes": 39,
  "Lycée Nikola Tesla|Dourdan": 46
};
const NORMALIZED_DISTANCES_CORBEIL = Object.fromEntries(
  Object.entries(DISTANCES_CORBEIL_ESSONNES).map(([key, distance]) => [normalizeDistanceKey(key), distance])
);
function getDistanceFromCorbeil(etablissement) {
  const fullKey = normalizeDistanceKey(`${etablissement.nom}|${etablissement.ville}`);
  return NORMALIZED_DISTANCES_CORBEIL[fullKey] ?? 999;
}
function sortEtablissementsByDistance(domains) {
  Object.values(domains).forEach(domain => {
    domain.formations.forEach(formation => {
      formation.etablissements.forEach(e => { 
        e.distanceKm = getDistanceFromCorbeil(e); 
        const d = getDureeFromCorbeil(e);
        if (d) { 
          e.dureeMin = d.dureeMin; 
          e.trajet = d.trajet; 
        }
      });
      formation.etablissements.sort((a, b) => {
        const d = a.distanceKm - b.distanceKm;
        if (d !== 0) return d;
        const c = a.ville.localeCompare(b.ville, "fr");
        if (c !== 0) return c;
        return a.nom.localeCompare(b.nom, "fr");
      });
    });
  });
}
sortEtablissementsByDistance(DOMAINS);
