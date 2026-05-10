/**
 * Spinsight 計測を補助するための練習プラン生成（ルールベース・ブラウザ内完結）
 * 公式 API 非連携: アプリで得た数値・感覚はユーザーが入力
 */

const ISSUE_CATALOG = {
  underspin_receive: {
    label: "下回転の受け（ツッツキ・ストップ）",
    improvements: [
      "ラケット面を「立てすぎ／寝かせすぎ」から微調整し、ボールの下を通す意識を固定する",
      "タイミングは足の入り→体重移動→スイングの順。手だけで取りに行かない",
      "回転が強い球ほど摩擦で掴む時間を短くし、前後のブレを減らす",
    ],
    drills: [
      {
        name: "一本ツッツキ（定点）",
        time: "10分",
        detail: "相手に多様な下回転を出してもらい、ネットミスと長さのばらつきを記録。目標は「同じフォームで長短を出し分け」。",
      },
      {
        name: "半面ストップ→プッシュ",
        time: "15分",
        detail: "ストップで止めた後、同じ受け方からプッシュへ繋ぐ。ラケット角度の差分を小さくする練習。",
      },
    ],
    spinsight:
      "ストローク練／スキルテストで同じ受けフォームを繰り返し、回転・スピードのブレを数値で追うと改善が早いです。",
  },
  topspin_rally: {
    label: "上回転ラリー（フォア・バック）",
    improvements: [
      "打点を一定にする（高すぎ／低すぎの自覚を Spinsight の再現性チェックに繋げる）",
      "スイングは「小さく当てる→押し込む」の順で増幅。いきなり大きく振らない",
      "相手球の上回転が強いほど、顔の前で待ってから前に送り出す",
    ],
    drills: [
      {
        name: "クロス連続ループ",
        time: "15分",
        detail: "打点とラインを固定し、20本連続を目標。切れたら原因を「打点／面／タイミング」のどれか一つに絞る。",
      },
      {
        name: "バックからフォアへ替え",
        time: "12分",
        detail: "替えの一歩の幅を一定に。替え後の第一打だけ Spinsight で再測定すると癖が見えます。",
      },
    ],
    spinsight:
      "同じドリル条件で回転数・球速を比較し、『振ったつもり』と実測の差を週次で見るのが有効です。",
  },
  spin_reading: {
    label: "回転の見極め・ミート",
    improvements: [
      "サーブ／第三球は「音・マーク・軌道」の手掛かりをセットで観察する",
      "返す前にラベル（上／下／ノースピン寄り）を心の中で言語化する",
      "ミートが甘いときは面の調整より、打点を手前に取りすぎていないかを疑う",
    ],
    drills: [
      {
        name: "隠しマルチボール（回転当て）",
        time: "10分",
        detail: "コーチがランダムに上下を出し、ラケットを触る前に回転を宣言。正答率より反応速度を重視。",
      },
      {
        name: "サーブ受け一本勝負",
        time: "15分",
        detail: "同一サーブでも第二球まで繋がないと負け。読みと足の入りをセットで鍛える。",
      },
    ],
    spinsight:
      "OpenPlay で実戦に近い球を受け、回転方向・回転量の分布をダッシュボードで確認すると癖が可視化されます。",
  },
  serve: {
    label: "サーブの質・変化",
    improvements: [
      "投げ・引き・出すのリズムを一定にし、ボールの落ちる位置を固定する",
      "回転差は腕の速さより、ラケット軌道とボールの摩擦位置で作る",
      "ミスしたサーブの再現性を上げる（同じミスを意図的に減らす）",
    ],
    drills: [
      {
        name: "ターゲットサーブ 20本",
        time: "12分",
        detail: "コースと長さを指定し、20本中の入り数を記録。今日は回転量より入り率優先でも可。",
      },
      {
        name: "同一モーション二種",
        time: "15分",
        detail: "振りが似た上回転と下回転（またはノースピン寄り）を交互に。相手の読み損ねを増やす。",
      },
    ],
    spinsight:
      "サーブ練モードで回転・速度を都度確認し、『狙い値』に対するブレ幅を週で比較してください。",
  },
  third_ball: {
    label: "第3球（サーブ＆レシーブ後の攻め）",
    improvements: [
      "サーブ後の還元と、第三球の足の入り方をセットで設計する",
      "レシーブの質が悪い日は第三球を決め切らず、確率の高いコースに寄せる",
      "相手の出だしパターンを2パターンに分類し、対応表を作る",
    ],
    drills: [
      {
        name: "サーブ→フリック or ツッツキ→攻め",
        time: "20分",
        detail: "レシーブ球に応じて第三球を限定（例: バックミドル）。ミス理由を毎回一語でメモ。",
      },
      {
        name: "レシーブ限定→一本攻め",
        time: "15分",
        detail: "相手のサーブを固定し、第三球だけフルスイング可。足の替え幅を一定に。",
      },
    ],
    spinsight:
      "第三球のスイングだけを切り出して測定し、回転が落ちるポイント（打点・面）を特定します。",
  },
  footwork: {
    label: "フットワーク・身体操作",
    improvements: [
      "一歩目の方向と幅を揃え、最後はクロスステップで調整する癖を付ける",
      "打った後の還元を「相手のラケット」ではなく「自分の重心の中心」基準にする",
      "無理な飛び込みは打点が下がり回転負けしやすい。踏み替えのタイミングを早める",
    ],
    drills: [
      {
        name: "三点踏み替え多球",
        time: "15分",
        detail: "フォア・ミドル・バックへランダム。打ったら必ず中央へ還元。",
      },
      {
        name: "ペン／シェーク替えフットワーク",
        time: "10分",
        detail: "自分の持ち方に合わせ、替えの無駄歩数を減らす。替え後の第一打だけ計測しても良い。",
      },
    ],
    spinsight:
      "同じドリルでも、足が遅い日は球速・回転が落ちやすい傾向があります。コンディション別に記録してください。",
  },
  pace_adapt: {
    label: "球の速さ・タメへの適応",
    improvements: [
      "早い球は打点を手前に取りすぎない。遅い球は待ちすぎて下がらない",
      "タメがある相手には、自分のスイングも短くタメを作って合わせる",
      "練習では意図的に「遅い多球→速い実戦」の順で切り替える",
    ],
    drills: [
      {
        name: "速度変化ラリー",
        time: "15分",
        detail: "コーチ／パートナーが速球と遅球を混ぜる。打点の前後ズレを自己採点。",
      },
      {
        name: "前ステップ限定レシーブ",
        time: "12分",
        detail: "下がらずに前で処理。早い球の練習になる。疲れたら中止。",
      },
    ],
    spinsight:
      "球速と回転の組み合わせをログ化し、苦手ゾーン（速×下など）を特定すると対策が明確になります。",
  },
  mental: {
    label: "メンタル・試合運び",
    improvements: [
      "1点ごとのルーティン（呼吸・ボール観察）を3秒以内に固定する",
      "ミス後の次の一球は難易度を下げ、確実に台に上げる選択を優先",
      "得点が入った後の緩みを「ルーティン再開」で防ぐ",
    ],
    drills: [
      {
        name: "カウント別シミュ",
        time: "20分",
        detail: "8-8、9-9、デュースを繰り返し、得点後の一本だけルーティン必須。",
      },
      {
        name: "ペナルティ付きゲーム",
        time: "15分",
        detail: "決め手を外したら相手に1点など、プレッシャーを人工的に付与。",
      },
    ],
    spinsight:
      "試合モードの数値と練習モードを比較し、本番で落ちる項目（球速・回転・再現性）を特定します。",
  },
};

const KEYWORD_MAP = [
  [/下回転|ツッツキ|ストップ|チキータ|バック/, "underspin_receive"],
  [/上回転|ループ|ドライブ|ラリー/, "topspin_rally"],
  [/回転|読み|ミート|見極め/, "spin_reading"],
  [/サーブ|サービス/, "serve"],
  [/第3|三球|三拍子|サーブ.*レシーブ/, "third_ball"],
  [/フット|足|ステップ|還元/, "footwork"],
  [/速い|遅い|タメ|球速/, "pace_adapt"],
  [/メンタル|試合|緊張|マインド/, "mental"],
];

function inferIssuesFromText(text) {
  const ids = new Set();
  const t = text.trim();
  if (!t) return [];
  for (const [re, id] of KEYWORD_MAP) {
    if (re.test(t)) ids.add(id);
  }
  return [...ids];
}

function spinsightContextNotes({ rpsRange, stability, freeform }) {
  const lines = [];
  if (rpsRange && rpsRange !== "unknown") {
    const map = {
      low: "回転の絶対値が低めの日は、打点・面のミスが数値に出やすいです。フォームの再現性を優先しましょう。",
      mid: "中程度の回転域なら、球質の差は「摩擦の質」や「スイング軌道」で作れます。数値のブレ幅を週で比較してください。",
      high: "高回転域に入っているなら、次は打点の安定とスピードのバランス（スピン効率）を Spinsight で追う段階です。",
    };
    lines.push(map[rpsRange] || "");
  }
  if (stability && stability !== "unknown") {
    const map = {
      shaky: "再現性がまだ揺らぐ段階です。同じドリル条件で測定回数を増やし、中央値ではなく『ばらつき』を見てください。",
      ok: "そこそこ安定しています。次は一つ上の難易度（球速・回転）へ条件を変えて再測定しましょう。",
      solid: "安定しているので、試合モードでの分布を見て弱点コースを特定するのがおすすめです。",
    };
    lines.push(map[stability] || "");
  }
  if (freeform.trim()) {
    lines.push(`あなたの Spinsight メモ: 「${freeform.trim()}」— 週次で同じ条件を再測定し、差分だけを見ると改善点が明確になります。`);
  }
  if (lines.filter(Boolean).length === 0) {
    lines.push(
      "Spinsight のダッシュボードで、同じメニュー（例: ストローク練）を週1回同条件で測ると、感覚と数値のズレが減ります。"
    );
  }
  return lines.filter(Boolean);
}

function uniqueByKey(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const k = keyFn(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function buildWeeklyPlan(issueIds) {
  const days = [
    { day: "月", focus: "基礎リズム", extra: "ウォームアップ多め、フォーム確認" },
    { day: "火", focus: "弱点ドリルA", extra: "計測セット ×2（前後半で同条件）" },
    { day: "水", focus: "休息 or 軽い素振り", extra: "肩・手首のケア、動画レビュー" },
    { day: "木", focus: "弱点ドリルB", extra: "ゲーム形式でプレッシャーを付与" },
    { day: "金", focus: "実戦近似", extra: "OpenPlay／試合モードでログ比較" },
    { day: "土", focus: "メンテナンス", extra: "得意技の再現性チェックのみ短時間" },
    { day: "日", focus: "振り返り", extra: "メモを1行だけ残し、来週の一項目を決める" },
  ];

  const primary = issueIds[0] ? ISSUE_CATALOG[issueIds[0]] : null;
  const secondary = issueIds[1] ? ISSUE_CATALOG[issueIds[1]] : null;

  if (primary) {
    days[1].focus = `${primary.label}（定点）`;
    days[1].extra = primary.drills[0] ? `${primary.drills[0].name} を中心に` : days[1].extra;
  }
  if (secondary) {
    days[3].focus = `${secondary.label}（応用）`;
    days[3].extra = secondary.drills[0] ? `${secondary.drills[0].name} をゲーム化` : days[3].extra;
  }

  return days;
}

function generatePlan(formData) {
  const selected = [...formData.issues];
  const inferred = inferIssuesFromText(formData.goals + " " + formData.freeform);
  const issueIds = uniqueByKey([...selected, ...inferred], (id) => id);

  if (issueIds.length === 0) {
    return {
      ok: false,
      message: "課題を1つ以上選ぶか、「やりたいこと」にキーワード（例: 下回転、サーブ）を書いてください。",
    };
  }

  const improvements = [];
  const drills = [];
  const spinsightHints = [];

  for (const id of issueIds) {
    const cat = ISSUE_CATALOG[id];
    if (!cat) continue;
    improvements.push(...cat.improvements.map((t) => ({ id, text: t })));
    drills.push(...cat.drills.map((d) => ({ ...d, issueId: id })));
    spinsightHints.push(cat.spinsight);
  }

  const topImprovements = uniqueByKey(improvements, (x) => x.text).slice(0, 6);
  const topDrills = uniqueByKey(drills, (d) => `${d.name}-${d.detail}`).slice(0, 7);
  const topHints = [...new Set(spinsightHints)].slice(0, 4);
  const spinsightExtra = spinsightContextNotes(formData);

  const summaryParts = issueIds.map((id) => ISSUE_CATALOG[id]?.label).filter(Boolean);
  const summary = `今回の入力から、特に強化すると効果が出やすいのは「${summaryParts.join("」「")}」です。下記は優先度の高い順の改善ポイントと、週次の進め方です。`;

  return {
    ok: true,
    summary,
    improvements: topImprovements,
    drills: topDrills,
    spinsightHints: topHints,
    spinsightExtra,
    week: buildWeeklyPlan(issueIds),
    issueLabels: summaryParts,
  };
}

function renderPlan(plan, container) {
  container.innerHTML = "";
  container.hidden = false;

  const intro = document.createElement("p");
  intro.className = "plan-summary";
  intro.textContent = plan.summary;
  container.appendChild(intro);

  const impH = document.createElement("h2");
  impH.textContent = "改善のポイント";
  container.appendChild(impH);

  const impOl = document.createElement("ol");
  impOl.className = "plan-list";
  for (const item of plan.improvements) {
    const li = document.createElement("li");
    li.textContent = item.text;
    impOl.appendChild(li);
  }
  container.appendChild(impOl);

  const drillH = document.createElement("h2");
  drillH.textContent = "練習メニュー（今日〜今週）";
  container.appendChild(drillH);

  const drillUl = document.createElement("ul");
  drillUl.className = "drill-cards";
  for (const d of plan.drills) {
    const li = document.createElement("li");
    li.className = "drill-card";
    const title = document.createElement("h3");
    title.textContent = d.name;
    const meta = document.createElement("p");
    meta.className = "drill-meta";
    meta.textContent = `目安時間: ${d.time}`;
    const body = document.createElement("p");
    body.textContent = d.detail;
    li.append(title, meta, body);
    drillUl.appendChild(li);
  }
  container.appendChild(drillUl);

  const weekH = document.createElement("h2");
  weekH.textContent = "1週間の進め方（目安）";
  container.appendChild(weekH);

  const weekTable = document.createElement("div");
  weekTable.className = "week-grid";
  for (const row of plan.week) {
    const cell = document.createElement("div");
    cell.className = "week-cell";
    const d = document.createElement("strong");
    d.textContent = `${row.day}曜`;
    const f = document.createElement("p");
    f.className = "week-focus";
    f.textContent = row.focus;
    const e = document.createElement("p");
    e.className = "week-extra muted";
    e.textContent = row.extra;
    cell.append(d, f, e);
    weekTable.appendChild(cell);
  }
  container.appendChild(weekTable);

  const sh = document.createElement("h2");
  sh.textContent = "Spinsight 活用のヒント";
  container.appendChild(sh);

  const hintP = document.createElement("ul");
  hintP.className = "plan-list";
  for (const h of plan.spinsightHints) {
    const li = document.createElement("li");
    li.textContent = h;
    hintP.appendChild(li);
  }
  container.appendChild(hintP);

  if (plan.spinsightExtra.length) {
    const extraH = document.createElement("h3");
    extraH.textContent = "あなたの入力に基づく計測メモ";
    container.appendChild(extraH);
    const extraUl = document.createElement("ul");
    extraUl.className = "plan-list muted";
    for (const line of plan.spinsightExtra) {
      const li = document.createElement("li");
      li.textContent = line;
      extraUl.appendChild(li);
    }
    container.appendChild(extraUl);
  }

  const disclaimer = document.createElement("p");
  disclaimer.className = "disclaimer muted";
  disclaimer.textContent =
    "本サイトは Spinsight 非公式の補助ツールです。怪我のリスクがあるドリルは無理せず、コーチやパートナーと相談してください。";
  container.appendChild(disclaimer);
}

function collectForm() {
  const issues = [...document.querySelectorAll('input[name="issue"]:checked')].map((el) => el.value);
  const goals = document.getElementById("goals").value;
  const rpsRange = document.getElementById("rpsRange").value;
  const stability = document.getElementById("stability").value;
  const freeform = document.getElementById("spinsightNotes").value;
  return { issues, goals, rpsRange, stability, freeform };
}

function init() {
  const form = document.getElementById("coach-form");
  const out = document.getElementById("plan-output");
  const err = document.getElementById("plan-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    err.textContent = "";
    err.hidden = true;
    const data = collectForm();
    const plan = generatePlan(data);
    if (!plan.ok) {
      err.textContent = plan.message;
      err.hidden = false;
      out.hidden = true;
      out.innerHTML = "";
      return;
    }
    renderPlan(plan, out);
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

document.addEventListener("DOMContentLoaded", init);
