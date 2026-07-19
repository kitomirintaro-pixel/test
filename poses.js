/** 練習ポーズのわかりやすい簡易イラスト（SVG） */
const POSE_LABELS = {
  drive: "ドライブ",
  drive_speed: "スピードドライブ",
  drive_loop: "ループドライブ",
  drive_curve: "カーブドライブ",
  drive_shoot: "シュートドライブ",
  backhand_drive: "バックドライブ",
  serve: "サーブ",
  smash: "スマッシュ",
  block_game: "ブロック",
  footwork: "フットワーク",
};

const POSE_HINTS = {
  drive: "腰から振って、ラケットでボールの芯を押す",
  drive_speed: "振りは小さく、最後だけ速く出す",
  drive_loop: "下から上へ。ラケットは少し閉じる",
  drive_curve: "ボールの横を擦って曲げる",
  drive_shoot: "低い打点でまっすぐ押し出す",
  backhand_drive: "替えた後、肘を支点に前へ",
  serve: "投げたボールをラケットで出す",
  smash: "高い球を上から叩く",
  block_game: "ラケット面を固定して返す",
  footwork: "打ったら中央へ戻る",
};

const ISSUE_TO_POSE = {
  drive: "drive",
  drive_speed: "drive_speed",
  drive_loop: "drive_loop",
  drive_knuckle: "drive",
  drive_curve: "drive_curve",
  drive_shoot: "drive_shoot",
  backhand_drive: "backhand_drive",
  topspin_rally: "drive_loop",
  counter_attack: "drive_speed",
  smash: "smash",
  block_game: "block_game",
  serve: "serve",
  serve_top: "serve",
  serve_under: "serve",
  serve_side_top: "serve",
  serve_side_under: "serve",
  serve_makikomi: "serve",
  serve_yg: "serve",
  serve_squat: "serve",
  serve_forehand: "serve",
  serve_backhand: "serve",
  serve_long: "serve",
  footwork: "footwork",
  flick_short: "drive_speed",
  push_attack: "drive",
  lobbing: "drive_loop",
  third_ball: "serve",
  cut_defense: "block_game",
  underspin_receive: "block_game",
  spin_reading: "block_game",
  pace_adapt: "footwork",
  mental: "footwork",
};

/** 卓球台・ネット・ラベル付きの共通シーン（矢印図解スタイル） */
const POSE_TO_ICON = {
  drive: "drive",
  drive_speed: "speed",
  drive_loop: "loop",
  drive_curve: "curve",
  drive_shoot: "shoot",
  backhand_drive: "backhand",
  serve: "serve",
  smash: "smash",
  block_game: "defense",
  footwork: "footwork",
};

/**
 * ChatGPT などで作成した画像を assets/techniques/ に置くと自動で表示されます。
 * ファイル名: {kind}.webp（PNG も可 — TECHNIQUE_IMAGE_EXT を変更）
 * kinds: drive, speed, loop, curve, shoot, backhand, smash, serve, attack, flick, defense, footwork, mental
 * 推奨サイズ: 520×244px（横長）、暗め背景・矢印で球の軌道が分かる構成
 */
const TECHNIQUE_IMAGE_BASE = "assets/techniques/";
const TECHNIQUE_IMAGE_EXT = ".png";
const TECHNIQUE_IMAGE_ALT_EXT = ".webp";

function escapeAttr(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** 差し替え用画像（13枚）。assets/techniques/{id}.webp または .png */
const TECHNIQUE_IMAGE_CATALOG = [
  { id: "drive", label: "ドライブ", motion: "ラケットでボールを前へまっすぐ押し出す。水平のオレンジ矢印" },
  { id: "speed", label: "スピードドライブ", motion: "速い水平ドライブ。太い前向き矢印と速度線（並行の短い線）" },
  { id: "loop", label: "ループドライブ", motion: "ボールが上に弧を描いて飛ぶ。紫色の曲線矢印" },
  { id: "curve", label: "カーブドライブ", motion: "ボールが横に曲がる。横へ膨らむ曲線矢印" },
  { id: "shoot", label: "シュートドライブ", motion: "低い打点でネット際をまっすぐ押す。低い水平矢印" },
  { id: "backhand", label: "バックドライブ", motion: "左方向へ打つバックハンド。左向きの矢印" },
  { id: "smash", label: "スマッシュ", motion: "高いボールを上から叩く。下向きの太い矢印" },
  { id: "serve", label: "サーブ", motion: "ボールを投げ上げて打つ。上への点線＋打った後の飛び方向矢印" },
  { id: "attack", label: "攻め・第3球", motion: "積極的に前へ攻める。速い前向き矢印" },
  { id: "flick", label: "フリック", motion: "短い球を上に弾く。短い球から上方向へ弾く矢印" },
  { id: "defense", label: "守備・ブロック", motion: "左から来た球をラケット面で止めて返す。左→右の矢印" },
  { id: "footwork", label: "フットワーク", motion: "打った後中央へ戻る。足元の踏み出しと戻る矢印" },
  { id: "mental", label: "メンタル", motion: "集中・落ち着き。中央に向かう矢印やターゲット" },
];

function getTechniqueImageSrc(kind, ext = TECHNIQUE_IMAGE_EXT) {
  return `${TECHNIQUE_IMAGE_BASE}${kind}${ext}`;
}

function getTechniqueVisualHtml(kind, { variant = "icon", alt = "", svgFallback = "" }) {
  const imgClass = variant === "pose" ? "pose-img" : "issue-icon-img";
  const src = getTechniqueImageSrc(kind);
  return `<span class="technique-visual technique-visual-${variant}">
    <img class="${imgClass}" src="${src}" data-technique-kind="${kind}" alt="${escapeAttr(alt || kind)}" width="520" height="244" loading="lazy" decoding="async" />
    <span class="technique-fallback" hidden aria-hidden="true">${svgFallback}</span>
  </span>`;
}

function initTechniqueImageFallback(root = document) {
  root.querySelectorAll(".technique-visual img").forEach((img) => {
    if (img.dataset.fallbackBound) return;
    img.dataset.fallbackBound = "1";
    const showSvgFallback = () => {
      img.hidden = true;
      const fb = img.parentElement?.querySelector(".technique-fallback");
      if (fb) {
        fb.hidden = false;
        fb.removeAttribute("aria-hidden");
      }
    };
    const onError = () => {
      const kind = img.dataset.techniqueKind;
      if (kind && img.dataset.triedAltExt !== "1") {
        img.dataset.triedAltExt = "1";
        img.hidden = false;
        img.src = getTechniqueImageSrc(kind, TECHNIQUE_IMAGE_ALT_EXT);
        return;
      }
      showSvgFallback();
    };
    if (img.complete && img.naturalWidth === 0) onError();
    else img.addEventListener("error", onError, { once: false });
  });
}

function buildPoseSvg({ title, hint, content }) {
  const accessible = hint ? `${title} — ${hint}` : title;
  return `<svg class="pose-svg" viewBox="0 0 260 122" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${accessible.replace(/"/g, "&quot;")}">
    <rect width="260" height="122" rx="12" fill="#152032"/>
    <rect x="12" y="6" width="236" height="80" rx="8" fill="#0f172a"/>
    <g transform="translate(79, 14) scale(1.6)">
      ${content}
    </g>
    <rect x="15" y="92" width="230" height="24" rx="4" fill="#166534" opacity="0.9"/>
    <rect x="15" y="92" width="230" height="5" rx="2" fill="#2d7a5f"/>
    <line x1="130" y1="92" x2="130" y2="116" stroke="#86efac" stroke-width="1.5" opacity="0.65"/>
    <text x="130" y="88" text-anchor="middle" fill="#64748b" font-size="8" font-family="sans-serif">ネット</text>
  </svg>`;
}

function svgPose(kind) {
  const iconKind = POSE_TO_ICON[kind] || "drive";
  const content = DIAGRAM_CONTENT[iconKind] || DIAGRAM_CONTENT.drive;
  return buildPoseSvg({
    title: POSE_LABELS[kind] || kind,
    hint: POSE_HINTS[kind] || "",
    content,
  });
}

function getPoseVisualHtml(poseId) {
  const kind = POSE_TO_ICON[poseId] || "drive";
  const label = POSE_LABELS[poseId] || poseId;
  const hint = POSE_HINTS[poseId] || "";
  const alt = hint ? `${label} — ${hint}` : label;
  return getTechniqueVisualHtml(kind, {
    variant: "pose",
    alt,
    svgFallback: svgPose(poseId),
  });
}

function getPosesForIssues(issueIds) {
  const seen = new Set();
  const out = [];
  for (const id of issueIds) {
    const poseId = ISSUE_TO_POSE[id];
    if (!poseId || seen.has(poseId)) continue;
    seen.add(poseId);
    out.push({
      id: poseId,
      label: POSE_LABELS[poseId] || poseId,
      hint: POSE_HINTS[poseId] || "",
      svg: getPoseVisualHtml(poseId),
    });
    if (out.length >= 4) break;
  }
  return out;
}

const ISSUE_TO_ICON = {
  drive: "drive",
  drive_speed: "speed",
  drive_loop: "loop",
  drive_knuckle: "drive",
  drive_curve: "curve",
  drive_shoot: "shoot",
  backhand_drive: "backhand",
  topspin_rally: "loop",
  counter_attack: "speed",
  flick_short: "flick",
  smash: "smash",
  push_attack: "drive",
  lobbing: "loop",
  third_ball: "attack",
  serve: "serve",
  serve_top: "serve",
  serve_under: "serve",
  serve_long: "serve",
  serve_side_top: "serve",
  serve_side_under: "serve",
  serve_makikomi: "serve",
  serve_yg: "serve",
  serve_squat: "serve",
  serve_forehand: "serve",
  serve_backhand: "serve",
  cut_defense: "defense",
  block_game: "defense",
  underspin_receive: "defense",
  spin_reading: "defense",
  footwork: "footwork",
  pace_adapt: "footwork",
  mental: "mental",
};

/** 矢印（軌道・動きの方向を示す） */
function iconArrow(x1, y1, x2, y2, color = "#ffb347", width = 3, dashed = false) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const head = 6;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const dash = dashed ? ' stroke-dasharray="4 2"' : "";
  return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash}/>
    <polygon points="${x2},${y2} ${bx + px * 3.5},${by + py * 3.5} ${bx - px * 3.5},${by - py * 3.5}" fill="${color}"/>
  `;
}

/** 曲線矢印（ループ・カーブ用） */
function iconCurveArrow(d, color = "#c4b5fd", width = 3) {
  const endMatch = d.match(/,\s*([\d.]+)\s+([\d.]+)\s*$/);
  const ex = endMatch ? Number(endMatch[1]) : 50;
  const ey = endMatch ? Number(endMatch[2]) : 20;
  return `
    <path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>
    ${iconArrow(ex - 5, ey, ex, ey, color, width)}
  `;
}

function iconBall(x, y, r = 4.5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fb923c" stroke="#fff" stroke-width="1.2"/>`;
}

function iconPaddle(x, y, flip = false) {
  const sx = flip ? -1 : 1;
  return `
    <g transform="translate(${x},${y}) scale(${sx},1)">
      <rect x="-2" y="-7" width="10" height="14" rx="2" fill="#ef4444" stroke="#fca5a5" stroke-width="1"/>
      <rect x="8" y="-2" width="7" height="4" rx="1" fill="#94a3b8"/>
    </g>
  `;
}

function issueIconShell(content) {
  return `<svg class="issue-icon-svg" viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="64" height="48" rx="9" fill="#152032"/>
    <rect x="4" y="36" width="56" height="6" rx="2" fill="#166534" opacity="0.9"/>
    <line x1="32" y1="36" x2="32" y2="42" stroke="#86efac" stroke-width="1.2" opacity="0.6"/>
    ${content}
  </svg>`;
}

const DIAGRAM_CONTENT = {
  drive: `
    ${iconPaddle(22, 24)}
    ${iconBall(34, 24)}
    ${iconArrow(40, 24, 58, 24, "#ffb347", 3.5)}
    ${iconArrow(18, 28, 24, 24, "#6ee7ff", 2.5)}
  `,
  speed: `
    ${iconPaddle(18, 24)}
    ${iconBall(30, 24)}
    ${iconArrow(36, 24, 58, 24, "#ffb347", 4)}
    ${iconArrow(38, 19, 54, 19, "#ff8c42", 2, true)}
    ${iconArrow(38, 29, 54, 29, "#ff8c42", 2, true)}
  `,
  loop: `
    ${iconPaddle(20, 30)}
    ${iconBall(28, 30)}
    ${iconCurveArrow("M32 30 Q40 10 54 22", "#c4b5fd", 3.5)}
    ${iconArrow(16, 32, 22, 28, "#6ee7ff", 2.5)}
  `,
  curve: `
    ${iconPaddle(18, 26)}
    ${iconBall(28, 26)}
    ${iconCurveArrow("M32 26 Q44 14 56 28", "#6ee7ff", 3.5)}
    ${iconArrow(10, 30, 18, 26, "#94a3b8", 2, true)}
  `,
  shoot: `
    ${iconPaddle(16, 32)}
    ${iconBall(28, 33)}
    ${iconArrow(34, 33, 58, 33, "#ffb347", 3.5)}
    <line x1="6" y1="33" x2="58" y2="33" stroke="#475569" stroke-width="1" stroke-dasharray="3 2" opacity="0.7"/>
  `,
  backhand: `
    ${iconPaddle(42, 24, true)}
    ${iconBall(30, 24)}
    ${iconArrow(26, 24, 6, 24, "#ffb347", 3.5)}
    ${iconArrow(46, 28, 40, 24, "#6ee7ff", 2.5)}
  `,
  smash: `
    ${iconBall(46, 10, 4)}
    ${iconPaddle(40, 16)}
    ${iconArrow(48, 14, 50, 32, "#ffb347", 4)}
    ${iconArrow(42, 8, 46, 12, "#6ee7ff", 2.5)}
  `,
  serve: `
    ${iconBall(40, 8, 3.5)}
    ${iconArrow(40, 12, 40, 20, "#94a3b8", 2, true)}
    ${iconPaddle(34, 24)}
    ${iconArrow(38, 22, 52, 30, "#ffb347", 3.5)}
  `,
  attack: `
    ${iconPaddle(16, 24)}
    ${iconBall(28, 22)}
    ${iconArrow(34, 22, 58, 18, "#ffb347", 4)}
    ${iconArrow(8, 12, 16, 18, "#ef4444", 2.5)}
  `,
  flick: `
    ${iconPaddle(22, 32)}
    ${iconBall(30, 32, 3.5)}
    ${iconArrow(34, 30, 48, 18, "#ffb347", 3.5)}
    <path d="M10 34 C18 32 24 32 30 34" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2"/>
  `,
  defense: `
    ${iconArrow(6, 24, 22, 24, "#fb923c", 3)}
    ${iconPaddle(26, 24)}
    ${iconBall(20, 24, 3.5)}
    ${iconArrow(32, 24, 48, 26, "#6ee7ff", 2.5)}
  `,
  footwork: `
    ${iconPaddle(36, 22)}
    ${iconBall(44, 20, 3.5)}
    ${iconArrow(28, 34, 36, 30, "#6ee7ff", 2.5)}
    ${iconArrow(40, 30, 32, 34, "#c4b5fd", 2.5, true)}
    <circle cx="28" cy="35" r="2.5" fill="#94a3b8"/>
    <circle cx="32" cy="35" r="2.5" fill="#cbd5e1"/>
  `,
  mental: `
    <circle cx="32" cy="22" r="10" fill="none" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="32" cy="22" r="4" fill="#6ee7ff" opacity="0.5"/>
    ${iconArrow(10, 22, 24, 22, "#a78bfa", 2.5)}
    ${iconArrow(54, 22, 40, 22, "#a78bfa", 2.5)}
    ${iconArrow(32, 6, 32, 16, "#a78bfa", 2.5)}
  `,
};

const ISSUE_ICON_ART = Object.fromEntries(
  Object.entries(DIAGRAM_CONTENT).map(([key, content]) => [key, issueIconShell(content)])
);

function getIssueIconSvg(issueId) {
  const kind = ISSUE_TO_ICON[issueId] || ISSUE_TO_ICON[ISSUE_TO_POSE[issueId]] || "drive";
  const svg = ISSUE_ICON_ART[kind] || ISSUE_ICON_ART.drive;
  const label =
    typeof ISSUE_CATALOG !== "undefined" && ISSUE_CATALOG[issueId]?.label
      ? ISSUE_CATALOG[issueId].label
      : kind;
  return getTechniqueVisualHtml(kind, { variant: "icon", alt: label, svgFallback: svg });
}

function initDetailedIssueIcons() {
  document.querySelectorAll("#form-detailed input[name='issue']").forEach((input) => {
    const label = input.closest("label.check");
    if (!label || label.classList.contains("check-with-icon")) return;

    const textEl = input.nextElementSibling;
    const text = textEl?.textContent || "";
    const checked = input.checked ? " checked" : "";
    label.classList.add("check-with-icon");
    label.innerHTML = `<span class="issue-icon">${getIssueIconSvg(input.value)}</span><span class="issue-check-body"><input type="checkbox" name="issue" value="${input.value}"${checked} /><span>${text}</span></span>`;
  });
  initTechniqueImageFallback(document.getElementById("form-detailed"));
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initDetailedIssueIcons);
}

if (typeof window !== "undefined") {
  window.initTechniqueImageFallback = initTechniqueImageFallback;
}
