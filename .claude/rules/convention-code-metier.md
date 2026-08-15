# Convention de structure du code métier (`features/`) — OBLIGATOIRE

**Chaque agent doit consulter et appliquer cette convention avant de créer ou modifier une
feature dans `features/`.** Elle complète `convention-code.md` (structure des pages `app/`) :
celle-ci couvre le côté page/UI, celle-ci couvre le côté logique métier/backend.

Référence canonique : `features/search/` et `features/prospects/`. En cas de doute, s'aligner
sur ces deux features plutôt que sur `features/users/`, plus ancienne et pas encore mise à
niveau (voir section 7).

---

## 1. Arborescence obligatoire

Une feature métier = un dossier dans `features/`. Toute feature créée ou modifiée doit
respecter cette arborescence :

```
features/ma-feature/
├── dto/
│   ├── schema.ts          # schémas Zod (entité + DTOs d'entrée) et leurs types inférés
│   └── validator.ts       # objet regroupant les fonctions de validation (safeParse)
├── entities/
│   ├── type.ts             # types bruts externes (réponse API tierce, payload source)
│   ├── repository.ts       # contrats des repositories (interfaces read/write)
│   └── services.ts         # contrat du service (type de l'objet exposé par services.ts)
├── repositories/
│   ├── read.ts             # implémentation concrète du contrat de lecture (Drizzle)
│   └── write.ts            # implémentation concrète du contrat d'écriture (Drizzle)
├── mocks/                  # données/fonctions de simulation pour sources pas encore branchées
└── services.ts             # point d'entrée métier : orchestration, règles, appels repositories
```

Ne créer un sous-dossier que s'il a du contenu (pas de dossier vide). Dès qu'un schéma, un
contrat, une implémentation ou un mock existe, il va dans le bon fichier — jamais en vrac
dans `services.ts`.

---

## 2. Rôle de chaque couche

### `dto/schema.ts`
Schémas Zod uniquement. Deux familles à distinguer dans le même fichier :
- **Schéma d'entité** (`ProspectSchema`) : forme de l'objet métier tel qu'il circule dans
  l'app. Type exporté avec le même nom que le schéma, sans suffixe (`Prospect`).
- **DTOs d'entrée** (`createSearchProspectsSchema`, `criterialSchema`) : forme des données
  reçues en entrée d'une opération de service. Type exporté en suffixant `Dto`
  (`CreateSearchProspectsDto`).

Toujours exporter le type via `z.infer<typeof leSchema>`, jamais retapé à la main.

### `dto/validator.ts`
Un seul objet exporté, nommé `<feature>Validator`, qui regroupe une fonction par schéma
(`validate`, `validateCriterial`, …). Chaque fonction se contente d'appeler
`leSchema.safeParse(data)` et de retourner le résultat brut — **ne jamais throw ici**. C'est
à l'appelant (`services.ts`) de décider quoi faire d'un échec de validation.

### `entities/type.ts`
Types TypeScript bruts qui ne nous appartiennent pas : forme d'une réponse d'API tierce, d'un
payload source non normalisé (`LeadFinderApiResponse`). Pas de Zod ici — ce ne sont pas des
données qu'on valide, mais des contrats externes qu'on subit.

### `entities/repository.ts`
Contrats des repositories, en interfaces séparées lecture/écriture :
`I<Feature>ReadRepository` et `I<Feature>WriteRepository`. Les méthodes se typent contre les
types Drizzle inférés dans `@/db/schemas` — jamais un type retapé à la main :
- lecture / update : `<Table>SqlInfer` (= `typeof table.$inferSelect`)
- création : `<Table>SqlInsert` (= `typeof table.$inferInsert`)

Ces deux types (`SqlInfer` / `SqlInsert`) doivent déjà exister dans le fichier de schéma
Drizzle correspondant (`db/schemas/<table>.ts`) — les y ajouter s'ils manquent, ne pas les
redéfinir dans la feature.

### `entities/services.ts`
Contrat du service : un type `<Feature>Services` qui déclare la forme publique que
`services.ts` doit implémenter (`create`, `collections`, `update`, `delete`,
`deleteMany`, `clear`, …). Ce fichier fixe l'interface avant l'implémentation — même
si les types internes restent `any` en attendant que la feature soit stabilisée.

Nommage à respecter : `deleteMultiple` est remplacé par `deleteMany` partout (service et
repository). `truncate` en revanche ne change qu'au niveau du service, où il devient `clear`
(le nom exposé à l'appelant) ; la méthode de repository sous-jacente garde `truncate`, qui
décrit l'opération SQL réelle (voir `features/search/`, référence de ce renommage).

### `repositories/read.ts` et `repositories/write.ts`
Implémentations concrètes des interfaces d'`entities/repository.ts`, nommées
`<Feature>ReadRepositoriesImpl` et `<Feature>WriteRepositoriesImpl`, typées explicitement
contre le contrat (`: I<Feature>ReadRepository`). **C'est la seule couche autorisée à
importer `@/db`.** Une méthode pas encore branchée doit throw
`new Error("Method not implemented.")` plutôt que d'être omise : l'interface reste la seule
source de vérité de ce que le repository supportera à terme.

### `mocks/`
Données ou fonctions de simulation pour tout ce qui n'est pas encore branché à une vraie
source (API tierce, seed de dev). Une fonction de mock qui simule un appel réseau doit
respecter la forme async de la vraie fonction qu'elle remplacera (voir `LeadFinderMock`,
qui retourne une `Promise` avec un délai simulé) : le jour où le mock est remplacé par
l'appel réel, `services.ts` ne doit pas changer de forme.

### `services.ts` (racine de la feature)
Couche d'orchestration et de règles métier. **C'est la seule couche que le reste de
l'app (routes, server actions, pages) est autorisé à importer.** Responsabilités :
1. Valider les entrées via `dto/validator.ts`, et throw l'erreur Zod si `success` est `false`.
2. Résoudre le contexte utilisateur via le service dédié (`UserServices.getCurrentUser()`),
   jamais en accédant directement à la session ou à une autre feature en dur.
3. Appeler les repositories `read`/`write` — jamais Drizzle (`db`) directement depuis
   `services.ts`.
4. Appliquer les règles métier et le mapping de données via des fonctions "factory" privées,
   non exportées (ex. `criteriaEmployeeRangeFactory`, `leadsApiToProspectFactory`).

Objet exporté nommé `<Feature>ServicesImpl`, typé contre le contrat d'`entities/services.ts`.

---

## 3. Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Schéma d'entité | `<Nom>Schema` / type `<Nom>` | `ProspectSchema` / `Prospect` |
| Schéma DTO d'entrée | `<action><Nom>Schema` / type `<Action><Nom>Dto` | `createSearchProspectsSchema` / `CreateSearchProspectsDto` |
| Validator | `<feature>Validator` | `searchProspectsValidator` |
| Interface repository lecture | `I<Feature>ReadRepository` | `ISearchReadRepository` |
| Interface repository écriture | `I<Feature>WriteRepository` | `ISearchWriteRepository` |
| Implémentation repository | `<Feature>ReadRepositoriesImpl` / `<Feature>WriteRepositoriesImpl` | `SearchWriteRepositoriesImpl` |
| Contrat de service | `<Feature>Services` | `SearchServices` |
| Implémentation de service | `<Feature>ServicesImpl` | `SearchProspectsServicesImpl` |
| Type Drizzle (lecture) | `<Table>SqlInfer` | `SearchesSqlInfer` |
| Type Drizzle (écriture) | `<Table>SqlInsert` | `SearchesSqlInsert` |

Toujours des **objets plats exportés en `const`**, jamais de classe : repositories et
services s'écrivent comme des littéraux d'objet typés contre une interface, pas comme des
instances.

---

## 4. Règles transverses

1. **Réutilisation d'abord** : avant d'ajouter une méthode de repository ou un DTO, vérifier
   qu'un équivalent générique n'existe pas déjà dans une autre feature ou dans `core/`.
2. **Une feature ne touche pas au repository d'une autre feature.** Si `search` a besoin de
   données `users`, il passe par `UserServices`, jamais par `UserReadRepository` en direct.
3. **Aucun accès direct à `@/db` en dehors de `repositories/read.ts` et
   `repositories/write.ts`.**
4. **Aucun `fetch` ni appel externe dans `services.ts`** tant que la source réelle n'est pas
   branchée : passer par `mocks/`, remplacé ensuite sans changer la signature.
5. Migrations Drizzle générées (`pnpm db:generate`) puis appliquées (`pnpm db:migrate`),
   jamais de SQL écrit à la main — règle déjà actée dans `CLAUDE.md`, rappelée ici car c'est
   la couche `db/schemas` que `entities/repository.ts` consomme directement.

---

## 5. Tests

Mêmes règles que pour les pages (`convention-code.md`) : vitest pour les tests unitaires
(`*.test.ts`), dans un dossier `tests/` à la racine de la feature — à créer dès qu'un premier
test existe. Prioriser les tests sur `dto/validator.ts` (cas valides/invalides) et sur les
fonctions "factory" privées de `services.ts` (via leur effet observable, pas en les import
directement si elles ne sont pas exportées).

---

## 6. État actuel des features (26/07/2026 → 15/08/2026)

- `search/` et `prospects/` suivent déjà cette convention et servent de référence.
- `stats/` s'en approche mais avec des sous-domaines (`kpis/`, `last-search/`,
  `recents-activities/`) qui répètent une partie de la structure à leur propre niveau —
  garder ce découpage si chaque sous-domaine a son propre contrat read/write, sinon le
  remonter à la racine de `stats/`.
- `users/` ne respecte pas encore cette convention (`repository/` sans séparation contrat
  d'interface / implémentation dans `entities/repository.ts`, pas de couche `mocks/`). Ne pas
  la copier pour une nouvelle feature ; l'aligner sur ce document est un chantier à part,
  pas un prérequis bloquant pour le reste.
- `companies/`, `emails/`, `adresses/`, `persons/` sont encore des dossiers vides ou à
  peine amorcés : leur première implémentation doit suivre cette convention dès le départ.
