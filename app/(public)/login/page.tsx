import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { LoginForm } from "./components/form/login-form";

export default function LoginPage() {
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
