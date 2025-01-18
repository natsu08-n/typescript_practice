import { Memo } from "./types";
import { STORAGE_KEY, readLocalStorage, saveLocalStorage } from "./storage";

// ************************************************************
// 処理
// ************************************************************
let memos: Memo[] = [];
let memoIndex: number = 0;

// ************************************************************
// 要素一覧
// ************************************************************
const memoList = document.getElementById("list") as HTMLDivElement;

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

/**
 * 初期化
 */
function init() {
  //ローカルストレージからすべてのメモを取得する
  memos = readLocalStorage(STORAGE_KEY);
  console.log(memos);
  if (memos.length === 0) {
    memos.push(newMemo());
    //すべてのメモをローカルストレージに保存する
    saveLocalStorage(STORAGE_KEY, memos);
  }
  showMemoElements(memoList, memos);
}

/**
 * メモを追加する
 * @param {Memo} memo メモ
 * @returns {HTMLDivElementHTMLDivElement}
 */
function newMemoElement(memo: Memo): HTMLDivElement {
  const div = document.createElement("div");
  div.innerText = memo.title;
  div.setAttribute("data-id", memo.id);
  div.classList.add("w-full", "p-sm");
  return div;
}

/**
 * メモを削除する
 * @param {HTMLDivElement} div メモ一覧のdiv要素
 */
function clearMemoElements(div: HTMLDivElement) {
  div.innerText = "";
}

/**
 * すべてのメモ要素を表示する
 * @param {HTMLDivElement} div メモ一覧のdiv要素
 * @param {Memo[]} memos メモ
 */
function showMemoElements(div: HTMLDivElement, memos: Memo[]) {
  clearMemoElements(div);
  memos.forEach(memo => {
    const memoElement = newMemoElement(memo);
    div.appendChild(memoElement);
  });
}

init();
