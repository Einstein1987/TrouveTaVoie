/* =============================================================================
 * export.js — Impression et envoi par mail, pour les DEUX onglets
 *
 *   Voie professionnelle : la carte « Mon projet d'orientation »
 *   Voie générale (2GT)  : la carte « Mes vœux 2GT »
 *
 * L'impression repose sur les règles @media print de styles.css et 2gt.css :
 * l'onglet inactif est en display:none, il ne s'imprime donc jamais.
 * ========================================================================== */

function vueActive() {
  const gt = document.getElementById("vue-2gt");
  return (gt && gt.classList.contains("is-active")) ? "2gt" : "pro";
}

/* ---- Voie professionnelle : texte lu depuis la carte affichée ------------- */
function buildOrientationCardText() {
  const lines = [];
  const date   = document.getElementById("cardDate")?.textContent?.trim() || "";
  const domain = document.getElementById("cardMetier")?.textContent?.trim() || "";
  lines.push("Mon Projet d'Orientation");
  lines.push("");
  lines.push("Date : " + date);
  lines.push("Famille de métiers / domaine : " + domain);
  lines.push("");

  document.querySelectorAll("#cardDetailsContainer .formation-block").forEach(block => {
    const title = block.querySelector(".formation-title")?.textContent?.trim();
    if (title) {
      lines.push("--------------------------------------------------");
      lines.push(title);
      lines.push("--------------------------------------------------");
    }
    const coeffs = Array.from(block.querySelectorAll(".coeffs-table tbody td"))
      .map(td => td.textContent.trim());
    if (coeffs.length === 7) {
      lines.push(
        "Coefficients AFFELNET : " +
        `Français ${coeffs[0]} | Maths ${coeffs[1]} | Hist.-Géo ${coeffs[2]} | ` +
        `Langues ${coeffs[3]} | EPS ${coeffs[4]} | Arts ${coeffs[5]} | ` +
        `Sciences-Techno ${coeffs[6]}`
      );
      lines.push("");
    }
    lines.push("Établissements publics en Essonne :");
    block.querySelectorAll(".estab").forEach(school => {
      const t = school.innerText.split("\n").map(l => l.trim()).filter(Boolean).join(" — ");
      lines.push("- " + t);
    });
    lines.push("");
  });
  lines.push("N'hésite pas à en parler à ton professeur principal et/ou à la PsyEN de l'établissement.");
  return lines.join("\n");
}

/* ---- Aiguillage ---------------------------------------------------------- */
function texteCourant() {
  if (vueActive() === "2gt") {
    return (window.TrouveTaVoie2GT && typeof window.TrouveTaVoie2GT.buildText === "function")
      ? window.TrouveTaVoie2GT.buildText()
      : "";
  }
  return buildOrientationCardText();
}

function sujetCourant() {
  return vueActive() === "2gt"
    ? "Mes vœux — 2nde générale et technologique"
    : "Mon projet d'orientation";
}

function printCard() {
  window.print();
}

function emailCard() {
  const texte = texteCourant();
  if (!texte) return;

  // mailto: est limité en longueur par certains clients mail. Au-delà, on tronque
  // proprement plutôt que de risquer un message vidé sans prévenir l'élève.
  const LIMITE = 1800;
  let corps = texte;
  if (corps.length > LIMITE) {
    corps = corps.slice(0, LIMITE) +
      "\n\n[...] Liste trop longue pour un e-mail : utilise le bouton « Imprimer » " +
      "pour obtenir le document complet.";
  }
  window.location.href =
    `mailto:?subject=${encodeURIComponent(sujetCourant())}&body=${encodeURIComponent(corps)}`;
}

/* ---- Branchement par délégation : la carte 2GT est reconstruite à chaque clic */
function initExportButtons() {
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-export]");
    if (!btn) return;
    if (btn.dataset.export === "print")      printCard();
    else if (btn.dataset.export === "email") emailCard();
  });
}

document.addEventListener("DOMContentLoaded", initExportButtons);
