import { readLocalStorage, saveLocalStorage, STORAGE_KEY } from "./storage";
import { Memo } from "./types";
import { marked } from "marked";

// ************************
// 要素一覧
// *************************
const memoList = document.getElementById("list") as HTMLDivElement;
const addButton = document.getElementById("add") as HTMLButtonElement;
const editButton = document.getElementById("edit") as HTMLButtonElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const deleteButton = document.getElementById("delete") as HTMLButtonElement;
const memoTitle = document.getElementById("memoTitle") as HTMLInputElement;
const memoBody = document.getElementById("memoBody") as HTMLTextAreaElement;
const previewBody = document.getElementById("previewBody") as HTMLDivElement;
const downloadLink = document.getElementById("download") as HTMLAnchorElement;
 
// ************************
// 処理
// *************************
let memos: Memo[] = [];
let memoIndex: number = 0;
downloadLink.addEventListener("click", clickDownloadMemo);
deleteButton.addEventListener("click", clickDeleteMemo);
addButton.addEventListener("click", clickAddMemo);
editButton.addEventListener("click", clickEditMemo);
saveButton.addEventListener("click", clickSaveMemo);

init();

// ************************
// 関数
// ************************
// 新しいメモを作成する
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

// 初期化
function init() {
  memos = readLocalStorage(STORAGE_KEY);
  console.log(memos);
  if (memos.length === 0) {
    // 新しいメモを二つ作成する
    memos.push(newMemo());
    memos.push(newMemo());
    // 全てのメモをローカルストレージに保存する
    saveLocalStorage(STORAGE_KEY, memos);
  }
  console.log(memos);
  // すべてのメモのタイトルを一覧に表示する
  showMemoElements(memoList, memos);
  // メモ一覧のタイトルにアクティブなスタイルを設定する
  setActiveStyle(memoIndex + 1, true);
  // 選択中のメモ情報を表示用のメモ要素に設定する
  setMemoElement();
  // 保存ボタンを非表示にし編集ボタンを表示する
  setHiddenButton(saveButton, false);
  setHiddenButton(editButton, true);
}
// メモの要素を作成する
function newMemoElement(memo: Memo): HTMLDivElement {
  // div要素を作成する
  const div = document.createElement("div");
  // div要素にタイトルを設定する
  div.innerText = memo.title;
  // div要素のdata-id属性にメモidを設定する
  div.setAttribute("data-id", memo.id);
  // div要素のclass属性にスタイルを設定する
  div.classList.add("w-full", "p-sm");
  div.addEventListener("click", selectedMemo);
  return div;
}

// 全てもメモ要素を削除する
function clearMemoElements(div: HTMLDivElement) {
  div.innerText = "";
}

// 全てもメモ要素を表示
function showMemoElements(div: HTMLDivElement, memos: Memo[]) {
  // メモ一覧をクリアする
  clearMemoElements(div);
  memos.forEach((memo) => {
    // メモのタイトルの要素を作成する
    const memoElement = newMemoElement(memo);
    div.appendChild(memoElement);
  });
}

// div要素にアクティブスタイル設定する
function setActiveStyle(index: number, isActive: boolean) {
  const selector = `#list > div:nth-child(${index})`;
  const element = document.querySelector(selector) as HTMLDivElement;
  if (isActive) {
    element.classList.add("active");
  } else {
    element.classList.remove("active");
  }
}

// メモを設定する
function setMemoElement() {
  const memo: Memo = memos[memoIndex];
  // メモを表示する要素にタイトルと本文を設定する
  memoTitle.value = memo.title;
  memoBody.value = memo.body;
  //  markdownで記述した本文（文字列）をHTMLのパースする
  (async ()=>{
    try {
      previewBody. innerHTML = await marked.parse(memo.body);
    } catch (error) {
      console.error(error); 
    }
  })();
}

// button要素の表示・非表示を設定する
function setHiddenButton(button: HTMLButtonElement, isHidden: boolean) {
  if (isHidden) {
    button.removeAttribute("hidden");
  } else {
    button.setAttribute("hidden", "hidden");
  }
}

// タイトルと本文の要素のdisabledz属性を設定する
function setEditMode(editMode: boolean) {
  if (editMode) {
    memoTitle.removeAttribute("disabled");
    memoBody.removeAttribute("disabled");
    // 編集モード時はtextareaを非表示ひし、プレビュー用を表示する
    memoBody.removeAttribute("hidden");
    previewBody.setAttribute("hidden", "hidden");
  } else {
    memoTitle.setAttribute("disabled", "disabled");
    memoBody.setAttribute("disabled", "disabled");
    // 表示モード時はtextareaを非表示ひし、プレビュー用を表示する
    memoBody.setAttribute("hidden","hidden");
    previewBody.removeAttribute("hidden");
  }
}

// ************************
// イベント関連の関数一覧
// *************************

function clickAddMemo(event: MouseEvent) {
    // タイトルと本文を表示モードにする
    setEditMode(true);
    // 保存ボタンを非表示にし編集ボタンを表示する
    setHiddenButton(saveButton, true);
    setHiddenButton(editButton, false);

  // 新しいメモを追加する
  memos.push(newMemo());
  // 全てのメモをローカルストレージに保存する
  saveLocalStorage(STORAGE_KEY, memos);
  // 新しいメモが追加されたインデクスを設定する
  memoIndex = memos.length - 1;
  // 全てのメモのタイトルをメモ一覧に表示する
  showMemoElements(memoList, memos);
  // メモ一覧のタイトルにアクティブなスタイルを設定する
  setActiveStyle(memoIndex + 1, true);
  // 選択中のメモ情報を表示用のメモ要素に設定する
  setMemoElement();
}

// メモが選択された時の処理
function selectedMemo(event: MouseEvent) {
  // タイトルと本文を表示モードにする
  setEditMode(false);
  // 保存ボタンを非表示にし編集ボタンを表示する
  setHiddenButton(saveButton, false);
  setHiddenButton(editButton, true);

  // メモ一覧のタイトルにアクティブなスタイルを設定する
  setActiveStyle(memoIndex + 1, false);
  // クリックされたdiv要素のdata-id属性からメモIDを取得する
  const target = event.target as HTMLDivElement;
  const id = target.getAttribute("data-id");
  // 選択されたメモのインデックスを取得する
  memoIndex = memos.findIndex((memo) => memo.id === id);
  // 選択中のメモ情報を表示用のメモ要素に設定する
  setMemoElement();
  // メモ一覧のタイトルのアクティブなスタイルを設定する
  setActiveStyle(memoIndex + 1, true);
}

// 編集ボタンが押された時の処理
function clickEditMemo(event: MouseEvent) {
  // タイトルと本文を編集モードにする
  setEditMode(true);
  // 保存ボタン
  setHiddenButton(saveButton, true);
  setHiddenButton(editButton, false);
}

// 保存ボタンが押された時の処理
function clickSaveMemo(event: MouseEvent) {
  // メモデータを更新する
  const memo: Memo = memos[memoIndex];
  memo.title = memoTitle.value;
  memo.body = memoBody.value;
  memo.updatedAt = Date.now();
  // すべてのローカルストレージに保存する
  saveLocalStorage(STORAGE_KEY, memos);
  // タイトルと本文を表示モードにする
  setEditMode(false);
  // 保存ボタンを非表示にし編集ボタンを表示する
  setHiddenButton(saveButton, true);
  setHiddenButton(editButton, false);
  // 全てのメモのタイトルを一覧で表示する
  showMemoElements(memoList, memos);
  // メモ一覧のタイトルなスタイルを設定する
  setActiveStyle(memoIndex + 1, true);
  // 表示するメモを設定する
  setMemoElement();
}


function clickDeleteMemo(event: MouseEvent) {
  if (memos.length === 1) {
    alert("これ以上は削除できません")
    return;
  }
  // 表示中のメモのIDを取得する 
  const memoId = memos[memoIndex].id;
  // 全てのメモから表示中のメモを削除する
  memos = memos.filter((memo)=> memo.id !== memoId);
  // 全てのメモをローカルストレージの保存する
  saveLocalStorage(STORAGE_KEY, memos);
  // 表示するメモのインデックスを１つで前のものにする
  if(1<=memoIndex) { memoIndex--; }
  // 表示するメモを設定する
  setMemoElement();
  // 画面右側を表示モードにする
  setEditMode(false);
  // 保存ボタンを非表示にし編集ボタンを表示する
  setHiddenButton(saveButton, false);
  setHiddenButton(editButton, true);
  // 画面右側のメモのタイトル一覧をクリアして再構築する
  showMemoElements(memoList, memos);
  // 表示するメモのタイトルのアクティブなスタイルを設定する
  setActiveStyle(memoIndex+1, true);
}

function clickDownloadMemo(event: MouseEvent) {
  // ダウンロードするメモを取得する
  const memo = memos[memoIndex];
  // イベントが発生した要素を取得する
  const target = event.target as HTMLAnchorElement;
  // ダウンロードするファイルの名前を指定する
  target.download = `${memo. title}.md`;
  // ダウンロードするファイルのデータ
  target.href = URL.createObjectURL(
    new Blob([memo.body], {
      type: "application/octet-stream",
    })
  );
}