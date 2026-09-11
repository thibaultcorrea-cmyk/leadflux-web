import type { UserAccount } from "../types/user";

const USERS: UserAccount[] = [
  {
    id: "thibault-correa",
    name: "Thibault Correa",
    email: "thibault@oxiagen.fr",
    initials: "TC",
    isCurrentUser: true,
    role: "admin",
    status: "active",
    lastActivityLabel: "Aujourd'hui, 09:12",
    lastActivityAt: "2026-09-11T09:12:00",
  },
  {
    id: "assadi",
    name: "Assadi",
    email: "assadi@oxiagen.fr",
    initials: "AS",
    role: "admin",
    status: "active",
    lastActivityLabel: "Hier, 18:40",
    lastActivityAt: "2026-09-10T18:40:00",
  },
  {
    id: "marie-lefevre",
    name: "Marie Lefèvre",
    email: "marie@atelier-lefevre.fr",
    initials: "ML",
    role: "client",
    status: "active",
    lastActivityLabel: "2 septembre 2026",
    lastActivityAt: "2026-09-02T00:00:00",
  },
  {
    id: "atelier-dubois",
    name: "contact@atelier-dubois.fr",
    email: "Invitation envoyée le 9 septembre",
    initials: "AD",
    role: "client",
    status: "pending",
    lastActivityLabel: "—",
    lastActivityAt: null,
  },
];

export const usersMock = {
  getUsers(): UserAccount[] {
    return USERS;
  },
};
