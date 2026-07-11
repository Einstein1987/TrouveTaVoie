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

    function activer(cible) {
      onglets.forEach(function (t) {
        const on = t.dataset.vue === cible;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      vues.forEach(function (v) {
        v.classList.toggle("is-active", v.id === cible);
      });

      // Pas de statistique ici : un simple clic d'onglet n'est pas un usage.
      // La voie 2GT compte au moment où l'élève valide sa liste de vœux.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    onglets.forEach(function (t) {
      t.addEventListener("click", function () { activer(t.dataset.vue); });
    });
  });
})();
