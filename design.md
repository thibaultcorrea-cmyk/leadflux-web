# Design System — Leadflux (site vitrine)

> Référence design du site Leadflux, agent de prospection commercialisable d'OxIAgen.
> Conforme à la DA OxIAgen (section 9 du CLAUDE.md global). Prêt à l'emploi avec Tailwind CSS v4 (`@theme inline`, pas de `tailwind.config.js`).
> Style cible : premium accessible, Notion + Stripe + Anthropic. Pas de 3D, pas de néons, pas de glassmorphism.

---

## 1. Couleurs

### Couleurs de marque (source de vérité — ne jamais dévier)

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Primaire | Violet Cramoisi | `#43142A` | Titres, fonds sombres, nav, footer |
| Secondaire | Mauve Poussiéreux | `#8E6B7A` | Texte secondaire, bordures, icônes discrètes |
| Fond | Porcelaine | `#FFFCF7` | Fond de page par défaut |
| Accent / CTA | Harvest Gold | `#D89727` | Boutons primaires, liens actifs, highlights |

### Palette étendue (tints / shades calculés)

Générée par mélange avec blanc (tints) et noir (shades) pour obtenir une échelle utilisable en `bg-primary-100` etc. À utiliser pour hover, disabled, surfaces, contrastes — jamais pour remplacer les 4 couleurs de marque elles-mêmes.

```css
/* Primary — Violet Cramoisi #43142A */
--color-primary-50:  #F7EEF1;
--color-primary-100: #EAD7DE;
--color-primary-200: #D2AEBC;
--color-primary-300: #B8859A;
--color-primary-400: #9B5C77;
--color-primary-500: #6F2E45;
--color-primary-600: #58233A;
--color-primary-700: #43142A; /* = brand primary */
--color-primary-800: #330F20;
--color-primary-900: #220A15;

/* Secondary — Mauve Poussiéreux #8E6B7A */
--color-secondary-50:  #F6F0F2;
--color-secondary-100: #EBDEE3;
--color-secondary-200: #D7BDC8;
--color-secondary-300: #C29CAD;
--color-secondary-400: #A98A94; /* ajustée pour transition douce */
--color-secondary-500: #8E6B7A; /* = brand secondary */
--color-secondary-600: #745662;
--color-secondary-700: #5A424C;
--color-secondary-800: #402E36;
--color-secondary-900: #271B20;

/* Background — Porcelaine #FFFCF7 */
--color-background:     #FFFCF7; /* = brand background */
--color-background-100: #FFF9EF; /* légèrement plus chaud, cards alternées */
--color-background-200: #F5EFE6; /* séparateurs, fonds de section */
--color-background-300: #E9E1D4; /* bordures sur fond clair */

/* Accent / CTA — Harvest Gold #D89727 */
--color-accent-50:  #FCF3E1;
--color-accent-100: #F8E4BC;
--color-accent-200: #F0C87A;
--color-accent-300: #E7AC4E;
--color-accent-400: #DFA02E;
--color-accent-500: #D89727; /* = brand accent */
--color-accent-600: #B87D1D;
--color-accent-700: #946315;
--color-accent-800: #6F4A10;
--color-accent-900: #4A310B;

/* Neutres (texte, bordures neutres) — dérivés du Violet Cramoisi désaturé */
--color-ink-900: #23181C; /* texte principal (meilleur contraste que le violet pur sur fond clair) */
--color-ink-700: #4A3B41;
--color-ink-500: #77656C;
--color-ink-300: #B3A4AA;
--color-ink-100: #E4DBDD;

/* Sémantiques (états — hors palette de marque, usage fonctionnel uniquement) */
--color-success: #2F6B4F;
--color-warning: #B87D1D; /* = accent-600, réutilisé pour cohérence */
--color-error:   #A83232;
--color-info:    #43142A; /* = brand primary */
```

**Règle de contraste** : le violet `#43142A` sur fond `#FFFCF7` donne un ratio ≈ 11.8:1 (AAA). Le mauve `#8E6B7A` sur `#FFFCF7` ne donne que ≈ 3.4:1 : **ne jamais l'utiliser pour du texte de moins de 18px** — réservé aux éléments décoratifs, bordures, icônes, ou texte large (≥ 24px / bold ≥ 18.5px). Pour du texte secondaire lisible, utiliser `--color-ink-700` ou `--color-ink-500`.

---

## 2. Typographie

- **Titres** : League Gothic (condensée, display, impact) — usage réservé aux titres H1-H3, chiffres clés, badges courts. **Ne jamais l'utiliser pour du texte de paragraphe** : c'est une typo condensée, illisible en long texte.
- **Corps** : Playfair Display (storytelling, empattements) pour l'accroche éditoriale ; compléter par une sans-serif neutre pour le texte fonctionnel dense (UI, formulaires, footer légal) où Playfair devient lourd à lire.

> Playfair Display reste correct jusqu'à ~2-3 phrases (hero, citations, intros de section). Au-delà (paragraphes longs, listes de features, UI produit), utiliser `--font-body-ui` (voir ci-dessous) pour préserver la lisibilité — c'est un choix pragmatique, pas une dérogation à la DA : les titres et l'accroche gardent Playfair/League Gothic.

### Import (Next.js `next/font/google`)

```ts
// app/layout.tsx
import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local"; // League Gothic n'est pas sur Google Fonts en variable complète -> fichier local recommandé

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});
```

> **Note** : League Gothic n'est disponible que via Google Fonts en une seule graisse (400). Télécharger et servir en `next/font/local` si un poids "bold" alternatif est nécessaire, ou compenser via `letter-spacing` négatif + `font-stretch` plutôt que du faux gras (jamais de `font-weight: 700` synthétique sur une typo condensée : ça casse le dessin des lettres).

### Tokens CSS (`@theme inline`)

```css
@theme inline {
  --font-display: "League Gothic", "Oswald", sans-serif; /* titres */
  --font-serif:   "Playfair Display", Georgia, serif;     /* accroche, storytelling */
  --font-ui:      "Inter", "Helvetica Neue", sans-serif;  /* UI, formulaires, footer */
}
```

### Échelle typographique

League Gothic est **condensée** : compenser par un `letter-spacing` légèrement positif aux petites tailles (sinon les titres paraissent écrasés) et une `line-height` serrée (c'est une display font, pas du texte courant).

| Token | Taille | Line-height | Letter-spacing | Font | Usage |
|---|---|---|---|---|---|
| `text-display-xl` | 72px / 4.5rem | 0.95 | 0.01em | League Gothic | Hero H1 |
| `text-display-lg` | 48px / 3rem | 1.0 | 0.01em | League Gothic | H2 sections |
| `text-display-md` | 32px / 2rem | 1.05 | 0.015em | League Gothic | H3 |
| `text-display-sm` | 24px / 1.5rem | 1.1 | 0.02em | League Gothic | H4, labels de section |
| `text-lead` | 20px / 1.25rem | 1.5 | 0 | Playfair Display | Chapô, accroche hero |
| `text-body-lg` | 18px / 1.125rem | 1.6 | 0 | Inter (UI) | Corps important |
| `text-body` | 16px / 1rem | 1.6 | 0 | Inter (UI) | Corps standard |
| `text-body-sm` | 14px / 0.875rem | 1.5 | 0 | Inter (UI) | Légendes, footer |
| `text-caption` | 12px / 0.75rem | 1.4 | 0.02em | Inter (UI) | Badges, métadonnées |

```css
@theme inline {
  --text-display-xl: 4.5rem;
  --text-display-xl--line-height: 0.95;
  --text-display-xl--letter-spacing: 0.01em;

  --text-display-lg: 3rem;
  --text-display-lg--line-height: 1;
  --text-display-lg--letter-spacing: 0.01em;

  --text-display-md: 2rem;
  --text-display-md--line-height: 1.05;
  --text-display-md--letter-spacing: 0.015em;

  --text-display-sm: 1.5rem;
  --text-display-sm--line-height: 1.1;
  --text-display-sm--letter-spacing: 0.02em;

  --text-lead: 1.25rem;
  --text-lead--line-height: 1.5;

  --text-body-lg: 1.125rem;
  --text-body-lg--line-height: 1.6;

  --text-body: 1rem;
  --text-body--line-height: 1.6;

  --text-body-sm: 0.875rem;
  --text-body-sm--line-height: 1.5;

  --text-caption: 0.75rem;
  --text-caption--line-height: 1.4;
  --text-caption--letter-spacing: 0.02em;
}
```

**Poids** : Bold (600-700) pour les titres et labels forts, Regular (400) pour le corps, Medium (500) pour les éléments d'UI intermédiaires (nav, boutons secondaires).

**Longueur de ligne** : 60-75 caractères en desktop, 35-60 en mobile pour le corps de texte (Playfair Display / Inter).

---

## 3. Spacing, radius, ombres

Rythme en base 4px (échelle Tailwind par défaut conservée, pas de redéfinition nécessaire — `p-1` à `p-32` couvrent le besoin).

```css
@theme inline {
  /* Radius — arrondi mesuré, pas de "pilule" agressive sauf badges */
  --radius-sm:  0.25rem;  /* inputs, petits tags */
  --radius-md:  0.5rem;   /* boutons, champs de formulaire */
  --radius-lg:  0.75rem;  /* cards */
  --radius-xl:  1rem;     /* cards mises en avant, modales */
  --radius-full: 9999px;  /* badges, avatars, pills */

  /* Ombres — discrètes, jamais de drop-shadow lourde (anti pattern "néon/3D") */
  --shadow-xs: 0 1px 2px 0 rgb(35 24 28 / 0.04);
  --shadow-sm: 0 1px 3px 0 rgb(35 24 28 / 0.06), 0 1px 2px -1px rgb(35 24 28 / 0.06);
  --shadow-md: 0 4px 8px -2px rgb(35 24 28 / 0.08), 0 2px 4px -2px rgb(35 24 28 / 0.06);
  --shadow-lg: 0 12px 24px -6px rgb(35 24 28 / 0.10), 0 4px 8px -4px rgb(35 24 28 / 0.06);

  /* Container */
  --container-content: 72rem; /* max-w-6xl équivalent, contenu principal */
  --container-narrow:  48rem; /* texte long, storytelling */
}
```

**Grille de section** : `py-16` à `py-24` desktop, `py-10` à `py-16` mobile. Gutter horizontal adaptatif : `px-4` mobile → `px-6` tablette → `px-8` desktop.

---

## 4. Effets et style général

- **Pas de dégradés visibles**, pas de glow/néon, pas d'ombres 3D. Surfaces plates avec séparation par contraste de fond (`background` vs `background-200`) et bordures fines (`ink-100` ou `background-300`).
- **Transitions** : 150-250ms, `ease-out` à l'entrée, `ease-in` à la sortie. Hover = léger changement de fond/couleur ou `scale(0.98)` sur press des cards cliquables. Jamais d'animation > 400ms.
- **Un seul CTA principal par section/écran** ; CTA secondaires en `outline` ou texte simple, jamais en compétition visuelle avec l'accent gold.
- **Icônes** : SVG (Lucide ou Heroicons), jamais d'emoji comme icône fonctionnelle. Stroke width cohérent (1.5px ou 2px, pas les deux).

---

## 5. Composants clés

### Bouton primaire (CTA)
```html
<button class="bg-accent-500 hover:bg-accent-600 text-white font-medium
               px-6 py-3 rounded-md shadow-sm transition-colors duration-200
               cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2">
  Réserver un audit
</button>
```

### Bouton secondaire
```html
<button class="border border-primary-700 text-primary-700 hover:bg-primary-50
               font-medium px-6 py-3 rounded-md transition-colors duration-200 cursor-pointer">
  En savoir plus
</button>
```

### Card (feature / offre)
```html
<div class="bg-background-100 border border-background-300 rounded-lg p-6
            hover:shadow-md transition-shadow duration-200">
  <h3 class="font-display text-display-sm text-primary-700 mb-2">Titre</h3>
  <p class="font-ui text-body text-ink-700">Description courte et concrète.</p>
</div>
```

### Badge
```html
<span class="inline-flex items-center gap-1 bg-accent-50 text-accent-700
             text-caption font-medium px-3 py-1 rounded-full">
  Nouveau
</span>
```

### Hero (structure de référence — pattern "Hero + Testimonials + CTA")
1. Nav sticky (fond `background`, bordure basse `background-300`)
2. Hero : H1 League Gothic (`text-display-xl`, `primary-700`), accroche Playfair (`text-lead`, `ink-700`), CTA principal + CTA secondaire texte
3. Preuve sociale (logos clients / chiffres clés) — fond `background-100`
4. Problème → Solution (2-3 blocs, icônes)
5. Témoignages (3-5, photo + nom + rôle, fond `background-100`, citation en Playfair italique)
6. CTA final (fond `primary-700`, texte `background`, un seul bouton `accent-500`)
7. Footer (fond `primary-700`, texte `background-200`)

---

## 6. Accessibilité et UX — checklist avant livraison

- [ ] Contraste texte ≥ 4.5:1 (vérifié : `primary-700` sur `background` = AAA ; `secondary-500` réservé aux éléments non-textuels ou texte ≥ 18.5px bold)
- [ ] Cibles tactiles ≥ 44×44px, espacement ≥ 8px entre éléments cliquables
- [ ] `cursor-pointer` sur tout élément cliquable, focus ring visible (`focus:ring-2 focus:ring-accent-300`)
- [ ] Aucune information transmise par la couleur seule (icône ou texte en complément)
- [ ] `prefers-reduced-motion` respecté sur toutes les transitions/animations
- [ ] Un seul CTA primaire par écran, CTA secondaires visuellement subordonnés
- [ ] Testé à 375px, 768px, 1024px, 1440px — pas de scroll horizontal
- [ ] Formulaires : labels visibles (pas de placeholder-only), erreurs sous le champ concerné, validation au blur

---

## 7. Anti-patterns à éviter

- Dégradés multicolores, glow/néon, effets 3D ou glassmorphism (hors DA OxIAgen)
- League Gothic en gras synthétique ou sur du texte courant
- `secondary-500` (Mauve) utilisé comme couleur de texte sur fond clair en dessous de 18px
- Plus d'un CTA de même poids visuel par section
- Ombres lourdes façon skeuomorphisme (`box-shadow` > `--shadow-lg`)
- Emoji utilisés comme icônes structurelles
