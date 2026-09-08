"use client";



import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema, LoginSchema } from "../schema";
import { useAuthenticationClient } from "@/hooks/useAuthenticationClient";
import { useRemebeMeStorage } from "./useRemebe-me-storage";




export const useLoginForm = () => {
    const { signIn } = useAuthenticationClient();
    const { remeberMe, saveRememberMe } = useRemebeMeStorage();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema) as any,
        defaultValues: {
            email: "",
            password: "",
            rememberMe: remeberMe,
        },
    });

    const handleCheckedRememberMe = (checked: boolean) => {
        saveRememberMe(checked);
        form.setValue("rememberMe", checked);
    };

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        await signIn(data);
    };

    return {
        form,
        handleCheckedRememberMe,
        onSubmit,
    };
};