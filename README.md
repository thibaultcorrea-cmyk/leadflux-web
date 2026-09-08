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

## Agent dédié

Le développement de ce site est piloté par l'agent Claude Code
`mon-dev-leadflux` (`.claude/agents/mon-dev-leadflux.md` à la racine du
Cowork). Invoquer cet agent pour toute intervention sur la partie site.
