"use client"

import { useRef } from "react";

const REMEMBER_ME_STORAGE_KEY = "rememberMe";

const readRememberMe = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(REMEMBER_ME_STORAGE_KEY) === "true";
};

export const useRemebeMeStorage = () => {

    const rememberMeRef = useRef<boolean>(readRememberMe())

    const saveRememberMe = (checked: boolean) => {
        localStorage.setItem(REMEMBER_ME_STORAGE_KEY, checked.toString());
        rememberMeRef.current = checked;
    };

    return {
        remeberMe: rememberMeRef.current,
        saveRememberMe
    }
}