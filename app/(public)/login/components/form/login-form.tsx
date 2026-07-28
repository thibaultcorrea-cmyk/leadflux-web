"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/app/(public)/login/_hooks/useLoginForm";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { form, onSubmit } = useLoginForm();

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@entreprise.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <span className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            {...form.register("password")}
            className="pr-9"
          />
          {form.formState.errors.password && (
            <span className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={
              showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            title={
              showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-ink-500 hover:text-ink-700"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="remember-me" name="remember-me" />
        <Label htmlFor="remember-me" className="font-normal text-ink-700">
          Se souvenir de moi
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <LoadingButton /> : "Se connecter"}
      </Button>
    </form>
  );
}



const LoadingButton = () => {

  return (
    <div className="flex items-center gap-2">
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      <span>Connexion en cours...</span>
    </div>
  );
}
