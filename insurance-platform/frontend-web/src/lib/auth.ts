import { STORAGE_KEYS } from "./constants";
import type { User } from "@/types/user";

export function saveAuth(token: string, user: User): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(STORAGE_KEYS.user);
  if (!value) return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}