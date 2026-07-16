# TrouveTaVoie

**Application web d'aide à l'orientation pour les élèves de 3ᵉ.**
Développée pour le collège La Nacelle (Corbeil-Essonnes, Essonne) — académie de Versailles.
 
🔗 [Accéder à l'application](https://trouvetavoie-3e.netlify.app)
 
---
 
## Ce que fait l'application
 
Après la 3ᵉ, un élève doit formuler des vœux sur **Affelnet**. Deux situations très
différentes, donc deux outils :
 
### 🔧 Voie professionnelle — un assistant conversationnel
 
L'élève ne sait pas toujours ce qui existe. L'espace est vaste : **48 bacs pro et
33 CAP**, répartis sur **31 lycées publics** de l'Essonne — 188 offres de formation
au total. L'application propose donc un **dialogue guidé**, avec quatre portes
d'entrée :

- il connaît déjà la formation qu'il veut ;
- il sait dans quel **secteur** il veut travailler ;
- il connaît un lycée et veut voir ce qu'on y propose ;
- **il est perdu** → un quiz le guide par élimination.

En sortie, une fiche personnelle : la formation, les **coefficients Affelnet**
correspondants, la liste des établissements publics de l'Essonne qui la proposent,
avec pour chacun la distance (estimée) et le **temps de trajet depuis le collège**.

#### Secteur ≠ famille de métiers

Cette distinction structure toute l'application, et elle n'est pas cosmétique :

- Un **secteur** (il y en a 18) est un regroupement **thématique**, inventé ici pour
  aider un élève à se repérer. *Ça n'existe pas dans Affelnet.*
- Une **famille de métiers** (14 officielles, dont **13 représentées** dans les
  lycées publics de l'Essonne) est une réalité **administrative**. Elle décide si
  l'élève entre en **seconde commune** — une année pour découvrir plusieurs
  spécialités avant de choisir — ou **directement en spécialité**.
- **Un CAP n'est jamais dans une famille de métiers.** Les familles ne concernent que
  la seconde professionnelle.

La fiche de sortie affiche donc **trois sections distinctes** : les familles de
métiers concernées, les **bacs pro hors famille** (11 dans la base — engagement dès
la seconde, sans année de découverte), et les **CAP**. Chaque section explique par
écrit ce qu'elle implique : la couleur ne porte jamais l'information seule.

> Confondre les deux notions a coûté cher : 13 CAP portaient les coefficients
> Affelnet de leur *secteur* au lieu des leurs. Un coefficient faux, c'est un élève
> qui calcule mal ses chances et peut se retrouver sans affectation. Corrigé en
> juillet 2026, et désormais vérifié à chaque commit.
 
### 🎓 Voie générale et technologique — un comparateur de lycées
 
Ici, l'élève n'est pas perdu : il a **5 lycées de secteur** et doit les classer. Un
dialogue serait inutile. L'application affiche donc un **tableau comparatif** : il
coche ce qui l'intéresse (théâtre, design, chinois, biotechnologies…), les lycées
concernés se surlignent, et une **liste de vœux ordonnée** se construit.
 
C'est là que se joue la vraie valeur de l'outil, car il explique ce qu'aucune
brochure ne dit clairement :
 
- **Toutes les options ne sont pas des vœux.** « Doisneau Théâtre » est un code vœu
  Affelnet distinct de « Doisneau ». Mais le latin, l'EPS ou le japonais ne se
  demandent pas sur Affelnet : ils se choisissent à l'inscription. L'application
  sépare rigoureusement les deux.
- **Le filet de sécurité.** Un vœu avec option et le vœu simple ont chacun leur
  quota de places. L'application place systématiquement le vœu simple juste en
  dessous, pour protéger l'affectation dans le lycée visé.
- **La priorité aux sections européennes.** Une section euro ne se rattrape pas à
  l'inscription, contrairement à une option. L'application la place donc en premier,
  et explique pourquoi.
- **La couverture du secteur.** L'élève sera affecté dans l'un des 5 lycées. S'il
  n'en classe que deux, l'administration décidera pour lui. L'application complète
  la liste avec les lycées restants, du plus proche au plus lointain.
- **La limite des 10 vœux.** Une ligne rouge marque le seuil Affelnet : au-delà,
  c'est à l'élève d'arbitrer.
- **Les procédures spécifiques** (PassCCD pour le design, PassSTL pour les
  biotechnologies) sont signalées : elles imposent un entretien de présélection.
  
### 📄 Export PDF
 
Chaque onglet produit un **PDF téléchargeable** (jsPDF), que l'élève imprime, envoie
par mail ou dépose sur l'ENT comme il le souhaite.
 
> **Choix assumé :** l'application n'envoie aucun e-mail et ne demande jamais
> l'adresse de l'élève. Un envoi automatique imposerait de faire transiter des
> données personnelles de mineurs par un prestataire externe. Le PDF téléchargé rend
> le même service, sans collecter la moindre donnée.
 
---
 
## Principes de conception
 
**Aider à décider, jamais décider à la place.** L'application ne « valide » pas un
projet, elle n'affiche pas de taux de pression, et elle ne classe jamais les vœux par
*chances d'obtention*. Un élève doit demander le théâtre **parce qu'il veut faire du
théâtre**, pas parce que la ligne serait moins demandée. Toutes les informations qui
pourraient encourager un usage stratégique du barème sont volontairement absentes.
 
**Tout tracer vers une source officielle.** Chaque donnée affichée provient d'un
document public et daté, cité dans l'application.
 
**Rendre les coûts visibles.** Un trajet de plus de 45 minutes est signalé en ambre,
avec le total aller-retour quotidien. L'élève reste libre — mais il sait.

*Précision :* les **temps de trajet** sont calculés par l'API PRIM d'Île-de-France
Mobilités depuis le collège — ce sont de vrais itinéraires en transports. Les
**distances en kilomètres**, en revanche, sont une **estimation** : distance à vol
d'oiseau multipliée par 1,3 pour approcher un tracé routier. Elles donnent un ordre
de grandeur, pas une mesure. Le README a longtemps parlé de « distance réelle » :
c'était faux, et c'est corrigé.
 
**Aucune donnée personnelle collectée par l'application.** Pas de compte, pas de
mot de passe, pas de cookie, pas de stockage local, pas d'adresse e-mail. Les
statistiques d'usage sont **anonymes** : deux champs, un type d'action et une
valeur, sans identifiant ni moyen de remonter à un élève (voir plus bas).

*Précision honnête :* comme tout site web, les serveurs sollicités reçoivent
techniquement l'adresse IP du visiteur. Ils sont désormais réduits à deux : **Netlify**
(hébergement) et **Google Forms** (statistiques anonymes, à la demande). Les polices
et jsPDF sont **hébergés localement** : plus aucune requête vers Google Fonts ni vers
un CDN. Une politique de sécurité de contenu stricte (`_headers`) interdit d'ailleurs
tout script d'origine tierce.

*Limite assumée :* les statistiques Google Forms sont **falsifiables** — n'importe qui
peut poster dans le formulaire. Elles sont **indicatives**, jamais décisionnelles.
 
---
 
## Architecture technique
 
Vanilla HTML / CSS / JavaScript. **Aucun framework, aucune étape de build, aucun
serveur.** Le site est entièrement statique et hébergé sur Netlify.
 
```
index.html                     Page unique, deux onglets
_headers                       En-têtes de sécurité Netlify (dont une CSP stricte)
├── styles/
│   ├── styles.css             Charte commune + voie professionnelle
│   ├── 2gt.css                Comparateur 2GT (+ règles d'impression)
│   └── fonts/                 7 fichiers .woff2 — @font-face local, aucun CDN
├── scripts/
│   ├── bdd_pro.js             Données voie pro : 18 secteurs, 81 formations, 188 offres
│   ├── dico_chatbot.js        Vocabulaire d'élève + distance de Levenshtein
│   ├── quiz_pro.js            10 questions, scoring normalisé
│   ├── app_pro.js             Assistant conversationnel, quiz, fiche de sortie
│   ├── bdd_gt.js              Données 2GT : 5 lycées, 23 codes vœux, 11 critères
│   ├── app_gt.js              Comparateur, génération de la liste de vœux
│   ├── export.js              Branchement du bouton de téléchargement
│   ├── pdf.js                 Génération des PDF (jsPDF), pour les deux onglets
│   ├── tabs.js                Bascule entre les onglets, remise à zéro via le logo
│   └── vendor/                jsPDF 4.2.1 (MIT) + sa licence
├── tools/                     Scripts Node — jamais chargés par le navigateur
│   ├── verifier-donnees.mjs        Cohérence des bases              (CI)
│   ├── verifier-coefficients.mjs   Coefficients vs fiche n°21       (CI)
│   ├── verifier-contrastes.mjs     Contrastes WCAG 2.1 AA           (CI)
│   ├── test-pdf.mjs                Génération réelle des deux PDF   (CI)
│   ├── test-parcours.mjs           Parcours utilisateur via jsdom   (CI)
│   ├── verifier-readme.mjs         Chiffres du README vs code        (CI)
│   └── eslint.config.mjs           Règle no-undef (variables non déclarées)
│   ├── calculer-distances.mjs      Géocodage → distances estimées
│   └── calculer-durees.mjs         API PRIM → temps de trajet
├── .github/workflows/
│   └── verifier-donnees.yml   Lance tous les contrôles ci-dessus à chaque commit

└── img/                       Logo, favicon
```

> **L'ordre des `<script>` dans `index.html` est contractuel.** Il n'y a pas de build :
> les fichiers communiquent par variables globales.
> `vendor/jspdf` → `bdd_pro` → `dico_chatbot` → `quiz_pro` → `app_pro` → `export` →
> `bdd_gt` → `app_gt` → `pdf` → `tabs`

**Dépendances**

| Dépendance | Rôle | Hébergement |
|---|---|---|
| [jsPDF](https://github.com/parallax/jsPDF) 4.2.1 (MIT) | Génération des PDF | **Local** (`scripts/vendor/`) — aucun CDN |
| Outfit, Space Mono (OFL) | Typographie | **Local** (`styles/fonts/`) — aucun CDN |
| Google Forms | Statistiques anonymes | Externe, à la demande |
| Web Speech API | Lecture vocale et dictée | Navigateur |
| jsdom | Tests uniquement — jamais livré au navigateur | `npm install` en CI |
 
### Structure des données 2GT — trois niveaux à ne jamais confondre
 
```js
{
  voeux: [ … ],           // Se DEMANDE sur Affelnet (code vœu officiel)
  horsAffelnet: [ … ],    // Dossier à part (ex. section sportive) — pas un vœu
  optionsSurPlace: [ … ]  // Se choisit APRÈS l'affectation, auprès du lycée
}
```
 
Cette distinction est le cœur de l'outil : une brochure de lycée mélange les trois,
l'application les sépare.
 
---
 
## Sources des données
 
Les données ne sont pas inventées : elles proviennent de documents officiels, cités
dans l'application et datés.
 
| Donnée | Source |
|---|---|
| Codes vœux Affelnet 2GT | Catalogue « Offres de formation post-3ᵉ », académie de Versailles — campagne 2026 |
| Carte des formations GT de l'Essonne | Fiche technique n° 16 (académie de Versailles) |
| Options et enseignements des lycées | CIO Évry-Courcouronnes (MAJ 16/04/2026) + sites des lycées |
| Coefficients Affelnet voie pro | **Fiche technique n° 21** — « Tableau des coefficients des évaluations par champs disciplinaires, palier 3ᵉ » (académie de Versailles). C'est la source qui **fait foi**. |
| Rattachement aux familles de métiers | DGESCO — « L'organisation de la classe de seconde professionnelle par famille de métiers » (mai 2024) |
| Coordonnées GPS des établissements | [Annuaire de l'Éducation nationale](https://data.education.gouv.fr) (API publique) |
| Temps de trajet | API PRIM / Île-de-France Mobilités, calculés depuis le collège |
 
⚠️ **Ces données évoluent chaque année.** Elles sont valables pour la **rentrée 2026**
et affichées sous réserve de modifications. L'application invite systématiquement
l'élève à confirmer auprès de son professeur principal ou de la PsyEN.
 
---
 
## Statistiques d'usage
 
L'application remonte des statistiques **anonymes** vers un formulaire Google, pour
mesurer son utilité réelle. Deux champs seulement : un **type d'action** et une
**valeur**. Aucune donnée personnelle, aucun identifiant, aucun moyen de remonter à
un élève.
 
| Type d'action | Déclenché quand… |
|---|---|
| `domaine` / `formation` / `etablissement` | Une fiche pro est affichée |
| `quiz_lance` | L'élève **clique** sur « faire le quiz » |
| `quiz_resultat` | Une piste du quiz est consultée (la première seulement) |
| `2gt_voeux` | L'élève choisit un mode de classement en 2GT |

Ouvrir la page ou changer d'onglet n'envoie rien.

> **Correction d'une affirmation erronée.** Ce README a longtemps prétendu que les
> statistiques n'étaient « jamais envoyées au clic ». C'est faux : `quiz_lance` part
> précisément au clic sur le bouton d'aide — c'est même tout son intérêt, puisqu'il
> mesure *combien d'élèves se déclarent perdus*, y compris ceux qui abandonnent le
> quiz en route. Le dire autrement revenait à masquer une mesure derrière une
> promesse de sobriété qu'on ne tenait pas.

**Ces chiffres sont falsifiables.** Le formulaire est public : n'importe qui peut y
poster. Ils servent à savoir si l'outil est utilisé, pas à fonder une décision.
 
---
 
## Développement local
 
Aucune installation nécessaire :
 
```bash
git clone https://github.com/Einstein1987/TrouveTaVoie.git
cd TrouveTaVoie
python3 -m http.server 8000   # ou n'importe quel serveur statique
```
 
Puis ouvrir <http://localhost:8000>.

### Valider avant de livrer

Cinq contrôles, lancés à chaque commit par GitHub Actions. **Ils ne sont pas
décoratifs : chacun existe parce qu'un vrai défaut est passé au travers.**

```bash
npm install jsdom                    # une seule fois

node --check scripts/*.js            # syntaxe
npx eslint scripts/                  # variables non déclarées (no-undef)
node tools/verifier-donnees.mjs      # cohérence des bases
node tools/verifier-coefficients.mjs # coefficients vs fiche n°21 + familles
node tools/verifier-contrastes.mjs   # contrastes WCAG 2.1 AA
node tools/test-pdf.mjs              # génération réelle des deux PDF
node tools/test-parcours.mjs         # parcours utilisateur dans un vrai DOM
node tools/verifier-readme.mjs       # ce README correspond-il au code ?
```

| Contrôle | Ce qu'il a rattrapé |
|---|---|
| `test-parcours` | Une fonction supprimée mais encore appelée : `node --check` passait, et **toute la voie pro était cassée en production**. |
| `verifier-coefficients` | 18 coefficients faux — 13 CAP portaient ceux de leur *secteur*. |
| `verifier-contrastes` | Le bouton d'aide à **2,54:1** sur blanc (seuil AA : 4,5:1) — illisible pour les élèves les plus perdus, précisément ceux qu'il vise. |
| `test-pdf` | Le PDF n'était testé par **rien**. C'est ce trou qui a bloqué la mise à jour de jsPDF pendant des mois. |
| `eslint` (no-undef) | Un `body = …` sans `let` : `node --check` et jsdom (non stricts) laissaient passer, le navigateur plantait. Le classement 2GT était cassé en production. |

> **`node --check` ne voit pas tout.** Une syntaxe valide n'est pas une application
> qui fonctionne. C'est pour cette raison que `test-parcours.mjs` charge la page dans
> un vrai DOM (jsdom) et clique comme le ferait un élève.

**Le pire défaut est celui qui donne une impression de protection.** Un fichier
d'en-têtes sans directive CSP ; un validateur qui cherchait `f.coefficients` au lieu
de `f.coeffs` et ne vérifiait donc **aucun** coefficient. Les deux ont existé ici.
Chaque validateur de ce dépôt a été testé **en le faisant échouer volontairement**.

### Mise à jour annuelle
 
1. **Codes vœux 2GT** → récupérer le nouveau catalogue Affelnet, mettre à jour
   `bdd_gt.js`.
2. **Options des lycées** → vérifier auprès du CIO et des établissements.
3. **Distances et trajets** → relancer le script de calcul (géocodage via l'Annuaire
   de l'Éducation nationale).
4. **Coefficients** → vérifier la publication académique de l'année.
---
 
## Licence

Le **code** est publié sous licence [GNU AGPL-3.0](LICENSE).

Vous êtes libre de l'utiliser, de l'étudier, de le modifier et de le redistribuer.
En contrepartie, **toute version modifiée doit rester libre** — y compris si elle
est simplement *hébergée* et proposée en ligne, sans être distribuée. C'est la
particularité de l'AGPL par rapport à la GPL classique, et c'est ce qui garantit
que les adaptations de TrouveTaVoie (pour un autre collège, un autre bassin, une
autre académie) reviennent à la communauté éducative plutôt que de se refermer.

Concrètement : si vous adaptez cette application et la mettez en ligne pour vos
élèves, vous devez publier votre code source.

Les **données** (codes vœux Affelnet, coefficients, listes d'établissements)
proviennent de sources publiques de l'Éducation nationale. Elles ne sont pas
couvertes par cette licence et restent soumises aux conditions de leurs
producteurs respectifs.

**Dépendances tierces :**

- [jsPDF](https://github.com/parallax/jsPDF) 4.2.1, licence **MIT** — compatible AGPL.
  Sa licence est conservée dans `scripts/vendor/jspdf-LICENSE.txt`.
- Polices **Outfit** et **Space Mono**, sous *SIL Open Font License 1.1* — compatible
  AGPL, y compris en hébergement local. ⚠️ *Le fichier de licence n'est pas encore
  joint aux `.woff2` de `styles/fonts/` : c'est une obligation de l'OFL, à corriger.*

---

## Auteur
 
**Jérémy Violette** — professeur de physique-chimie, référent numérique,
collège La Nacelle (Corbeil-Essonnes).
 
Les retours, corrections de données et suggestions sont les bienvenus :
ouvrez une [issue](https://github.com/Einstein1987/TrouveTaVoie/issues).
