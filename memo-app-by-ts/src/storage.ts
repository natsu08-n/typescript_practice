import { Memo } from "./types";

// ************************************************************
// 変数一覧
// ************************************************************
export const STORAGE_KEY = "memos";

// ************************************************************
// 関数一覧
// ************************************************************
/**
 * ローカルストレージからすべてのメモを取得する
 * @param {string} key キー
 * @returns {Memo} すべてのメモ
 */
export function readLocalStorage(key: string): Memo[] {
  const data = localStorage.getItem(key);
  if (data === null) {
    return [];
  }
  return JSON.parse(data);
}

/**
 * ローカルストレージにメモを保存する
 * @param {string} key キー
 * @param {Memo} data メモ
 */
export function saveLocalStorage(key: string, data: Memo[]) {
  localStorage.setItem(key, JSON.stringify(data));
}
