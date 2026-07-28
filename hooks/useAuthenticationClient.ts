"use client";

import { LoginSchema } from "@/app/(public)/login/schema";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


export const useAuthenticationClient = () => {

    const router = useRouter();


    const signIn = async (input: LoginSchema) => {

        const { data, error } = await authClient.signIn.email({
            email: input.email,
            password: input.password,
            rememberMe: input.rememberMe,

            fetchOptions: {
                onSuccess: () => {
                    console.log("Login successful");
                    router.replace("/tableau");
                },
                onError: (error) => {
                    console.log(error);
                    throw error;
                },
            },

        })

    }


    const signOut = async () => {
        const { data, error } = await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    console.log("Sign out successful");
                    router.replace("/login");
                },
                onError: (error) => {
                    console.log(error);
                    throw error;
                },
            },
        })
    }


    return { signIn, signOut }



}

