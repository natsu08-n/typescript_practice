import { Memo } from "./types";
import { STORAGE_KEY, readLocalStorage, saveLocalStorage } from "./storage";
// ************************************************************
// 要素一覧
// ************************************************************
const memoList = document.getElementById("list") as HTMLDivElement;
const addButton = document.getElementById("add") as HTMLButtonElement;
const memoTitle = document.getElementById("memoTitle") as HTMLInputElement;
const memoBody = document.getElementById("memoBody") as HTMLTextAreaElement;
const editButton = document.getElementById("edit") as HTMLButtonElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const deleteButton = document.getElementById("delete") as HTMLButtonElement;

// ************************************************************
// 処理
// ************************************************************
let memos: Memo[] = [];
let memoIndex: number = 0;
//※関数宣言なので巻き上げでここで使える
addButton.addEventListener("click", clickAddMemo);
editButton.addEventListener("click", clickEditMemo);
saveButton.addEventListener("click", clickSaveMemo);
deleteButton.addEventListener("click", clickDeleteMemo);
init();

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
 * メモの要素を作成する
 * @param {Memo} memo メモ
 * @returns {HTMLDivElement}
 */
function newMemoElement(memo: Memo): HTMLDivElement {
  const div = document.createElement("div");
  div.innerText = memo.title;
  div.setAttribute("data-id", memo.id);
  div.classList.add("w-full", "p-sm");
  div.addEventListener("click", selectedMemo);
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
 * すべてのメモのタイトルを一覧で表示する
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
/**
 * メモ一覧のタイトルにアクティブスタイルを設定する
 * @param {number} index
 * @param {boolean} isActive true: 追加 false:削除
 */
function setActiveStyle(index: number, isActive: boolean) {
  const selector = `#list > div:nth-child(${index})`;
  const element = document.querySelector(selector) as HTMLDivElement;
  if (isActive) {
    element.classList.add("active");
  } else {
    element.classList.remove("active");
  }
}
/**
 * 選択中のメモ情報を表示用のメモ要素に設定する
 */
function setMemoElement() {
  const memo: Memo = memos[memoIndex];
  memoTitle.value = memo.title;
  memoBody.value = memo.body;
}
/**
 * button要素の表示・非表示を設定する
 * @param {HTMLButtonElement} button
 * @param {boolean} isHidden true
 */
function setHiddenButton(button: HTMLButtonElement, isHidden: boolean) {
  if (isHidden) {
    button.removeAttribute("hidden");
  } else {
    button.setAttribute("hidden", "hidden"); //ここは第二引数trueの気がする
  }
}
/**
 * タイトルと本文の要素のdisabled属性を設定する
 * @param editMode true:編集モード false:表示モード
 */
function setEditMode(editMode: boolean) {
  if (editMode) {
    memoTitle.removeAttribute("disabled");
    memoBody.removeAttribute("disabled");
  } else {
    memoTitle.setAttribute("disabled", "disabled");
    memoBody.setAttribute("disabled", "disabled");
  }
}

/**
 * 初期化
 */
function init() {
  //ローカルストレージからすべてのメモを取得する
  memos = readLocalStorage(STORAGE_KEY);
  if (memos.length === 0) {
    memos.push(newMemo());
    //すべてのメモをローカルストレージに保存する
    saveLocalStorage(STORAGE_KEY, memos);
  }
  showMemoElements(memoList, memos);
  setActiveStyle(memoIndex + 1, true);
  setMemoElement();
  setHiddenButton(saveButton, true);
  setHiddenButton(editButton, false);
}

// ************************************************************
// イベント関連の関数一覧
// ************************************************************
/**
 * 追加ボタンが押された時の処理
 * @param {MouseEvent} event
 */
function clickAddMemo(event: MouseEvent) {
  setEditMode(true);
  setHiddenButton(editButton, false);
  setHiddenButton(saveButton, true);
  memos.push(newMemo());
  saveLocalStorage(STORAGE_KEY, memos);
  // 配列は０から始まるのでー１する
  memoIndex = memos.length - 1;
  showMemoElements(memoList, memos);
  setActiveStyle(memoIndex + 1, true);
  setMemoElement();
}
/**
 * メモが選択された時の処理
 */
function selectedMemo(event: MouseEvent) {
  setEditMode(false);
  setHiddenButton(editButton, true);
  setHiddenButton(saveButton, false);
  setActiveStyle(memoIndex + 1, false);
  const target = event.target as HTMLDivElement;
  const id = target.getAttribute("data-id");
  memoIndex = memos.findIndex(memo => memo.id === id);
  setMemoElement();
  setActiveStyle(memoIndex + 1, true);
}
/**
 * 編集ボタンが押された時の処理
 * @param {MouseEvent} event
 */
function clickEditMemo(event: MouseEvent) {
  setEditMode(true);
  setHiddenButton(editButton, false);
  setHiddenButton(saveButton, true);
}
/**
 * 保存ボタンが押された時の処理
 */
function clickSaveMemo() {
  const memo = memos[memoIndex];
  memo.title = memoTitle.value;
  memo.body = memoBody.value;
  memo.updatedAt = Date.now();
  saveLocalStorage(STORAGE_KEY, memos);
  setEditMode(false);
  setHiddenButton(editButton, true);
  setHiddenButton(saveButton, false);
  showMemoElements(memoList, memos);
  setActiveStyle(memoIndex + 1, true);
}
/**
 * 削除ボタンが押された時の処理
 * @param {MouseEvent} event
 */
function clickDeleteMemo(event: MouseEvent) {
  if (memos.length === 1) {
    alert("最後のメモは削除できません");
    return;
  }
  const memoId = memos[memoIndex].id;
  memos = memos.filter(memo => memo.id !== memoId);
  saveLocalStorage(STORAGE_KEY, memos);
  if (1 <= memoIndex) {
    memoIndex--;
  }
  setMemoElement();
  setEditMode(false);
  setHiddenButton(editButton, true);
  setHiddenButton(saveButton, false);
  showMemoElements(memoList, memos);
  setActiveStyle(memoIndex + 1, true);
}
