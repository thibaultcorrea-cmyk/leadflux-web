import { redirect } from "next/navigation";

// "Administration" n'est plus qu'un regroupement de sous-navigation (Configurations,
// Utilisateurs, Historiques) dans la sidebar : /administration seul renvoie vers sa
// première sous-page plutôt que d'afficher un contenu propre.
export default function AdministrationPage() {
  redirect("/administration/configurations");
}
