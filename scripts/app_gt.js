/* =============================================================================
 * app_gt.js — TrouveTaVoie / Onglet "Je vais en 2nde générale et technologique"
 *
 * Dépend de : scripts/bdd_gt.js  (LYCEES_2GT, CRITERES_2GT, SERIES_TECHNO_2GT…)
 * Optionnel  : pingStats(type, valeur) défini dans scripts/app_pro.js
 *
 * Principe : l'élève coche ce qui l'intéresse, le tableau surligne les lycées
 * concernés (il ne les masque JAMAIS : on garde la vue d'ensemble pour classer),
 * et la carte de sortie propose une liste de vœux ordonnée — avec le vœu simple
 * du lycée en filet de sécurité sous chaque vœu à option.
 * ========================================================================== */

(function () {
  "use strict";

  const ORDRE_LYCEES = ["doisneau", "parc_des_loges", "brassens", "truffaut", "laurencin"];
  const selection = new Set();   // critères "vœu Affelnet" cochés
  const selPlace  = new Set();   // critères "sur place" cochés (aucun vœu)
  let strategie   = null;        // null = l'élève n'a pas encore choisi : on n'affiche pas la liste
  let statEnvoyee = false;       // compteur : une seule statistique par chargement de page

  // Ordre personnalisé des 5 lycées, UNIQUEMENT dans le cas « sans option ».
  //
  // Pourquoi seulement là : sans option, les 5 vœux sont tous équivalents (des
  // vœux simples de couverture), il n'y a aucun filet de sécurité à protéger.
  // L'élève peut donc les réordonner librement — c'est même le but : imprimer
  // un brouillon de vœux dans SON ordre de préférence.
  //
  // Dès qu'il coche une option, ce tableau est ignoré : l'application reprend la
  // main sur l'ordre (option → filet → couverture), parce que là, la position
  // du filet juste sous son vœu N'EST PAS négociable. On efface donc l'ordre
  // perso quand une option est cochée, pour ne pas le rappliquer par erreur.
  let ordrePerso = null;         // tableau d'ids de lycées, ou null (= ordre par distance)

  /* ---------------------------------------------------------------------- */
  /* Utilitaires                                                            */
  /* ---------------------------------------------------------------------- */

  function ping(type, valeur) {
    if (typeof pingStats === "function") pingStats(type, valeur);
  }

  // Signale UN usage abouti du 2GT — une seule fois par chargement de page.
  //
  // Avant, la statistique ne partait qu'au clic sur « classer par lycée / par
  // option ». Or ce bouton n'apparaît QUE si l'élève a coché une vraie option.
  // Résultat : les élèves sans option (la majorité) et ceux qui cochent un
  // simple atout n'étaient JAMAIS comptés. Les statistiques sous-estimaient
  // massivement l'usage réel du comparateur.
  //
  // On compte désormais dès qu'il y a un vrai usage, quelle qu'en soit la
  // porte d'entrée : cocher une option, cocher un atout, ou réordonner ses
  // vœux sans option. Ouvrir l'onglet ou en changer ne compte pas.
  function signalerUsage2GT(detail) {
    if (statEnvoyee) return;
    statEnvoyee = true;
    ping("2gt_voeux", detail);
  }

  function trajetTexte(lyc) {
    const t = lyc.trajet || {};
    if (t.minutes == null) return "trajet à renseigner";
    let txt = t.minutes + " min";
    if (t.km != null) txt += " · " + t.km + " km";
    return txt;
  }
  const SEUIL_TRAJET_LONG = 45;   // minutes : au-delà, on alerte l'élève
  const LIMITE_VOEUX      = 10;   // Affelnet : 10 vœux maximum

  function trajetLong(lyc) {
    const t = lyc.trajet || {};
    return t.minutes != null && t.minutes > SEUIL_TRAJET_LONG;
  }

  function trajetLigne(lyc) {
    const t = lyc.trajet || {};
    return t.ligne ? t.ligne : "";
  }

  // Les vœux d'un lycée qui répondent à un critère donné.
  //
  // La correspondance repose sur l'identifiant `criteres` porté par chaque vœu
  // dans bdd_gt.js — JAMAIS sur son libellé. Une correction d'accent ou de
  // formulation dans le catalogue Affelnet romprait sinon le lien en silence,
  // sans la moindre erreur visible.
  function voeuxPourCritere(lycId, critere) {
    const lyc = LYCEES_2GT[lycId];
    if (!lyc || !critere.lycees.includes(lycId)) return [];
    return lyc.voeux.filter(function (v) {
      return v.criteres && v.criteres.indexOf(critere.id) !== -1;
    });
  }

  function scoreLycee(lycId) {          // sert à construire les vœux
    let n = 0;
    CRITERES_2GT.forEach(function (c) {
      if (selection.has(c.id) && c.lycees.includes(lycId)) n++;
    });
    return n;
  }

  function atoutsDe(lycId) {            // atouts cochés que CE lycée propose
    return CRITERES_SUR_PLACE.filter(function (c) {
      return selPlace.has(c.id) && c.lycees.includes(lycId);
    });
  }

  // Une option demandable sur Affelnet pèse plus qu'un simple atout : elle structure
  // le vœu lui-même, alors qu'un atout se choisit après coup. 3 contre 1.
  // Plus de score pondéré. Un « atout » (latin, EPS) et une « option-vœu »
  // (design) ne sont pas comparables sur une même échelle : l'un se demande sur
  // Affelnet, l'autre pas. Les additionner en 3+1 inventait une hiérarchie que
  // rien ne justifiait, et le classement (pondéré) contredisait le badge (brut).
  //
  // Le classement repose désormais sur un critère FACTUEL et neutre : la
  // distance. La sélection ne « note » pas les lycées, elle REMONTE en tête ceux
  // qui proposent ce que l'élève cherche. Le badge dit juste : le propose, ou non.
  function proposeQuelqueChose(lycId) {
    return scoreLycee(lycId) > 0 || atoutsDe(lycId).length > 0;
  }

  /* ---------------------------------------------------------------------- */
  /* 1. Les cases à cocher                                                  */
  /* ---------------------------------------------------------------------- */

  function chipHTML(c, on, groupe) {
    const solo = (c.exclusif || (c.lycees && c.lycees.length === 1)) ? " is-solo" : "";
    return '<button type="button" class="gt-chip' + solo + '" data-' + groupe + '="' + c.id + '"' +
           ' aria-pressed="' + (on ? "true" : "false") + '">' +
           '<span class="gt-chip-box" aria-hidden="true"></span>' + c.label +
           (c.procedure ? ' <span class="gt-pass">' + c.procedure + '</span>' : '') +
           '</button>';
  }

  function renderCriteres(root) {
    const chipsVoeu = CRITERES_2GT.map(function (c) {
      return chipHTML(c, selection.has(c.id), "critere");
    }).join("");
    const chipsPlace = CRITERES_SUR_PLACE.map(function (c) {
      return chipHTML(c, selPlace.has(c.id), "place");
    }).join("");

    root.innerHTML =
      '<h3>Qu\'est-ce qui t\'intéresse ?</h3>' +

      '<h4 class="gt-groupe">① Options qui se demandent sur Affelnet</h4>' +
      '<p class="gt-hint">Ces options font partie de ton vœu : « Doisneau Théâtre » n\'est pas le même ' +
      'vœu que « Doisneau ». Le contour en pointillés = un seul lycée la propose.</p>' +
      '<div class="gt-chips">' + chipsVoeu + '</div>' +

      '<h4 class="gt-groupe">② Atouts du lycée <span class="gt-groupe-sub">(ne se demandent PAS sur Affelnet)</span></h4>' +
      '<p class="gt-hint">Ces enseignements se choisissent une fois que tu es affecté, à l\'inscription. ' +
      'Ils ne changent rien à la procédure, mais ils peuvent t\'aider à préférer un lycée à un autre.</p>' +
      '<div class="gt-chips">' + chipsPlace + '</div>' +

      '<div class="gt-actions">' +
      '<button type="button" class="gt-btn gt-btn-ghost" data-action="reset">Tout décocher</button>' +
      '</div>';
  }

  /* ---------------------------------------------------------------------- */
  /* 2. Le tableau comparatif                                               */
  /* ---------------------------------------------------------------------- */

  function renderTable(root) {

    let html = '<table class="gt-table"><thead><tr><th>Ce que je cherche</th>';
    ORDRE_LYCEES.forEach(function (id) {
      const l = LYCEES_2GT[id];
      html += '<th><span class="gt-lyc-nom">' + l.nom.replace("Lycée ", "") + '</span>' +
              '<span class="gt-lyc-meta' + (trajetLong(l) ? ' is-loin' : '') + '">' + l.ville +
              '<br><b>' + trajetTexte(l) + '</b>' +
              (trajetLigne(l) ? '<br>' + trajetLigne(l) : '') + '</span></th>';
    });
    html += '</tr></thead><tbody>';

    // Lignes : un critère = une ligne cochable
    html += '<tr class="gt-sep"><th colspan="6">Options demandées sur Affelnet (un vœu à part entière)</th></tr>';
    CRITERES_2GT.forEach(function (c) {
      const on = selection.has(c.id);
      html += '<tr class="' + (on ? "is-checked" : "") + '" data-critere-row="' + c.id + '">';
      html += '<th class="gt-row-head"><label style="cursor:pointer;display:flex;gap:8px;align-items:center;">' +
              '<input type="checkbox" data-critere="' + c.id + '"' + (on ? " checked" : "") + '>' +
              c.label + (c.procedure ? ' <span class="gt-pass">' + c.procedure + '</span>' : '') +
              '</label></th>';
      ORDRE_LYCEES.forEach(function (id) {
        const ok = c.lycees.includes(id);
        html += ok
          ? '<td class="gt-yes">●</td>'
          : '<td class="gt-no">—</td>';
      });
      html += '</tr>';
    });

    // Atouts sur place : aucun vœu Affelnet
    html += '<tr class="gt-sep"><th colspan="6">Atouts du lycée — à choisir à l\'inscription, pas un vœu Affelnet</th></tr>';
    CRITERES_SUR_PLACE.forEach(function (c) {
      const on = selPlace.has(c.id);
      html += '<tr class="' + (on ? "is-checked" : "") + '">';
      html += '<th class="gt-row-head"><label style="cursor:pointer;display:flex;gap:8px;align-items:center;">' +
              '<input type="checkbox" data-place="' + c.id + '"' + (on ? " checked" : "") + '>' +
              c.label + '</label></th>';
      ORDRE_LYCEES.forEach(function (id) {
        html += c.lycees.includes(id) ? '<td class="gt-yes">●</td>' : '<td class="gt-no">—</td>';
      });
      html += '</tr>';
    });

    // Séries technologiques : information, pas un vœu de 3e
    html += '<tr class="gt-sep"><th colspan="6">Séries technologiques possibles (choix en fin de 2nde, pas un vœu maintenant)</th></tr>';
    Object.keys(SERIES_TECHNO_2GT).forEach(function (serie) {
      html += '<tr><th class="gt-row-head">' + serie + '</th>';
      ORDRE_LYCEES.forEach(function (id) {
        html += SERIES_TECHNO_2GT[serie].includes(id)
          ? '<td class="gt-yes">●</td>'
          : '<td class="gt-no">—</td>';
      });
      html += '</tr>';
    });

    html += '</tbody><tfoot><tr><th class="gt-row-head">Ce lycée coche</th>';
    ORDRE_LYCEES.forEach(function (id) {
      // Badge factuel : ce lycée propose-t-il ce que l'élève a coché ?
      // Plus de chiffre, donc plus de contradiction possible avec le classement.
      const actif = (selection.size > 0 || selPlace.size > 0);
      if (!actif) {
        html += '<td><span class="gt-score-badge gt-badge-neutre" title="Coche une option pour comparer">\u2013</span></td>';
      } else if (proposeQuelqueChose(id)) {
        html += '<td><span class="gt-score-badge is-top" title="Ce lycée propose ce que tu as coché">\u2713</span></td>';
      } else {
        html += '<td><span class="gt-score-badge gt-badge-non" title="Ce lycée ne propose pas ce que tu as coché">\u2013</span></td>';
      }
    });
    html += '</tr></tfoot></table>';

    root.innerHTML = html;
  }

  /* ---------------------------------------------------------------------- */
  /* 3. La carte « Mes vœux 2GT »                                            */
  /* ---------------------------------------------------------------------- */

  function estEuroVoeu(x)  { return x.voeu.categorie === "section_euro"; }
  function estEuroCrit(c)  { return c.id.indexOf("euro_") === 0; }
  function parTrajet(a, b) {
    const ta = a.lyc ? a.lyc.trajet : a.trajet, tb = b.lyc ? b.lyc.trajet : b.trajet;
    const ma = ta && ta.minutes, mb = tb && tb.minutes;
    if (ma == null || mb == null) return 0;
    return ma - mb;
  }

  function construireVoeux() {
    // CAS SANS AUCUNE VRAIE OPTION (rien coché, ou seulement des atouts sur
    // place comme le japonais). Les 5 lycées forment alors UNE SEULE liste de
    // vœux simples, entièrement réordonnable. L'ordre par défaut met en tête les
    // lycées qui proposent un atout coché (pour qu'ils remontent), puis les
    // autres par distance — mais l'élève peut tout déplacer, y compris ces
    // lycées-là. On ne sépare donc PAS « retenus » et « couverture » ici, sinon
    // les lycées-à-atout seraient bloqués en tête et impossibles à déplacer.
    if (selection.size === 0) {
      let ids = ORDRE_LYCEES.slice();
      if (ordrePerso) {
        // L'élève a réordonné : on respecte son ordre.
        ids.sort(function (a, b) {
          const ia = ordrePerso.indexOf(a), ib = ordrePerso.indexOf(b);
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });
      } else {
        // Ordre par défaut : lycées à atout d'abord, puis par distance.
        ids.sort(function (a, b) {
          const pa = proposeQuelqueChose(a) ? 0 : 1;
          const pb = proposeQuelqueChose(b) ? 0 : 1;
          if (pa !== pb) return pa - pb;
          return parTrajet(LYCEES_2GT[a], LYCEES_2GT[b]);
        });
      }
      return ids.map(function (id) {
        const l = LYCEES_2GT[id];
        const b = l.voeux.find(function (v) { return v.categorie === "base"; });
        return { lyc: l, voeu: b, filet: false, complement: true, atouts: atoutsDe(id) };
      });
    }

    // Les lycées qui proposent au moins un critère coché, TRIÉS PAR DISTANCE
    // (plus de score : voir le commentaire de proposeQuelqueChose). La sélection
    // ne classe pas, elle remonte simplement ces lycées en tête de liste.
    const retenus = ORDRE_LYCEES
      .map(function (id) {
        return { id: id, lyc: LYCEES_2GT[id], atouts: atoutsDe(id) };
      })
      .filter(function (o) { return proposeQuelqueChose(o.id); })
      .sort(function (a, b) { return parTrajet(a.lyc, b.lyc); });

    const vus = {};                        // codes déjà placés, par lycée
    retenus.forEach(function (o) { vus[o.id] = new Set(); });

    function pousser(liste, o, v) {
      if (vus[o.id].has(v.code)) return;
      vus[o.id].add(v.code);
      liste.push({ lyc: o.lyc, voeu: v, filet: false, atouts: o.atouts });
    }
    function optionsDe(o) {                // euro d'abord, dans l'ordre des critères
      const out = [];
      const crits = CRITERES_2GT.filter(function (c) { return selection.has(c.id); });
      crits.filter(estEuroCrit).concat(crits.filter(function (c) { return !estEuroCrit(c); }))
        .forEach(function (c) {
          voeuxPourCritere(o.id, c).forEach(function (v) {
            if (vus[o.id].has(v.code)) return;
            vus[o.id].add(v.code);
            out.push({ lyc: o.lyc, voeu: v, filet: false, atouts: o.atouts });
          });
        });
      return out.filter(estEuroVoeu).concat(out.filter(function (x) { return !estEuroVoeu(x); }));
    }

    const liste = [];

    if (strategie === "lycee") {
      // Lycée par lycée : ses options (euro d'abord), puis SON vœu simple
      retenus.forEach(function (o) {
        const opts = optionsDe(o);                 // UN SEUL appel : il mémorise les codes
        opts.forEach(function (x) { liste.push(x); });
        const b = o.lyc.voeux.find(function (v) { return v.categorie === "base"; });
        if (b && !vus[o.id].has(b.code)) {
          vus[o.id].add(b.code);
          // Un vœu simple n'est un FILET DE SÉCURITÉ que s'il est placé SOUS un
          // vœu à option (Affelnet). Un atout « sur place » (japonais, latin…)
          // ne crée aucun vœu au-dessus : le vœu simple n'est alors le filet de
          // personne, c'est un vœu simple ordinaire. On teste donc le nombre
          // d'OPTIONS produites (opts.length), pas la présence d'atouts.
          const aUneOption = opts.length > 0;
          liste.push({ lyc: o.lyc, voeu: b, filet: aUneOption, atouts: o.atouts,
                       seul: !aUneOption });
        }
      });
    } else {
      // Option par option : euro d'abord, puis les autres options par ordre alphabétique.
      // Dans une même option, les lycées sont triés par temps de trajet.
      const crits = CRITERES_2GT.filter(function (c) { return selection.has(c.id); });
      const parLabel = function (a, b) { return a.label.localeCompare(b.label, "fr"); };
      const ordonnes = crits.filter(estEuroCrit).sort(parLabel)
                    .concat(crits.filter(function (c) { return !estEuroCrit(c); }).sort(parLabel));

      ordonnes.forEach(function (c) {
        retenus
          .filter(function (o) { return c.lycees.includes(o.id); })
          .sort(function (a, b) { return parTrajet(a.lyc, b.lyc); })
          .forEach(function (o) {
            voeuxPourCritere(o.id, c).forEach(function (v) { pousser(liste, o, v); });
          });
      });

      // Tous les vœux simples à la fin, du plus proche au plus lointain
      retenus.slice().sort(function (a, b) { return parTrajet(a.lyc, b.lyc); })
        .forEach(function (o) {
          const b = o.lyc.voeux.find(function (v) { return v.categorie === "base"; });
          if (b && !vus[o.id].has(b.code)) {
            vus[o.id].add(b.code);
            // Filet uniquement si ce lycée a produit au moins un vœu à OPTION.
            // Les atouts sur place ne comptent pas (ils ne créent pas de vœu).
            const aUneOption = scoreLycee(o.id) > 0;
            liste.push({ lyc: o.lyc, voeu: b, filet: aUneOption, atouts: o.atouts,
                         seul: !aUneOption });
          }
        });
    }

    // ---- Couverture du secteur ----
    // Les 5 lycées sont des lycées de secteur : l'élève sera affecté dans l'un
    // d'eux, qu'il ait coché une option ou non. On complète donc TOUJOURS la
    // liste avec les vœux simples des lycées encore absents, du plus proche au
    // plus loin.
    //
    // C'est cette section qui gère le cas le plus fréquent : l'élève ne veut
    // AUCUNE option. Avant, la couverture était conditionnée à `liste.length > 0`
    // et cet élève repartait avec zéro vœu à classer — alors qu'on lui disait
    // « tu seras affecté dans l'un de ces 5 lycées ». Le filet de sécurité le
    // plus important, celui des élèves sans projet d'option, était désactivé.
    const dejaListes = new Set(liste.map(function (x) { return x.lyc.id; }));
    const reste = ORDRE_LYCEES.filter(function (id) { return !dejaListes.has(id); });

    // Sans aucune option, si l'élève a réordonné les lycées (glisser-déposer ou
    // flèches), on respecte SON ordre. Sinon, ordre par distance.
    const sansOption = selection.size === 0;   // atout seul compris
    if (sansOption && ordrePerso) {
      reste.sort(function (a, b) {
        const ia = ordrePerso.indexOf(a), ib = ordrePerso.indexOf(b);
        // Un lycée absent de l'ordre perso (cas improbable) retombe à la fin.
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      });
    } else {
      reste.sort(function (a, b) { return parTrajet(LYCEES_2GT[a], LYCEES_2GT[b]); });
    }

    reste
      .map(function (id) { return LYCEES_2GT[id]; })
      .forEach(function (l) {
        const b = l.voeux.find(function (v) { return v.categorie === "base"; });
        // On rattache les atouts « sur place » que CE lycée propose : ainsi un
        // atout coché seul (japonais) apparaît bien sur le lycée concerné, à
        // l'écran ET dans le PDF, même si ce lycée n'est là qu'en couverture.
        if (b) liste.push({ lyc: l, voeu: b, filet: false, complement: true,
                            atouts: atoutsDe(l.id) });
      });

    return liste;
  }

  function renderCarte(root) {
    const date = new Date().toLocaleDateString("fr-FR");

    // DISTINCTION CAPITALE (relevée par l'audit) :
    //
    //   selection  = de vraies OPTIONS Affelnet (design, biotech…). Chacune est
    //                un vœu à formuler. Elles déclenchent le mode « stratégie »
    //                (classer par lycée / par option) et les filets de sécurité.
    //
    //   selPlace   = des ATOUTS proposés « sur place » (japonais, latin, EPS…).
    //                Ils ne créent AUCUN vœu Affelnet : on les choisit à
    //                l'inscription, une fois dans le lycée. Cocher un atout ne
    //                doit donc RIEN changer au parcours des 5 lycées — juste
    //                signaler « ce lycée propose aussi le japonais ».
    //
    // Le mode « stratégie » ne dépend donc QUE des vraies options. Avant, il
    // suffisait de cocher un atout pour basculer à tort dans ce mode : boutons
    // de classement sans objet, liste masquée, glisser-déposer désactivé.
    const aDesOptions = selection.size > 0;

    // Le choix de classement (masqué s'il n'y a aucune option Affelnet).
    const bLyc = strategie === "lycee"  ? " is-on" : "";
    const bOpt = strategie === "option" ? " is-on" : "";
    const choix =
      '<div class="gt-strategie">' +
        '<span class="gt-strat-label">Comment veux-tu classer tes vœux ? ' +
        'Qu\'est-ce qui compte le plus pour toi ?</span>' +
        '<div class="gt-strat-btns">' +
          '<button type="button" class="gt-strat' + bLyc + '" data-strat="lycee">Le lycée</button>' +
          '<button type="button" class="gt-strat' + bOpt + '" data-strat="option">L\'option</button>' +
        '</div>' +
        (strategie
          ? '<p class="gt-strat-hint">' +
              (strategie === "lycee"
                ? "Tes vœux sont groupés par lycée : ton lycée préféré d'abord, avec ses options, puis son filet de sécurité juste en dessous."
                : "Tes vœux sont groupés par option : tous les lycées qui proposent ce que tu veux d'abord, et les vœux sans option à la fin.") +
              ' Tu peux basculer entre les deux pour comparer.</p>'
          : '<p class="gt-strat-hint">Choisis l\'un des deux pour voir ta liste de vœux.</p>') +
      '</div>';

    // On demande de choisir une stratégie UNIQUEMENT s'il y a des options à
    // classer. Sans option, la liste (les 5 lycées par distance) s'affiche
    // directement — pas de choix à faire.
    if (aDesOptions && !strategie) {
      root.innerHTML =
        '<div class="gt-card-head"><h3>Mes vœux 2GT</h3><span class="gt-date">' + date + '</span></div>' +
        '<div class="gt-card-body">' + choix + '</div>';
      return;
    }

    // Sans option, on n'affiche pas la question « lycée ou option ? ».
    const blocChoix = aDesOptions ? choix : "";

    const liste = construireVoeux();

    let separateurPose = false;
    let rang = 0;
    const items = liste.map(function (o) {
      rang++;
      const v = o.voeu;
      let avant = "";

      if (rang === LIMITE_VOEUX + 1) {
        avant += '<li class="gt-limite-li"><div>' +
          '<strong>⛔ Limite Affelnet : 10 vœux maximum</strong>' +
          '<span>Tout ce qui suit cette ligne ne pourra pas être saisi. Si tu tiens à un vœu ' +
          'placé en dessous, il faut <b>en retirer un au-dessus</b> — c\'est à toi de choisir ' +
          'lequel compte le moins pour toi.</span>' +
          '</div></li>';
      }

      if (o.complement && !separateurPose) {
        separateurPose = true;
        // Aucune option cochée du tout : la liste n'est QUE de la couverture.
        // On ne parle donc pas de « compléter » — c'est le classement principal.
        const aucuneOption = (selection.size === 0);   // atout seul compris : pas de vraie option
        avant += aucuneOption
          ? '<li class="gt-sep-li"><div>' +
            '<strong>Tes 5 lycées de secteur, du plus proche au plus loin</strong>' +
            '<span>Tu ne cherches pas d\'option particulière, et c\'est très bien : la plupart ' +
            'des élèves sont dans ce cas. Tu seras affecté dans l\'un de ces 5 lycées. En les ' +
            'classant tous — ici du plus proche au plus lointain — <b>c\'est toi qui décides de ' +
            'l\'ordre</b>, pas l\'administration. Tu peux les réordonner comme tu veux.</span>' +
            '</div></li>'
          : '<li class="gt-sep-li"><div>' +
            '<strong>Pour couvrir tous tes lycées de secteur</strong>' +
            '<span>Tu seras forcément affecté dans l\'un de ces 5 lycées. Si tu n\'en classes ' +
            'que quelques-uns et qu\'ils sont pleins, c\'est l\'administration qui choisira pour toi. ' +
            'En ajoutant les vœux ci-dessous, du plus proche au plus lointain, <b>c\'est toi qui gardes ' +
            'la main jusqu\'au bout</b>. Tu restes libre de les retirer ou de les réordonner.</span>' +
            '</div></li>';
      }

      let notes = "";
      if (o.complement && selection.size === 0) {
        // Cas « aucune option » : inutile de dire « tu n'as rien coché ICI »,
        // l'élève n'a rien coché nulle part. Une note sobre suffit.
        notes = '<span class="gt-v-note">Lycée de secteur : tu peux y être affecté. ' +
                'À toi de le placer où tu veux dans ta liste.</span>';
      } else if (o.complement) {
        notes = '<span class="gt-v-note">Vœu de couverture : tu n\'as coché aucune option ici, ' +
                'mais ce lycée fait partie de ton secteur. Le classer, c\'est éviter qu\'on décide ' +
                'à ta place si tes premiers vœux sont pleins.</span>';
      } else if (o.filet && o.seul) {
        notes = '<span class="gt-v-note">Tu n\'as coché aucune option demandable sur Affelnet ' +
                'dans ce lycée : c\'est donc le vœu « simple » qui te correspond ici.</span>';
      } else if (o.filet) {
        notes = '<span class="gt-v-note">Filet de sécurité : ce vœu « sans option » a ses ' +
                'propres places. Le garder sous ton vœu avec option protège ton affectation ' +
                'dans ce lycée.</span>';
      } else if (v.procedure) {
        notes = '<span class="gt-v-note is-warn">⚠ Recrutement spécifique (' + v.procedure +
                ') : un entretien de présélection est nécessaire. L\'avis de la commission ' +
                'donne des points bonus ou malus. Parles-en vite à ton professeur principal, ' +
                'les dossiers se déposent tôt dans l\'année.</span>';
      } else if (v.note) {
        notes = '<span class="gt-v-note">' + v.note + '</span>';
      }

      if (o.atouts && o.atouts.length) {
        notes += '<span class="gt-v-atouts">★ Ce lycée propose aussi ce que tu as coché : <b>' +
                 o.atouts.map(function (a) { return a.label; }).join(", ") + '</b>' +
                 ' — à choisir à l\'inscription, ce n\'est pas un vœu.</span>';
      }

      const loin = trajetLong(o.lyc);
      const traj = '<span class="gt-v-trajet' + (loin ? ' is-loin' : '') + '">🚌 ' + trajetTexte(o.lyc) +
                   (trajetLigne(o.lyc) ? ' — ' + trajetLigne(o.lyc) : '') +
                   (loin ? ' <b>· trajet long : environ ' + (o.lyc.trajet.minutes * 2) +
                           ' min par jour, aller-retour</b>' : '') + '</span>';

      let classe = o.complement ? "is-complement"
                 : (o.filet ? (o.seul ? "is-simple" : "is-filet") : "");
      if (rang > LIMITE_VOEUX) classe += " is-hors-limite";

      // Réordonnancement : dès qu'il n'y a AUCUNE vraie option Affelnet (que des
      // atouts sur place, ou rien du tout). Dans ces cas la liste n'est faite que
      // de 5 vœux simples équivalents — aucun filet de sécurité à protéger, donc
      // l'élève peut les réordonner librement (souris + flèches clavier).
      const reordonnable = (selection.size === 0);
      const attrsDrag = reordonnable
        ? ' draggable="true" data-lyc="' + o.lyc.id + '"' : "";
      if (reordonnable) classe += " gt-reordonnable";

      const poignee = reordonnable
        ? '<div class="gt-reorder">' +
          '<button type="button" class="gt-move" data-move="up" data-lyc="' + o.lyc.id +
          '" title="Monter ce vœu" aria-label="Monter ' + o.lyc.nom + '">\u25b2</button>' +
          '<button type="button" class="gt-move" data-move="down" data-lyc="' + o.lyc.id +
          '" title="Descendre ce vœu" aria-label="Descendre ' + o.lyc.nom + '">\u25bc</button>' +
          '</div>'
        : "";

      return avant + '<li class="' + classe + '"' + attrsDrag + '>' +
             poignee +
             '<div><span class="gt-v-main">' + v.libelle + '</span> ' +
             '<span class="gt-v-lyc">— ' + o.lyc.nom + ', ' + o.lyc.ville + '</span>' +
             '<span class="gt-v-code">' + v.code + '</span>' +
             (o.filet && !o.seul ? '<span class="gt-tag-filet">filet de sécurité</span>' : '') +
             (o.complement ? '<span class="gt-tag-couv">couverture secteur</span>' : '') +
             traj + notes + '</div></li>';
    }).join("");

    // Ce qui ne passe pas par Affelnet
    const idsRetenus = Array.from(new Set(liste.map(function (o) { return o.lyc.id; })));
    const hors = [], surPlace = [], vusHors = new Set();
    idsRetenus.forEach(function (id) {
      const l = LYCEES_2GT[id];
      (l.horsAffelnet || []).forEach(function (h) {
        const cle = id + "|" + h.libelle;
        if (vusHors.has(cle)) return;
        vusHors.add(cle);
        hors.push('<li><strong>' + h.libelle + '</strong> (' + l.nom + ') — ' + h.note + '</li>');
      });
      if (l.optionsSurPlace && l.optionsSurPlace.length) {
        surPlace.push('<li><strong>' + l.nom + '</strong> : ' + l.optionsSurPlace.join(", ") + '</li>');
      }
    });

    const body =
      '<p class="gt-unseul"><strong>Tu ne seras affecté que sur UN SEUL de ces vœux</strong> : ' +
      'le premier de ta liste où il reste de la place. L\'ordre compte donc énormément — ' +
      'il doit refléter tes vraies préférences, pas tes chances.</p>' +
      '<p class="gt-exclusif">' + REGLE_VOEUX_EXCLUSIFS + '</p>' +
      (liste.some(function (x) { return x.voeu.categorie === "section_euro"; })
        ? '<p class="gt-euro-tip"><strong>Pourquoi la section européenne est placée en premier ?</strong> ' +
          'Parce qu\'elle ne se rattrape pas : si tu es affecté sur un autre vœu, tu ne pourras plus ' +
          'la demander. Une option, au contraire, peut encore se choisir à l\'inscription. ' +
          'Mettre l\'euro devant te laisse donc une chance d\'avoir les deux.</p>'
        : "") +
      '<p class="gt-compteur' + (liste.length > LIMITE_VOEUX ? ' is-trop' : '') + '">' +
        'Ta liste compte <b>' + liste.length + ' vœu' + (liste.length > 1 ? 'x' : '') + '</b> ' +
        'sur les <b>' + LIMITE_VOEUX + '</b> autorisés par Affelnet.' +
        (liste.length > LIMITE_VOEUX
          ? ' <b>Il va falloir en retirer ' + (liste.length - LIMITE_VOEUX) + '.</b>' : '') +
      '</p>' +
      blocChoix +
      '<ol class="gt-voeux">' + items + '</ol>' +
      (hors.length
        ? '<div class="gt-aside"><h4>À faire en dehors d\'Affelnet</h4><ul>' + hors.join("") + '</ul></div>'
        : "") +
      (surPlace.length
        ? '<div class="gt-aside"><h4>Options facultatives que tu pourras choisir à l\'inscription</h4>' +
          '<p class="gt-aside-hint">Rien d\'obligatoire ici : ce sont des possibilités offertes par ' +
          'chaque lycée, à demander une fois que tu y seras affecté.</p><ul>' +
          Array.from(new Set(surPlace)).join("") + '</ul></div>'
        : "") +
      '<div class="gt-card-actions">' +
        '<button type="button" class="card-action-btn" data-export="pdf">📄 Télécharger le PDF</button>' +
      '</div>' +
      '<p class="psy-note">💡 N\'hésite pas à en parler à ton professeur principal ' +
      'et/ou à la PsyEN de l\'établissement.</p>' +
      '<p class="gt-source">Sources : ' + SOURCE_2GT.affelnet + ' ; ' + SOURCE_2GT.fiche16 +
      ' ; ' + SOURCE_2GT.cio + '.<br>' + SOURCE_2GT.avertissement + '</p>';

    root.innerHTML =
      '<div class="gt-card-head"><h3>Mes vœux 2GT</h3><span class="gt-date">' + date + '</span></div>' +
      '<div class="gt-card-body">' + body + '</div>';
  }

  /* ---------------------------------------------------------------------- */
  /* Orchestration                                                          */
  /* ---------------------------------------------------------------------- */

  let elCriteres, elTable, elCarte;

  /* ---------------------------------------------------------------------------
   * FOCUS CLAVIER ET RECONSTRUCTION
   *
   * refresh() reconstruit tout le comparateur en innerHTML. L'élément qui avait
   * le focus est donc DÉTRUIT, et le focus retombe sur <body>. Concrètement :
   * un élève qui navigue au clavier coche un critère, et se retrouve renvoyé au
   * début de la page. Il doit re-tabuler jusqu'où il en était. À chaque clic.
   * C'est inutilisable sans souris — et un lecteur d'écran n'annonce plus rien.
   *
   * Les écouteurs, eux, survivent : ils sont délégués sur `root`. Seul le focus
   * est à sauver. On le repère par ses attributs `data-*`, qui sont stables
   * d'une reconstruction à l'autre, et on le repose après.
   *
   * On ne reconstruit PAS le focus sur un élément disparu (après une remise à
   * zéro, par exemple) : dans ce cas on ne fait rien, et le navigateur applique
   * son comportement normal.
   * ------------------------------------------------------------------------ */

  // Les attributs qui identifient de façon stable un élément focusable du 2GT.
  const ATTRIBUTS_FOCUS = ["data-critere", "data-place", "data-strat", "data-action", "data-move"];

  function repererFocus() {
    const actif = document.activeElement;
    if (!actif || actif === document.body) return null;

    // Cas des flèches de réordonnancement : « monter Doisneau » et « monter
    // Truffaut » ont le même data-move. Il faut combiner move + lyc pour viser
    // le bon bouton après reconstruction, sinon le focus saute d'un lycée.
    const move = actif.getAttribute("data-move");
    if (move !== null) {
      const lyc = actif.getAttribute("data-lyc");
      const esc = (v) => (window.CSS && CSS.escape ? CSS.escape(v) : v);
      return 'button[data-move="' + esc(move) + '"][data-lyc="' + esc(lyc) + '"]';
    }

    for (let i = 0; i < ATTRIBUTS_FOCUS.length; i++) {
      const attr = ATTRIBUTS_FOCUS[i];
      const valeur = actif.getAttribute(attr);
      if (valeur === null) continue;
      // On garde aussi le nom de la balise : une même valeur peut exister à la
      // fois sur un <button> (la puce) et sur un <input type="checkbox">.
      return actif.tagName.toLowerCase() +
             "[" + attr + '="' + (window.CSS && CSS.escape ? CSS.escape(valeur) : valeur) + '"]';
    }
    return null;
  }

  function reposerFocus(selecteur, root) {
    if (!selecteur || !root) return;
    let cible = null;
    try { cible = root.querySelector(selecteur); } catch (e) { return; }
    // L'élément a disparu (remise à zéro) : on laisse le navigateur décider.
    if (!cible || typeof cible.focus !== "function") return;
    cible.focus({ preventScroll: true });
  }

  function refresh() {
    const racine = elCriteres && elCriteres.closest ? elCriteres.closest("#vue-2gt") : null;
    const selecteur = repererFocus();
    renderCriteres(elCriteres);
    renderTable(elTable);
    renderCarte(elCarte);
    reposerFocus(selecteur, racine || document);
  }

  function togglePlace(id) {
    const c = CRITERES_SUR_PLACE.find(function (x) { return x.id === id; });
    if (!c) return;
    if (selPlace.has(id)) { selPlace.delete(id); }
    else { selPlace.add(id); signalerUsage2GT("Atout sur place coché"); }
    // Un atout ne bascule PAS en mode option : on ne réinitialise donc pas
    // l'ordre perso (l'élève garde son classement des 5 lycées).
    refresh();
  }

  function toggle(id) {
    const c = CRITERES_2GT.find(function (x) { return x.id === id; });
    if (!c) return;
    if (selection.has(id)) {
      selection.delete(id);
    } else {
      selection.add(id);
      signalerUsage2GT("Option Affelnet cochée");
    }
    ordrePerso = null;   // une vraie option : l'app reprend la main sur l'ordre
    refresh();
  }

  /* Ordre courant des 5 lycées dans le cas sans option (perso ou par distance). */
  function ordreCourant() {
    if (ordrePerso) return ordrePerso.slice();
    // Même ordre par défaut que construireVoeux : lycées à atout d'abord, puis
    // par distance. Sinon, le premier déplacement partirait d'un ordre erroné
    // (par distance pure) et ferait « sauter » la liste sous les yeux de l'élève.
    return ORDRE_LYCEES.slice().sort(function (a, b) {
      const pa = proposeQuelqueChose(a) ? 0 : 1;
      const pb = proposeQuelqueChose(b) ? 0 : 1;
      if (pa !== pb) return pa - pb;
      return parTrajet(LYCEES_2GT[a], LYCEES_2GT[b]);
    });
  }

  /* Déplace un lycée d'un cran (flèches) ou à une position (glisser-déposer).
   * N'a d'effet que sans option — le seul cas où le réordonnancement est permis. */
  function deplacerLycee(idLyc, versId) {
    if (selection.size > 0) return;   // sécurité : pas de réordre si vraie option
    const ordre = ordreCourant();
    const de = ordre.indexOf(idLyc);
    if (de === -1) return;
    ordre.splice(de, 1);
    let a;
    if (versId === "up")      a = Math.max(0, de - 1);
    else if (versId === "down") a = Math.min(ordre.length, de + 1);
    else {                     // versId = id du lycée sur lequel on a lâché
      const cible = ordre.indexOf(versId);
      a = cible === -1 ? ordre.length : cible;
    }
    ordre.splice(a, 0, idLyc);
    ordrePerso = ordre;
    // Réordonner ses vœux est un usage abouti du 2GT (cas sans option, souvent
    // le plus fréquent). Sans ça, ces élèves n'étaient jamais comptés.
    signalerUsage2GT("Vœux réordonnés (sans option)");
    refresh();
  }

  function init(rootId) {
    const root = document.getElementById(rootId || "vue-2gt");
    if (!root) return;

    root.innerHTML =
      '<div class="gt-wrap">' +
        '<div class="gt-intro">' +
          '<h2>Classer mes vœux pour la 2nde générale et technologique</h2>' +
          '<p>Tu as 5 lycées possibles. Ils enseignent tous le même tronc commun : ce qui les ' +
          'distingue, ce sont les options, les langues et les séries technologiques. ' +
          'Coche ce qui t\'intéresse, compare, puis classe tes vœux.</p>' +
        '</div>' +
        '<div class="gt-filet">' +
          '<span class="gt-filet-ico" aria-hidden="true">🛟</span>' +
          '<div><strong>À lire avant de commencer</strong><p>' + REGLE_FILET_SECURITE + '</p></div>' +
        '</div>' +
        '<div class="gt-criteres" id="gt-criteres"></div>' +
        '<div class="gt-table-scroll" id="gt-table"></div>' +
        '<div class="gt-card" id="gt-carte"></div>' +
      '</div>';

    elCriteres = document.getElementById("gt-criteres");
    elTable    = document.getElementById("gt-table");
    elCarte    = document.getElementById("gt-carte");

    // Délégation d'événements : puces + cases du tableau + reset
    root.addEventListener("click", function (e) {
      const chip = e.target.closest("[data-critere]");
      const reset = e.target.closest('[data-action="reset"]');
      if (reset) { selection.clear(); selPlace.clear(); strategie = null; refresh(); return; }
      const chipP = e.target.closest("[data-place]");
      if (chipP && chipP.tagName === "BUTTON") { togglePlace(chipP.dataset.place); return; }
      const strat = e.target.closest("[data-strat]");
      if (strat) {
        const nouvelle = strat.dataset.strat;
        // L'usage a déjà été compté au cochage de l'option ; cet appel ne fait
        // donc rien de plus (garde statEnvoyee), mais couvre le cas — théorique —
        // où l'on arriverait ici sans être passé par un cochage.
        signalerUsage2GT(nouvelle === "lycee" ? "Classement par lycée" : "Classement par option");
        strategie = nouvelle;
        refresh();
        return;
      }
      const move = e.target.closest("[data-move]");
      if (move) { deplacerLycee(move.dataset.lyc, move.dataset.move); return; }
      if (chip && chip.tagName === "BUTTON") { toggle(chip.dataset.critere); }
    });

    // Glisser-déposer : uniquement sur les <li> réordonnables (cas sans option).
    let idPris = null;
    root.addEventListener("dragstart", function (e) {
      const li = e.target.closest("li.gt-reordonnable");
      if (!li) return;
      idPris = li.dataset.lyc;
      li.classList.add("gt-drag");
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    });
    root.addEventListener("dragend", function (e) {
      const li = e.target.closest("li.gt-reordonnable");
      if (li) li.classList.remove("gt-drag");
      idPris = null;
    });
    root.addEventListener("dragover", function (e) {
      if (idPris && e.target.closest("li.gt-reordonnable")) e.preventDefault(); // autorise le drop
    });
    root.addEventListener("drop", function (e) {
      const li = e.target.closest("li.gt-reordonnable");
      if (!li || !idPris) return;
      e.preventDefault();
      const cible = li.dataset.lyc;
      if (cible !== idPris) deplacerLycee(idPris, cible);
      idPris = null;
    });
    root.addEventListener("change", function (e) {
      if (e.target.matches('input[type="checkbox"][data-critere]')) {
        toggle(e.target.dataset.critere);
      } else if (e.target.matches('input[type="checkbox"][data-place]')) {
        togglePlace(e.target.dataset.place);
      }
    });

    refresh();
  }

  // Données structurées pour la génération du PDF
  function getVoeux() {
    return construireVoeux().map(function (o) {
      return {
        libelle:   o.voeu.libelle,
        code:      o.voeu.code,
        lycee:     o.lyc.nom,
        ville:     o.lyc.ville,
        trajet:    trajetTexte(o.lyc) + (trajetLigne(o.lyc) ? " (" + trajetLigne(o.lyc) + ")" : ""),
        procedure: o.voeu.procedure || null,
        filet:      !!(o.filet && !o.seul),
        complement: !!o.complement,
        // Les atouts « sur place » proposés par ce lycée (japonais, latin…),
        // pour que le PDF puisse les mentionner. Vide si aucun n'est coché.
        atouts:    (o.atouts || []).map(function (a) { return a.label; })
      };
    });
  }

  window.TrouveTaVoie2GT = {
    init: init,
    getVoeux: getVoeux,
    limite: LIMITE_VOEUX,
    // Signale un usage abouti si aucun ne l'a encore été. Appelé au
    // téléchargement du PDF : c'est LE cas qui restait dans l'angle mort —
    // l'élève sans option, sans atout, qui accepte l'ordre par défaut et imprime
    // sa liste. Il n'a rien coché ni réordonné, mais il repart avec ses vœux :
    // c'est bien un usage. (Garde statEnvoyee : pas de double comptage.)
    signalerTelechargement: function () { signalerUsage2GT("Liste par défaut téléchargée (sans option)"); }
  };
  if (document.readyState !== "loading") { init(); }
  else { document.addEventListener("DOMContentLoaded", function () { init(); }); }
})();
