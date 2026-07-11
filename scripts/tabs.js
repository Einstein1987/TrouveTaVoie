/* =============================================================================
 * tabs.js — Bascule entre les deux vues de TrouveTaVoie
 *   #vue-pro  : l'assistant conversationnel (voie professionnelle)
 *   #vue-2gt  : le comparateur de lycées (2nde générale et technologique)
 * ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const onglets = Array.prototype.slice.call(document.querySelectorAll(".tab[data-vue]"));
    const vues    = Array.prototype.slice.call(document.querySelectorAll(".vue"));
    if (!onglets.length) return;

    const dejaVu = {};   // pour ne compter l'ouverture d'un onglet qu'une fois par session

    function activer(cible) {
      onglets.forEach(function (t) {
        const on = t.dataset.vue === cible;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      vues.forEach(function (v) {
        v.classList.toggle("is-active", v.id === cible);
      });

      // Statistiques : une seule fois par onglet et par session
      if (!dejaVu[cible] && typeof pingStats === "function") {
        dejaVu[cible] = true;
        pingStats("onglet_ouvert", cible === "vue-2gt" ? "2GT" : "Professionnelle");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    onglets.forEach(function (t) {
      t.addEventListener("click", function () { activer(t.dataset.vue); });
    });
  });
})();
