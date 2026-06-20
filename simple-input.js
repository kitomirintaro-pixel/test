/**
 * 簡単入力モード — タップで選ぶピッカー UI
 */

const SIMPLE_ISSUE_GROUPS = [
  {
    title: "攻め・ラリー",
    items: [
      { id: "drive", label: "ドライブ" },
      { id: "drive_speed", label: "スピードドライブ" },
      { id: "drive_loop", label: "ループドライブ" },
      { id: "backhand_drive", label: "バックドライブ" },
      { id: "topspin_rally", label: "上回転ラリー" },
      { id: "counter_attack", label: "カウンター" },
      { id: "flick_short", label: "フリック・チキータ" },
      { id: "smash", label: "スマッシュ" },
      { id: "push_attack", label: "攻めプッシュ" },
      { id: "third_ball", label: "第3球" },
    ],
  },
  {
    title: "サーブ",
    items: [
      { id: "serve", label: "サーブ全般" },
      { id: "serve_top", label: "上回転系" },
      { id: "serve_under", label: "下回転系" },
      { id: "serve_long", label: "ロングサーブ" },
      { id: "serve_side_top", label: "横回転・上寄り" },
      { id: "serve_forehand", label: "フォアサーブ" },
      { id: "serve_backhand", label: "バックサーブ" },
    ],
  },
  {
    title: "守備・レシーブ",
    items: [
      { id: "cut_defense", label: "カット" },
      { id: "block_game", label: "ブロック" },
      { id: "underspin_receive", label: "下回転の受け" },
      { id: "spin_reading", label: "回転の見極め" },
    ],
  },
  {
    title: "身体・メンタル",
    items: [
      { id: "footwork", label: "フットワーク" },
      { id: "pace_adapt", label: "球速への適応" },
      { id: "mental", label: "メンタル" },
    ],
  },
];

const SIMPLE_GOAL_OPTIONS = [
  { id: "match_win", label: "試合で勝ちたい", text: "試合で勝てるようになりたい。緊張しても自分の技術を出したい。" },
  { id: "fore_stable", label: "フォアを安定", text: "フォアドライブ・ループを安定させたい。" },
  { id: "serve_strong", label: "サーブを強化", text: "サーブの精度と変化を上げ、第3球につなげたい。" },
  { id: "receive_better", label: "レシーブ改善", text: "レシーブのミスを減らし、ラリーに持ち込みたい。" },
  { id: "footwork_up", label: "フットワーク向上", text: "左右への動きを速く、無駄のないフットワークにしたい。" },
  { id: "backhand_up", label: "バックを強化", text: "バックドライブ・バックループを試合で使えるようにしたい。" },
  { id: "fun_rally", label: "ラリーを楽しむ", text: "まずはラリーが続くようになり、卓球を楽しみたい。" },
];

const SIMPLE_HISTORY_OPTIONS = [
  { id: "under1", label: "1年未満" },
  { id: "1to3", label: "1〜3年" },
  { id: "3to5", label: "3〜5年" },
  { id: "5to10", label: "5〜10年" },
  { id: "over10", label: "10年以上" },
];

const SIMPLE_PRACTICE_OPTIONS = [
  { id: "all-30", label: "毎日30分", summary: "毎日30分" },
  { id: "all-15", label: "毎日15分", summary: "毎日15分" },
  { id: "weekday-30-weekend-60", label: "平日30分・土日60分", summary: "平日30分・土日60分" },
  { id: "week3-30", label: "週3回・各30分", summary: "月・水・土 各30分" },
  { id: "weekend", label: "週末中心", summary: "土日60分・平日休み" },
];

const SIMPLE_STRENGTH_OPTIONS = [
  { id: "lateral", label: "左右ステップ" },
  { id: "stamina", label: "体力・持久力" },
  { id: "legs", label: "脚・下半身" },
  { id: "core", label: "体幹" },
  { id: "none", label: "今は不要" },
];

const PRACTICE_PRESET_SCHEDULES = {
  "all-30": { mon: 30, tue: 30, wed: 30, thu: 30, fri: 30, sat: 30, sun: 30 },
  "all-15": { mon: 15, tue: 15, wed: 15, thu: 15, fri: 15, sat: 15, sun: 15 },
  "weekday-30-weekend-60": { mon: 30, tue: 30, wed: 30, thu: 30, fri: 30, sat: 60, sun: 60 },
  "week3-30": { mon: 30, tue: 0, wed: 30, thu: 0, fri: 0, sat: 30, sun: 0 },
  "weekend": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 60, sun: 60 },
};

const SimpleInput = {
  mode: "simple",
  state: {
    issues: [],
    goalIds: [],
    ttHistory: "",
    practicePreset: "weekday-30-weekend-60",
    strengthIds: [],
  },
  _draft: null,
  _activePicker: null,

  init() {
    const saved = localStorage.getItem("spinCoachInputMode");
    if (saved === "detailed" || saved === "simple") this.mode = saved;
    this.applyMode(this.mode, false);
    this.updateAllSummaries();

    document.querySelectorAll("[data-input-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-input-mode");
        if (next === this.mode) return;
        if (next === "detailed") this.syncToDetailedForm();
        else this.syncFromDetailedForm();
        this.applyMode(next, true);
      });
    });

    document.querySelectorAll("[data-simple-picker]").forEach((btn) => {
      btn.addEventListener("click", () => this.openPicker(btn.getAttribute("data-simple-picker")));
    });

    document.getElementById("simple-sheet-close")?.addEventListener("click", () => this.closePicker());
    document.getElementById("simple-sheet-done")?.addEventListener("click", () => this.confirmPicker());
    document.getElementById("simple-picker-sheet")?.addEventListener("click", (e) => {
      if (e.target?.id === "simple-picker-sheet") this.closePicker();
    });
  },

  getMode() {
    return this.mode;
  },

  applyMode(mode, persist) {
    this.mode = mode;
    const simpleEl = document.getElementById("form-simple");
    const detailedEl = document.getElementById("form-detailed");
    if (simpleEl) simpleEl.hidden = mode !== "simple";
    if (detailedEl) detailedEl.hidden = mode !== "detailed";

    document.querySelectorAll("[data-input-mode]").forEach((btn) => {
      const active = btn.getAttribute("data-input-mode") === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (persist) localStorage.setItem("spinCoachInputMode", mode);
    if (mode === "simple") this.syncToDetailedForm();
  },

  openPicker(key) {
    this._activePicker = key;
    this._draft = this.cloneDraft(key);
    const dialog = document.getElementById("simple-picker-sheet");
    const title = document.getElementById("simple-sheet-title");
    const body = document.getElementById("simple-sheet-body");
    if (!dialog || !title || !body) return;

    const titles = {
      issues: "課題を選ぶ（複数可）",
      goals: "目標を選ぶ（複数可）",
      history: "卓球歴",
      practice: "練習時間",
      strength: "筋トレ（複数可）",
    };
    title.textContent = titles[key] || "選択";
    body.innerHTML = "";
    body.appendChild(this.buildPickerContent(key));
    dialog.showModal();
  },

  closePicker() {
    document.getElementById("simple-picker-sheet")?.close();
    this._activePicker = null;
    this._draft = null;
  },

  confirmPicker() {
    if (!this._activePicker || !this._draft) return;
    const key = this._activePicker;
    if (key === "issues") this.state.issues = [...this._draft];
    else if (key === "goals") this.state.goalIds = [...this._draft];
    else if (key === "history") this.state.ttHistory = this._draft;
    else if (key === "practice") this.state.practicePreset = this._draft;
    else if (key === "strength") {
      const picked = [...this._draft];
      if (picked.includes("none") && picked.length > 1) {
        this.state.strengthIds = picked.filter((id) => id !== "none");
      } else {
        this.state.strengthIds = picked.length ? picked : ["none"];
      }
    }
    this.syncToDetailedForm();
    this.updateAllSummaries();
    this.closePicker();
  },

  cloneDraft(key) {
    if (key === "issues") return [...this.state.issues];
    if (key === "goals") return [...this.state.goalIds];
    if (key === "history") return this.state.ttHistory || "";
    if (key === "practice") return this.state.practicePreset || "weekday-30-weekend-60";
    if (key === "strength") return this.state.strengthIds.length ? [...this.state.strengthIds] : ["none"];
    return null;
  },

  buildPickerContent(key) {
    const wrap = document.createElement("div");
    wrap.className = "simple-chip-area";

    if (key === "issues") {
      for (const group of SIMPLE_ISSUE_GROUPS) {
        const h = document.createElement("p");
        h.className = "simple-chip-group-title";
        h.textContent = group.title;
        wrap.appendChild(h);
        wrap.appendChild(this.buildChipGrid(group.items, this._draft, true));
      }
      return wrap;
    }

    if (key === "goals") {
      wrap.appendChild(this.buildChipGrid(SIMPLE_GOAL_OPTIONS, this._draft, true));
      return wrap;
    }

    if (key === "history") {
      wrap.appendChild(this.buildChipGrid(SIMPLE_HISTORY_OPTIONS, this._draft, false));
      return wrap;
    }

    if (key === "practice") {
      wrap.appendChild(this.buildChipGrid(SIMPLE_PRACTICE_OPTIONS, this._draft, false, "id", "label"));
      return wrap;
    }

    if (key === "strength") {
      wrap.appendChild(this.buildChipGrid(SIMPLE_STRENGTH_OPTIONS, this._draft, true));
      return wrap;
    }

    return wrap;
  },

  buildChipGrid(items, draft, multi, valueKey = "id", labelKey = "label") {
    const grid = document.createElement("div");
    grid.className = "simple-chip-grid";
    for (const item of items) {
      const btn = document.createElement("button");
      btn.type = "button";
      const val = item[valueKey];
      const selected = multi ? draft.includes(val) : draft === val;
      btn.className = `simple-chip${selected ? " is-selected" : ""}`;
      btn.textContent = item[labelKey];
      btn.addEventListener("click", () => {
        if (multi) {
          if (this._activePicker === "strength" && val === "none") {
            this._draft = ["none"];
          } else if (this._activePicker === "strength") {
            this._draft = this._draft.filter((id) => id !== "none");
            const idx = this._draft.indexOf(val);
            if (idx >= 0) this._draft.splice(idx, 1);
            else this._draft.push(val);
            if (this._draft.length === 0) this._draft = ["none"];
          } else {
            const idx = this._draft.indexOf(val);
            if (idx >= 0) this._draft.splice(idx, 1);
            else this._draft.push(val);
          }
        } else {
          this._draft = val;
        }
        const body = document.getElementById("simple-sheet-body");
        if (body) {
          body.innerHTML = "";
          body.appendChild(this.buildPickerContent(this._activePicker));
        }
      });
      grid.appendChild(btn);
    }
    return grid;
  },

  labelForIssue(id) {
    for (const group of SIMPLE_ISSUE_GROUPS) {
      const found = group.items.find((i) => i.id === id);
      if (found) return found.label;
    }
    return id;
  },

  updateAllSummaries() {
    this.setSummary(
      "simple-summary-issues",
      this.state.issues.length
        ? this.state.issues.map((id) => this.labelForIssue(id)).join("、")
        : "タップして選ぶ"
    );
    this.setSummary(
      "simple-summary-goals",
      this.state.goalIds.length
        ? this.state.goalIds.map((id) => SIMPLE_GOAL_OPTIONS.find((g) => g.id === id)?.label || id).join("、")
        : "タップして選ぶ"
    );
    this.setSummary(
      "simple-summary-history",
      SIMPLE_HISTORY_OPTIONS.find((h) => h.id === this.state.ttHistory)?.label || "タップして選ぶ"
    );
    this.setSummary(
      "simple-summary-practice",
      SIMPLE_PRACTICE_OPTIONS.find((p) => p.id === this.state.practicePreset)?.summary || "タップして選ぶ"
    );
    const strengthLabels = this.state.strengthIds
      .filter((id) => id !== "none")
      .map((id) => SIMPLE_STRENGTH_OPTIONS.find((s) => s.id === id)?.label || id);
    this.setSummary(
      "simple-summary-strength",
      strengthLabels.length ? strengthLabels.join("、") : "今は不要"
    );
  },

  setSummary(id, text) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text;
      el.classList.toggle("has-value", text !== "タップして選ぶ");
    }
  },

  syncToDetailedForm() {
    document.querySelectorAll('input[name="issue"]').forEach((el) => {
      el.checked = this.state.issues.includes(el.value);
    });

    const goalsText = this.state.goalIds
      .map((id) => SIMPLE_GOAL_OPTIONS.find((g) => g.id === id)?.text)
      .filter(Boolean)
      .join("\n");
    const goalsEl = document.getElementById("goals");
    if (goalsEl && goalsText) goalsEl.value = goalsText;

    const schedule = PRACTICE_PRESET_SCHEDULES[this.state.practicePreset];
    if (schedule && typeof restoreWeekScheduleToDom === "function") {
      restoreWeekScheduleToDom(schedule);
    }
  },

  syncFromDetailedForm() {
    this.state.issues = [...document.querySelectorAll('input[name="issue"]:checked')].map((el) => el.value);

    const goalsVal = document.getElementById("goals")?.value || "";
    this.state.goalIds = SIMPLE_GOAL_OPTIONS.filter((g) => goalsVal.includes(g.text.slice(0, 8))).map((g) => g.id);
    if (!this.state.goalIds.length && goalsVal.trim()) {
      this.state.goalIds = ["match_win"];
    }

    if (!this.state.ttHistory) this.state.ttHistory = "1to3";
    if (!this.state.practicePreset) this.state.practicePreset = "weekday-30-weekend-60";
    if (!this.state.strengthIds.length) this.state.strengthIds = ["none"];

    this.updateAllSummaries();
  },

  buildFormData() {
    const schedule = PRACTICE_PRESET_SCHEDULES[this.state.practicePreset] || PRACTICE_PRESET_SCHEDULES["weekday-30-weekend-60"];
    const goals = this.state.goalIds
      .map((id) => SIMPLE_GOAL_OPTIONS.find((g) => g.id === id)?.text)
      .filter(Boolean)
      .join("\n");

    return {
      issues: [...this.state.issues],
      goals,
      rpsRange: "unknown",
      stability: "unknown",
      freeform: "",
      playerName: document.getElementById("playerName")?.value || "",
      rubberFh: typeof readRubberSideFromDom === "function" ? readRubberSideFromDom("rubberFh") : {},
      rubberBh: typeof readRubberSideFromDom === "function" ? readRubberSideFromDom("rubberBh") : {},
      weekSchedule: schedule,
      strokeType: "unknown",
      spinRps: null,
      ballSpeed: null,
      ttHistory: this.state.ttHistory,
      strengthIds: this.state.strengthIds.filter((id) => id !== "none"),
      inputMode: "simple",
    };
  },
};

window.SimpleInput = SimpleInput;

document.addEventListener("DOMContentLoaded", () => {
  SimpleInput.init();
});
