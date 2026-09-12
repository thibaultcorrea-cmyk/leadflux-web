"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdminForm } from "../../hooks/useCreateAdminForm";

export function CreateAdminForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { form, onSubmit } = useCreateAdminForm();
  const { errors } = form.formState;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      {errors.root && (
        <p role="alert" className="text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Prénom Nom"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...form.register("name")}
        />
        {errors.name && (
          <span id="name-error" role="alert" className="text-red-500 text-sm">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@entreprise.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...form.register("email")}
        />
        {errors.email && (
          <span id="email-error" role="alert" className="text-red-500 text-sm">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...form.register("password")}
            className="pr-9"
          />
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
        {errors.password && (
          <span id="password-error" role="alert" className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <LoadingButton /> : "Créer le compte admin"}
      </Button>
    </form>
  );
}

const LoadingButton = () => {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      <span>Création en cours...</span>
    </div>
  );
};
