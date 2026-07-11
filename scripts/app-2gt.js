/* =============================================================================
 * app-2gt.js — TrouveTaVoie / Onglet "Je vais en 2nde générale et technologique"
 *
 * Dépend de : scripts/bdd-2gt.js  (LYCEES_2GT, CRITERES_2GT, SERIES_TECHNO_2GT…)
 * Optionnel  : pingStats(type, valeur) défini dans scripts/app.js
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
  let strategie = "lycee";       // "lycee" = je tiens au lycée | "option" = je tiens à l'option

  /* ---------------------------------------------------------------------- */
  /* Utilitaires                                                            */
  /* ---------------------------------------------------------------------- */

  function ping(type, valeur) {
    if (typeof pingStats === "function") pingStats(type, valeur);
  }

  function trajetTexte(lyc) {
    const t = lyc.trajet || {};
    if (t.minutes == null) return "trajet à renseigner";
    let txt = t.minutes + " min";
    if (t.km != null) txt += " · " + t.km + " km";
    return txt;
  }
  function trajetLigne(lyc) {
    const t = lyc.trajet || {};
    return t.ligne ? t.ligne : "";
  }

  // Les vœux d'un lycée qui répondent à un critère donné
  function voeuxPourCritere(lycId, critere) {
    const lyc = LYCEES_2GT[lycId];
    if (!lyc || !critere.lycees.includes(lycId)) return [];
    const cle = critere.id;
    return lyc.voeux.filter(function (v) {
      const lib = v.libelle.toLowerCase();
      if (cle === "arts_plastiques") return lib.includes("arts plastiques");
      if (cle === "histoire_arts")   return lib.includes("histoire des arts");
      if (cle === "musique")         return lib.includes("musique");
      if (cle === "cinema")          return lib.includes("cinéma");
      if (cle === "theatre")         return lib.includes("théâtre");
      if (cle === "design")          return lib.includes("design");
      if (cle === "biotech")         return lib.includes("biotechnologies");
      if (cle === "chinois")         return lib.includes("chinois");
      if (cle === "portugais")       return lib.includes("portugais");
      if (cle === "euro_espagnol")   return lib.includes("européenne espagnol");
      if (cle === "euro_anglais")    return lib.includes("européenne anglais");
      return false;
    });
  }

  function scoreLycee(lycId) {          // sert à construire les vœux
    let n = 0;
    CRITERES_2GT.forEach(function (c) {
      if (selection.has(c.id) && c.lycees.includes(lycId)) n++;
    });
    return n;
  }

  function scoreTotal(lycId) {          // sert au badge du tableau (vœux + atouts)
    let n = scoreLycee(lycId);
    CRITERES_SUR_PLACE.forEach(function (c) {
      if (selPlace.has(c.id) && c.lycees.includes(lycId)) n++;
    });
    return n;
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
    const scores = {};
    ORDRE_LYCEES.forEach(function (id) { scores[id] = scoreTotal(id); });
    const best = Math.max.apply(null, ORDRE_LYCEES.map(function (id) { return scores[id]; }));

    let html = '<table class="gt-table"><thead><tr><th>Ce que je cherche</th>';
    ORDRE_LYCEES.forEach(function (id) {
      const l = LYCEES_2GT[id];
      html += '<th><span class="gt-lyc-nom">' + l.nom.replace("Lycée ", "") + '</span>' +
              '<span class="gt-lyc-meta">' + l.ville + '<br><b>' + trajetTexte(l) + '</b>' +
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
      const s = scores[id];
      const top = (selection.size > 0 && s === best && s > 0) ? " is-top" : "";
      html += '<td><span class="gt-score-badge' + top + '">' + s + '</span></td>';
    });
    html += '</tr></tfoot></table>';

    root.innerHTML = html;
  }

  /* ---------------------------------------------------------------------- */
  /* 3. La carte « Mes vœux 2GT »                                            */
  /* ---------------------------------------------------------------------- */

  function construireVoeux() {
    const retenus = ORDRE_LYCEES
      .map(function (id) { return { id: id, score: scoreLycee(id), lyc: LYCEES_2GT[id] }; })
      .filter(function (o) { return o.score > 0; })
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        const ta = a.lyc.trajet && a.lyc.trajet.minutes;
        const tb = b.lyc.trajet && b.lyc.trajet.minutes;
        if (ta != null && tb != null) return ta - tb;
        return 0;
      });

    // Vœux "à option" de chaque lycée retenu, dans l'ordre des critères cochés
    // Les vœux "section européenne" passent AVANT les autres options :
    // une section euro ne se rattrape pas à l'inscription, une option si.
    function estEuro(x) { return x.voeu.categorie === "section_euro"; }

    function optionsDe(o) {
      const vus = new Set(); const out = [];
      CRITERES_2GT.forEach(function (c) {
        if (!selection.has(c.id)) return;
        voeuxPourCritere(o.id, c).forEach(function (v) {
          if (vus.has(v.code)) return;
          vus.add(v.code);
          out.push({ lyc: o.lyc, voeu: v, filet: false });
        });
      });
      return out.filter(estEuro).concat(out.filter(function (x) { return !estEuro(x); }));
    }
    function filetDe(o) {
      const s = o.lyc.voeux.find(function (v) { return v.categorie === "base"; });
      return s ? { lyc: o.lyc, voeu: s, filet: true } : null;
    }

    const liste = [];
    if (strategie === "lycee") {
      // Lycée par lycée : ses options, puis SON filet juste en dessous
      retenus.forEach(function (o) {
        optionsDe(o).forEach(function (x) { liste.push(x); });
        const f = filetDe(o); if (f) liste.push(f);
      });
    } else {
      // Toutes les sections euro, puis toutes les autres options, puis tous les filets
      const tous = [];
      retenus.forEach(function (o) { optionsDe(o).forEach(function (x) { tous.push(x); }); });
      tous.filter(estEuro).forEach(function (x) { liste.push(x); });
      tous.filter(function (x) { return !estEuro(x); }).forEach(function (x) { liste.push(x); });
      retenus.forEach(function (o) { const f = filetDe(o); if (f) liste.push(f); });
    }
    return liste;
  }

  function renderCarte(root) {
    const liste = construireVoeux();
    const date = new Date().toLocaleDateString("fr-FR");

    let body;
    if (liste.length === 0) {
      body = '<p class="gt-empty">Coche au moins une option ci-dessus pour voir apparaître ' +
             'une proposition de vœux à recopier sur ta fiche Affelnet.</p>';
    } else {
      const items = liste.map(function (o) {
        const v = o.voeu;
        let notes = "";
        if (o.filet) {
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
        const traj = '<span class="gt-v-trajet">🚌 ' + trajetTexte(o.lyc) +
                     (trajetLigne(o.lyc) ? ' — ' + trajetLigne(o.lyc) : '') + '</span>';
        return '<li class="' + (o.filet ? "is-filet" : "") + '">' +
               '<div><span class="gt-v-main">' + v.libelle + '</span> ' +
               '<span class="gt-v-lyc">— ' + o.lyc.nom + ', ' + o.lyc.ville + '</span>' +
               '<span class="gt-v-code">' + v.code + '</span>' +
               (o.filet ? '<span class="gt-tag-filet">filet de sécurité</span>' : '') +
               traj + notes + '</div></li>';
      }).join("");

      // Ce qui ne passe PAS par Affelnet, mais qui concerne les lycées retenus
      const idsRetenus = Array.from(new Set(liste.map(function (o) { return o.lyc.id; })));
      const hors = [];
      const surPlace = [];
      const vusHors = new Set();
      idsRetenus.forEach(function (id) {
        const l = LYCEES_2GT[id];
        (l.horsAffelnet || []).forEach(function (h) {
          const cle = l.id + "|" + h.libelle;
          if (vusHors.has(cle)) return;
          vusHors.add(cle);
          hors.push('<li><strong>' + h.libelle + '</strong> (' + l.nom + ') — ' + h.note + '</li>');
        });
        if (l.optionsSurPlace && l.optionsSurPlace.length) {
          surPlace.push('<li><strong>' + l.nom + '</strong> : ' + l.optionsSurPlace.join(", ") + '</li>');
        }
      });

      const bLyc = strategie === "lycee" ? " is-on" : "";
      const bOpt = strategie === "option" ? " is-on" : "";
      body =
        '<div class="gt-strategie">' +
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
          '<p class="gt-rappel-deux">' + REGLE_MAX_DEUX_OPTIONS + '</p>' +
          '<span class="gt-strat-label">Ce qui compte le plus pour toi ?</span>' +
          '<div class="gt-strat-btns">' +
            '<button type="button" class="gt-strat' + bLyc + '" data-strat="lycee">Le lycée</button>' +
            '<button type="button" class="gt-strat' + bOpt + '" data-strat="option">L\'option</button>' +
          '</div>' +
          '<p class="gt-strat-hint">' +
            (strategie === "lycee"
              ? "Les vœux sont groupés par lycée : ton lycée préféré d'abord, avec son option, puis son filet de sécurité juste en dessous."
              : "Les vœux sont groupés par option : tous les lycées qui proposent ce que tu veux d'abord, et les vœux sans option à la fin.") +
          '</p>' +
        '</div>' +
        '<ol class="gt-voeux">' + items + '</ol>' +
        (hors.length
          ? '<div class="gt-aside"><h4>À faire en dehors d\'Affelnet</h4><ul>' +
            hors.join("") + '</ul></div>'
          : "") +
        (surPlace.length
          ? '<div class="gt-aside"><h4>Options à choisir une fois affecté (pas un vœu)</h4><ul>' +
            Array.from(new Set(surPlace)).join("") + '</ul></div>'
          : "") +
        '<p class="gt-source">Sources : ' + SOURCE_2GT.affelnet + ' ; ' + SOURCE_2GT.fiche16 +
        ' ; ' + SOURCE_2GT.cio + '.<br>' + SOURCE_2GT.avertissement + '</p>';
    }

    root.innerHTML =
      '<div class="gt-card-head"><h3>Mes vœux 2GT</h3><span class="gt-date">' + date + '</span></div>' +
      '<div class="gt-card-body">' + body + '</div>';
  }

  /* ---------------------------------------------------------------------- */
  /* Orchestration                                                          */
  /* ---------------------------------------------------------------------- */

  let elCriteres, elTable, elCarte;

  function refresh() {
    renderCriteres(elCriteres);
    renderTable(elTable);
    renderCarte(elCarte);
  }

  function togglePlace(id) {
    const c = CRITERES_SUR_PLACE.find(function (x) { return x.id === id; });
    if (!c) return;
    if (selPlace.has(id)) { selPlace.delete(id); }
    else { selPlace.add(id); ping("2gt_atout", c.label); }
    refresh();
  }

  function toggle(id) {
    const c = CRITERES_2GT.find(function (x) { return x.id === id; });
    if (!c) return;
    if (selection.has(id)) {
      selection.delete(id);
    } else {
      selection.add(id);
      ping("2gt_critere", c.label);
    }
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
      if (reset) { selection.clear(); selPlace.clear(); refresh(); return; }
      const chipP = e.target.closest("[data-place]");
      if (chipP && chipP.tagName === "BUTTON") { togglePlace(chipP.dataset.place); return; }
      const strat = e.target.closest("[data-strat]");
      if (strat) { strategie = strat.dataset.strat; ping("2gt_strategie", strategie); refresh(); return; }
      if (chip && chip.tagName === "BUTTON") { toggle(chip.dataset.critere); }
    });
    root.addEventListener("change", function (e) {
      if (e.target.matches('input[type="checkbox"][data-critere]')) {
        toggle(e.target.dataset.critere);
      } else if (e.target.matches('input[type="checkbox"][data-place]')) {
        togglePlace(e.target.dataset.place);
      }
    });

    ping("2gt_ouverture", "");
    refresh();
  }

  window.TrouveTaVoie2GT = { init: init };
  if (document.readyState !== "loading") { init(); }
  else { document.addEventListener("DOMContentLoaded", function () { init(); }); }
})();
