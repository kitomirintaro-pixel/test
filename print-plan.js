function printPlan(plan, playerName) {
  const wrap = document.getElementById("print-root");
  if (!wrap) return;

  const name = playerName?.trim() || "（名前なし）";
  const date = new Date().toLocaleString("ja-JP");

  let html = `<div class="print-doc">
    <h1>SpinCoach 練習プラン</h1>
    <p class="print-meta"><strong>${escapeHtml(name)}</strong> さん　／　${escapeHtml(date)}</p>
    <p>${escapeHtml(plan.summary)}</p>`;

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

  if (plan.week?.length) {
    html += `<h2>1週間の目安</h2><ul>`;
    for (const w of plan.week) {
      html += `<li>${escapeHtml(w.day)}: ${escapeHtml(w.focus)} — ${escapeHtml(w.extra)}</li>`;
    }
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
