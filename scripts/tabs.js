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

    // Active un onglet et synchronise classes, attributs ARIA et panneau visible.
    function activer(cible) {
      onglets.forEach(function (t) {
        const on = t.dataset.vue === cible;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        // Un seul onglet est atteignable par Tab : les autres se rejoignent
        // avec les flèches, comme le veut le motif ARIA « tabs ».
        t.setAttribute("tabindex", on ? "0" : "-1");
      });
      vues.forEach(function (v) {
        const on = v.id === cible;
        v.classList.toggle("is-active", on);
        // `hidden` retire vraiment le panneau de l'arbre d'accessibilité :
        // une classe CSS seule laisserait le lecteur d'écran le parcourir.
        if (on) { v.removeAttribute("hidden"); }
        else    { v.setAttribute("hidden", ""); }
      });

      // Pas de statistique ici : un simple clic d'onglet n'est pas un usage.
      // La voie 2GT compte au moment où l'élève choisit son classement de vœux.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Navigation au clavier : flèches gauche/droite, Début et Fin.
    function deplacer(depuis, pas) {
      const i = onglets.indexOf(depuis);
      if (i === -1) return;
      let j;
      if (pas === "debut")     j = 0;
      else if (pas === "fin")  j = onglets.length - 1;
      else                     j = (i + pas + onglets.length) % onglets.length;
      onglets[j].focus();
      activer(onglets[j].dataset.vue);
    }

    onglets.forEach(function (t) {
      t.addEventListener("click", function () { activer(t.dataset.vue); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); deplacer(t, 1); }
        else if (e.key === "ArrowLeft")  { e.preventDefault(); deplacer(t, -1); }
        else if (e.key === "Home")       { e.preventDefault(); deplacer(t, "debut"); }
        else if (e.key === "End")        { e.preventDefault(); deplacer(t, "fin"); }
      });
    });

    // Le logo remet l'application à son état de départ : c'est le geste attendu
    // quand on veut « recommencer », et c'est plus simple qu'un bouton de reset
    // qui devrait vider le chat, la carte, les cases cochées et les onglets.
    const logo = document.querySelector(".app-logo");
    if (logo) {
      logo.style.cursor = "pointer";
      logo.setAttribute("role", "button");
      logo.setAttribute("tabindex", "0");
      logo.setAttribute("title", "Revenir au début");
      // Recharge la page pour remettre simultanément les deux parcours à zéro.
      const recommencer = function () { window.location.reload(); };
      logo.addEventListener("click", recommencer);
      logo.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); recommencer(); }
      });
    }
  });
})();
