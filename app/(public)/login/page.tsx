import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { LoginForm } from "./components/form/login-form";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/tableau");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center gap-2 text-center">
          <h1 className="font-display text-display-sm tracking-[0.02em] text-primary-700">
            Connexion
          </h1>
          <CardDescription>Accédez à votre espace Leadflux.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
