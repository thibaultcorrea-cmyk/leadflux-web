import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const isDevMode: boolean = process.env.NODE_ENV?.toLowerCase() === "development";


export const waitDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} o`;

  const ko = bytes / 1024;
  if (ko < 1024) return `${ko < 10 ? ko.toFixed(1) : Math.round(ko)} Ko`;

  const mo = ko / 1024;
  if (mo < 1024) return `${mo < 10 ? mo.toFixed(1) : Math.round(mo)} Mo`;

  const go = mo / 1024;
  return `${go < 10 ? go.toFixed(1) : Math.round(go)} Go`;
};