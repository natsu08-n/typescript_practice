import { Memo } from "./types";
import { STORAGE_KEY, readLocalStorage, saveLocalStorage } from "./storage";

// ************************************************************
// 処理
// ************************************************************
let memos: Memo[] = [];
let memoIndex: number = 0;

// ************************************************************
// 関数一覧
// ************************************************************
/**
 * メモを作成する
 * @returns {Memo[]} メモ
 */
function newMemo(): Memo {
  const timestamp: number = Date.now();
  return {
    id: timestamp.toString() + memos.length.toString(),
    title: `new memo ${memos.length + 1}`,
    body: "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function init() {
  //ローカルストレージからすべてのメモを取得する
  memos = readLocalStorage(STORAGE_KEY);
  console.log(memos);
  if (memos.length === 0) {
    memos.push(newMemo());
    //すべてのメモをローカルストレージに保存する
    saveLocalStorage(STORAGE_KEY, memos);
  }
  console.log(memos);
}

init();
