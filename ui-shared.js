/** 共通 UI: ステータス表示・タブ操作・ヒーロー折りたたみ・データ入出力 */

function showAppStatus(text, durationMs = 3200) {
  const el = document.getElementById("app-status");
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  clearTimeout(showAppStatus._timer);
  showAppStatus._timer = window.setTimeout(() => {
    el.hidden = true;
    el.textContent = "";
  }, durationMs);
}

function appendHandoffNote(el, tag, text) {
  if (!el || !String(text || "").trim()) return;
  const block = `【${tag}】\n${String(text).trim()}`;
  const current = el.value || "";
  if (current.includes(block)) return;
  const re = new RegExp(`\\n?【${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}】[\\s\\S]*?(?=\\n【|$)`);
  const cleaned = current.replace(re, "").trim();
  el.value = cleaned ? `${cleaned}\n\n${block}` : block;
}

function stripHandoffNotes(value) {
  return String(value || "")
    .replace(/\n?【[^】]+】[\s\S]*?(?=\n【|$)/g, "")
    .trim();
}

function scrollToDetails(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.tagName === "DETAILS") el.open = true;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initScrollLinks() {
  document.querySelectorAll("[data-scroll-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      scrollToDetails(btn.getAttribute("data-scroll-target"));
    });
  });
}

function initTabKeyboard(tablistSelector) {
  const tablist = document.querySelector(tablistSelector);
  if (!tablist) return;

  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.tabIndex = tab.classList.contains("is-active") || tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    tab.addEventListener("keydown", (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        tabs[(idx + 1) % tabs.length].click();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        tabs[(idx - 1 + tabs.length) % tabs.length].click();
      } else if (e.key === "Home") {
        e.preventDefault();
        tabs[0].click();
      } else if (e.key === "End") {
        e.preventDefault();
        tabs[tabs.length - 1].click();
      }
    });
  });
}

function setHeroCollapsed(collapsed) {
  const hero = document.querySelector(".app-mode-hero");
  const toggle = document.querySelector(".app-mode-hero-toggle");
  if (!hero) return;
  hero.classList.toggle("is-collapsed", collapsed);
  if (toggle) {
    toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    toggle.textContent = collapsed ? "説明を開く" : "説明をたたむ";
  }
  try {
    sessionStorage.setItem("spincoach_hero_collapsed", collapsed ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function initHeroCollapse() {
  let collapsed = false;
  try {
    collapsed = sessionStorage.getItem("spincoach_hero_collapsed") === "1";
  } catch {
    /* ignore */
  }
  if (window.matchMedia("(max-width: 719px)").matches) {
    setHeroCollapsed(collapsed);
  }

  document.querySelector(".app-mode-hero-toggle")?.addEventListener("click", () => {
    const hero = document.querySelector(".app-mode-hero");
    setHeroCollapsed(!hero?.classList.contains("is-collapsed"));
  });

  document.querySelectorAll("[data-app-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 719px)").matches) {
        setHeroCollapsed(true);
      }
    });
  });
}

function initDataBackup() {
  const exportBtn = document.getElementById("btn-export-data");
  const importBtn = document.getElementById("btn-import-data");
  const importInput = document.getElementById("import-data-file");

  exportBtn?.addEventListener("click", () => {
    if (typeof DataStore === "undefined") return;
    const blob = new Blob([DataStore.exportAll()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spincoach-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showAppStatus("データをエクスポートしました。");
  });

  importBtn?.addEventListener("click", () => importInput?.click());

  importInput?.addEventListener("change", async () => {
    const file = importInput.files?.[0];
    importInput.value = "";
    if (!file || typeof DataStore === "undefined") return;
    try {
      const text = await file.text();
      const ok = window.confirm("インポートすると現在の記録・日記と置き換わります。続けますか？");
      if (!ok) return;
      const res = DataStore.importAll(text);
      if (!res.ok) {
        showAppStatus(res.message || "インポートに失敗しました。");
        return;
      }
      if (typeof refreshRecordList === "function") refreshRecordList();
      if (typeof refreshDiaryList === "function") refreshDiaryList();
      showAppStatus(`インポート完了（記録${res.records}件・日記${res.diaries}件）`);
    } catch {
      showAppStatus("ファイルの読み込みに失敗しました。");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollLinks();
  initTabKeyboard(".app-mode-grid");
  initTabKeyboard(".input-mode-bar");
  initHeroCollapse();
  initDataBackup();
});

window.showAppStatus = showAppStatus;
window.appendHandoffNote = appendHandoffNote;
window.stripHandoffNotes = stripHandoffNotes;
