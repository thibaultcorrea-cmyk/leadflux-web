import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { UserServices } from "@/features/users/services";
import { CreateAdminForm } from "./components/form/create-admin-form";

export default async function CreationAdminPage() {
  const needsInitialSetup = await UserServices.needsInitialSetup();
  if (!needsInitialSetup) redirect("/login");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center gap-2 text-center">
          <h1 className="font-display text-display-sm tracking-[0.02em] text-primary-700">
            Création du compte admin
          </h1>
          <CardDescription>
            Aucun administrateur n&apos;existe encore. Créez le premier compte
            pour démarrer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAdminForm />
        </CardContent>
      </Card>
    </main>
  );
}
