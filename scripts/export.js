/* =============================================================================
 * export.js — Un seul geste : télécharger le PDF.
 *
 * L'élève enregistre le fichier, puis l'imprime, l'envoie par mail ou le dépose
 * sur l'ENT comme il veut. L'application ne collecte aucune donnée, et ne dépend
 * d'aucun client mail installé sur le poste.
 *
 * Le branchement se fait par DÉLÉGATION : la carte 2GT est reconstruite à chaque
 * clic de l'élève, un écouteur posé directement sur le bouton serait détruit.
 * ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    const btn = e.target.closest('[data-export="pdf"]');
    if (!btn) return;
    if (typeof window.telechargerPDF === "function") window.telechargerPDF();
  });
});
