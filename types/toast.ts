import { LucideIcon } from "lucide-react";

export interface ToastParams {
    title?: string;
    description?: string;
    icon?: LucideIcon | React.ReactNode;
    duration?: number;
    className?: string;



}

export interface PromiseToastParams<T> {
    loading: string;
    success: (data: T) => string;
    error: string;
}

export interface IToast {
    info: (args: ToastParams) => void;
    success: (args: ToastParams) => void;
    warning: (args: ToastParams) => void;
    error: (args: ToastParams) => void;
    promise: <T>(promise: Promise<T>, args: PromiseToastParams<T>) => Promise<T>;
}