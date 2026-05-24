/** 表示用テキストを短く・やさしい言い方に整える */
function toSimple(text) {
  if (!text || typeof text !== "string") return text;
  let t = text
    .replace(/Spinsight/g, "計測アプリ")
    .replace(/再現性/g, "同じ打ち方の安定")
    .replace(/フリクション/g, "摩擦")
    .replace(/コンディション/g, "体調")
    .replace(/ブレ幅/g, "ぶれ")
    .replace(/トレードオフ/g, "バランス")
    .replace(/リリース/g, "出す瞬間")
    .replace(/イメージ/g, "意識")
    .replace(/優先度の高い順/g, "大事な順");

  const sentences = t
    .split(/。/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length > 2) {
    t = `${sentences.slice(0, 2).join("。")}。`;
  }
  if (t.length > 96) {
    t = `${t.slice(0, 93)}…`;
  }
  return t;
}

function simplifyPlan(plan) {
  if (!plan || !plan.ok) return plan;
  return {
    ...plan,
    summary: toSimple(plan.summary),
    improvements: plan.improvements.map((x) => ({ ...x, text: toSimple(x.text) })),
    drills: plan.drills.map((d) => ({
      ...d,
      name: d.name,
      detail: toSimple(d.detail),
    })),
    spinsightHints: plan.spinsightHints.map(toSimple),
    spinsightExtra: plan.spinsightExtra.map(toSimple),
    serveRubberExtras: (plan.serveRubberExtras || []).map(toSimple),
    rubberAdvice: (plan.rubberAdvice || []).map((b) => ({
      ...b,
      bullets: b.bullets.map(toSimple),
    })),
    week: plan.week.map((w) => ({
      ...w,
      focus: toSimple(w.focus),
      extra: toSimple(w.extra),
    })),
  };
}
