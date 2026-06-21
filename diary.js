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

const DIARY_EXAMPLES = {
  issues: "ロングサーブの深さ、バックドライブの安定、第3球の入り",
  content: "30分練習。フォアドライブ定点20本、サーブ各種20本、多球ラリー15分。",
  good: "バックの替えが早くなった。ロングサーブの深さが安定してきた。",
  reflection: "第3球で振りが大きくなりすぎた。次回はコンパクトに当てる。",
};

function switchAppMode(mode) {
  const menuView = document.getElementById("view-menu");
  const diaryView = document.getElementById("view-diary");
  const diagnosisView = document.getElementById("view-diagnosis");
  const tabMenu = document.getElementById("tab-menu");
  const tabDiary = document.getElementById("tab-diary");
  const tabDiagnosis = document.getElementById("tab-diagnosis");
  if (!menuView || !diaryView || !tabMenu || !tabDiary) return;

  const active = mode === "diary" || mode === "diagnosis" ? mode : "menu";
  menuView.hidden = active !== "menu";
  diaryView.hidden = active !== "diary";
  if (diagnosisView) diagnosisView.hidden = active !== "diagnosis";

  tabMenu.classList.toggle("is-active", active === "menu");
  tabDiary.classList.toggle("is-active", active === "diary");
  if (tabDiagnosis) tabDiagnosis.classList.toggle("is-active", active === "diagnosis");

  tabMenu.setAttribute("aria-selected", String(active === "menu"));
  tabDiary.setAttribute("aria-selected", String(active === "diary"));
  if (tabDiagnosis) tabDiagnosis.setAttribute("aria-selected", String(active === "diagnosis"));

  document.querySelectorAll(".app-mode-grid [role='tab']").forEach((tab) => {
    const selected = tab.classList.contains("is-active");
    tab.tabIndex = selected ? 0 : -1;
  });

  try {
    sessionStorage.setItem("spincoach_app_mode", active);
  } catch {
    /* ignore */
  }

  if (active === "diary") {
    const dateEl = document.getElementById("diaryDate");
    if (dateEl && !dateEl.value) dateEl.value = todayDateString();
    refreshDiaryList();
  }

  if (active === "diagnosis" && typeof Diagnosis !== "undefined") {
    Diagnosis.render();
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
  const valid = ["menu", "diary", "diagnosis"];
  switchAppMode(valid.includes(saved) ? saved : "menu");
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

    const menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "btn btn-primary btn-submit-main diary-item-menu-btn";
    menuBtn.textContent = "この課題でメニューを作る";
    menuBtn.addEventListener("click", () => {
      loadDiaryToForm(e);
      createMenuFromDiary();
    });

    const subActions = document.createElement("div");
    subActions.className = "diary-item-sub-actions";

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "btn btn-ghost btn-small";
    copyBtn.textContent = "コピー";
    copyBtn.addEventListener("click", async () => {
      const res = await copyTextToClipboard(diaryEntryToPlainText(e));
      showDiaryMessage(res.ok ? "日記をコピーしました。" : res.message || "コピーに失敗しました。");
    });

    const pdfBtn = document.createElement("button");
    pdfBtn.type = "button";
    pdfBtn.className = "btn btn-ghost btn-small";
    pdfBtn.textContent = "PDF";
    pdfBtn.addEventListener("click", () => {
      if (typeof printDiaryEntry === "function") printDiaryEntry(e);
    });

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

    subActions.append(copyBtn, pdfBtn, editBtn, delBtn);
    actions.append(menuBtn, subActions);
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
  msg.setAttribute("role", "status");
  if (text && typeof showAppStatus === "function") showAppStatus(text);
}

function getDiaryFieldsForMenu() {
  return {
    issues: document.getElementById("diaryIssues")?.value || "",
    content: document.getElementById("diaryContent")?.value || "",
    good: document.getElementById("diaryGood")?.value || "",
    reflection: document.getElementById("diaryReflection")?.value || "",
  };
}

function getDiaryCombinedText(fields = getDiaryFieldsForMenu()) {
  return [fields.issues, fields.content, fields.good, fields.reflection]
    .map((s) => String(s || "").trim())
    .filter(Boolean)
    .join("\n");
}

function inferIssuesFromDiaryText(text) {
  if (!text.trim()) return [];
  const inferred = typeof inferIssuesFromText === "function" ? inferIssuesFromText(text) : [];
  return inferred.length ? inferred : ["drive"];
}

function createMenuFromDiary() {
  const fields = getDiaryFieldsForMenu();
  const combined = getDiaryCombinedText(fields);
  const issueIds = inferIssuesFromDiaryText(combined);
  const goalIds =
    typeof inferGoalIdsFromText === "function" ? inferGoalIdsFromText(combined) : [];
  const finalGoalIds = goalIds.length ? goalIds : ["fun_rally"];

  switchAppMode("menu");

  if (typeof SimpleInput !== "undefined") {
    SimpleInput.applyQuickRecommendation({
      patch: {
        issues: issueIds.slice(0, 6),
        goalIds: finalGoalIds,
        ttHistory: SimpleInput.state.ttHistory || "1to3",
        practicePreset: SimpleInput.state.practicePreset || "weekday-30-weekend-60",
        strengthIds: ["none"],
      },
    });
  } else {
    document.querySelectorAll('input[name="issue"]').forEach((el) => {
      el.checked = issueIds.includes(el.value);
    });
  }

  const notesEl = document.getElementById("spinsightNotes");
  if (notesEl && combined && typeof appendHandoffNote === "function") {
    appendHandoffNote(notesEl, "日記より", combined.slice(0, 600));
  }

  const goalsEl = document.getElementById("goals");
  if (goalsEl && fields.reflection.trim()) {
    goalsEl.value = fields.reflection.trim().slice(0, 500);
    if (typeof SimpleInput !== "undefined") {
      SimpleInput.syncFromDetailedForm();
      SimpleInput.updateAllSummaries();
    }
  }

  window.setTimeout(() => {
    if (typeof generateAndShowPlan === "function") {
      const ok = generateAndShowPlan();
      const target = ok ? document.getElementById("plan-output") : document.getElementById("coach-form");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof showAppStatus === "function") {
        showAppStatus(
          ok
            ? "日記の内容から練習メニューを作成しました。"
            : "課題を反映しました。内容を確認してプランを生成してください。"
        );
      }
    } else {
      document.getElementById("coach-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof showAppStatus === "function") {
        showAppStatus("日記の課題をメニュー画面に反映しました。");
      }
    }
  }, 120);
}

function initDiary() {
  const form = document.getElementById("diary-form");
  const dateEl = document.getElementById("diaryDate");
  if (dateEl && !dateEl.value) dateEl.value = todayDateString();

  document.getElementById("btn-diary-cancel")?.addEventListener("click", () => {
    resetDiaryForm();
    showDiaryMessage("");
  });

  document.querySelectorAll("[data-diary-example]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-diary-example");
      const examples = DIARY_EXAMPLES;
      if (!examples) return;
      if (key === "full") {
        document.getElementById("diaryIssues").value = examples.issues;
        document.getElementById("diaryContent").value = examples.content;
        document.getElementById("diaryGood").value = examples.good;
        document.getElementById("diaryReflection").value = examples.reflection;
      } else if (examples[key]) {
        const el = document.getElementById(
          key === "issues" ? "diaryIssues" : key === "content" ? "diaryContent" : key === "good" ? "diaryGood" : "diaryReflection"
        );
        if (el) el.value = examples[key];
      }
    });
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

  document.getElementById("btn-diary-create-menu")?.addEventListener("click", () => {
    createMenuFromDiary();
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
