"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  createInitialAdminSchema,
  CreateInitialAdminDto,
} from "@/features/users/dto/schema";
import { createInitialAdminAction } from "../services/create-admin-action";

export const useCreateAdminForm = () => {
  const router = useRouter();

  const form = useForm<CreateInitialAdminDto>({
    resolver: zodResolver(createInitialAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: CreateInitialAdminDto) => {
    const result = await createInitialAdminAction(data);

    if (!result.success) {
      form.setError("root", { message: result.error });
      return;
    }

    router.replace("/login");
  };

  return { form, onSubmit };
};
