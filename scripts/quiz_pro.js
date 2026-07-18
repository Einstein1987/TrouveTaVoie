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
 * QUIZ D'ORIENTATION — VOIE PROFESSIONNELLE
 *
 * Objectif : aider l'élève qui ne sait pas par où commencer à identifier
 * TROIS secteurs à explorer. Jamais une seule : un questionnaire
 * d'intérêts ouvre des pistes, il ne désigne pas un destin.
 *
 * Méthode : les questions portent sur les GOÛTS et les GESTES, jamais sur les
 * métiers (un élève de 3e ne sait pas ce que fait un « technicien de
 * maintenance d'installations automatisées »). Chaque réponse attribue des
 * points à plusieurs domaines.
 *
 * Les axes qui séparent réellement les 18 secteurs :
 *   - la matière manipulée : humains / machines / matière brute / vivant / écrans
 *   - le lieu : dehors, atelier, bureau, contact public
 *   - le geste : créer, réparer, organiser, aider, protéger
 *   - le rapport au cadre : procédure stricte ou liberté créative
 *
 * Questions entièrement originales (aucune reprise de questionnaire existant).
 * ========================================================================== */

const QUIZ_PRO = [

  {
    id: "q1",
    question: "Pour commencer : qu'est-ce qui te donnerait le plus envie de te lever le matin ?",
    reponses: [
      { label: "Fabriquer quelque chose de mes propres mains",
        scores: { batiment: 3, agencement_bois: 3, realisation_mecanique: 3, mode_art: 2 } },
      { label: "M'occuper des autres, les aider",
        scores: { sante_social: 4, beaute: 2, securite: 1 } },
      { label: "Comprendre comment les choses marchent, et les réparer",
        scores: { maintenance_vehicules: 3, numerique_energie: 3, pilotage_maintenance: 3 } },
      { label: "Organiser, gérer, faire que tout soit carré",
        scores: { gestion_logistique: 4, relation_client: 2, etudes_batiment: 1 } }
    ]
  },

  {
    id: "q2",
    question: "Où te vois-tu travailler tous les jours ?",
    reponses: [
      { label: "Dehors, en plein air",
        scores: { nature_paysage: 4, batiment: 3, securite: 2 } },
      { label: "Dans un atelier, un garage, une usine",
        scores: { maintenance_vehicules: 3, realisation_mecanique: 3, agencement_bois: 3, pilotage_maintenance: 2 } },
      { label: "En contact avec du public toute la journée",
        scores: { relation_client: 4, hotellerie_restauration: 3, beaute: 3, sante_social: 2 } },
      { label: "Devant des écrans, des plans, des chiffres",
        scores: { etudes_batiment: 4, numerique_energie: 2, gestion_logistique: 3 } }
    ]
  },

  {
    id: "q3",
    question: "Un appareil tombe en panne chez toi. Ton premier réflexe ?",
    reponses: [
      { label: "Je le démonte pour voir ce qu'il a",
        scores: { maintenance_vehicules: 3, pilotage_maintenance: 3, realisation_mecanique: 2,
                  aeronautique: 3 } },
      { label: "Je cherche un tuto, un schéma, une notice",
        scores: { numerique_energie: 3, etudes_batiment: 2, pilotage_maintenance: 1 } },
      { label: "J'appelle quelqu'un qui saura faire",
        scores: { relation_client: 2, sante_social: 2, gestion_logistique: 1 } },
      { label: "Je récupère les pièces pour bricoler autre chose",
        scores: { agencement_bois: 3, mode_art: 3, realisation_mecanique: 1 } }
    ]
  },

  {
    id: "q4",
    question: "Avec quoi préférerais-tu travailler ?",
    reponses: [
      { label: "Du bois, du métal, du tissu, du cuir",
        scores: { agencement_bois: 4, realisation_mecanique: 3, mode_art: 4 } },
      { label: "Des plantes, la terre, les animaux",
        scores: { nature_paysage: 5 } },
      { label: "De l'électricité, de l'électronique, des machines",
        scores: { numerique_energie: 4, pilotage_maintenance: 3, maintenance_vehicules: 2,
                  aeronautique: 3 } },
      { label: "Des gens, tout simplement",
        scores: { sante_social: 3, relation_client: 3, beaute: 2, securite: 2 } }
    ]
  },

  {
    id: "q5",
    question: "Qu'est-ce qui te ferait le plus plaisir, en rentrant le soir ?",
    reponses: [
      { label: "Voir un bâtiment auquel j'ai participé",
        scores: { batiment: 4, etudes_batiment: 3, agencement_bois: 1 } },
      { label: "Avoir aidé quelqu'un à aller mieux",
        scores: { sante_social: 4, beaute: 3 } },
      { label: "Avoir remis en marche une machine à l'arrêt",
        scores: { maintenance_vehicules: 4, pilotage_maintenance: 3, realisation_mecanique: 2 } },
      { label: "Avoir fait plaisir : avoir régalé quelqu'un, ou l'avoir mis en beauté",
        scores: { hotellerie_restauration: 4, mode_art: 3, beaute: 2, relation_client: 1 } }
    ]
  },

  {
    id: "q6",
    question: "Dans un travail de groupe, ton rôle naturel, c'est plutôt…",
    reponses: [
      { label: "Mettre la main à la pâte",
        scores: { batiment: 2, agencement_bois: 2, hotellerie_restauration: 2, realisation_mecanique: 2 } },
      { label: "Organiser et répartir les tâches",
        scores: { gestion_logistique: 4, relation_client: 2, securite: 1 } },
      { label: "Trouver les idées, donner le style",
        scores: { mode_art: 4, etudes_batiment: 2, hotellerie_restauration: 1 } },
      { label: "Vérifier que rien n'est oublié",
        scores: { pilotage_maintenance: 3, securite: 3, gestion_logistique: 2 } }
    ]
  },

  {
    id: "q7",
    question: "Es-tu plutôt à l'aise avec l'effort physique ?",
    reponses: [
      { label: "Oui, j'aime bouger, porter, me dépenser",
        scores: { batiment: 3, nature_paysage: 3, securite: 3, hotellerie_restauration: 2,
                  conduite: 3 } },
      { label: "Je préfère un travail minutieux, au calme",
        scores: { mode_art: 3, beaute: 3, etudes_batiment: 2, numerique_energie: 2 } },
      { label: "Un peu des deux, selon les moments",
        scores: { maintenance_vehicules: 2, agencement_bois: 2, realisation_mecanique: 2, pilotage_maintenance: 2 } },
      { label: "J'aime surtout être en mouvement et parler aux gens",
        scores: { relation_client: 3, gestion_logistique: 3, sante_social: 2 } }
    ]
  },

  {
    id: "q8",
    question: "Qu'est-ce qui compte le plus pour toi dans un métier ?",
    reponses: [
      { label: "Que ce soit utile aux autres",
        scores: { sante_social: 4, securite: 3, hotellerie_restauration: 1 } },
      { label: "Que ce soit technique, et qu'on apprenne sans arrêt",
        scores: { numerique_energie: 3, pilotage_maintenance: 3, maintenance_vehicules: 2,
                  etudes_batiment: 2, aeronautique: 4 } },
      { label: "Pouvoir créer, inventer des choses",
        scores: { mode_art: 4, agencement_bois: 3, hotellerie_restauration: 2, beaute: 2 } },
      { label: "Que ce soit concret, qu'on voie le résultat de son travail",
        scores: { batiment: 3, realisation_mecanique: 3, nature_paysage: 2 } }
    ]
  },

  {
    id: "q9",
    question: "Face à une situation d'urgence ou de stress…",
    reponses: [
      { label: "Je garde mon sang-froid, j'aime l'action",
        scores: { securite: 4, sante_social: 2, hotellerie_restauration: 2 } },
      { label: "Je préfère un cadre calme et des règles claires",
        scores: { gestion_logistique: 3, etudes_batiment: 3, pilotage_maintenance: 2 } },
      { label: "Je m'adapte, je trouve une solution sur le moment",
        scores: { maintenance_vehicules: 3, numerique_energie: 2, relation_client: 2 } },
      { label: "Je prends mon temps, je soigne le détail",
        scores: { mode_art: 3, beaute: 3, agencement_bois: 2, alimentation: 4,
                  aeronautique: 2 } }
    ]
  },

  {
    id: "q10",
    question: "Dernière question. Parmi ces activités, laquelle t'attire le plus ?",
    reponses: [
      { label: "Conduire un engin, piloter une machine",
        scores: { pilotage_maintenance: 4, batiment: 2, gestion_logistique: 2,
                  maintenance_vehicules: 2, conduite: 5 } },
      { label: "Cuisiner, recevoir, servir",
        scores: { hotellerie_restauration: 5, relation_client: 1 } },
      { label: "Faire du pain, des gâteaux, des chocolats",
        scores: { alimentation: 5, hotellerie_restauration: 1 } },
      { label: "Travailler sur des avions",
        scores: { aeronautique: 5, maintenance_vehicules: 1 } },
      { label: "Coiffer, maquiller, prendre soin de l'apparence",
        scores: { beaute: 5, mode_art: 1 } },
      { label: "Dessiner, coudre, créer des objets",
        scores: { mode_art: 4, agencement_bois: 2, etudes_batiment: 1 } }
    ]
  }

];

/* -----------------------------------------------------------------------------
 * Calcul du résultat.
 * Renvoie les TROIS domaines les mieux placés, avec leur score.
 * Trois et pas un : un questionnaire d'intérêts ouvre des pistes, il ne
 * désigne pas un métier. C'est l'élève qui choisit ensuite.
 * -------------------------------------------------------------------------- */
function calculerResultatQuiz(reponses) {
  const scores = {};
  Object.keys(DOMAINS).forEach(function (k) { scores[k] = 0; });

  reponses.forEach(function (rep) {
    if (!rep || !rep.scores) return;
    Object.keys(rep.scores).forEach(function (dom) {
      if (scores[dom] === undefined) return;   // domaine inconnu : on ignore
      scores[dom] += rep.scores[dom];
    });
  });

  // Normalisation : score obtenu rapporté au score MAXIMAL atteignable.
  //
  // Sans cela, un domaine cité dans beaucoup de réponses (mode_art, par ex.)
  // accumule des points même quand l'élève répond de façon incohérente, tandis
  // qu'un domaine très ciblé (nature_paysage) ne peut jamais rattraper. On
  // compare donc chaque domaine à lui-même : « quelle part de ce qui pouvait
  // le désigner l'a effectivement désigné ? »
  const maxima = maximaParDomaine();

  const classe = Object.keys(scores)
    .map(function (k) {
      return {
        domainKey: k,
        label: DOMAINS[k].label,
        score: scores[k],
        affinite: maxima[k] ? scores[k] / maxima[k] : 0   // entre 0 et 1
      };
    })
    .filter(function (o) { return o.score > 0; })
    .sort(function (a, b) {
      if (b.affinite !== a.affinite) return b.affinite - a.affinite;
      if (b.score !== a.score) return b.score - a.score;
      // Dernier départage : ordre ALPHABÉTIQUE du libellé. Ce n'est pas
      // « meilleur », mais c'est NEUTRE et stable — il ne dépend plus de l'ordre
      // de déclaration des secteurs dans DOMAINS (qui, lui, était arbitraire et
      // invisible : deux pistes à égalité parfaite étaient départagées par un
      // détail du code, toujours en faveur de la même). L'audit avait relevé que
      // 5,46 % des parcours tombaient dans ce cas.
      return a.label.localeCompare(b.label, "fr");
    });

  // Combien de pistes montrer ? Trois en principe. MAIS si la 4e est à égalité
  // STRICTE (même affinité ET même score) avec la 3e, les départager serait
  // mentir à l'élève : elles lui correspondent autant. On les montre alors
  // toutes les deux (voire plus, si plusieurs sont ex æquo pile à la frontière).
  let n = Math.min(3, classe.length);
  while (n < classe.length &&
         classe[n].affinite === classe[n - 1].affinite &&
         classe[n].score === classe[n - 1].score) {
    n++;   // la suivante est à égalité stricte avec la dernière retenue
  }
  return classe.slice(0, n);
}

// Score maximal qu'un domaine pourrait atteindre si l'élève choisissait, à
// chaque question, la réponse qui lui rapporte le plus. Calculé une fois.
let _maxima = null;
function maximaParDomaine() {
  if (_maxima) return _maxima;
  _maxima = {};
  Object.keys(DOMAINS).forEach(function (k) { _maxima[k] = 0; });
  QUIZ_PRO.forEach(function (q) {
    Object.keys(_maxima).forEach(function (dom) {
      let best = 0;
      q.reponses.forEach(function (r) {
        if (r.scores[dom] && r.scores[dom] > best) best = r.scores[dom];
      });
      _maxima[dom] += best;
    });
  });
  return _maxima;
}
