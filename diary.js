function todayDateString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDiaryDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  const wd = ["日", "月", "火", "水", "木", "金", "土"][new Date(`${y}-${m}-${d}T12:00:00`).getDay()];
  return `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日（${wd}）`;
}

function switchAppMode(mode) {
  const menuView = document.getElementById("view-menu");
  const diaryView = document.getElementById("view-diary");
  const tabMenu = document.getElementById("tab-menu");
  const tabDiary = document.getElementById("tab-diary");
  if (!menuView || !diaryView || !tabMenu || !tabDiary) return;

  const isMenu = mode === "menu";
  menuView.hidden = !isMenu;
  diaryView.hidden = isMenu;
  tabMenu.classList.toggle("is-active", isMenu);
  tabDiary.classList.toggle("is-active", !isMenu);
  tabMenu.setAttribute("aria-selected", String(isMenu));
  tabDiary.setAttribute("aria-selected", String(!isMenu));

  try {
    sessionStorage.setItem("spincoach_app_mode", mode);
  } catch {
    /* ignore */
  }

  if (!isMenu) {
    const dateEl = document.getElementById("diaryDate");
    if (dateEl && !dateEl.value) dateEl.value = todayDateString();
    refreshDiaryList();
  }
}

function initAppMode() {
  document.querySelectorAll("[data-app-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchAppMode(btn.getAttribute("data-app-mode"));
    });
  });
  let saved = "menu";
  try {
    saved = sessionStorage.getItem("spincoach_app_mode") || "menu";
  } catch {
    /* ignore */
  }
  switchAppMode(saved === "diary" ? "diary" : "menu");
}

function resetDiaryForm() {
  const editId = document.getElementById("diaryEditId");
  const dateEl = document.getElementById("diaryDate");
  const content = document.getElementById("diaryContent");
  const issues = document.getElementById("diaryIssues");
  const good = document.getElementById("diaryGood");
  const reflection = document.getElementById("diaryReflection");
  const cancelBtn = document.getElementById("btn-diary-cancel");
  const saveBtn = document.getElementById("btn-diary-save");
  if (editId) editId.value = "";
  if (dateEl) dateEl.value = todayDateString();
  if (issues) issues.value = "";
  if (content) content.value = "";
  if (good) good.value = "";
  if (reflection) reflection.value = "";
  if (cancelBtn) cancelBtn.hidden = true;
  if (saveBtn) saveBtn.textContent = "日記を保存";
}

function loadDiaryToForm(entry) {
  const editId = document.getElementById("diaryEditId");
  const dateEl = document.getElementById("diaryDate");
  const content = document.getElementById("diaryContent");
  const issues = document.getElementById("diaryIssues");
  const good = document.getElementById("diaryGood");
  const reflection = document.getElementById("diaryReflection");
  const cancelBtn = document.getElementById("btn-diary-cancel");
  const saveBtn = document.getElementById("btn-diary-save");
  if (editId) editId.value = entry.id;
  if (dateEl) dateEl.value = entry.date;
  if (issues) issues.value = entry.issues || "";
  if (content) content.value = entry.content || "";
  if (good) good.value = entry.good || "";
  if (reflection) reflection.value = entry.reflection || "";
  if (cancelBtn) cancelBtn.hidden = false;
  if (saveBtn) saveBtn.textContent = "日記を更新";
  document.getElementById("diary-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function refreshDiaryList() {
  const listEl = document.getElementById("diary-list");
  const clearBtn = document.getElementById("btn-clear-all-diaries");
  if (!listEl || typeof DiaryStore === "undefined") return;

  const entries = DiaryStore.list();
  listEl.innerHTML = "";
  if (clearBtn) clearBtn.hidden = entries.length === 0;

  if (entries.length === 0) {
    listEl.innerHTML = "<p class=\"muted\">まだ日記はありません。</p>";
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "diary-items";
  for (const e of entries) {
    const li = document.createElement("li");
    li.className = "diary-item";

    const main = document.createElement("div");
    main.className = "diary-item-main";

    const dateStrong = document.createElement("strong");
    dateStrong.className = "diary-item-date";
    dateStrong.textContent = formatDiaryDate(e.date);

    if (e.issues) {
      const issueP = document.createElement("p");
      issueP.className = "diary-item-issues";
      issueP.textContent = `課題: ${e.issues.length > 60 ? `${e.issues.slice(0, 60)}…` : e.issues}`;
      main.appendChild(issueP);
    }

    const preview = document.createElement("p");
    preview.className = "diary-item-preview muted";
    const parts = [e.content, e.good, e.reflection].filter(Boolean);
    const text = parts.join(" ／ ");
    preview.textContent = text.length > 80 ? `${text.slice(0, 80)}…` : text || "（内容なし）";

    main.append(dateStrong, preview);

    const actions = document.createElement("div");
    actions.className = "diary-item-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-ghost btn-small";
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", () => loadDiaryToForm(e));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-ghost btn-small btn-danger-outline";
    delBtn.textContent = "削除";
    delBtn.addEventListener("click", () => {
      const ok = window.confirm(`${formatDiaryDate(e.date)}の日記を削除しますか？`);
      if (!ok) return;
      DiaryStore.remove(e.id);
      const editId = document.getElementById("diaryEditId");
      if (editId?.value === e.id) resetDiaryForm();
      refreshDiaryList();
      showDiaryMessage("日記を削除しました。");
    });

    actions.append(editBtn, delBtn);
    li.append(main, actions);
    ul.appendChild(li);
  }
  listEl.appendChild(ul);
}

function showDiaryMessage(text) {
  const msg = document.getElementById("diary-message");
  if (!msg) return;
  msg.textContent = text;
  msg.hidden = !text;
}

function initDiary() {
  const form = document.getElementById("diary-form");
  const dateEl = document.getElementById("diaryDate");
  if (dateEl && !dateEl.value) dateEl.value = todayDateString();

  document.getElementById("btn-diary-cancel")?.addEventListener("click", () => {
    resetDiaryForm();
    showDiaryMessage("");
  });

  document.getElementById("btn-clear-all-diaries")?.addEventListener("click", () => {
    const n = DiaryStore.list().length;
    if (n === 0) return;
    const ok = window.confirm(`日記をすべて削除しますか？（${n}件）\nこの操作は元に戻せません。`);
    if (!ok) return;
    DiaryStore.clearAll();
    resetDiaryForm();
    refreshDiaryList();
    showDiaryMessage("すべての日記を削除しました。");
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const playerName = document.getElementById("playerName")?.value || "";
    const res = DiaryStore.save({
      id: document.getElementById("diaryEditId")?.value || "",
      date: document.getElementById("diaryDate")?.value,
      issues: document.getElementById("diaryIssues")?.value,
      content: document.getElementById("diaryContent")?.value,
      good: document.getElementById("diaryGood")?.value,
      reflection: document.getElementById("diaryReflection")?.value,
      playerName,
    });
    if (!res.ok) {
      showDiaryMessage(res.message);
      return;
    }
    resetDiaryForm();
    refreshDiaryList();
    showDiaryMessage("日記を保存しました。");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAppMode();
  initDiary();
});
