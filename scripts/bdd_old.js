const DOMAINS = {
  relation_client: {
    label: "Métiers de la Relation Client & Gestion",
    keywords: ["commerce", "vente", "vendre", "client", "magasin", "accueil", "boutique", "relation client", "mrc", "mcva", "mcvb", "agora", "gestion", "administration"],
    coeffs: [6, 5, 4, 5, 3, 3, 4], 
    formations: [
      {
        nom: "Bac Pro Métiers du Commerce et de la Vente (Opt A et B)",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" },
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" },
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Marguerite Yourcenar", ville: "Morangis", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Henri Poincaré", ville: "Palaiseau", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Paul Langevin", ville: "Ste-Geneviève-des-Bois", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Louis Armand", ville: "Yerres", transport: "RER D (env. 35 min)" }
        ]
      },
      {
        nom: "Bac Pro AGORA (Assistance à la Gestion)",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 30 min)" },
          { nom: "Lycée Marie Laurencin", ville: "Mennecy", transport: "RER D (env. 15 min)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "Lycée Parc de Vilgénis", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "CAP Équipier polyvalent du commerce",
        niveau: "CAP",
        etablissements: [
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" },
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "EREA Jean Isoard", ville: "Montgeron", transport: "RER D (env. 35 min)" }
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
        etablissements: [
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "Lycée Jean Monnet", ville: "Juvisy-sur-Orge", transport: "RER D (env. 30 min)" },
          { nom: "Lycée Léonard de Vinci", ville: "Saint-Michel-sur-Orge", transport: "RER D puis RER C (env. 45 min)" },
          { nom: "Lycée Nelson Mandela", ville: "Étampes", transport: "RER D puis RER C (env. 1h15)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Henri Poincaré", ville: "Palaiseau", transport: "RER D puis Bus (env. 1h)" },
          { nom: "Lycée Les Frères Moreau", ville: "Quincy-sous-Sénart", transport: "RER D (env. 40 min)" }
        ]
      },
      {
        nom: "CAP Accompagnant éducatif petite enfance",
        niveau: "CAP",
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
        etablissements: [
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Charles Baudelaire", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 30 min)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" },
          { nom: "Lycée Paul Belmondo", ville: "Arpajon", transport: "Bus 91-04 (env. 60 min)" },
          { nom: "Lycée Clément Ader", ville: "Athis-Mons", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "Lycée Nelson Mandela", ville: "Étampes", transport: "RER D puis RER C (env. 1h15)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "Lycée Jean Perrin", ville: "Longjumeau", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Parc de Vilgénis", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" },
          { nom: "Lycée André-Marie Ampère", ville: "Morsang-sur-Orge", transport: "RER D puis Bus (env. 50 min)" },
          { nom: "Lycée Les Frères Moreau", ville: "Quincy-sous-Sénart", transport: "RER D (env. 40 min)" }
        ]
      },
      {
        nom: "Bac Pro Cybersécurité, Informatique et Réseaux (CIEL)",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Georges Brassens", ville: "Évry-Courcouronnes", transport: "Bus 401 puis Bus 402 (env. 40 min)" },
          { nom: "Lycée Nikola Tesla", ville: "Dourdan", transport: "RER D puis RER C (env. 1h30)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "Lycée Parc de Vilgénis", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" },
          { nom: "Lycée André-Marie Ampère", ville: "Morsang-sur-Orge", transport: "RER D puis Bus (env. 50 min)" }
        ]
      },
      {
        nom: "CAP Électricien",
        niveau: "CAP",
        etablissements: [
          { nom: "Lycée Robert Doisneau", ville: "Corbeil-Essonnes", transport: "Bus 401 ou à pied (env. 15 min)" },
          { nom: "Lycée Pierre Mendès France", ville: "Ris-Orangis", transport: "RER D (env. 25 min)" },
          { nom: "Lycée Clément Ader", ville: "Athis-Mons", transport: "RER D (env. 40 min)" },
          { nom: "Lycée Nadar", ville: "Draveil", transport: "RER D puis Bus (env. 45 min)" },
          { nom: "Lycée L'Essouriau", ville: "Les Ulis", transport: "RER D puis Bus (env. 1h15)" },
          { nom: "EREA Jean Isoard", ville: "Montgeron", transport: "RER D (env. 35 min)" },
          { nom: "Lycée André-Marie Ampère", ville: "Morsang-sur-Orge", transport: "RER D puis Bus (env. 50 min)" }
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
        nom: "Bac Pro Technicien d'études du bâtiment (A et B)",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" },
          { nom: "Lycée Jean Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" },
          { nom: "Lycée Gustave Eiffel", ville: "Massy", transport: "RER D puis Tram 12 (env. 1h)" }
        ]
      },
      {
        nom: "Bac Pro Aménagement et finition du bâtiment",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Jean Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" }
        ]
      },
      {
        nom: "CAP Maçon",
        niveau: "CAP",
        etablissements: [
          { nom: "Lycée Auguste Perret", ville: "Évry-Courcouronnes", transport: "Bus 401 (env. 25 min)" },
          { nom: "Lycée Jean Pierre Timbaud", ville: "Brétigny-sur-Orge", transport: "RER D puis RER C (env. 60 min)" },
          { nom: "EREA Château du Lac", ville: "Ollainville", transport: "RER D puis RER C puis Bus (env. 1h20)" }
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
        etablissements: [
          { nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)" },
          { nom: "Lycée St Pierre (Privé)", ville: "Brunoy", transport: "RER D (env. 40 min)" }
        ]
      },
      {
        nom: "Bac Pro Cuisine",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Château des Coudraies", ville: "Étiolles", transport: "Bus 7001 (env. 20 min)" },
          { nom: "Lycée St Pierre (Privé)", ville: "Brunoy", transport: "RER D (env. 40 min)" }
        ]
      },
      {
        nom: "CAP Cuisine / Pâtissier",
        niveau: "CAP",
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
        nom: "Bac Pro Maintenance des véhicules (Option Voitures Particulières)",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" },
          { nom: "Lycée Gaspard Monge", ville: "Savigny-sur-Orge", transport: "RER D puis RER C (env. 45 min)" },
          { nom: "Lycée Les Frères Moreau", ville: "Quincy-sous-Sénart", transport: "RER D (env. 40 min)" }
        ]
      },
      {
        nom: "Bac Pro Carrossier peintre automobile",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" },
          { nom: "Lycée Gaspard Monge", ville: "Savigny-sur-Orge", transport: "RER D puis RER C (env. 45 min)" }
        ]
      },
      {
        nom: "Bac Pro Aéronautique",
        niveau: "Bac Pro",
        etablissements: [
          { nom: "Lycée Alexandre Denis", ville: "Cerny", transport: "RER D jusqu'à Mennecy puis Bus (env. 45 min)" }
        ]
      }
    ]
  }
};
