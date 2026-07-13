# TrouveTaVoie

**Application web d'aide à l'orientation pour les élèves de 3ᵉ.**
Développée pour le collège La Nacelle (Corbeil-Essonnes, Essonne) — académie de Versailles.
 
🔗 [Accéder à l'application](https://trouvetavoie-3e.netlify.app)
 
---
 
## Ce que fait l'application
 
Après la 3ᵉ, un élève doit formuler des vœux sur **Affelnet**. Deux situations très
différentes, donc deux outils :
 
### 🔧 Voie professionnelle — un assistant conversationnel
 
L'élève ne sait pas toujours ce qui existe. L'espace est vaste : 15 familles de
métiers, des dizaines de bacs pro et de CAP, une trentaine de lycées dans l'Essonne.
L'application propose donc un **dialogue guidé**, avec quatre portes d'entrée :
 
- il connaît déjà la formation qu'il veut ;
- il connaît la famille de métiers ou le domaine ;
- il connaît un lycée et veut voir ce qu'on y propose ;
- **il est perdu** → un quiz le guide par élimination.
En sortie, une fiche personnelle : la formation, les **coefficients Affelnet**
correspondants, la liste des établissements publics de l'Essonne qui la proposent,
avec pour chacun la **distance et le temps de trajet réels depuis le collège**.
 
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
 
**Aucune donnée personnelle collectée par l'application.** Pas de compte, pas de
mot de passe, pas de cookie, pas de stockage local, pas d'adresse e-mail. Les
statistiques d'usage sont **anonymes** : deux champs, un type d'action et une
valeur, sans identifiant ni moyen de remonter à un élève (voir plus bas).

*Précision honnête :* comme tout site web, les serveurs sollicités (Netlify pour
l'hébergement, Google pour le formulaire de statistiques et — pour l'instant — les
polices) reçoivent techniquement l'adresse IP du visiteur. L'application ne
l'exploite pas et n'y a pas accès. L'internalisation des polices, prévue, supprimera
la dernière requête non indispensable vers un tiers.
 
---
 
## Architecture technique
 
Vanilla HTML / CSS / JavaScript. **Aucun framework, aucune étape de build, aucun
serveur.** Le site est entièrement statique et hébergé sur Netlify.
 
```
index.html                 Page unique, deux onglets
├── styles/
│   ├── styles.css         Charte commune + voie professionnelle
│   └── 2gt.css            Comparateur 2GT (+ règles d'impression)
├── scripts/
│   ├── bdd_pro.js         Données voie pro : 15 domaines, formations, lycées, coefficients
│   ├── app_pro.js         Assistant conversationnel, quiz, fiche de sortie
│   ├── bdd_gt.js          Données 2GT : 5 lycées, 23 codes vœux Affelnet
│   ├── app_gt.js          Comparateur, génération de la liste de vœux
│   ├── tabs.js            Bascule entre les deux onglets, reset via le logo
│   ├── pdf.js             Génération des PDF (jsPDF), pour les deux onglets
│   └── export.js          Branchement du bouton de téléchargement
└── img/                   Logo, favicon
```
 
**Dépendances**

| Dépendance | Rôle | Hébergement |
|---|---|---|
| [jsPDF](https://github.com/parallax/jsPDF) 2.5.1 (MIT) | Génération des PDF | **Local** (`scripts/vendor/`) — aucun CDN |
| Google Fonts (Outfit, Space Mono) | Typographie | Externe ⚠️ *(à internaliser)* |
| Google Forms | Statistiques anonymes | Externe, à la demande |
| Web Speech API | Lecture vocale et dictée | Navigateur |
 
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
| Coefficients Affelnet voie pro | Académie de Versailles |
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
| `domaine` / `formation` / `etablissement` | Une fiche pro est confirmée |
| `quiz_lance` / `quiz_resultat` | Le quiz démarre / son résultat est accepté |
| `2gt_voeux` | Une liste de vœux 2GT est générée |
 
Une ligne par **usage abouti** — jamais au clic, jamais à l'ouverture d'un onglet.
Une simple exploration ne produit rien.
 
---
 
## Développement local
 
Aucune installation nécessaire :
 
```bash
git clone https://github.com/Einstein1987/TrouveTaVoie.git
cd TrouveTaVoie
python3 -m http.server 8000   # ou n'importe quel serveur statique
```
 
Puis ouvrir <http://localhost:8000>.
 
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

**Dépendance :** [jsPDF](https://github.com/parallax/jsPDF), sous licence MIT —
compatible avec l'AGPL. Sa licence est conservée dans `scripts/vendor/`.

---

## Auteur
 
**Jérémy Violette** — professeur de physique-chimie, référent numérique,
collège La Nacelle (Corbeil-Essonnes).
 
Les retours, corrections de données et suggestions sont les bienvenus :
ouvrez une [issue](https://github.com/Einstein1987/TrouveTaVoie/issues).
