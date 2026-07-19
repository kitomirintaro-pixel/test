const PRINT_DOC_STYLES = `
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    color: #000000 !important;
    -webkit-text-fill-color: #000000 !important;
  }
  body {
    padding: 16px !important;
    font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
    font-size: 12pt;
    line-height: 1.55;
  }
  .print-doc, .print-doc * {
    color: #000000 !important;
    -webkit-text-fill-color: #000000 !important;
    opacity: 1 !important;
    text-shadow: none !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  h1 { font-size: 18pt; margin: 0 0 10pt; font-weight: 700; }
  h2 { font-size: 13pt; margin: 14pt 0 6pt; font-weight: 700; }
  p { margin: 0 0 8pt; }
  ul, ol { margin: 0 0 10pt; padding-left: 1.25em; }
  li { margin-bottom: 4pt; }
  .print-meta { margin-bottom: 12pt; }
  .print-meta-sub { margin: -6pt 0 12pt; font-size: 10pt; }
  .print-foot { margin-top: 16pt; font-size: 9pt; }
`;

function isIOSLike() {
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  return navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua);
}

function isMobileLike() {
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
  return isIOSLike();
}

function loadScriptOnce(src) {
  const key = `script:${src}`;
  if (loadScriptOnce._cache?.[key]) return loadScriptOnce._cache[key];
  loadScriptOnce._cache = loadScriptOnce._cache || {};
  loadScriptOnce._cache[key] = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-print-lib="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script load failed")));
      if (existing.dataset.loaded === "1") resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.printLib = src;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = () => reject(new Error("script load failed"));
    document.head.appendChild(s);
  });
  return loadScriptOnce._cache[key];
}

async function ensureHtml2Pdf() {
  if (typeof window.html2pdf === "function") return window.html2pdf;
  await loadScriptOnce("vendor/html2pdf.bundle.min.js");
  if (typeof window.html2pdf !== "function") {
    throw new Error("html2pdf unavailable");
  }
  return window.html2pdf;
}

function notifyPrintStatus(text) {
  if (typeof showAppStatus === "function") showAppStatus(text, 5200);
}

function buildPlanPrintHtml(plan, playerName) {
  const name = playerName?.trim() || "（名前なし）";
  const date = new Date().toLocaleString("ja-JP");

  let html = `<div class="print-doc">
    <h1>SpinCoach 練習プラン</h1>
    <p class="print-meta"><strong>${escapeHtml(name)}</strong> さん　／　${escapeHtml(date)}</p>`;

  const meta = [];
  if (plan.matchFormatLabel) meta.push(`試合形式: ${escapeHtml(plan.matchFormatLabel)}`);
  if (plan.dominantHandLabel && plan.dominantHand !== "unknown") {
    meta.push(`利き手: ${escapeHtml(plan.dominantHandLabel)}`);
  }
  if (plan.ttHistoryLabel) meta.push(`卓球歴: ${escapeHtml(plan.ttHistoryLabel)}`);
  if (meta.length) html += `<p class="print-meta-sub">${meta.join("　／　")}</p>`;

  html += `<p>${escapeHtml(plan.summary || "")}</p>`;

  if (plan.improvements?.length) {
    html += `<h2>改善ポイント</h2><ol>`;
    for (const i of plan.improvements) {
      html += `<li>${escapeHtml(i.text)}</li>`;
    }
    html += `</ol>`;
  }

  if (plan.rubberAdvice?.length) {
    html += `<h2>ラバーアドバイス</h2>`;
    for (const block of plan.rubberAdvice) {
      html += `<p><strong>${escapeHtml(block.title)}</strong></p><ul>`;
      for (const b of block.bullets || []) html += `<li>${escapeHtml(b)}</li>`;
      html += `</ul>`;
    }
  }

  if (plan.serveRubberExtras?.length) {
    html += `<h2>サーブ×ラバー</h2><ul>`;
    for (const t of plan.serveRubberExtras) html += `<li>${escapeHtml(t)}</li>`;
    html += `</ul>`;
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
      if (w.isRest) {
        html += `<li>${escapeHtml(w.day)}: 休み — 体を休める</li>`;
        continue;
      }
      const mode = w.modeLabel ? `【${escapeHtml(w.modeLabel)}】` : "";
      html += `<li>${escapeHtml(w.day)}: ${mode} ${escapeHtml(w.focus)} — ${escapeHtml(w.extra || "")}`;
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
    html += `<h2>計測のヒント</h2><ul>`;
    for (const h of plan.spinsightHints) html += `<li>${escapeHtml(h)}</li>`;
    html += `</ul>`;
  }

  html += `<p class="print-foot">Spinsight 非公式の補助ツール。体調に合わせて練習してください。</p></div>`;
  return html;
}

function buildDiaryPrintHtml(entry) {
  const dateLabel =
    typeof formatDiaryDate === "function" ? formatDiaryDate(entry.date) : entry.date;
  let html = `<div class="print-doc">
    <h1>SpinCoach 練習日記</h1>
    <p class="print-meta">${escapeHtml(dateLabel)}</p>`;

  if (entry.issues) html += `<h2>課題</h2><p>${escapeHtml(entry.issues)}</p>`;
  if (entry.content) html += `<h2>練習内容</h2><p>${escapeHtml(entry.content)}</p>`;
  if (entry.good) html += `<h2>良かったところ</h2><p>${escapeHtml(entry.good)}</p>`;
  if (entry.reflection) html += `<h2>反省・気づき</h2><p>${escapeHtml(entry.reflection)}</p>`;

  html += `<p class="print-foot">SpinCoach 練習日記</p></div>`;
  return html;
}

function stampFilename(prefix) {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.pdf`;
}

function prepareCaptureRoot(innerHtml) {
  const wrap = document.getElementById("print-root");
  if (!wrap) return null;
  wrap.innerHTML = innerHtml;
  wrap.classList.add("is-capturing");
  wrap.setAttribute("aria-hidden", "false");
  return wrap.querySelector(".print-doc") || wrap.firstElementChild;
}

function clearCaptureRoot() {
  const wrap = document.getElementById("print-root");
  if (!wrap) return;
  wrap.classList.remove("is-capturing");
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML = "";
}

async function pdfBlobFromElement(element, filename) {
  const html2pdf = await ensureHtml2Pdf();
  // スマホは軽量設定（画質より速度優先）。PCも過剰な高解像度は避ける。
  const mobile = isMobileLike();
  const scale = mobile ? 1 : 1.25;
  return html2pdf()
    .set({
      margin: mobile ? [8, 8, 8, 8] : [10, 10, 10, 10],
      filename,
      image: { type: "jpeg", quality: mobile ? 0.72 : 0.82 },
      html2canvas: {
        scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: mobile ? 640 : 794,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      // legacy pagebreak は遅いので使わない
      pagebreak: { mode: ["avoid-all"] },
      enableLinks: false,
    })
    .from(element)
    .outputPdf("blob");
}

async function createPdfBlob(innerHtml, filename) {
  await ensureHtml2Pdf();
  const element = prepareCaptureRoot(innerHtml);
  if (!element) throw new Error("capture root missing");
  try {
    // レイアウト確定のためのごく短い待ち（長すぎると体感が悪化する）
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const blob = await pdfBlobFromElement(element, filename);
    if (!(blob instanceof Blob) || blob.size < 64) {
      throw new Error("empty pdf blob");
    }
    return blob;
  } finally {
    clearCaptureRoot();
  }
}

function closePdfSaveSheet() {
  document.getElementById("pdf-save-sheet")?.remove();
}

function removePrintFrame() {
  document.getElementById("spincoach-print-frame")?.remove();
}

/**
 * 専用の白い印刷ページへ移動する。
 * iPhone で「白紙3ページ＋最後だけ薄い字」になる親ページ印刷を避ける。
 */
function openDedicatedPrintPage(innerHtml, opts = {}) {
  closePdfSaveSheet();
  removePrintFrame();
  try {
    sessionStorage.setItem("spincoach-print-html", innerHtml);
    sessionStorage.setItem(
      "spincoach-print-return",
      `${window.location.pathname}${window.location.search}${window.location.hash}` || "./"
    );
    if (opts.plainText != null) {
      sessionStorage.setItem("spincoach-print-text", String(opts.plainText));
    } else {
      sessionStorage.removeItem("spincoach-print-text");
    }
    const base = String(opts.filename || "SpinCoach-plan").replace(/\.pdf$/i, "");
    sessionStorage.setItem("spincoach-print-filename", base);
  } catch (err) {
    console.warn("sessionStorage failed:", err);
    notifyPrintStatus("保存ページを開けませんでした。");
    return;
  }
  window.location.href = "print-view.html";
}

function printHtmlDocument(innerHtml) {
  openDedicatedPrintPage(innerHtml);
}

function openPdfInSafari(blob, filename) {
  const url = URL.createObjectURL(blob);
  try {
    sessionStorage.setItem("spincoach-pdf-name", filename || "SpinCoach.pdf");
  } catch (_) {
    /* ignore */
  }
  // Safari の PDF ビューアで開く（共有・ファイルに保存ができる）
  window.location.href = url;
}

async function sharePdfBlob(blob, filename) {
  const file = new File([blob], filename, {
    type: "application/pdf",
    lastModified: Date.now(),
  });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: filename,
    });
    notifyPrintStatus("共有シートで「ファイルに保存」を選んでください。");
    return "shared";
  }

  openPdfInSafari(blob, filename);
  return "opened";
}

async function sharePlainText(text, title) {
  const body = String(text || "").trim();
  if (!body) throw new Error("empty text");

  if (navigator.share) {
    await navigator.share({ title: title || "SpinCoach", text: body });
    notifyPrintStatus("テキストを共有しました。");
    return;
  }

  if (typeof copyTextToClipboard === "function") {
    const res = await copyTextToClipboard(body);
    notifyPrintStatus(res.ok ? "テキストをコピーしました。" : "共有に対応していません。");
    return;
  }

  throw new Error("share unsupported");
}

/**
 * 互換用（スマホは専用保存ページへ即移動）
 */
function showIosSaveSheet({ innerHtml, filename, plainText }) {
  openDedicatedPrintPage(innerHtml, { filename, plainText });
}

function openPdfInViewer(blob) {
  openPdfInSafari(blob, "SpinCoach.pdf");
}

async function deliverPdfBlob(blob, filename) {
  try {
    if (navigator.canShare) {
      const file = new File([blob], filename, { type: "application/pdf" });
      if (navigator.canShare({ files: [file] }) && isMobileLike()) {
        await navigator.share({
          files: [file],
          title: filename,
          text: "SpinCoach のPDFです。",
        });
        notifyPrintStatus("共有シートから保存できます。");
        return "shared";
      }
    }
  } catch (err) {
    if (err && err.name === "AbortError") return "aborted";
    console.warn("share failed:", err);
  }

  if (isMobileLike()) {
    openPdfInSafari(blob, filename);
    return "opened";
  }

  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    notifyPrintStatus("PDFをダウンロードしました。");
    return "downloaded";
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}

function runBrowserPrint(innerHtml) {
  openDedicatedPrintPage(innerHtml);
}

async function exportPrintDocAsPdf(innerHtml, filename, plainText) {
  // スマホでは重い処理をアプリ本体でせず、保存用ページへ即移動
  if (isMobileLike()) {
    openDedicatedPrintPage(innerHtml, { filename, plainText });
    return;
  }

  try {
    notifyPrintStatus("PDFを作成しています…");
    const blob = await createPdfBlob(innerHtml, filename);
    await deliverPdfBlob(blob, filename);
  } catch (err) {
    console.warn("PDF export failed, falling back to print page:", err);
    notifyPrintStatus("PDF作成に失敗したので、保存用ページを開きます。");
    openDedicatedPrintPage(innerHtml, { filename, plainText });
  }
}

async function printPlan(plan, playerName) {
  const html = buildPlanPrintHtml(plan, playerName);
  const filename = stampFilename("SpinCoach-plan");
  const plain =
    typeof planToPlainText === "function"
      ? planToPlainText(plan)
      : String(plan?.summary || "");
  await exportPrintDocAsPdf(html, filename, plain);
}

async function printDiaryEntry(entry) {
  if (!entry) return;
  const html = buildDiaryPrintHtml(entry);
  const filename = stampFilename("SpinCoach-diary");
  const plain =
    typeof diaryEntryToPlainText === "function"
      ? diaryEntryToPlainText(entry)
      : [entry.issues, entry.content, entry.good, entry.reflection].filter(Boolean).join("\n\n");
  await exportPrintDocAsPdf(html, filename, plain);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.printPlan = printPlan;
window.printDiaryEntry = printDiaryEntry;
