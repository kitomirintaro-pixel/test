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
      { id: "drive_knuckle", label: "ナックルドライブ" },
      { id: "drive_curve", label: "カーブドライブ" },
      { id: "drive_shoot", label: "シュートドライブ" },
      { id: "backhand_drive", label: "バックドライブ" },
      { id: "topspin_rally", label: "上回転ラリー" },
      { id: "counter_attack", label: "カウンター" },
      { id: "flick_short", label: "フリック・チキータ" },
      { id: "smash", label: "スマッシュ" },
      { id: "push_attack", label: "攻めプッシュ" },
      { id: "lobbing", label: "ロビング" },
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
      { id: "serve_side_under", label: "横回転・下寄り" },
      { id: "serve_makikomi", label: "巻き込み系" },
      { id: "serve_yg", label: "YG系" },
      { id: "serve_squat", label: "しゃがみ込み系" },
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
  { id: "all-20", label: "毎日20分", summary: "毎日20分" },
  { id: "all-45", label: "毎日45分", summary: "毎日45分" },
  { id: "all-15", label: "毎日15分", summary: "毎日15分" },
  { id: "weekday-30-weekend-60", label: "平日30分・土日60分", summary: "平日30分・土日60分" },
  { id: "weekday-30-weekend-90", label: "平日30分・土日90分", summary: "平日30分・土日90分" },
  { id: "week3-30", label: "週3回・各30分", summary: "月・水・土 各30分" },
  { id: "week3-45", label: "週3回・各45分", summary: "月・水・土 各45分" },
  { id: "weekend", label: "週末中心", summary: "土日60分・平日休み" },
  { id: "weekend-long", label: "週末長め", summary: "土120分・日90分" },
];

const WEEK_DAYS = [
  { key: "mon", label: "月" },
  { key: "tue", label: "火" },
  { key: "wed", label: "水" },
  { key: "thu", label: "木" },
  { key: "fri", label: "金" },
  { key: "sat", label: "土" },
  { key: "sun", label: "日" },
];

const PRACTICE_PRESET_SCHEDULES = {
  "all-30": { mon: 30, tue: 30, wed: 30, thu: 30, fri: 30, sat: 30, sun: 30 },
  "all-20": { mon: 20, tue: 20, wed: 20, thu: 20, fri: 20, sat: 20, sun: 20 },
  "all-45": { mon: 45, tue: 45, wed: 45, thu: 45, fri: 45, sat: 45, sun: 45 },
  "all-15": { mon: 15, tue: 15, wed: 15, thu: 15, fri: 15, sat: 15, sun: 15 },
  "weekday-30-weekend-60": { mon: 30, tue: 30, wed: 30, thu: 30, fri: 30, sat: 60, sun: 60 },
  "weekday-30-weekend-90": { mon: 30, tue: 30, wed: 30, thu: 30, fri: 30, sat: 90, sun: 90 },
  "week3-30": { mon: 30, tue: 0, wed: 30, thu: 0, fri: 0, sat: 30, sun: 0 },
  "week3-45": { mon: 45, tue: 0, wed: 45, thu: 0, fri: 0, sat: 45, sun: 0 },
  weekend: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 60, sun: 60 },
  "weekend-long": { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 120, sun: 90 },
};

const QUICK_RECOMMENDATIONS = [
  {
    id: "beginner",
    label: "初心者",
    patch: {
      issues: ["topspin_rally", "serve_under", "footwork"],
      goalIds: ["fun_rally"],
      ttHistory: "under1",
      practicePreset: "week3-30",
      strengthIds: ["none"],
      matchFormat: "singles",
      dominantHand: "unknown",
    },
  },
  {
    id: "match_prep",
    label: "試合前",
    patch: {
      issues: ["serve", "third_ball", "mental"],
      goalIds: ["match_win"],
      ttHistory: "1to3",
      practicePreset: "weekday-30-weekend-60",
      strengthIds: ["stamina"],
      matchFormat: "singles",
      dominantHand: "unknown",
    },
  },
  {
    id: "serve_focus",
    label: "サーブ強化",
    patch: {
      issues: ["serve", "serve_long", "serve_under", "third_ball"],
      goalIds: ["serve_strong"],
      ttHistory: "1to3",
      practicePreset: "week3-45",
      strengthIds: ["core"],
      matchFormat: "singles",
      dominantHand: "unknown",
    },
  },
  {
    id: "doubles",
    label: "ダブルス",
    patch: {
      issues: ["underspin_receive", "flick_short", "footwork"],
      goalIds: ["receive_better"],
      ttHistory: "3to5",
      practicePreset: "weekday-30-weekend-90",
      strengthIds: ["lateral", "legs"],
      matchFormat: "doubles",
      dominantHand: "unknown",
    },
  },
  {
    id: "left_hand",
    label: "左利き向け",
    patch: {
      issues: ["drive", "serve_forehand", "footwork"],
      goalIds: ["fore_stable"],
      ttHistory: "1to3",
      practicePreset: "all-30",
      strengthIds: ["lateral"],
      matchFormat: "singles",
      dominantHand: "left",
    },
  },
];

const SIMPLE_STRENGTH_OPTIONS = [
  { id: "lateral", label: "左右ステップ" },
  { id: "stamina", label: "体力・持久力" },
  { id: "legs", label: "脚・下半身" },
  { id: "core", label: "体幹" },
  { id: "none", label: "今は不要" },
];

const SIMPLE_PRACTICE_MINUTES = [0, 10, 15, 20, 30, 45, 60, 90, 120];

function simplePracticeModeLabel(minutes) {
  if (!minutes) return "休み";
  if (minutes === 60) return "1時間練習モード";
  if (minutes === 120) return "2時間練習モード";
  if (minutes === 90) return "1時間30分練習モード";
  return `${minutes}分練習モード`;
}

function fillPracticeMinuteSelect(selectEl, selectedValue) {
  if (!selectEl) return;
  if (typeof populatePracticeMinuteSelect === "function") {
    populatePracticeMinuteSelect(selectEl, selectedValue);
    return;
  }
  const current = SIMPLE_PRACTICE_MINUTES.includes(selectedValue) ? selectedValue : 0;
  selectEl.innerHTML = "";
  for (const min of SIMPLE_PRACTICE_MINUTES) {
    const opt = document.createElement("option");
    opt.value = String(min);
    opt.textContent = simplePracticeModeLabel(min);
    if (min === current) opt.selected = true;
    selectEl.appendChild(opt);
  }
}

const GOAL_KEYWORD_MAP = [
  [/試合|勝ち|緊張|メンタル/, "match_win"],
  [/サーブ|第3|三球/, "serve_strong"],
  [/レシーブ|受け|ツッツキ|ストップ/, "receive_better"],
  [/フォア|ドライブ|ループ/, "fore_stable"],
  [/フット|足|ステップ|還元/, "footwork_up"],
  [/バック/, "backhand_up"],
  [/ラリー|楽し/, "fun_rally"],
];

function inferGoalIdsFromText(text) {
  const ids = new Set();
  const t = String(text || "").trim();
  if (!t) return [];
  for (const g of SIMPLE_GOAL_OPTIONS) {
    if (t.includes(g.label) || t.includes(g.text)) ids.add(g.id);
  }
  for (const [re, id] of GOAL_KEYWORD_MAP) {
    if (re.test(t)) ids.add(id);
  }
  return [...ids].slice(0, 2);
}

window.inferGoalIdsFromText = inferGoalIdsFromText;

const SimpleInput = {
  mode: "simple",
  state: {
    issues: [],
    goalIds: [],
    ttHistory: "",
    practicePreset: "weekday-30-weekend-60",
    customSchedule: null,
    strengthIds: [],
  },
  _draft: null,
  _draftSchedule: null,
  _activePicker: null,

  init() {
    const saved = localStorage.getItem("spinCoachInputMode");
    if (saved === "detailed" || saved === "simple") this.mode = saved;
    this.applyMode(this.mode, false);
    this.renderQuickRecommendations();
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
    if (mode === "simple") {
      this.syncToDetailedForm();
    } else if (typeof restoreWeekScheduleToDom === "function") {
      restoreWeekScheduleToDom(this.getActiveSchedule());
    } else if (typeof initPracticeMinuteSelects === "function") {
      initPracticeMinuteSelects();
    }
  },

  openPicker(key) {
    this._activePicker = key;
    this._draft = this.cloneDraft(key);
    if (key === "practice") {
      this._draftSchedule = { ...this.getActiveSchedule() };
    } else {
      this._draftSchedule = null;
    }
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
    this._draftSchedule = null;
  },

  confirmPicker() {
    if (!this._activePicker) return;
    const key = this._activePicker;
    if (key !== "practice" && (this._draft == null || this._draft === "")) return;
    if (key === "issues") this.state.issues = [...this._draft];
    else if (key === "goals") this.state.goalIds = [...this._draft];
    else if (key === "history") this.state.ttHistory = this._draft;
    else if (key === "practice") {
      const presetSchedule = this._draft && this._draft !== "custom" ? PRACTICE_PRESET_SCHEDULES[this._draft] : null;
      const scheduleChanged =
        this._draftSchedule &&
        presetSchedule &&
        WEEK_DAYS.some((d) => this._draftSchedule[d.key] !== presetSchedule[d.key]);
      if (this._draft === "custom" || scheduleChanged || !presetSchedule) {
        this.state.practicePreset = "custom";
        this.state.customSchedule = { ...(this._draftSchedule || this.getActiveSchedule()) };
      } else {
        this.state.practicePreset = this._draft;
        this.state.customSchedule = null;
      }
    }
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
    if (key === "practice") {
      if (this.state.practicePreset === "custom") return "custom";
      return this.state.practicePreset || "weekday-30-weekend-60";
    }
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
      const presetTitle = document.createElement("p");
      presetTitle.className = "simple-chip-group-title";
      presetTitle.textContent = "パターンから選ぶ";
      wrap.appendChild(presetTitle);
      wrap.appendChild(this.buildChipGrid(SIMPLE_PRACTICE_OPTIONS, this._draft === "custom" ? "" : this._draft, false, "id", "label"));

      const customTitle = document.createElement("p");
      customTitle.className = "simple-chip-group-title";
      customTitle.textContent = "曜日ごとに細かく（10分刻み）";
      wrap.appendChild(customTitle);

      const dayGrid = document.createElement("div");
      dayGrid.className = "simple-day-schedule-grid";
      for (const day of WEEK_DAYS) {
        const row = document.createElement("label");
        row.className = "simple-day-schedule-row";
        const span = document.createElement("span");
        span.textContent = `${day.label}曜`;
        const sel = document.createElement("select");
        sel.className = "simple-day-select";
        fillPracticeMinuteSelect(sel, this._draftSchedule?.[day.key] ?? 0);
        sel.addEventListener("change", () => {
          this._draftSchedule = this._draftSchedule || {};
          this._draftSchedule[day.key] = parseInt(sel.value, 10);
          this._draft = "custom";
        });
        row.append(span, sel);
        dayGrid.appendChild(row);
      }
      wrap.appendChild(dayGrid);
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
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
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
          if (this._activePicker === "practice") {
            this._draftSchedule = { ...(PRACTICE_PRESET_SCHEDULES[val] || this.getActiveSchedule()) };
          }
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
      this.practiceSummaryText()
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

  getActiveSchedule() {
    if (this.state.customSchedule) return { ...this.state.customSchedule };
    return { ...(PRACTICE_PRESET_SCHEDULES[this.state.practicePreset] || PRACTICE_PRESET_SCHEDULES["weekday-30-weekend-60"]) };
  },

  practiceSummaryText() {
    if (this.state.practicePreset === "custom" && this.state.customSchedule) {
      const parts = WEEK_DAYS.filter((d) => this.state.customSchedule[d.key] > 0).map(
        (d) => `${d.label}${this.state.customSchedule[d.key]}分`
      );
      return parts.length ? parts.join("・") : "タップして選ぶ";
    }
    return SIMPLE_PRACTICE_OPTIONS.find((p) => p.id === this.state.practicePreset)?.summary || "タップして選ぶ";
  },

  applyQuickRecommendation(rec) {
    if (!rec?.patch) return;
    const p = rec.patch;
    this.state.issues = [...(p.issues || [])];
    this.state.goalIds = [...(p.goalIds || [])];
    this.state.ttHistory = p.ttHistory || "";
    this.state.practicePreset = p.practicePreset || "weekday-30-weekend-60";
    this.state.customSchedule = null;
    this.state.strengthIds = [...(p.strengthIds || ["none"])];
    if (p.matchFormat) {
      const el = document.getElementById("matchFormat");
      if (el) el.value = p.matchFormat;
    }
    if (p.dominantHand) {
      const el = document.getElementById("dominantHand");
      if (el) el.value = p.dominantHand;
    }
    this.syncToDetailedForm();
    this.updateAllSummaries();
  },

  renderQuickRecommendations() {
    const row = document.getElementById("quick-recommend-row");
    if (!row) return;
    row.innerHTML = "";
    for (const rec of QUICK_RECOMMENDATIONS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quick-recommend-chip";
      btn.textContent = rec.label;
      btn.addEventListener("click", () => this.applyQuickRecommendation(rec));
      row.appendChild(btn);
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
    if (goalsEl) goalsEl.value = goalsText;

    const schedule = this.getActiveSchedule();
    if (schedule && typeof restoreWeekScheduleToDom === "function") {
      restoreWeekScheduleToDom(schedule);
    }
  },

  syncFromDetailedForm() {
    this.state.issues = [...document.querySelectorAll('input[name="issue"]:checked')].map((el) => el.value);

    const goalsVal = document.getElementById("goals")?.value || "";
    this.state.goalIds = SIMPLE_GOAL_OPTIONS.filter((g) => goalsVal.includes(g.text)).map((g) => g.id);
    if (!this.state.goalIds.length && goalsVal.trim()) {
      this.state.goalIds = ["match_win"];
    }

    if (!this.state.ttHistory) this.state.ttHistory = "1to3";
    if (!this.state.practicePreset) this.state.practicePreset = "weekday-30-weekend-60";
    if (!this.state.strengthIds.length) this.state.strengthIds = ["none"];

    this.updateAllSummaries();
  },

  buildFormData() {
    const schedule = this.getActiveSchedule();
    const presetGoals = this.state.goalIds
      .map((id) => SIMPLE_GOAL_OPTIONS.find((g) => g.id === id)?.text)
      .filter(Boolean);
    const customGoals = document.getElementById("goals")?.value?.trim() || "";
    const goals = [...presetGoals, customGoals].filter(Boolean).join("\n");
    const profile =
      typeof readPlayerProfileFromDom === "function"
        ? readPlayerProfileFromDom()
        : { matchFormat: "singles", dominantHand: "unknown" };
    const spinEl = (id) => document.getElementById(id);
    const parseNum = (id) => {
      const v = parseFloat(spinEl(id)?.value);
      return Number.isFinite(v) ? v : null;
    };

    return {
      issues: [...this.state.issues],
      goals,
      rpsRange: spinEl("rpsRange")?.value || "unknown",
      stability: spinEl("stability")?.value || "unknown",
      freeform: spinEl("spinsightNotes")?.value || "",
      playerName: document.getElementById("playerName")?.value || "",
      rubberFh: typeof readRubberSideFromDom === "function" ? readRubberSideFromDom("rubberFh") : {},
      rubberBh: typeof readRubberSideFromDom === "function" ? readRubberSideFromDom("rubberBh") : {},
      weekSchedule: schedule,
      strokeType: spinEl("strokeType")?.value || "unknown",
      spinRps: parseNum("spinRps"),
      ballSpeed: parseNum("ballSpeed"),
      ttHistory: this.state.ttHistory,
      strengthIds: this.state.strengthIds.filter((id) => id !== "none"),
      inputMode: "simple",
      matchFormat: profile.matchFormat,
      dominantHand: profile.dominantHand,
    };
  },
};

window.SimpleInput = SimpleInput;

document.addEventListener("DOMContentLoaded", () => {
  SimpleInput.init();
});
