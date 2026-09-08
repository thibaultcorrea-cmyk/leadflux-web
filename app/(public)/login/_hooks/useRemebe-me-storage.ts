"use client"

import { useRef } from "react";

const REMEMBER_ME_STORAGE_KEY = "rememberMe";

export const useRemebeMeStorage = () => {

    const rememberMeRef = useRef<boolean>(localStorage.getItem(REMEMBER_ME_STORAGE_KEY) === "true")

    const saveRememberMe = (checked: boolean) => {
        localStorage.setItem(REMEMBER_ME_STORAGE_KEY, checked.toString());
        rememberMeRef.current = checked;
    };

    return {
        remeberMe: rememberMeRef.current,
        saveRememberMe
    }
}