# Leadflux

Agent de prospection commercialisable par OxIAgen : sourcing de leads B2B puis
génération d'emails de prospection personnalisés pour les clients d'OxIAgen.
Inspiré du workflow n8n "LEAD 2.0" de NAIOM, repensé avec un mode brouillon
systématique (aucun envoi automatique) et une passe d'humanisation du texte
avant validation humaine.

Le modèle de données (prospects, emails, statuts) n'est pas encore figé : ce
dépôt contient pour l'instant le scaffold technique de base.

## Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript, Tailwind CSS)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- Gestionnaire de paquets : pnpm

## Prérequis

- Node.js >= 20
- pnpm (`corepack enable` ou `npm install -g pnpm`)
- Docker (pour PostgreSQL en local)

## Démarrage

```bash
# 1. Copier le template d'environnement et ajuster si besoin
cp .env.example .env.local

# 2. Lancer PostgreSQL en local
docker compose up -d

# 3. Installer les dépendances
pnpm install

# 4. Appliquer le schéma Drizzle
pnpm db:generate
pnpm db:migrate

# 5. Lancer le serveur de développement
pnpm dev
```

Le site est alors disponible sur http://localhost:3000.

## Scripts disponibles

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement Next.js |
| `pnpm build` | Build de production |
| `pnpm start` | Démarre le build de production |
| `pnpm lint` | Lint ESLint |
| `pnpm db:generate` | Génère les migrations Drizzle à partir de `db/schema.ts` |
| `pnpm db:migrate` | Applique les migrations sur la base PostgreSQL |
| `pnpm db:studio` | Ouvre Drizzle Studio pour explorer la base |

## Structure

```
site/
├─ app/                 # Routes Next.js (App Router)
├─ db/
│  ├─ schema.ts         # Schéma Drizzle (placeholder)
│  ├─ index.ts          # Client DB (drizzle + postgres-js)
│  └─ migrations/       # Migrations générées par drizzle-kit
├─ drizzle.config.ts    # Config drizzle-kit
├─ docker-compose.yml   # PostgreSQL local
├─ .env.example         # Template des variables d'environnement
└─ .env.local           # Variables réelles (jamais commité)
```

## Agent dédié

Le développement de ce site est piloté par l'agent Claude Code
`mon-dev-leadflux` (`.claude/agents/mon-dev-leadflux.md` à la racine du
Cowork). Invoquer cet agent pour toute intervention sur la partie site.
