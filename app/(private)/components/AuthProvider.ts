"use client";


import { redirect } from "next/navigation";


export const AuthProvider = ({
    session,
    children,
}: Readonly<{ session: any, children: React.ReactNode }>) => {

    if (!session.user) redirect("/");

    return children;


}