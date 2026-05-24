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
  footwork: "footwork",
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
    </g>`;
}

function paddle(x, y, angle, label) {
  return `
    <g transform="translate(${x},${y}) rotate(${angle})">
      <rect x="-4" y="-22" width="8" height="24" rx="2" fill="#c45c26" stroke="#ff8c42" stroke-width="1.5"/>
      <rect x="-14" y="-24" width="28" height="16" rx="3" fill="#1e293b" stroke="#6ee7ff" stroke-width="2"/>
      ${label ? `<text x="0" y="-30" text-anchor="middle" fill="#6ee7ff" font-size="8" font-family="sans-serif">${label}</text>` : ""}
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
      ${paddle(95, 88, -35, "ラケット")}
      ${ball(145, 95)}
      ${arrow(102, 82, 138, 92, false)}
      <text x="200" y="90" fill="#9aa3b5" font-size="8">前へ押す</text>
    `,
    drive_speed: () => `
      ${ARROW_DEF}
      ${playerBase(65, 74, false)}
      ${paddle(92, 86, -25, "ラケット")}
      ${ball(175, 98)}
      ${arrow(108, 80, 168, 94, false)}
      <text x="195" y="78" fill="#ff8c42" font-size="9" font-weight="bold">速い</text>
    `,
    drive_loop: () => `
      ${ARROW_DEF}
      ${playerBase(68, 72, false)}
      ${paddle(90, 95, -55, "ラケット")}
      ${ball(150, 88)}
      <path d="M 105 100 Q 125 70 145 86" fill="none" stroke="#ff8c42" stroke-width="2" marker-end="url(#arrowhead)"/>
      <text x="195" y="72" fill="#a78bfa" font-size="8">上へ回転</text>
    `,
    drive_curve: () => `
      ${ARROW_DEF}
      ${playerBase(60, 74, false)}
      ${paddle(88, 90, -15, "ラケット")}
      ${ball(195, 102)}
      <path d="M 110 88 Q 150 75 188 98" fill="none" stroke="#ff8c42" stroke-width="2" marker-end="url(#arrowhead)"/>
      <text x="200" y="88" fill="#a78bfa" font-size="8">横に曲げる</text>
    `,
    drive_shoot: () => `
      ${ARROW_DEF}
      ${playerBase(75, 78, false)}
      ${paddle(100, 102, -10, "ラケット")}
      ${ball(185, 108)}
      ${arrow(115, 98, 178, 106, false)}
      <text x="200" y="100" fill="#9aa3b5" font-size="8">低く直進</text>
    `,
    backhand_drive: () => `
      ${ARROW_DEF}
      ${playerBase(175, 72, true)}
      ${paddle(148, 88, 35, "ラケット")}
      ${ball(55, 95)}
      ${arrow(142, 82, 62, 92, false)}
      <text x="45" y="78" fill="#9aa3b5" font-size="8">バック</text>
    `,
    serve: () => `
      ${ARROW_DEF}
      ${playerBase(130, 70, false)}
      ${paddle(155, 95, -70, "ラケット")}
      ${ball(175, 55)}
      <circle cx="175" cy="55" r="12" fill="none" stroke="#ff8c42" stroke-width="1" stroke-dasharray="3 2"/>
      ${arrow(168, 62, 160, 88, true)}
      <text x="200" y="52" fill="#9aa3b5" font-size="8">投げ球</text>
      <text x="200" y="100" fill="#9aa3b5" font-size="8">サーブ</text>
    `,
    smash: () => `
      ${ARROW_DEF}
      ${playerBase(100, 65, false)}
      ${paddle(118, 75, -110, "ラケット")}
      ${ball(140, 45)}
      ${arrow(125, 72, 138, 52, false)}
      <text x="195" y="48" fill="#ff8c42" font-size="9" font-weight="bold">上から</text>
    `,
    block_game: () => `
      ${ARROW_DEF}
      ${playerBase(130, 72, false)}
      ${paddle(108, 88, 0, "ラケット")}
      ${ball(75, 82)}
      ${arrow(68, 78, 100, 84, false)}
      <text x="50" y="70" fill="#9aa3b5" font-size="8">相手の球</text>
      <text x="195" y="88" fill="#6ee7ff" font-size="8">面を固定</text>
    `,
    footwork: () => `
      ${ARROW_DEF}
      ${playerBase(100, 72, false)}
      ${paddle(125, 90, -30, "ラケット")}
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
