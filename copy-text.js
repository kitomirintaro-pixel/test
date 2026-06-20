/**
 * クリップボードコピー（メニュー・日記）
 */

async function copyTextToClipboard(text) {
  const value = String(text || "");
  if (!value.trim()) return { ok: false, message: "コピーする内容がありません。" };

  try {
    await navigator.clipboard.writeText(value);
    return { ok: true };
  } catch {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok ? { ok: true } : { ok: false, message: "コピーに失敗しました。" };
  }
}

function diaryEntryToPlainText(entry) {
  if (!entry) return "";
  const lines = [`【練習日記】${typeof formatDiaryDate === "function" ? formatDiaryDate(entry.date) : entry.date}`];
  if (entry.issues) lines.push(`課題: ${entry.issues}`);
  if (entry.content) lines.push(`練習内容: ${entry.content}`);
  if (entry.good) lines.push(`良かったところ: ${entry.good}`);
  if (entry.reflection) lines.push(`反省・気づき: ${entry.reflection}`);
  lines.push("", "— SpinCoach");
  return lines.join("\n");
}
