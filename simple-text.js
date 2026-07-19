/** 表示用テキストを短く・やさしい言い方に整える */

function toSimple(text) {
  if (!text || typeof text !== "string") return text;
  let t = text
    .replace(/Spinsight/g, "計測")
    .replace(/再現性/g, "安定")
    .replace(/フリクション/g, "擦る感じ")
    .replace(/コンディション/g, "体調")
    .replace(/ブレ幅|ぶれ幅/g, "ぶれ")
    .replace(/トレードオフ/g, "バランス")
    .replace(/リリース/g, "出す瞬間")
    .replace(/イメージ/g, "意識")
    .replace(/優先度の高い順/g, "大事な順")
    .replace(/入射角/g, "当たる角度")
    .replace(/終端加速/g, "振りの終わり")
    .replace(/引き足/g, "足で引く")
    .replace(/ミート/g, "芯で当てる")
    .replace(/コンパクトに/g, "小さく")
    .replace(/数値ログ/g, "計測メモ")
    .replace(/／/g, "・");

  const first = t
    .split(/[。．!！?？\n]/)
    .map((s) => s.trim())
    .find(Boolean);
  t = first || t.trim();
  if (t && !/[。．!！?？]$/.test(t)) t += "。";
  if (t.length > 48) t = `${t.slice(0, 45)}…`;
  return t;
}

function simplifyPlan(plan) {
  if (!plan || !plan.ok) return plan;

  const labels = (plan.issueLabels || []).slice(0, 3);
  const shortSummary = labels.length
    ? `伸ばす課題: ${labels.join("・")}。下のメニューをやろう。`
    : "下のメニューをやろう。";

  return {
    ...plan,
    summary: shortSummary,
    improvements: (plan.improvements || []).slice(0, 3).map((x) => ({
      ...x,
      text: toSimple(x.text),
    })),
    drills: (plan.drills || []).slice(0, 4).map((d) => ({
      ...d,
      detail: toSimple(d.detail),
    })),
    strengthDrills: (plan.strengthDrills || []).slice(0, 2).map((d) => ({
      ...d,
      detail: toSimple(d.detail),
    })),
    spinsightHints: (plan.spinsightHints || []).slice(0, 2).map(toSimple),
    spinsightExtra: [],
    serveRubberExtras: (plan.serveRubberExtras || []).slice(0, 1).map(toSimple),
    rubberAdvice: (plan.rubberAdvice || []).slice(0, 2).map((b) => {
      const kept = (b.bullets || []).filter((line) =>
        /感触|回転|弾み|練習のコツ|硬さ|あなたのラバー|練習の考え方/.test(line)
      );
      const bullets = (kept.length ? kept : b.bullets || []).slice(0, 4).map(toSimple);
      return { ...b, bullets };
    }),
    week: (plan.week || []).map((w) => ({
      ...w,
      focus: toSimple(w.focus),
      extra: w.isRest ? "休み" : toSimple(w.extra),
      blocks: [],
    })),
  };
}
