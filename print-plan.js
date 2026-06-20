function printPlan(plan, playerName) {
  const wrap = document.getElementById("print-root");
  if (!wrap) return;

  const name = playerName?.trim() || "（名前なし）";
  const date = new Date().toLocaleString("ja-JP");

  let html = `<div class="print-doc">
    <h1>SpinCoach 練習プラン</h1>
    <p class="print-meta"><strong>${escapeHtml(name)}</strong> さん　／　${escapeHtml(date)}</p>`;

  const meta = [];
  if (plan.matchFormatLabel) meta.push(`試合形式: ${escapeHtml(plan.matchFormatLabel)}`);
  if (plan.dominantHandLabel && plan.dominantHand !== "unknown") meta.push(`利き手: ${escapeHtml(plan.dominantHandLabel)}`);
  if (plan.ttHistoryLabel) meta.push(`卓球歴: ${escapeHtml(plan.ttHistoryLabel)}`);
  if (meta.length) html += `<p class="print-meta-sub">${meta.join("　／　")}</p>`;

  html += `<p>${escapeHtml(plan.summary)}</p>`;

  if (plan.rubberAdvice?.length) {
    html += `<h2>ラバーアドバイス</h2>`;
    for (const block of plan.rubberAdvice) {
      html += `<p><strong>${escapeHtml(block.title)}</strong></p><ul>`;
      for (const b of block.bullets) html += `<li>${escapeHtml(b)}</li>`;
      html += `</ul>`;
    }
  }

  if (plan.improvements?.length) {
    html += `<h2>改善ポイント</h2><ol>`;
    for (const i of plan.improvements) {
      html += `<li>${escapeHtml(i.text)}</li>`;
    }
    html += `</ol>`;
  }

  if (plan.drills?.length) {
    html += `<h2>練習メニュー</h2>`;
    for (const d of plan.drills) {
      html += `<p><strong>${escapeHtml(d.name)}</strong>（${escapeHtml(d.time)}）<br>${escapeHtml(d.detail)}</p>`;
    }
  }

  if (plan.strengthDrills?.length) {
    html += `<h2>筋トレ</h2>`;
    for (const d of plan.strengthDrills) {
      html += `<p><strong>${escapeHtml(d.name)}</strong>（${escapeHtml(d.time)}）<br>${escapeHtml(d.detail)}</p>`;
    }
  }

  if (plan.week?.length) {
    html += `<h2>1週間の目安</h2><ul>`;
    for (const w of plan.week) {
      const mode = w.modeLabel ? `【${escapeHtml(w.modeLabel)}】` : "";
      html += `<li>${escapeHtml(w.day)}: ${mode} ${escapeHtml(w.focus)} — ${escapeHtml(w.extra)}`;
      if (w.blocks?.length) {
        html += `<ul>`;
        for (const b of w.blocks) {
          html += `<li>${escapeHtml(b.label)}（${b.min}分）: ${escapeHtml(b.hint)}</li>`;
        }
        html += `</ul>`;
      }
      html += `</li>`;
    }
    html += `</ul>`;
  }

  if (plan.spinsightHints?.length) {
    html += `<h2>Spinsight ヒント</h2><ul>`;
    for (const h of plan.spinsightHints) html += `<li>${escapeHtml(h)}</li>`;
    html += `</ul>`;
  }

  html += `<p class="print-foot">Spinsight 非公式の補助ツール。体調に合わせて練習してください。</p></div>`;

  wrap.innerHTML = html;
  document.body.classList.add("is-printing");
  window.print();
  setTimeout(() => {
    document.body.classList.remove("is-printing");
    wrap.innerHTML = "";
  }, 500);
}

function printDiaryEntry(entry) {
  const wrap = document.getElementById("print-root");
  if (!wrap || !entry) return;

  const dateLabel = typeof formatDiaryDate === "function" ? formatDiaryDate(entry.date) : entry.date;
  let html = `<div class="print-doc">
    <h1>SpinCoach 練習日記</h1>
    <p class="print-meta">${escapeHtml(dateLabel)}</p>`;

  if (entry.issues) html += `<h2>課題</h2><p>${escapeHtml(entry.issues)}</p>`;
  if (entry.content) html += `<h2>練習内容</h2><p>${escapeHtml(entry.content)}</p>`;
  if (entry.good) html += `<h2>良かったところ</h2><p>${escapeHtml(entry.good)}</p>`;
  if (entry.reflection) html += `<h2>反省・気づき</h2><p>${escapeHtml(entry.reflection)}</p>`;

  html += `<p class="print-foot">SpinCoach 練習日記</p></div>`;

  wrap.innerHTML = html;
  document.body.classList.add("is-printing");
  window.print();
  setTimeout(() => {
    document.body.classList.remove("is-printing");
    wrap.innerHTML = "";
  }, 500);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
