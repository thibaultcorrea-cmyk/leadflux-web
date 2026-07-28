"use client";



import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema, LoginSchema } from "../schema";
import { useAuthenticationClient } from "@/hooks/useAuthenticationClient";




export const useLoginForm = () => {
    const { signIn } = useAuthenticationClient();


    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema) as any,
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        await signIn(data);
    };

    return {
        form,
        onSubmit,
    };
};