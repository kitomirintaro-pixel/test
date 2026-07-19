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
  const scale = isIOSLike() ? 1.15 : Math.min(2, window.devicePixelRatio || 1.5);
  return html2pdf()
    .set({
      margin: [10, 10, 12, 10],
      filename,
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: {
        scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 794,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    })
    .from(element)
    .outputPdf("blob");
}

async function createPdfBlob(innerHtml, filename) {
  const element = prepareCaptureRoot(innerHtml);
  if (!element) throw new Error("capture root missing");
  try {
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
function openDedicatedPrintPage(innerHtml) {
  closePdfSaveSheet();
  removePrintFrame();
  try {
    sessionStorage.setItem("spincoach-print-html", innerHtml);
    sessionStorage.setItem(
      "spincoach-print-return",
      `${window.location.pathname}${window.location.search}${window.location.hash}` || "./"
    );
  } catch (err) {
    console.warn("sessionStorage failed:", err);
    notifyPrintStatus("印刷ページを開けませんでした。");
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
 * iPhone: 専用印刷ページへ誘導。PDFは作成後に共有 or Safariで開く。
 */
function showIosSaveSheet({ innerHtml, plainText, title, filename }) {
  closePdfSaveSheet();

  const sheet = document.createElement("div");
  sheet.id = "pdf-save-sheet";
  sheet.className = "pdf-save-sheet";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  sheet.setAttribute("aria-label", "PDF保存");

  let pdfBlob = null;

  sheet.innerHTML = `
    <div class="pdf-save-sheet-card">
      <p class="pdf-save-sheet-title">PDF・印刷</p>
      <p class="pdf-save-sheet-text" data-role="help">
        iPhoneでは、このアプリ画面を直接印刷すると<strong>白紙や薄い字</strong>になりやすいです。<br>
        まず<strong>印刷用ページ</strong>を開くか、<strong>PDFを作成</strong>してください。
      </p>
      <p class="pdf-save-sheet-status" data-role="status" hidden></p>
      <button type="button" class="pdf-save-sheet-primary" data-action="open-print-page">印刷用ページを開く</button>
      <button type="button" class="pdf-save-sheet-secondary" data-action="make-pdf">PDFを作成する</button>
      <button type="button" class="pdf-save-sheet-primary" data-action="share-pdf" hidden disabled>このPDFを共有・保存</button>
      <button type="button" class="pdf-save-sheet-secondary" data-action="open-pdf" hidden disabled>PDFを表示する</button>
      <button type="button" class="pdf-save-sheet-secondary" data-action="share-text">テキストだけ送る</button>
      <button type="button" class="pdf-save-sheet-ghost" data-action="close">閉じる</button>
    </div>
  `;

  const statusEl = sheet.querySelector("[data-role='status']");
  const makeBtn = sheet.querySelector("[data-action='make-pdf']");
  const shareBtn = sheet.querySelector("[data-action='share-pdf']");
  const openBtn = sheet.querySelector("[data-action='open-pdf']");

  const setStatus = (text, isError = false) => {
    if (!statusEl) return;
    statusEl.hidden = !text;
    statusEl.textContent = text || "";
    statusEl.classList.toggle("is-error", Boolean(isError));
  };

  sheet.addEventListener("click", async (ev) => {
    const action = ev.target?.closest?.("[data-action]")?.getAttribute("data-action");
    if (!action) return;

    if (action === "open-print-page") {
      openDedicatedPrintPage(innerHtml);
      return;
    }

    if (action === "make-pdf") {
      makeBtn.disabled = true;
      setStatus("PDFを作成しています…画面を閉じないでください。");
      try {
        pdfBlob = await createPdfBlob(innerHtml, filename);
        setStatus("PDFの準備ができました。「共有・保存」か「PDFを表示」を押してください。");
        shareBtn.hidden = false;
        shareBtn.disabled = false;
        openBtn.hidden = false;
        openBtn.disabled = false;
        shareBtn.focus();
      } catch (err) {
        console.warn("pdf create failed:", err);
        setStatus("PDF作成に失敗しました。先に「印刷用ページを開く」を試してください。", true);
        makeBtn.disabled = false;
      }
      return;
    }

    if (action === "share-pdf") {
      if (!pdfBlob) {
        setStatus("先にPDFを作成してください。", true);
        return;
      }
      shareBtn.disabled = true;
      try {
        await sharePdfBlob(pdfBlob, filename);
        closePdfSaveSheet();
      } catch (err) {
        if (err && err.name === "AbortError") {
          shareBtn.disabled = false;
          return;
        }
        console.warn("pdf share failed:", err);
        setStatus("共有に失敗したので、PDF表示に切り替えます。", true);
        openPdfInSafari(pdfBlob, filename);
      }
      return;
    }

    if (action === "open-pdf") {
      if (!pdfBlob) {
        setStatus("先にPDFを作成してください。", true);
        return;
      }
      openPdfInSafari(pdfBlob, filename);
      return;
    }

    if (action === "share-text") {
      try {
        await sharePlainText(plainText, title);
        closePdfSaveSheet();
      } catch (err) {
        if (err && err.name === "AbortError") return;
        setStatus("テキスト共有に失敗しました。", true);
      }
      return;
    }

    if (action === "close") closePdfSaveSheet();
  });

  document.body.appendChild(sheet);
  sheet.querySelector("[data-action='open-print-page']")?.focus();
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

async function exportPrintDocAsPdf(innerHtml, filename, plainText, title) {
  // スマホは専用印刷ページ／共有シートへ（親ページ印刷の不具合回避）
  if (isMobileLike()) {
    showIosSaveSheet({
      innerHtml,
      plainText: plainText || "",
      title: title || "SpinCoach",
      filename,
    });
    return;
  }

  try {
    notifyPrintStatus("PDFを作成しています…");
    const blob = await createPdfBlob(innerHtml, filename);
    await deliverPdfBlob(blob, filename);
  } catch (err) {
    console.warn("PDF export failed, falling back to print page:", err);
    notifyPrintStatus("PDF作成に失敗したので、印刷用ページを開きます。");
    openDedicatedPrintPage(innerHtml);
  }
}

async function printPlan(plan, playerName) {
  const html = buildPlanPrintHtml(plan, playerName);
  const filename = stampFilename("SpinCoach-plan");
  const plain =
    typeof planToPlainText === "function"
      ? planToPlainText(plan)
      : String(plan?.summary || "");
  await exportPrintDocAsPdf(html, filename, plain, "SpinCoach 練習プラン");
}

async function printDiaryEntry(entry) {
  if (!entry) return;
  const html = buildDiaryPrintHtml(entry);
  const filename = stampFilename("SpinCoach-diary");
  const plain =
    typeof diaryEntryToPlainText === "function"
      ? diaryEntryToPlainText(entry)
      : [entry.issues, entry.content, entry.good, entry.reflection].filter(Boolean).join("\n\n");
  await exportPrintDocAsPdf(html, filename, plain, "SpinCoach 練習日記");
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
