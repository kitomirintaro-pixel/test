/**
 * 課題診断 — 質問からおすすめ課題を提案し、練習メニュー作成へ引き継ぐ
 */

const DIAGNOSIS_STEPS = [
  {
    id: "match",
    title: "試合・練習で困ること",
    hint: "当てはまるものを1つ以上選んでください",
    multi: true,
    requireSelection: true,
    options: [
      { id: "rally", label: "ラリーが続かない", issues: ["topspin_rally", "drive"] },
      { id: "attack", label: "攻め切れない・決めきれない", issues: ["drive", "smash", "third_ball"] },
      { id: "serve", label: "サーブ・第3球が弱い", issues: ["serve", "serve_under", "third_ball"] },
      { id: "receive", label: "レシーブ・返球でミスが多い", issues: ["underspin_receive", "spin_reading", "block_game"] },
      { id: "backhand", label: "バックが苦手", issues: ["backhand_drive"] },
      { id: "footwork", label: "足が遅い・位置取りが悪い", issues: ["footwork", "pace_adapt"] },
      { id: "mental", label: "緊張して普段の技が出ない", issues: ["mental"] },
    ],
  },
  {
    id: "technique",
    title: "伸ばしたい技術",
    hint: "気になるものを選んでください（任意）",
    multi: true,
    requireSelection: false,
    options: [
      { id: "drive_types", label: "ドライブの種類（スピード・ループなど）", issues: ["drive_speed", "drive_loop"] },
      { id: "flick", label: "フリック・チキータ", issues: ["flick_short"] },
      { id: "smash", label: "スマッシュ", issues: ["smash"] },
      { id: "serve_spin", label: "サーブの回転・変化", issues: ["serve_top", "serve_under", "serve_long"] },
      { id: "counter", label: "カウンター・速攻", issues: ["counter_attack"] },
      { id: "defense", label: "カット・守備", issues: ["cut_defense", "block_game"] },
      { id: "none", label: "特になし", issues: [] },
    ],
  },
  {
    id: "experience",
    title: "卓球歴",
    hint: "近いものを1つ選んでください",
    multi: false,
    requireSelection: true,
    options: [
      { id: "under1", label: "1年未満", ttHistory: "under1", issues: [] },
      { id: "1to3", label: "1〜3年", ttHistory: "1to3", issues: [] },
      { id: "3to5", label: "3〜5年", ttHistory: "3to5", issues: [] },
      { id: "5to10", label: "5〜10年", ttHistory: "5to10", issues: [] },
      { id: "over10", label: "10年以上", ttHistory: "over10", issues: [] },
    ],
  },
];

const DIAGNOSIS_GOAL_MAP = {
  rally: "fun_rally",
  attack: "fore_stable",
  serve: "serve_strong",
  receive: "receive_better",
  backhand: "backhand_up",
  footwork: "footwork_up",
  mental: "match_win",
};

function getIssueLabel(issueId) {
  if (typeof ISSUE_CATALOG !== "undefined" && ISSUE_CATALOG[issueId]?.label) {
    return ISSUE_CATALOG[issueId].label;
  }
  return issueId;
}

const Diagnosis = {
  stepIndex: 0,
  selections: {},

  init() {
    this.root = document.getElementById("diagnosis-app");
    if (!this.root) return;
    this.render();
  },

  resetView() {
    this.stepIndex = 0;
    this.selections = {};
    this.render();
  },

  getCurrentStep() {
    return DIAGNOSIS_STEPS[this.stepIndex] || null;
  },

  isResultStep() {
    return this.stepIndex >= DIAGNOSIS_STEPS.length;
  },

  canProceedStep(step) {
    const selected = this.selections[step.id] || [];
    if (step.requireSelection) return selected.length > 0;
    if (step.multi) return true;
    return selected.length > 0;
  },

  toggleOption(stepId, optionId) {
    const step = DIAGNOSIS_STEPS.find((s) => s.id === stepId);
    if (!step) return;
    if (!this.selections[stepId]) this.selections[stepId] = [];
    const selected = this.selections[stepId];
    const idx = selected.indexOf(optionId);
    if (step.multi) {
      if (optionId === "none") {
        this.selections[stepId] = idx >= 0 ? [] : ["none"];
        this.render();
        return;
      }
      const noneIdx = selected.indexOf("none");
      if (noneIdx >= 0) selected.splice(noneIdx, 1);
      if (idx >= 0) selected.splice(idx, 1);
      else selected.push(optionId);
    } else {
      this.selections[stepId] = idx >= 0 ? [] : [optionId];
    }
    this.render();
  },

  nextStep() {
    const step = this.getCurrentStep();
    if (!step || !this.canProceedStep(step)) return;
    this.stepIndex += 1;
    this.render();
  },

  prevStep() {
    if (this.stepIndex > 0) {
      this.stepIndex -= 1;
      this.render();
    }
  },

  computeResults() {
    const scores = new Map();
    let ttHistory = "1to3";
    const goalIds = new Set();

    for (const step of DIAGNOSIS_STEPS) {
      const picked = this.selections[step.id] || [];
      for (const optId of picked) {
        const opt = step.options.find((o) => o.id === optId);
        if (!opt) continue;
        if (opt.ttHistory) ttHistory = opt.ttHistory;
        if (DIAGNOSIS_GOAL_MAP[optId]) goalIds.add(DIAGNOSIS_GOAL_MAP[optId]);
        for (const issue of opt.issues || []) {
          scores.set(issue, (scores.get(issue) || 0) + 1);
        }
      }
    }

    if (scores.size === 0) {
      ["topspin_rally", "serve_under", "footwork"].forEach((id) => scores.set(id, 1));
      goalIds.add("fun_rally");
    }

    const issues = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)
      .slice(0, 6);

    return {
      issues,
      ttHistory,
      goalIds: [...goalIds].slice(0, 2),
    };
  },

  buildMenuPatch() {
    const result = this.computeResults();
    return {
      issues: result.issues,
      goalIds: result.goalIds.length ? result.goalIds : ["fun_rally"],
      ttHistory: result.ttHistory,
      practicePreset: "weekday-30-weekend-60",
      strengthIds: result.issues.includes("footwork") ? ["lateral"] : ["none"],
    };
  },

  applyToMenu({ generatePlan = false } = {}) {
    const patch = this.buildMenuPatch();
    if (typeof switchAppMode === "function") switchAppMode("menu");

    if (typeof SimpleInput !== "undefined") {
      SimpleInput.applyQuickRecommendation({ patch });
    } else {
      document.querySelectorAll('input[name="issue"]').forEach((el) => {
        el.checked = patch.issues.includes(el.value);
      });
    }

    window.setTimeout(() => {
      if (generatePlan && typeof generateAndShowPlan === "function") {
        const ok = generateAndShowPlan();
        const target = ok ? document.getElementById("plan-output") : document.getElementById("coach-form");
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        document.getElementById("coach-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (typeof showAppStatus === "function") {
          showAppStatus("課題をメニュー画面に反映しました。内容を確認してプランを生成できます。");
        }
      }
    }, 120);
  },

  render() {
    if (!this.root) return;
    this.root.innerHTML = "";

    if (this.isResultStep()) {
      this.renderResults();
      return;
    }

    const step = this.getCurrentStep();
    if (!step) return;

    const progress = document.createElement("p");
    progress.className = "diagnosis-progress muted";
    progress.textContent = `ステップ ${this.stepIndex + 1} / ${DIAGNOSIS_STEPS.length}`;

    const title = document.createElement("h2");
    title.className = "diagnosis-step-title";
    title.textContent = step.title;

    const hint = document.createElement("p");
    hint.className = "diagnosis-step-hint";
    hint.textContent = step.hint;

    const options = document.createElement("div");
    options.className = "diagnosis-options";
    const selected = this.selections[step.id] || [];

    for (const opt of step.options) {
      const btn = document.createElement("button");
      btn.type = "button";
      const isSelected = selected.includes(opt.id);
      btn.className = "diagnosis-option" + (isSelected ? " is-selected" : "");
      btn.textContent = opt.label;
      btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
      btn.addEventListener("click", () => this.toggleOption(step.id, opt.id));
      options.appendChild(btn);
    }

    const actions = document.createElement("div");
    actions.className = "diagnosis-actions";

    if (this.stepIndex > 0) {
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "btn btn-ghost";
      backBtn.textContent = "戻る";
      backBtn.addEventListener("click", () => this.prevStep());
      actions.appendChild(backBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn btn-primary btn-submit-main";
    nextBtn.textContent = this.stepIndex === DIAGNOSIS_STEPS.length - 1 ? "結果を見る" : "次へ";
    nextBtn.disabled = !this.canProceedStep(step);
    nextBtn.addEventListener("click", () => this.nextStep());
    actions.appendChild(nextBtn);

    this.root.append(progress, title, hint, options, actions);
  },

  renderResults() {
    const result = this.computeResults();

    const title = document.createElement("h2");
    title.className = "diagnosis-step-title";
    title.textContent = "あなたにおすすめの課題";

    const hint = document.createElement("p");
    hint.className = "diagnosis-step-hint";
    hint.textContent = "メニュー画面で内容を確認してからプランを生成できます。";

    const list = document.createElement("ul");
    list.className = "diagnosis-result-list";

    for (const issueId of result.issues) {
      const li = document.createElement("li");
      li.className = "diagnosis-result-item";
      if (typeof getIssueIconSvg === "function") {
        const icon = document.createElement("span");
        icon.className = "diagnosis-result-icon";
        icon.innerHTML = getIssueIconSvg(issueId);
        li.appendChild(icon);
      }
      const text = document.createElement("span");
      text.className = "diagnosis-result-label";
      text.textContent = getIssueLabel(issueId);
      li.appendChild(text);
      list.appendChild(li);
    }

    if (typeof initTechniqueImageFallback === "function") {
      initTechniqueImageFallback(list);
    }

    const actions = document.createElement("div");
    actions.className = "diagnosis-actions diagnosis-actions-result";

    const retryBtn = document.createElement("button");
    retryBtn.type = "button";
    retryBtn.className = "btn btn-ghost";
    retryBtn.textContent = "最初から";
    retryBtn.addEventListener("click", () => this.resetView());

    const reviewBtn = document.createElement("button");
    reviewBtn.type = "button";
    reviewBtn.className = "btn btn-ghost";
    reviewBtn.textContent = "メニューで確認する";
    reviewBtn.addEventListener("click", () => this.applyToMenu({ generatePlan: false }));

    const menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "btn btn-primary btn-submit-main";
    menuBtn.textContent = "すぐプランを作る";
    menuBtn.addEventListener("click", () => this.applyToMenu({ generatePlan: true }));

    actions.append(retryBtn, reviewBtn, menuBtn);
    this.root.append(title, hint, list, actions);
  },
};

function initDiagnosis() {
  Diagnosis.init();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initDiagnosis);
}
