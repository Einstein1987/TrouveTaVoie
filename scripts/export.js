function printOrientationCard() {
    window.print();
}

function emailOrientationCard() {
    const subject = encodeURIComponent("Mon projet d'orientation");
    const body = encodeURIComponent(buildOrientationCardText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function buildOrientationCardText() {
    const lines = [];
    const date = document.getElementById("cardDate")?.textContent?.trim() || "";
    const domain = document.getElementById("cardMetier")?.textContent?.trim() || "";
    lines.push("Mon Projet d'Orientation");
    lines.push("");
    lines.push("Date : " + date);
    lines.push("Famille de métiers / domaine : " + domain);
    lines.push("");
    const formationBlocks = document.querySelectorAll("#cardDetailsContainer .formation-block");
    formationBlocks.forEach(block => {
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
                `Français ${coeffs[0]} | ` +
                `Maths ${coeffs[1]} | ` +
                `Hist.-Géo ${coeffs[2]} | ` +
                `Langues ${coeffs[3]} | ` +
                `EPS ${coeffs[4]} | ` +
                `Arts ${coeffs[5]} | ` +
                `Sciences-Techno ${coeffs[6]}`
            );
            lines.push("");
        }
        lines.push("Établissements publics en Essonne :");
        const schools = block.querySelectorAll(".estab");
        schools.forEach(school => {
            const schoolText = school.innerText
                .split("\n")
                .map(line => line.trim())
                .filter(Boolean)
                .join(" — ");
            lines.push("- " + schoolText);
        });
        lines.push("");
    });
    lines.push("N'hésite pas à en parler à ton professeur principal et/ou à la PsyEN de l'établissement.");
    return lines.join("\n");
}

function initExportButtons() {
    const printBtn = document.getElementById("printBtn");
    const emailBtn = document.getElementById("emailBtn");
    if (printBtn) {
        printBtn.addEventListener("click", printOrientationCard);
    }
    if (emailBtn) {
        emailBtn.addEventListener("click", emailOrientationCard);
    }
}

document.addEventListener("DOMContentLoaded", initExportButtons);
