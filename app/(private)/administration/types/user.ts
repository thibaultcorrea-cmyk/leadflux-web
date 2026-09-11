export type UserRole = "admin" | "client";
export type UserStatus = "active" | "pending";

export const USER_STATUS_FILTERS = ["tous", "active", "pending"] as const;
export type UserStatusFilter = (typeof USER_STATUS_FILTERS)[number];

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  initials: string;
  isCurrentUser?: boolean;
  role: UserRole;
  status: UserStatus;
  lastActivityLabel: string;
  /** ISO ou `null` (invitation jamais connectée) : sert uniquement au tri, l'affichage reste `lastActivityLabel`. */
  lastActivityAt: string | null;
};
