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
  drive_knuckle: "drive",
  topspin_rally: "drive_loop",
  counter_attack: "drive_speed",
};

/** 卓球台・ネット・ラベル付きの共通シーン */
function buildPoseSvg({ title, hint, drawPlayer }) {
  const w = 260;
  const h = 170;
  let scene = "";
  if (typeof drawPlayer === "function") {
    scene = drawPlayer();
  }
  return `<svg class="pose-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pose-title">
    <title id="pose-title">${title}</title>
    <!-- 卓球台 -->
    <rect x="15" y="108" width="230" height="28" rx="4" fill="#1a5f4a" opacity="0.9"/>
    <rect x="15" y="108" width="230" height="6" rx="2" fill="#2d7a5f"/>
    <line x1="130" y1="108" x2="130" y2="136" stroke="#e8ecf4" stroke-width="2" opacity="0.7"/>
    <text x="130" y="104" text-anchor="middle" fill="#9aa3b5" font-size="9" font-family="sans-serif">ネット</text>
    ${scene}
    <rect x="0" y="148" width="${w}" height="22" fill="#121722" opacity="0.9"/>
    <text x="130" y="163" text-anchor="middle" fill="#6ee7ff" font-size="11" font-weight="bold" font-family="sans-serif">${title}</text>
  </svg>`;
}

function playerBase(x, y, flip) {
  const s = flip ? -1 : 1;
  const cx = x;
  return `
    <g transform="translate(${cx},${y}) scale(${s},1)">
      <circle cx="0" cy="0" r="11" fill="#4a5568" stroke="#6ee7ff" stroke-width="2"/>
      <rect x="-8" y="10" width="16" height="28" rx="5" fill="#3d4a5c"/>
      <line x1="-6" y1="38" x2="-10" y2="58" stroke="#3d4a5c" stroke-width="5" stroke-linecap="round"/>
      <line x1="6" y1="38" x2="10" y2="58" stroke="#3d4a5c" stroke-width="5" stroke-linecap="round"/>
      <!-- 手（ラケット柄を握る位置の目安） -->
      <ellipse cx="12" cy="32" rx="5" ry="4" fill="#4a5568" stroke="#6ee7ff" stroke-width="1"/>
    </g>`;
}

/**
 * 卓球ラケット（側面）
 * 上: 丸いラバー面（楕円） / 下: 細いグリップが続く
 */
function paddle(x, y, angle) {
  return `
    <g transform="translate(${x},${y}) rotate(${angle})">
      <!-- ラバー面（正面から見た丸いラケット頭） -->
      <ellipse cx="0" cy="0" rx="16" ry="20" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="14" ry="18" fill="#b91c1c" stroke="#ef4444" stroke-width="1"/>
      <ellipse cx="-4" cy="-5" rx="5" ry="7" fill="#ffffff" opacity="0.12"/>
      <!-- ラケット首（ブレードと柄のつなぎ） -->
      <path d="M -5 17 Q 0 14 5 17 L 4 22 L -4 22 Z" fill="#334155" stroke="#64748b" stroke-width="1"/>
      <!-- グリップ（細い柄・下に向かって細くなる） -->
      <path d="M -4 22 L -3.5 38 Q 0 40 3.5 38 L 4 22 Z" fill="#b45309" stroke="#d97706" stroke-width="1.2"/>
      <rect x="-2.5" y="36" width="5" height="4" rx="1.5" fill="#92400e"/>
    </g>`;
}

function ball(x, y) {
  return `<circle cx="${x}" cy="${y}" r="7" fill="#ff8c42" stroke="#fff" stroke-width="1.5"/>`;
}

function arrow(x1, y1, x2, y2, dashed) {
  const dash = dashed ? 'stroke-dasharray="4 3"' : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ff8c42" stroke-width="2" marker-end="url(#arrowhead)" ${dash}/>`;
}

const ARROW_DEF = `<defs>
  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
    <polygon points="0 0, 8 3, 0 6" fill="#ff8c42"/>
  </marker>
</defs>`;

function svgPose(kind) {
  const title = POSE_LABELS[kind] || kind;
  const hint = POSE_HINTS[kind] || "";

  const scenes = {
    drive: () => `
      ${ARROW_DEF}
      ${playerBase(70, 72, false)}
      ${paddle(95, 88, -35)}
      ${ball(145, 95)}
      ${arrow(102, 82, 138, 92, false)}
      <text x="200" y="90" fill="#9aa3b5" font-size="8">前へ押す</text>
    `,
    drive_speed: () => `
      ${ARROW_DEF}
      ${playerBase(65, 74, false)}
      ${paddle(92, 86, -25)}
      ${ball(175, 98)}
      ${arrow(108, 80, 168, 94, false)}
      <text x="195" y="78" fill="#ff8c42" font-size="9" font-weight="bold">速い</text>
    `,
    drive_loop: () => `
      ${ARROW_DEF}
      ${playerBase(68, 72, false)}
      ${paddle(90, 95, -55)}
      ${ball(150, 88)}
      <path d="M 105 100 Q 125 70 145 86" fill="none" stroke="#ff8c42" stroke-width="2" marker-end="url(#arrowhead)"/>
      <text x="195" y="72" fill="#a78bfa" font-size="8">上へ回転</text>
    `,
    drive_curve: () => `
      ${ARROW_DEF}
      ${playerBase(60, 74, false)}
      ${paddle(88, 90, -15)}
      ${ball(195, 102)}
      <path d="M 110 88 Q 150 75 188 98" fill="none" stroke="#ff8c42" stroke-width="2" marker-end="url(#arrowhead)"/>
      <text x="200" y="88" fill="#a78bfa" font-size="8">横に曲げる</text>
    `,
    drive_shoot: () => `
      ${ARROW_DEF}
      ${playerBase(75, 78, false)}
      ${paddle(100, 102, -10)}
      ${ball(185, 108)}
      ${arrow(115, 98, 178, 106, false)}
      <text x="200" y="100" fill="#9aa3b5" font-size="8">低く直進</text>
    `,
    backhand_drive: () => `
      ${ARROW_DEF}
      ${playerBase(175, 72, true)}
      ${paddle(148, 88, 35)}
      ${ball(55, 95)}
      ${arrow(142, 82, 62, 92, false)}
      <text x="45" y="78" fill="#9aa3b5" font-size="8">バック</text>
    `,
    serve: () => `
      ${ARROW_DEF}
      ${playerBase(130, 70, false)}
      ${paddle(155, 95, -70)}
      ${ball(175, 55)}
      <circle cx="175" cy="55" r="12" fill="none" stroke="#ff8c42" stroke-width="1" stroke-dasharray="3 2"/>
      ${arrow(168, 62, 160, 88, true)}
      <text x="200" y="52" fill="#9aa3b5" font-size="8">投げ球</text>
      <text x="200" y="100" fill="#9aa3b5" font-size="8">サーブ</text>
    `,
    smash: () => `
      ${ARROW_DEF}
      ${playerBase(100, 65, false)}
      ${paddle(118, 75, -110)}
      ${ball(140, 45)}
      ${arrow(125, 72, 138, 52, false)}
      <text x="195" y="48" fill="#ff8c42" font-size="9" font-weight="bold">上から</text>
    `,
    block_game: () => `
      ${ARROW_DEF}
      ${playerBase(130, 72, false)}
      ${paddle(108, 88, 0)}
      ${ball(75, 82)}
      ${arrow(68, 78, 100, 84, false)}
      <text x="50" y="70" fill="#9aa3b5" font-size="8">相手の球</text>
      <text x="195" y="88" fill="#6ee7ff" font-size="8">面を固定</text>
    `,
    footwork: () => `
      ${ARROW_DEF}
      ${playerBase(100, 72, false)}
      ${paddle(125, 90, -30)}
      ${ball(180, 100)}
      <circle cx="100" cy="115" r="18" fill="none" stroke="#6ee7ff" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="100" y="118" text-anchor="middle" fill="#6ee7ff" font-size="8">戻る</text>
      ${arrow(140, 95, 175, 98, false)}
    `,
  };

  const draw = scenes[kind] || scenes.drive;
  return buildPoseSvg({ title, hint, drawPlayer: draw });
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
      svg: svgPose(poseId),
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

const ISSUE_ICON_ART = {
  drive: issueIconShell(`
    ${iconPaddle(22, 24)}
    ${iconBall(34, 24)}
    ${iconArrow(40, 24, 58, 24, "#ffb347", 3.5)}
    ${iconArrow(18, 28, 24, 24, "#6ee7ff", 2.5)}
  `),
  speed: issueIconShell(`
    ${iconPaddle(18, 24)}
    ${iconBall(30, 24)}
    ${iconArrow(36, 24, 58, 24, "#ffb347", 4)}
    ${iconArrow(38, 19, 54, 19, "#ff8c42", 2, true)}
    ${iconArrow(38, 29, 54, 29, "#ff8c42", 2, true)}
  `),
  loop: issueIconShell(`
    ${iconPaddle(20, 30)}
    ${iconBall(28, 30)}
    ${iconCurveArrow("M32 30 Q40 10 54 22", "#c4b5fd", 3.5)}
    ${iconArrow(16, 32, 22, 28, "#6ee7ff", 2.5)}
  `),
  curve: issueIconShell(`
    ${iconPaddle(18, 26)}
    ${iconBall(28, 26)}
    ${iconCurveArrow("M32 26 Q44 14 56 28", "#6ee7ff", 3.5)}
    ${iconArrow(10, 30, 18, 26, "#94a3b8", 2, true)}
  `),
  shoot: issueIconShell(`
    ${iconPaddle(16, 32)}
    ${iconBall(28, 33)}
    ${iconArrow(34, 33, 58, 33, "#ffb347", 3.5)}
    <line x1="6" y1="33" x2="58" y2="33" stroke="#475569" stroke-width="1" stroke-dasharray="3 2" opacity="0.7"/>
  `),
  backhand: issueIconShell(`
    ${iconPaddle(42, 24, true)}
    ${iconBall(30, 24)}
    ${iconArrow(26, 24, 6, 24, "#ffb347", 3.5)}
    ${iconArrow(46, 28, 40, 24, "#6ee7ff", 2.5)}
  `),
  smash: issueIconShell(`
    ${iconBall(46, 10, 4)}
    ${iconPaddle(40, 16)}
    ${iconArrow(48, 14, 50, 32, "#ffb347", 4)}
    ${iconArrow(42, 8, 46, 12, "#6ee7ff", 2.5)}
  `),
  serve: issueIconShell(`
    ${iconBall(40, 8, 3.5)}
    ${iconArrow(40, 12, 40, 20, "#94a3b8", 2, true)}
    ${iconPaddle(34, 24)}
    ${iconArrow(38, 22, 52, 30, "#ffb347", 3.5)}
  `),
  attack: issueIconShell(`
    ${iconPaddle(16, 24)}
    ${iconBall(28, 22)}
    ${iconArrow(34, 22, 58, 18, "#ffb347", 4)}
    ${iconArrow(8, 12, 16, 18, "#ef4444", 2.5)}
  `),
  flick: issueIconShell(`
    ${iconPaddle(22, 32)}
    ${iconBall(30, 32, 3.5)}
    ${iconArrow(34, 30, 48, 18, "#ffb347", 3.5)}
    <path d="M10 34 C18 32 24 32 30 34" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2"/>
  `),
  defense: issueIconShell(`
    ${iconArrow(6, 24, 22, 24, "#fb923c", 3)}
    ${iconPaddle(26, 24)}
    ${iconBall(20, 24, 3.5)}
    ${iconArrow(32, 24, 48, 26, "#6ee7ff", 2.5)}
  `),
  footwork: issueIconShell(`
    ${iconPaddle(36, 22)}
    ${iconBall(44, 20, 3.5)}
    ${iconArrow(28, 34, 36, 30, "#6ee7ff", 2.5)}
    ${iconArrow(40, 30, 32, 34, "#c4b5fd", 2.5, true)}
    <circle cx="28" cy="35" r="2.5" fill="#94a3b8"/>
    <circle cx="32" cy="35" r="2.5" fill="#cbd5e1"/>
  `),
  mental: issueIconShell(`
    <circle cx="32" cy="22" r="10" fill="none" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="32" cy="22" r="4" fill="#6ee7ff" opacity="0.5"/>
    ${iconArrow(10, 22, 24, 22, "#a78bfa", 2.5)}
    ${iconArrow(54, 22, 40, 22, "#a78bfa", 2.5)}
    ${iconArrow(32, 6, 32, 16, "#a78bfa", 2.5)}
  `),
};

function getIssueIconSvg(issueId) {
  const kind = ISSUE_TO_ICON[issueId] || ISSUE_TO_ICON[ISSUE_TO_POSE[issueId]] || "drive";
  return ISSUE_ICON_ART[kind] || ISSUE_ICON_ART.drive;
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
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initDetailedIssueIcons);
}
