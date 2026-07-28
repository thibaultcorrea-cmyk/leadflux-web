<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:code-conventions -->
# Convention de structure des pages — OBLIGATOIRE

**Chaque agent doit consulter et appliquer cette convention avant d'agir.**

Dans Next.js (App Router), une page = un dossier dans `app/`. Toute page créée ou modifiée doit respecter cette arborescence :

```
app/ma-page/
├── page.tsx                  # point d'entrée de la route
├── hooks/                    # hooks React spécifiques à cette page
├── types/                    # types et interfaces TypeScript de la page
├── services/                 # fonctions utilitaires, appels API, accès données
├── components/               # composants propres à la page
│   ├── form/                 # si la page comporte un ou plusieurs formulaires
│   ├── table/                # tableaux de la page
│   └── modal/                # modals de la page
└── tests/                    # tests unitaires (*.test.ts[x]) et e2e (*.e2e.ts)
```

Règles :

1. **Réutilisation d'abord** : avant de créer une modal ou un tableau, TOUJOURS vérifier qu'il n'en existe pas déjà un réutilisable (dans `components/` à la racine du projet ou dans les autres pages). Si un composant sert à 2+ pages, le promouvoir dans `components/` à la racine plutôt que le dupliquer.
2. Ne créer les sous-dossiers que s'ils ont du contenu (pas de dossiers vides) — mais dès qu'un hook/type/service/formulaire existe, il va dans le bon dossier, jamais en vrac dans `page.tsx`.
3. **Tests unitaires** : vitest, fichiers `*.test.ts` / `*.test.tsx` dans `tests/`.
4. **Tests e2e** : Playwright (`@playwright/test`), fichiers `*.e2e.ts` dans `tests/`. Lancer avec `npm run test:e2e`. Si Playwright n'est pas installé dans le projet, l'installer avant d'écrire les tests.
5. Les dossiers `hooks/`, `types/`, `services/`, `components/`, `tests/` ne génèrent pas de routes : seul `page.tsx` (et les fichiers de convention Next) est routé — la colocation est sûre.
<!-- END:code-conventions -->
