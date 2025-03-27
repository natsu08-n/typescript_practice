import { Memo } from "./types";

export const STORAGE_KEY = "memos";

export function readLocalStorage(key: string): Memo[] {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
}

export function saveLocalStorage(key: string, memos: Memo[]): void {
  localStorage.setItem(key, JSON.stringify(memos));
}
