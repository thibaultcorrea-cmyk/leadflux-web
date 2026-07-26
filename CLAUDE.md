# Leadflux (site) - Contexte projet

> Contexte spécifique au site web Leadflux. Le CLAUDE.md global d'OxIAgen (racine du Cowork)
> reste chargé par-dessus : identité, ton, règles de sécurité, conventions Next.js générales.
> Ce fichier ne répète pas ce qui y est déjà écrit, il ajoute ce qui est propre à Leadflux.
>
> Source de vérité produit : `../2026-07-14-recap-site-leadflux-pour-assadi.md`
> Source de vérité design : `./design.md`

---

## 1. Ce qu'est Leadflux

Agent de prospection commercialisable d'OxIAgen. Nom **tranché et définitif** (jamais "Leadflow").

Il permet à un client OxIAgen (PME structurée ou solopreneur qualifié) de :
1. Sourcer des leads B2B selon des critères (secteur, localisation, taille, poste, CA)
2. Générer un email de prospection personnalisé à partir d'une base de connaissance propre au client
3. Faire valider par un humain avant tout envoi

**Deux livrables distincts, à ne jamais confondre :**
- Le **workflow n8n** (moteur de sourcing + rédaction), sur `breath-n8n.com`. Itéré par Thibault.
- Le **site web** (interface client), objet de ce dossier. Développé avec Asadi.

---

## 2. Stack et état du chantier

| Élément | Valeur |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| CSS | Tailwind CSS v4 (`@theme inline`, pas de `tailwind.config.js`) |
| Composants UI | **shadcn/ui** (obligatoire, voir section 6), retokenisé sur la DA OxIAgen |
| ORM / DB | Drizzle ORM + PostgreSQL (Docker en local) |
| Auth | **Better Auth** (décision actée le 14/07/2026, ni Supabase ni auth Lovable) |
| Package manager | pnpm (Node >= 20) |
| Repo | `github.com/thibaultcorrea-cmyk/leadflux-web` (perso, privé, branche `main`) |

**État réel du code au 26/07/2026 :**
- Scaffold Next.js + Drizzle + Tailwind en place, build et lint passent
- `db/schema.ts` est encore un **placeholder** (table `health_check` uniquement).
  Le vrai modèle (prospects, emails, statuts, clients, comptes) reste à concevoir.
- `app/layout.tsx` contient encore les metadata par défaut de `create-next-app` (à corriger)
- Better Auth n'est **pas encore installé**
- shadcn/ui n'est **pas encore initialisé** (pas de `components.json`, pas de dossier
  `components/ui/`). Première étape avant tout travail d'UI : `pnpm dlx shadcn@latest init`,
  puis retokeniser le thème généré sur la palette de `design.md`.
- Aucune cible de déploiement ou d'hébergement tranchée

**Maquette** : `Macket_de_site.pen` (fichier Pencil, à ouvrir via les outils MCP `pencil`,
jamais avec Read ou Grep). Contient à ce jour l'écran **Connexion Desktop 1440**.

---

## 3. Structure du site : onglets et contenu

Structure issue de la concertation du 14/07/2026, pas une copie du frontend Lovable de référence.

| Onglet | Route prévue | Statut | Contenu / rôle |
|---|---|---|---|
| **Tableau** | `/tableau` | Conservé | Vue d'ensemble / dashboard. Contient un widget "Par secteur" |
| **Recherche** | `/recherche` | Conservé | Formulaire de critères de sourcing (secteur, localisation, poste, taille, CA), lance le sourcing Apify |
| **Prospects** | `/prospects` | Conservé | Liste des leads sourcés, sélection d'un lead pour lancer la rédaction d'email |
| **Emails** | `/emails` | Conservé, avec évolution | L'onglet le plus modifié. Voir détail ci-dessous |
| **Analyse** | - | **Supprimé** | Tableau détaillé par secteur/CA/taille jugé superflu pour l'ICP OxIAgen. Trop proche d'un outil BI. Le widget "Par secteur" du Tableau suffit |

Les routes ci-dessus sont une proposition de nommage cohérente avec les onglets. Elles ne sont
pas encore actées : à confirmer avec Thibault avant de créer les dossiers dans `app/`.

### Onglet Emails : la partie à construire avec le plus de soin

L'interface de référence supposait un envoi automatique ("Emails envoyés", KPI "Taux d'envoi").
C'est **contradictoire avec la décision produit de Leadflux** (mode brouillon systématique).

Décision actée : **pas d'onglet "Réponses" séparé**. Le suivi des réponses est intégré dans
l'onglet Emails, structuré par **statut par prospect** et non par historique d'envois :

- Brouillon à valider
- Validé et envoyé
- A répondu

C'est cette logique de statut qui structure l'onglet. Ne jamais réintroduire de compteur
"taux d'envoi" ou de KPI qui suppose un envoi automatique.

---

## 4. Logique métier non négociable

- **Mode brouillon systématique** : aucun envoi automatique d'email, à aucun moment. Tout email
  généré atterrit en brouillon Gmail (ou équivalent) et passe par une validation humaine.
  Même règle que sur l'agent `ma-secretaire-auto`.
- **Un PDF de connaissance par client** (pas de RAG ni de vector store en v1) : identité, offre,
  ICP, preuves, ton, CTA. Cahier des charges détaillé dans
  `../2026-07-12-cahier-des-charges-donnees-client.html`.
- **Stockage de ce PDF non tranché** (upload à chaque exécution vs stocké une fois et réutilisé).
  Ne pas construire d'interface définitive dessus sans validation de Thibault.

---

## 5. Authentification et rôles

Décisions du 14/07/2026, à respecter dans toute page ou route d'auth :

- **Deux rôles seulement** : `admin` (Thibault + Asadi) et `client` (les clients OxIAgen).
- **Pas de permissions fines en v1** : aucune distinction lecture seule / édition dans un rôle.
- **Pas d'auto-inscription.** L'admin crée le compte du client manuellement (email + mot de passe).
  Une page d'inscription publique serait une erreur produit, pas une amélioration.
- **Reset de mot de passe automatique par email**, prévu dès la v1.
- **Isolation des données reportée** : un seul espace de données partagé en v1, tous les comptes
  clients voient les mêmes prospects. **Dette technique connue et assumée par Thibault**, pas un
  oubli. À revoir obligatoirement avant d'onboarder un deuxième client actif, sinon contradiction
  avec la règle d'isolation stricte des données clients (`.claude/rules/security.md`).

---

## 6. Design et identité visuelle

`design.md` (à la racine de ce dossier) est la référence complète : palette étendue, échelle
typographique, spacing, composants, anti-patterns. À lire avant toute création d'UI.

Rappel des 4 couleurs de marque, jamais à modifier :

| Rôle | Hex | Usage |
|---|---|---|
| Primaire (Violet Cramoisi) | `#43142A` | Titres, fonds sombres, nav, footer |
| Secondaire (Mauve Poussiéreux) | `#8E6B7A` | Décoratif, bordures, icônes. **Jamais du texte < 18px** |
| Fond (Porcelaine) | `#FFFCF7` | Fond de page |
| Accent (Harvest Gold) | `#D89727` | Boutons primaires, liens actifs |

**Typo** : League Gothic pour les titres (jamais du texte courant, jamais de faux gras),
Playfair Display pour l'accroche éditoriale, Inter pour toute l'UI dense (formulaires, tableaux,
footer légal).

**Correction de contraste appliquée le 26/07/2026** : le snippet "bouton primaire" de `design.md`
prescrit du texte blanc sur `#D89727`, soit 2,6:1, sous le minimum WCAG AA. Utiliser le texte en
`ink-900` (`#23181C`) sur le doré, soit 6,6:1. Même règle pour les liens dorés sur fond clair :
`accent-700` (`#946315`), jamais `accent-500`.

### Règle UI : toujours partir de shadcn/ui

**Tout composant d'interface se construit à partir de shadcn/ui.** Ce n'est pas une suggestion,
c'est la règle par défaut du projet. Ne jamais réinventer un composant qui existe déjà dans le
registre shadcn (bouton, champ, carte, dialogue, tableau, onglets, menu, toast, etc.).

Le partage des rôles est net :

| Ce qui vient de shadcn | Ce qui vient de la DA OxIAgen |
|---|---|
| Structure du composant et sémantique HTML | Couleurs, typo, radius, ombres |
| Comportements et états (focus, hover, disabled, loading, erreur) | Intensité et discrétion des effets |
| Accessibilité (Radix : rôles ARIA, navigation clavier, focus trap) | Le "premium accessible", pas de néon ni de 3D |
| Patterns de formulaire (label visible au-dessus, erreur sous le champ, toggle mot de passe) | Le ton des libellés et des messages |

Autrement dit : **shadcn décide de la mécanique, la DA décide de l'apparence.** Ne jamais livrer
un écran avec le thème shadcn par défaut (gris neutres, `zinc`), il faut le retoken sur la palette
de `design.md`.

**Serveur MCP shadcn** : défini dans `.mcp.json` à la racine de ce dossier.

```json
{ "mcpServers": { "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] } } }
```

Il faut lancer Claude Code **depuis `site/`** pour qu'il soit chargé, et approuver le serveur au
démarrage. Une fois actif, l'utiliser pour chercher le composant et son exemple officiel **avant**
d'écrire du code d'UI, plutôt que d'écrire un composant de mémoire. Le skill `ui-ux-pro-max`
s'appuie aussi sur ce MCP.

Ordre de travail sur toute nouvelle UI :
1. Chercher le composant dans le MCP shadcn (structure et exemple de référence)
2. L'installer via la CLI shadcn plutôt que de le recopier à la main
3. Appliquer les tokens de `design.md` (jamais de hex brut dans le composant)
4. Vérifier la checklist accessibilité de la section 6 de `design.md`

---

## 7. Conventions de code propres à ce dossier

- App Router uniquement (`app/`), jamais `pages/`
- Composants d'UI : toujours shadcn/ui en base (cf. section 6). Jamais de composant maison quand
  l'équivalent existe dans le registre. Les primitives shadcn vivent dans `components/ui/`, les
  composants métier Leadflux dans `components/`
- Un composant par section, en `.tsx`
- Tokens de la DA en CSS variables via `@theme inline` dans `app/globals.css`, jamais de hex brut
  dans un composant
- Fonts via `next/font/google` (Playfair Display, Inter) et `next/font/local` pour League Gothic
- Images statiques dans `public/images/`
- Variables d'env dans `.env.local`, jamais commitées, jamais hardcodées
- Migrations Drizzle générées (`pnpm db:generate`) puis appliquées (`pnpm db:migrate`), jamais
  de SQL écrit à la main dans `db/migrations/`

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` / `pnpm lint` | Build et lint (doivent passer avant tout commit) |
| `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio` | Drizzle |
| `docker compose up -d` | PostgreSQL local |

---

## 8. Points ouverts : ne rien implémenter dessus sans validation

1. **Articulation workflow n8n / site** : le site remplace-t-il le pilotage par webhook, vient-il
   par-dessus, ou les deux en parallèle ? Aucune décision à ce jour.
2. **Retour de pgvector** : le brief du 12/07 avait tranché "PDF par client plutôt que RAG".
   L'image `pgvector/pgvector:pg16` choisie le 14/07 semble revenir dessus. Sans réponse.
3. **Hébergement PostgreSQL** : même VPS Hostinger que n8n ou ailleurs ? Rappel : ce VPS n'a
   **aucune sauvegarde récurrente**. Si des identifiants clients y vivent, la sauvegarde
   automatique est un prérequis de mise en prod, pas une option.
4. **Relation entre `site/` et `../web/`** : même chantier ou deux approches parallèles ?
5. **Stockage du PDF de connaissance client** (cf. section 4).
6. **Sourcing Apify** : tel quel, ou à revoir avec une clé Apify propre à OxIAgen ?
7. **Envoi 100% automatique réservé à l'usage interne OxIAgen** : à trancher, ou brouillon partout
   sans exception.
8. **Modèle Drizzle réel** : à concevoir à partir des sections 3 et 5.

---

## 9. Ordre de construction suggéré

Proposition d'ordre, à valider avec Thibault et Asadi, pas une décision actée :

1. Modèle de données Drizzle (prospects, emails avec statut, clients, comptes)
2. Auth Better Auth (rôles admin/client, création de compte par l'admin, reset mot de passe email)
3. Onglet Tableau (dashboard + widget "Par secteur")
4. Onglet Recherche (formulaire de critères)
5. Onglet Prospects (liste, sélection pour rédaction)
6. Onglet Emails (le plus complexe : les 3 statuts, aucun KPI d'envoi)
7. Interface de gestion du PDF de connaissance (bloqué par le point 5 de la section 8)
8. Intégration workflow n8n (bloqué par le point 1 de la section 8)

---

## 10. Agent dédié

Le développement de ce site est piloté par l'agent Claude Code **`mon-dev-leadflux`**
(`.claude/agents/mon-dev-leadflux.md` à la racine du Cowork). L'invoquer pour toute
intervention sur le site.

---

## 11. Documents de référence

- `../2026-07-14-recap-site-leadflux-pour-assadi.md` : récap produit et structure (source de ce fichier)
- `../2026-07-12-brief-leadflux.md` : brief complet du projet
- `../2026-07-12-cahier-des-charges-donnees-client.html` : données du PDF de connaissance client
- `./design.md` : design system complet
- `./Macket_de_site.pen` : maquettes (outils MCP `pencil` uniquement)
