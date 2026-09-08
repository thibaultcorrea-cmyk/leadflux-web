# Leadflux

Agent de prospection commercialisable par OxIAgen : sourcing de leads B2B puis
génération d'emails de prospection personnalisés pour les clients d'OxIAgen.
Inspiré du workflow n8n "LEAD 2.0" de NAIOM, repensé avec un **mode brouillon
systématique** (aucun envoi automatique) et une passe d'humanisation du texte
avant validation humaine.

## Fonctionnalités

- **Tableau** — vue d'ensemble (widget « Par secteur », dernières recherches,
  activité récente) et point d'entrée du bouton « Nouvelle recherche ».
- **Recherche** — pas un onglet mais une action : modale à 5 critères
  (secteur, localisation, poste, taille, chiffre d'affaires), ouverte depuis
  le Tableau, la page de résultats ou la barre de critères.
- **Prospects** — liste des leads sourcés, sélection multiple, action
  groupée « Prospecter la sélection ».
- **Emails** — l'onglet le plus travaillé, structuré par **statut par
  prospect** (Brouillon à valider / Validé et envoyé / A répondu), jamais par
  historique d'envoi ni par taux d'envoi :
  - aperçu d'un email avec navigation Annuler/Rétablir entre les générations
    successives conservées (chaque régénération est versionnée) ;
  - édition inline du contenu HTML (éditeur riche Tiptap) directement depuis
    l'aperçu ou depuis la fiche email, avec mise à jour serveur immédiate ;
  - régénération d'un brouillon et revue séquentielle avant validation
    groupée (garde-fou : jamais d'envoi en un clic sans relecture).
- **Authentification** — Better Auth, deux rôles seulement (`admin` /
  `client`), pas d'auto-inscription (compte créé par l'admin), reset de mot
  de passe par email.
- **Détection de réponse** — mécanisme IMAP (`features/imap`) capable de
  chercher un message dans une boîte, brique de base pour faire transiter un
  email vers le statut « A répondu ». Pas encore câblé à un déclencheur
  (cron, webhook n8n…) : l'articulation site / workflow n8n reste un point
  ouvert (CLAUDE.md §8, point 1). Testé en local contre une boîte de test
  jetable (service `greenmail`).
- **Mode brouillon systématique** — aucun envoi automatique à aucun moment :
  tout email généré ou modifié reste en brouillon jusqu'à validation humaine
  explicite.

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router, TypeScript, Tailwind CSS v4)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/) (email + mot de passe, rôles
  admin/client)
- API [GraphQL](https://graphql.org/) (Apollo Server + `drizzle-graphql`)
- [TanStack Query](https://tanstack.com/query) et
  [TanStack Table](https://tanstack.com/table) pour l'état serveur et les
  tableaux
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
  pour les formulaires
- [Tiptap](https://tiptap.dev/) pour l'édition de contenu HTML riche
- [shadcn/ui](https://ui.shadcn.com/) retokenisé sur la DA OxIAgen
- [Vitest](https://vitest.dev/) (tests unitaires) et
  [Playwright](https://playwright.dev/) (tests e2e)
- Gestionnaire de paquets : pnpm

## Prérequis

- Node.js >= 20
- pnpm (`corepack enable` ou `npm install -g pnpm`)
- Docker (pour PostgreSQL et les services de test email en local)

## Variables d'environnement

Copier `.env.example` en `.env.local` puis renseigner les valeurs. `.env.local`
n'est jamais commité.

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Connexion PostgreSQL (alignée sur `docker-compose.yml` en local) |
| `NODE_ENV` | Environnement d'exécution |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app |
| `BETTER_AUTH_SECRET` | Secret de signature Better Auth |
| `BETTER_AUTH_URL` | URL de base servie à Better Auth |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` / `ADMIN_IMAGE_URL` | Compte admin créé par `pnpm db:seed` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` / `SMTP_FROM_ALIAS` | Envoi SMTP applicatif (en local : service `maildev`, catch-all, sans auth réelle) |
| `IMAP_HOST` / `IMAP_PORT` / `IMAP_USER` / `IMAP_PASS` / `IMAP_SECURE` | Boîte IMAP applicative réelle, lue par `features/imap` pour la détection de réponse. Pas d'équivalent `docker-compose` dédié : pour tester en local, pointer sur `greenmail` (`IMAP_PORT=3143`, `IMAP_SECURE=false`, identifiants alignés sur `SMTP_USER`/`SMTP_PASS`) |
| `IMAP_TEST_HOST` / `IMAP_TEST_PORT` / `IMAP_TEST_USER` / `IMAP_TEST_PASS` | Boîte IMAP/SMTP de test (service `greenmail`), réservée à la preuve de détection de réponse |
| `JENKINS_ADMIN_ID` / `JENKINS_ADMIN_PASSWORD` | Compte admin du service `jenkins`, provisionné via Configuration as Code (voir section Déploiement) |

## Démarrage

```bash
# 1. Copier le template d'environnement et ajuster si besoin
cp .env.example .env.local

# 2. Lancer PostgreSQL et les services de test email en local
docker compose up -d

# 3. Installer les dépendances
pnpm install

# 4. Appliquer le schéma Drizzle
pnpm db:generate
pnpm db:migrate

# 5. Créer le compte admin (ADMIN_* de .env.local)
pnpm db:seed

# 6. Lancer le serveur de développement
pnpm dev
```

Le site est alors disponible sur http://localhost:3000.

## Services `docker-compose`

| Service | Rôle | Accès |
|---|---|---|
| `postgres` | Base de données applicative | `localhost:5432` |
| `maildev` | Capture tout email sortant de l'app (mode brouillon/test), une seule UI catch-all | UI http://localhost:1080, SMTP `1025` |
| `greenmail` | Boîte IMAP/SMTP de test dédiée à la détection de réponse (`features/imap/tests/imap-reply-detection.e2e.ts`), éphémère, sans persistance | SMTP `3025`, IMAP `3143`, API REST `8080` |
| `roundcube` | Webmail pour consulter la boîte `greenmail` à la main | http://localhost:8334 |
| `jenkins` | CI/CD : build + run de l'image app sur push `main` (cf. section Déploiement). Image custom (`dependencies/jenkins/Dockerfile`) avec le CLI docker, socket hôte monté (Docker-outside-of-Docker) | UI http://localhost:8180 |

## Scripts disponibles

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement Next.js |
| `pnpm build` | Build de production |
| `pnpm start` | Démarre le build de production |
| `pnpm lint` | Lint ESLint |
| `pnpm db:generate` | Génère les migrations Drizzle à partir de `db/schemas/` |
| `pnpm db:migrate` | Applique les migrations sur la base PostgreSQL |
| `pnpm db:drop` | Supprime une migration Drizzle générée |
| `pnpm db:sync` | `db:generate` puis `db:migrate` |
| `pnpm db:seed` | Crée le compte admin à partir des variables `ADMIN_*` |
| `pnpm db:studio` | Ouvre Drizzle Studio pour explorer la base |
| `pnpm test` | Tests unitaires Vitest (`*.test.ts`) |
| `pnpm test:watch` | Tests unitaires Vitest en mode watch |

Tests e2e Playwright (`*.e2e.ts`, colocés dans les `tests/` de chaque page ou
feature) : `npx playwright test`.

## Structure

```
.
├─ app/
│  ├─ (public)/login/      # Connexion (Better Auth)
│  ├─ (private)/           # Tableau, Prospects, Emails — routes authentifiées
│  └─ api/
│     ├─ [...all]/         # Handler Better Auth
│     └─ v1/graphql/       # API GraphQL (Apollo Server + resolvers)
├─ features/                # Logique métier (dto/entities/repositories/services)
│  ├─ prospects/, search/, searchResults/  # sourcing et gestion des leads
│  ├─ emails/, emailVersions/              # emails, statuts, versions
│  ├─ agent/                               # génération de contenu par l'agent IA
│  ├─ smtp/                                # envoi d'email applicatif (nodemailer)
│  ├─ imap/                                # lecture de boîte pour la détection de réponse
│  ├─ stats/                               # KPIs et activité récente du Tableau
│  └─ users/                               # comptes et rôles
├─ components/
│  ├─ ui/          # primitives shadcn/ui
│  └─ shared/       # composants métier réutilisables entre pages
├─ db/
│  ├─ schemas/       # schéma Drizzle
│  ├─ seeds/         # seed du compte admin
│  ├─ migrations/    # migrations générées par drizzle-kit
│  └─ index.ts       # client DB (drizzle + postgres-js)
├─ lib/auth.ts, lib/auth-client.ts   # configuration Better Auth (serveur/client)
├─ drizzle.config.ts
├─ docker-compose.yml
├─ .env.example
└─ .env.local               # jamais commité
```

Convention de structure des pages (`app/`) et des features métier
(`features/`) détaillée dans `.claude/rules/convention-code.md` et
`.claude/rules/convention-code-metier.md`.

## Déploiement

**Cible d'hébergement pas encore actée** (CLAUDE.md §2 et §8, point 3) : ce
qui suit met en place le pipeline de build/run, pas l'endroit où il tourne
en prod. Pour l'instant l'app est exposée sur un simple port, sans reverse
proxy ni domaine.

- `Dockerfile` — build multi-stage (pnpm, Node 20), sortie `standalone` de
  Next.js (`next.config.ts`) pour une image minimale sans `node_modules`
  complet.
- `Jenkinsfile` — pipeline déclenché par un **webhook GitHub sur push
  `main`** (trigger `githubPush()`) : build de l'image puis (re)lancement du
  conteneur (`docker run`, port simple).

Mise en place d'une instance Jenkins (aucune existante à ce jour) :

1. Renseigner `JENKINS_ADMIN_ID` / `JENKINS_ADMIN_PASSWORD` dans `.env.local`,
   puis lancer le service `jenkins` du `docker-compose` (`pnpm docker:up`, ou
   `docker compose -f dependencies/docker-compose.yml --env-file .env up -d jenkins`
   pour ne démarrer que lui). Le socket Docker de l'hôte est monté dans le
   conteneur (Docker-outside-of-Docker) et l'image
   (`dependencies/jenkins/Dockerfile`) embarque le CLI docker par-dessus
   `jenkins/jenkins:lts` — nécessaire pour que le `Jenkinsfile` puisse
   `docker build`/`docker run`. L'image installe aussi les plugins requis
   (pipeline, Git, GitHub, credentials-binding) et provisionne le compte
   admin via Configuration as Code (`dependencies/jenkins/jenkins.yaml`) :
   pas d'assistant d'installation, pas de mot de passe généré aléatoirement
   à aller chercher dans le conteneur — se connecter directement sur
   http://localhost:8180 avec `JENKINS_ADMIN_ID`/`JENKINS_ADMIN_PASSWORD`.
2. Créer un job **Pipeline**, source SCM = ce repo, branche `*/main`,
   script depuis SCM (`Jenkinsfile` à la racine). Cocher « GitHub hook
   trigger for GITScm polling » dans les Build Triggers.
3. Sur le repo GitHub, ajouter un webhook vers
   `http://<host-jenkins>:8180/github-webhook/` (évènement `push`, port hôte
   du service `jenkins` — `8180` en local, cf. `docker-compose.yml`).
4. Créer une credential Jenkins de type **Secret file**, id
   `leadflux-web-env`, contenant les variables de prod (`DATABASE_URL`,
   `BETTER_AUTH_SECRET`, `SMTP_*`, `IMAP_*`…) — jamais commitées dans le
   repo. Le `Jenkinsfile` l'injecte au conteneur via `--env-file`.

Variables Jenkins optionnelles (valeurs par défaut sinon) : `CONTAINER_NAME`
(`leadflux-web`), `APP_PORT` (`3000`, port hôte exposé).

## Agent dédié

Le développement de ce site est piloté par l'agent Claude Code
`mon-dev-leadflux` (`.claude/agents/mon-dev-leadflux.md` à la racine du
Cowork). Invoquer cet agent pour toute intervention sur la partie site.
