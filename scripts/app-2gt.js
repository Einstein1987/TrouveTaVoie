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
  const selection = new Set();   // ids de critères cochés

  /* ---------------------------------------------------------------------- */
  /* Utilitaires                                                            */
  /* ---------------------------------------------------------------------- */

  function ping(type, valeur) {
    if (typeof pingStats === "function") pingStats(type, valeur);
  }

  function trajetTexte(lyc) {
    const t = lyc.trajet || {};
    const bouts = [];
    if (t.km != null)      bouts.push(t.km + " km");
    if (t.minutes != null) bouts.push(t.minutes + " min");
    return bouts.length ? bouts.join(" · ") : "trajet à renseigner";
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

  function scoreLycee(lycId) {
    let n = 0;
    CRITERES_2GT.forEach(function (c) {
      if (selection.has(c.id) && c.lycees.includes(lycId)) n++;
    });
    return n;
  }

  /* ---------------------------------------------------------------------- */
  /* 1. Les cases à cocher                                                  */
  /* ---------------------------------------------------------------------- */

  function renderCriteres(root) {
    const chips = CRITERES_2GT.map(function (c) {
      const on = selection.has(c.id);
      const solo = c.exclusif ? " is-solo" : "";
      const titre = c.remarque ? ' title="' + c.remarque + '"' : "";
      return '<button type="button" class="gt-chip' + solo + '" data-critere="' + c.id + '"' +
             ' aria-pressed="' + (on ? "true" : "false") + '"' + titre + '>' +
             '<span class="gt-chip-box" aria-hidden="true"></span>' + c.label +
             (c.procedure ? ' <span class="gt-pass">' + c.procedure + '</span>' : '') +
             '</button>';
    }).join("");

    root.innerHTML =
      '<h3>Qu\'est-ce qui t\'intéresse ?</h3>' +
      '<p class="gt-hint">Coche ce que tu aimerais faire en seconde. Les lycées qui le ' +
      'proposent seront surlignés dans le tableau. Le contour en pointillés signale une ' +
      'option qu\'un seul lycée propose.</p>' +
      '<div class="gt-chips">' + chips + '</div>' +
      '<div class="gt-actions">' +
      '<button type="button" class="gt-btn gt-btn-ghost" data-action="reset">Tout décocher</button>' +
      '</div>';
  }

  /* ---------------------------------------------------------------------- */
  /* 2. Le tableau comparatif                                               */
  /* ---------------------------------------------------------------------- */

  function renderTable(root) {
    const scores = {};
    ORDRE_LYCEES.forEach(function (id) { scores[id] = scoreLycee(id); });
    const best = Math.max.apply(null, ORDRE_LYCEES.map(function (id) { return scores[id]; }));

    let html = '<table class="gt-table"><thead><tr><th>Ce que je cherche</th>';
    ORDRE_LYCEES.forEach(function (id) {
      const l = LYCEES_2GT[id];
      html += '<th><span class="gt-lyc-nom">' + l.nom.replace("Lycée ", "") + '</span>' +
              '<span class="gt-lyc-meta">' + l.ville + '<br>' + trajetTexte(l) + '</span></th>';
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
    // Un lycée est retenu s'il coche au moins un critère.
    const retenus = ORDRE_LYCEES
      .map(function (id) { return { id: id, score: scoreLycee(id), lyc: LYCEES_2GT[id] }; })
      .filter(function (o) { return o.score > 0; })
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;           // + de critères d'abord
        const ta = a.lyc.trajet && a.lyc.trajet.minutes;
        const tb = b.lyc.trajet && b.lyc.trajet.minutes;
        if (ta != null && tb != null) return ta - tb;                // puis le plus proche
        return 0;
      });

    const liste = [];
    retenus.forEach(function (o) {
      const dejaVus = new Set();
      // a) les vœux "à option" qui correspondent aux cases cochées
      CRITERES_2GT.forEach(function (c) {
        if (!selection.has(c.id)) return;
        voeuxPourCritere(o.id, c).forEach(function (v) {
          if (dejaVus.has(v.code)) return;
          dejaVus.add(v.code);
          liste.push({ lyc: o.lyc, voeu: v, filet: false });
        });
      });
      // b) LE FILET DE SÉCURITÉ : le vœu simple du même lycée, juste en dessous
      const simple = o.lyc.voeux.find(function (v) { return v.categorie === "base"; });
      if (simple && !dejaVus.has(simple.code)) {
        liste.push({ lyc: o.lyc, voeu: simple, filet: true });
      }
    });
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
        return '<li class="' + (o.filet ? "is-filet" : "") + '">' +
               '<div><span class="gt-v-main">' + v.libelle + '</span> ' +
               '<span class="gt-v-lyc">— ' + o.lyc.nom + ', ' + o.lyc.ville + '</span>' +
               '<span class="gt-v-code">' + v.code + '</span>' +
               (o.filet ? '<span class="gt-tag-filet">filet de sécurité</span>' : '') +
               notes + '</div></li>';
      }).join("");

      // Ce qui ne passe PAS par Affelnet, mais qui concerne les lycées retenus
      const idsRetenus = liste.map(function (o) { return o.lyc.id; });
      const hors = [];
      const surPlace = [];
      idsRetenus.forEach(function (id) {
        const l = LYCEES_2GT[id];
        (l.horsAffelnet || []).forEach(function (h) {
          hors.push('<li><strong>' + h.libelle + '</strong> (' + l.nom + ') — ' + h.note + '</li>');
        });
        if (l.optionsSurPlace && l.optionsSurPlace.length) {
          surPlace.push('<li><strong>' + l.nom + '</strong> : ' + l.optionsSurPlace.join(", ") + '</li>');
        }
      });

      body = '<ol class="gt-voeux">' + items + '</ol>' +
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
      if (reset) { selection.clear(); refresh(); return; }
      if (chip && chip.tagName === "BUTTON") { toggle(chip.dataset.critere); }
    });
    root.addEventListener("change", function (e) {
      if (e.target.matches('input[type="checkbox"][data-critere]')) {
        toggle(e.target.dataset.critere);
      }
    });

    ping("2gt_ouverture", "");
    refresh();
  }

  window.TrouveTaVoie2GT = { init: init };
  if (document.readyState !== "loading") { init(); }
  else { document.addEventListener("DOMContentLoaded", function () { init(); }); }
})();
