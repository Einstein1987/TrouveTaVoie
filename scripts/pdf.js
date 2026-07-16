/* =============================================================================
 * pdf.js — Génère le PDF téléchargeable des DEUX onglets de TrouveTaVoie.
 *
 *   Voie professionnelle : « Mon projet d'orientation »
 *   Voie générale (2GT)  : « Mes vœux 2GT »
 *
 * Pourquoi un téléchargement, et pas un envoi de mail ?
 * Envoyer un mail depuis un site statique imposerait un service tiers, donc de
 * faire transiter l'adresse d'un élève mineur chez un prestataire externe.
 * Le PDF téléchargé ne collecte RIEN : la famille l'imprime, l'envoie ou le
 * dépose sur l'ENT comme elle le souhaite.
 *
 * Dépend de jsPDF, hébergé localement dans scripts/vendor/ (aucun CDN).
 * ========================================================================== */

(function () {
  "use strict";

  const M = 15, LARG = 210, HAUT = 297, UTILE = LARG - 2 * M;

  /* ---------------------------------------------------------------------------
   * Palette du PDF.
   *
   * ATTENTION : jsPDF ne lit PAS le CSS. Ces valeurs sont la copie manuelle de
   * :root dans styles/styles.css. Si tu changes la palette là-bas, change-la
   * ICI AUSSI — sinon le PDF téléchargé garde les anciennes couleurs pendant
   * que l'écran affiche les nouvelles, et personne ne s'en aperçoit.
   *
   * Contrastes vérifiés (WCAG AA, seuil 4,5:1) — et ça compte double sur un
   * PDF : il finit souvent imprimé, parfois en noir et blanc, sur l'imprimante
   * fatiguée d'un CDI.
   * ------------------------------------------------------------------------ */
  const INK        = [15, 23, 42];    // #0F172A
  const BRASS      = [79, 70, 229];   // #4F46E5 — était #6366F1 (4,47:1)
  const TEAL       = [4, 120, 87];    // #047857 — était #10B981 (2,54:1 !)
  const MUTED      = [92, 107, 128];  // #5C6B80 — était #64748B
  const ROUGE      = [185, 28, 28];   // #B91C1C — était #DC2626 (4,41:1 sur son fond pâle)
  const ROUGE_SOMBRE = [127, 29, 29]; // #7F1D1D — chiffre sur pastille hors limite
  const AMBRE      = [180, 83, 9];    // #B45309
  const LIGNE      = [226, 232, 240]; // #E2E8F0 (bordures, décoratif)
  const SOFT       = [248, 250, 252]; // #F8FAFC

  /* ---- Utilitaires communs ---- */

  function saut(doc, y, besoin) {
    if (y + besoin > HAUT - M - 10) { doc.addPage(); return M + 5; }
    return y;
  }

  function bandeau(doc, titre) {
    doc.setFillColor.apply(doc, INK);
    doc.rect(0, 0, LARG, 26, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(titre, M, 12);
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text("Édité le " + new Date().toLocaleDateString("fr-FR") + " · TrouveTaVoie", M, 19);
    return 34;
  }

  function piedDePage(doc) {
    const n = doc.internal.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor.apply(doc, MUTED);
      doc.text("TrouveTaVoie — Collège La Nacelle, Corbeil-Essonnes", M, HAUT - 8);
      doc.text("Page " + i + " / " + n, LARG - M, HAUT - 8, { align: "right" });
    }
  }

  function noteFinale(doc, y, texte) {
    y = saut(doc, y, 22) + 4;
    doc.setTextColor.apply(doc, MUTED);
    doc.setFontSize(7.5);
    doc.setFont(undefined, "normal");
    doc.text(doc.splitTextToSize(texte, UTILE), M, y);
  }

  function nouveauDoc() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("La génération du PDF n'a pas pu se faire : la bibliothèque n'a pas été chargée.\n\n" +
            "Tu peux utiliser Ctrl+P (ou Cmd+P) puis « Enregistrer au format PDF ».");
      return null;
    }
    return new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
  }

  /* ========================================================================
   * 1. VOIE PROFESSIONNELLE — lu depuis la carte affichée
   * ===================================================================== */
  function pdfPro() {
    const doc = nouveauDoc();
    if (!doc) return;

    const date   = (document.getElementById("cardDate")   || {}).textContent || "";
    const domain = (document.getElementById("cardMetier") || {}).textContent || "";
    const blocs  = document.querySelectorAll("#cardDetailsContainer .formation-block");
    if (!blocs.length) return;

    /* La carte est découpée en trois sections — famille de métiers, bacs pro
     * hors famille, CAP — et cette information est capitale : elle dit à l'élève
     * s'il entre en seconde COMMUNE ou directement en spécialité.
     *
     * Le PDF est ce qu'il imprime et montre à ses parents. S'il n'y retrouve
     * pas les sections, il perd précisément ce qu'on a voulu lui apprendre.
     * On parcourt donc les sections, et on retombe sur les blocs à plat si la
     * structure venait à changer. */
    const sections = document.querySelectorAll("#cardDetailsContainer .carte-section"); 

    let y = bandeau(doc, "Mon projet d'orientation");

    doc.setTextColor.apply(doc, MUTED);
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text("SECTEUR", M, y);
    doc.setTextColor.apply(doc, BRASS);
    doc.setFontSize(13);
    doc.text(doc.splitTextToSize(domain.trim(), UTILE), M, y + 6);
    y += 16;

    const PAD  = 5;                    // marge intérieure du cadre
    const BAS  = HAUT - M - 12;        // dernière ligne utilisable

    // Un en-tête de section dans le PDF : son titre et sa phrase d'explication.
    function enTeteSection(section) {
      const titre = ((section.querySelector(".carte-section-titre") || {}).textContent || "").trim();
      const note  = ((section.querySelector(".carte-section-note")  || {}).textContent || "").trim();
      if (!titre) return;

      const lignesNote = note ? doc.splitTextToSize(note, UTILE) : [];
      const besoin = 8 + lignesNote.length * 4 + 4;
      if (y + besoin > BAS) { doc.addPage(); y = M + 5; }

      doc.setTextColor.apply(doc, INK);
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text(doc.splitTextToSize(titre, UTILE), M, y);
      y += 6;

      if (lignesNote.length) {
        doc.setTextColor.apply(doc, MUTED);
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.text(lignesNote, M, y);
        y += lignesNote.length * 4 + 3;
      }
    }

    function rendreBloc(bloc) {
      const titre  = ((bloc.querySelector(".formation-title") || {}).textContent || "").trim();
      // L'avertissement « À vérifier » (coefficients non confirmés, ex. CAP
      // Métallier absent de la fiche n°21). Il est visible à l'écran ; le PDF
      // l'ignorait, présentant les coefficients comme certains. Or le PDF est ce
      // que l'élève imprime et montre : l'y omettre transmet une info incomplète.
      const avert = ((bloc.querySelector(".formation-warning") || {}).textContent || "").trim();
      const coeffs = Array.prototype.slice
        .call(bloc.querySelectorAll(".coeffs-table tbody td"))
        .map(function (td) { return td.textContent.trim(); });
      const ecoles = Array.prototype.slice.call(bloc.querySelectorAll(".estab"))
        .map(function (e) {
          return e.innerText.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
        });

      // Une formation ne commence jamais en bas de page : au moins le titre,
      // les coefficients et un établissement doivent tenir ensemble.
      if (y + 55 > BAS) { doc.addPage(); y = M + 5; }

      // Segments du cadre : un par page traversée.
      const segments = [];
      let page  = doc.internal.getNumberOfPages();
      let hautCadre = y;

      // Saut de page qui referme le cadre et le rouvre sur la page suivante
      function place(besoin) {
        if (y + besoin > BAS) {
          segments.push({ page: page, y0: hautCadre, y1: y + 2, ferme: false });
          doc.addPage();
          page = doc.internal.getNumberOfPages();
          y = M + 8;
          hautCadre = M + 4;
        }
      }

      /* ---- En-tête de la formation ---- */
      const lignesTitre = doc.splitTextToSize(titre, UTILE - 2 * PAD - 4);
      const hEntete = 5 + lignesTitre.length * 5.2;
      doc.setFillColor.apply(doc, SOFT);
      doc.rect(M + 0.4, y + 0.4, UTILE - 0.8, hEntete, "F");
      doc.setTextColor.apply(doc, INK);
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text(lignesTitre, M + PAD, y + 6);
      y += hEntete + 5;

      /* ---- Coefficients ---- */
      if (coeffs.length === 7) {
        const mat = ["Français", "Maths", "Hist.-Géo", "Langues", "EPS", "Arts", "Sc.-Techno"];
        place(22);
        doc.setTextColor.apply(doc, MUTED);
        doc.setFontSize(7.5);
        doc.setFont(undefined, "bold");
        doc.text("COEFFICIENTS AFFELNET", M + PAD, y);
        y += 3;
        const larg = UTILE - 2 * PAD;
        const lc = larg / 7;
        const x0 = M + PAD;
        doc.setDrawColor.apply(doc, LIGNE);
        doc.setFillColor(255, 255, 255);
        doc.rect(x0, y, larg, 6, "FD");
        doc.rect(x0, y + 6, larg, 7, "FD");
        mat.forEach(function (m, i) {
          const cx = x0 + lc * i + lc / 2;
          doc.setFontSize(6.2);
          doc.setTextColor.apply(doc, MUTED);
          doc.setFont(undefined, "normal");
          doc.text(m, cx, y + 4, { align: "center" });
          doc.setFontSize(10);
          doc.setTextColor.apply(doc, BRASS);
          doc.setFont(undefined, "bold");
          doc.text(coeffs[i], cx, y + 11, { align: "center" });
          if (i > 0) doc.line(x0 + lc * i, y, x0 + lc * i, y + 13);
        });
        y += 18;
      }

      /* ---- Avertissement « À vérifier » (coefficients non confirmés) ---- */
      if (avert) {
        const lignesAv = doc.splitTextToSize(avert, UTILE - 2 * PAD - 4);
        const hAv = 4 + lignesAv.length * 4;
        place(hAv + 3);
        doc.setFillColor(255, 251, 235);            // ambre très pâle (#FFFBEB)
        doc.setDrawColor(180, 83, 9);               // AMBRE
        doc.setLineWidth(0.3);
        doc.rect(M + PAD, y - 3, UTILE - 2 * PAD, hAv, "FD");
        doc.setLineWidth(0.2);
        doc.setTextColor(146, 64, 14);              // #92400E — 6,84:1 sur le fond ambre
        doc.setFontSize(7.5);
        doc.setFont(undefined, "bold");
        doc.text(lignesAv, M + PAD + 2, y + 1);
        doc.setFont(undefined, "normal");
        y += hAv + 2;
      }

      /* ---- Établissements ---- */
      place(12);
      doc.setTextColor.apply(doc, MUTED);
      doc.setFontSize(7.5);
      doc.setFont(undefined, "bold");
      doc.text("ÉTABLISSEMENTS PUBLICS EN ESSONNE", M + PAD, y);
      y += 5;

      // Largeur utile pour le texte d'un établissement (marges + petit retrait).
      const largeurEtab = UTILE - 2 * PAD - 4;

      ecoles.forEach(function (lignes) {
        // Chaque ligne (nom du lycée, puis trajet/distance) peut être longue :
        // un itinéraire « Bus X puis RER D puis Bus Y » dépassait la marge droite
        // et se retrouvait tronqué à l'impression. On découpe donc TOUT à la
        // largeur utile, et on calcule la hauteur d'après le nombre réel de
        // lignes produites — sinon le cadre et le texte se chevauchent.
        const nom   = doc.splitTextToSize(lignes[0] || "", largeurEtab);
        const infos = lignes.slice(1).map(function (l) {
          return doc.splitTextToSize(l, largeurEtab);
        });
        const nbInfos = infos.reduce(function (n, bloc) { return n + bloc.length; }, 0);
        const h = nom.length * 4.5 + nbInfos * 4 + 2.5;
        place(h);

        doc.setTextColor.apply(doc, INK);
        doc.setFontSize(9.5);
        doc.setFont(undefined, "bold");
        doc.text(nom, M + PAD + 2, y);
        y += nom.length * 4.5;

        doc.setTextColor.apply(doc, MUTED);
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        infos.forEach(function (bloc) {
          doc.text(bloc, M + PAD + 2, y);
          y += bloc.length * 4;
        });
        y += 2.5;
      });

      // Dernier segment
      segments.push({ page: page, y0: hautCadre, y1: y + PAD - 2, ferme: true });

      // On trace les cadres APRÈS le contenu : uniquement le contour, il ne
      // recouvre donc pas le texte déjà écrit.
      const pageFinale = page;
      segments.forEach(function (sg) {
        doc.setPage(sg.page);
        doc.setDrawColor.apply(doc, LIGNE);
        doc.setLineWidth(0.4);
        doc.roundedRect(M, sg.y0, UTILE, sg.y1 - sg.y0, 2.5, 2.5, "D");
        if (!sg.ferme) {   // le cadre continue page suivante : on le signale
          doc.setFontSize(6.5);
          doc.setTextColor.apply(doc, MUTED);
          doc.setFont(undefined, "italic");
          doc.text("suite page suivante…", LARG - M - 2, sg.y1 - 2, { align: "right" });
          doc.setFont(undefined, "normal");
        }
      });
      doc.setLineWidth(0.2);
      doc.setPage(pageFinale);

      y += PAD + 5;
    }

    if (sections.length) {
      // Cas normal : trois sections, chacune avec son en-tête.
      Array.prototype.forEach.call(sections, function (section) {
        enTeteSection(section);
        Array.prototype.forEach.call(
          section.querySelectorAll(".formation-block"), rendreBloc);
        y += 3;
      });
    } else {
      // Filet de sécurité : si la structure en sections disparaissait, on
      // imprime au moins les formations plutôt que de rendre une page vide.
      Array.prototype.forEach.call(blocs, rendreBloc);
    }

    noteFinale(doc, y,
      "Édité le " + date.trim() + ". N'hésite pas à en parler à ton professeur principal " +
      "et/ou à la PsyEN de l'établissement. Sous réserve de modifications : vérifie les " +
      "informations avant de formuler tes vœux.");
    piedDePage(doc);
    doc.save("mon-projet-orientation-" + new Date().toISOString().slice(0, 10) + ".pdf");
  }

  /* ========================================================================
   * 2. VOIE GÉNÉRALE ET TECHNOLOGIQUE — lu depuis les données
   * ===================================================================== */
  function pdf2GT() {
    const doc = nouveauDoc();
    if (!doc) return;
    if (!window.TrouveTaVoie2GT || typeof window.TrouveTaVoie2GT.getVoeux !== "function") return;

    const voeux  = window.TrouveTaVoie2GT.getVoeux();
    const LIMITE = window.TrouveTaVoie2GT.limite || 10;
    if (!voeux.length) return;

    let y = bandeau(doc, "Mes vœux — 2nde générale et technologique");

    // Avertissement principal
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(252, 211, 77);
    doc.roundedRect(M, y, UTILE, 20, 2, 2, "FD");
    doc.setTextColor.apply(doc, AMBRE);
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Tu ne seras affecté que sur UN SEUL de ces vœux.", M + 4, y + 6);
    doc.setFont(undefined, "normal");
    doc.setFontSize(8.5);
    doc.text(doc.splitTextToSize(
      "Le premier de ta liste où il reste de la place. L'ordre compte donc : il doit refléter tes " +
      "vraies préférences, pas tes chances. Affelnet accepte " + LIMITE + " vœux au maximum.",
      UTILE - 8), M + 4, y + 11);
    y += 26;

    voeux.forEach(function (v, i) {
      const rang = i + 1;

      if (rang === LIMITE + 1) {
        y = saut(doc, y, 20);
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor.apply(doc, ROUGE);
        doc.setLineWidth(0.5);
        doc.roundedRect(M, y, UTILE, 14, 2, 2, "FD");
        doc.setLineWidth(0.2);
        doc.setTextColor.apply(doc, ROUGE);
        doc.setFontSize(9);
        doc.setFont(undefined, "bold");
        doc.text("LIMITE AFFELNET : " + LIMITE + " vœux maximum", M + 4, y + 5.5);
        doc.setFont(undefined, "normal");
        doc.setFontSize(8);
        doc.text("Les vœux ci-dessous ne pourront pas être saisis. Pour en garder un, retire-en un au-dessus.",
                 M + 4, y + 10.5);
        y += 20;
      }

      const hors = rang > LIMITE;
      // Hauteur du bloc, calculée d'après ce qu'il contient réellement :
      //  - base : libellé + ligne lycée + ligne trajet
      //  - + une étiquette (filet / couverture) sur sa propre ligne
      //  - + le pavé « recrutement spécifique » si procédure
      const aEtiquette = !!(v.complement || v.filet);
      const h = 19 + (aEtiquette ? 4 : 0) + (v.procedure ? 8 : 0);
      y = saut(doc, y, h);

      const coul = hors ? [252, 165, 165]
                 : (v.complement ? MUTED : (v.filet ? TEAL : BRASS));
      doc.setFillColor.apply(doc, coul);
      doc.circle(M + 4, y + 3, 3.4, "F");
      // Chiffre blanc sur les pastilles sombres ; rouge foncé sur la pastille
      // rose pâle du « hors limite » — en blanc, il était à 1,90:1 : illisible,
      // et c'est pourtant le vœu qui ne partira pas sur Affelnet.
      if (hors) doc.setTextColor.apply(doc, ROUGE_SOMBRE);
      else doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text(String(rang), M + 4, y + 4.2, { align: "center" });

      doc.setTextColor.apply(doc, hors ? MUTED : INK);
      doc.setFontSize(10.5);
      doc.setFont(undefined, "bold");
      // Le libellé peut être long (« Langue vivante C rare — Portugais »). On le
      // borne à la largeur utile pour qu'il ne parte jamais sous l'étiquette ni
      // hors de la page ; s'il dépasse, jsPDF le renvoie à la ligne.
      const largeurLibelle = UTILE - 12;
      const lignesLib = doc.splitTextToSize(v.libelle, largeurLibelle);
      doc.text(lignesLib, M + 10, y + 3);

      // L'étiquette (« filet de sécurité », « couverture secteur ») va DESSOUS le
      // libellé, plus jamais à sa droite : à côté, elle chevauchait le libellé
      // dès qu'il était un peu long (bug relevé par l'audit). En dessous, la
      // largeur du libellé n'a plus aucune importance.
      const etiq = v.complement ? "couverture secteur"
                 : (v.filet ? "filet de sécurité" : "");
      let yInfo = y + 8;   // position de la ligne « lycée · code »
      if (etiq) {
        doc.setFontSize(7.5);
        doc.setFont(undefined, "normal");
        doc.setTextColor.apply(doc, v.complement ? MUTED : TEAL);
        doc.text("[ " + etiq + " ]", M + 10, y + 7.5);
        yInfo = y + 12;    // on décale les infos pour laisser la place à l'étiquette
      }

      doc.setFont(undefined, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor.apply(doc, MUTED);
      doc.text(v.lycee + " (" + v.ville + ")   ·   Code vœu : " + v.code, M + 10, yInfo);
      doc.text("Trajet depuis le collège : " + v.trajet, M + 10, yInfo + 4.5);

      if (v.procedure) {
        doc.setTextColor.apply(doc, AMBRE);
        doc.setFont(undefined, "bold");
        doc.setFontSize(8);
        doc.text(doc.splitTextToSize(
          "Recrutement spécifique (" + v.procedure + ") : entretien de présélection obligatoire. " +
          "L'avis de la commission donne des points bonus ou malus. À signaler très tôt à ton " +
          "professeur principal.", UTILE - 12), M + 10, yInfo + 9);
        doc.setFont(undefined, "normal");
      }

      doc.setDrawColor.apply(doc, LIGNE);
      doc.line(M, y + h - 3, LARG - M, y + h - 3);
      y += h;
    });

    noteFinale(doc, y,
      "Sources : catalogue Affelnet post-3e (académie de Versailles, campagne 2026) ; fiche " +
      "technique n°16 — carte des formations GT de l'Essonne ; CIO Évry-Courcouronnes " +
      "(MAJ 16/04/2026). Sous réserve de modifications : vérifie auprès de ton professeur " +
      "principal ou de la PsyEN avant de formuler tes vœux.");
    piedDePage(doc);
    doc.save("mes-voeux-2GT-" + new Date().toISOString().slice(0, 10) + ".pdf");
  }

  /* ---- Aiguillage selon l'onglet actif ---- */
  function telechargerPDF() {
    const gt = document.getElementById("vue-2gt");
    if (gt && gt.classList.contains("is-active")) pdf2GT();
    else pdfPro();
  }

  window.telechargerPDF = telechargerPDF;
})();
