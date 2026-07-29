import type { RowData } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";

/**
 * Action de ligne d'un tableau. C'est le contrat unique de la colonne
 * "Actions" : chaque page décrit ses actions (souvent depuis un hook métier)
 * et `createRowActionsColumn` se charge du rendu et de l'accessibilité.
 */
export type DataTableRowAction<TData> = {
  id: string;
  /** Sert à la fois d'infobulle et d'`aria-label` : jamais d'icône muette. */
  label: string;
  icon: LucideIcon;
  onSelect: (row: TData) => void;
  /**
   * `primary` = action principale de la ligne, affichée avec son libellé.
   * `ghost` = bouton icône seule. `destructive` = icône seule, ton erreur.
   */
  variant?: "primary" | "ghost" | "destructive";
  /** Masque l'action pour certaines lignes (droits, statut…). */
  isHidden?: (row: TData) => boolean;
  isDisabled?: (row: TData) => boolean;
};

/**
 * Action groupée, déclenchée depuis la barre de sélection du tableau.
 *
 * Rappel produit (CLAUDE.md §3) : une action groupée qui déclencherait un
 * envoi sans relecture est interdite. `onSelect` doit passer par une étape de
 * confirmation.
 */
export type DataTableBulkAction<TData> = {
  id: string;
  label: string;
  icon?: LucideIcon;
  onSelect: (rows: TData[]) => void;
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Libellé humain de la colonne (menus Trier / Colonnes, `aria-label`). */
    label?: string;
    headerClassName?: string;
    cellClassName?: string;
  }
}
