/** 練習ポーズの簡易イラスト（SVG） */
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

function svgPose(kind) {
  const common = `viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true"`;
  const table = `<rect x="20" y="95" width="160" height="8" rx="2" fill="#4a5568"/>`;
  const ball = `<circle cx="120" cy="88" r="6" fill="#ff8c42"/>`;

  const bodies = {
    drive: `<g stroke="#6ee7ff" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="70" cy="35" r="10"/>
      <line x1="70" y1="45" x2="75" y2="70"/>
      <line x1="75" y1="70" x2="95" y2="85"/>
      <line x1="75" y1="55" x2="110" y2="75"/>
      <line x1="110" y1="75" x2="130" y2="82"/>
    </g>`,
    drive_speed: `<g stroke="#6ee7ff" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="75" cy="36" r="10"/>
      <line x1="75" y1="46" x2="80" y2="68"/>
      <line x1="80" y1="68" x2="100" y2="86"/>
      <line x1="80" y1="52" x2="135" y2="78"/>
    </g>`,
    drive_loop: `<g stroke="#a78bfa" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="72" cy="34" r="10"/>
      <line x1="72" y1="44" x2="78" y2="68"/>
      <path d="M 85 72 Q 105 58 125 82" />
      <line x1="78" y1="58" x2="115" y2="76"/>
    </g>`,
    drive_curve: `<g stroke="#a78bfa" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="65" cy="38" r="10"/>
      <line x1="65" y1="48" x2="72" y2="72"/>
      <path d="M 95 80 Q 115 70 125 85" stroke="#ff8c42" stroke-width="2" fill="none"/>
      <line x1="72" y1="58" x2="100" y2="78"/>
    </g>`,
    drive_shoot: `<g stroke="#6ee7ff" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="85" cy="42" r="10"/>
      <line x1="85" y1="52" x2="90" y2="72"/>
      <line x1="90" y1="72" x2="108" y2="88"/>
      <line x1="90" y1="60" x2="128" y2="82"/>
    </g>`,
    backhand_drive: `<g stroke="#6ee7ff" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="120" cy="36" r="10"/>
      <line x1="120" y1="46" x2="115" y2="72"/>
      <line x1="115" y1="72" x2="100" y2="88"/>
      <line x1="115" y1="55" x2="75" y2="80"/>
    </g>`,
    serve: `<g stroke="#6ee7ff" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="100" cy="42" r="10"/>
      <line x1="100" y1="52" x2="100" y2="78"/>
      <line x1="100" y1="65" x2="85" y2="55"/>
      <line x1="100" y1="78" x2="115" y2="92"/>
      <circle cx="130" cy="70" r="5" fill="#ff8c42" stroke="none"/>
    </g>`,
    smash: `<g stroke="#6ee7ff" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="90" cy="28" r="10"/>
      <line x1="90" y1="38" x2="95" y2="65"/>
      <line x1="95" y1="65" x2="105" y2="88"/>
      <line x1="95" y1="50" x2="120" y2="55"/>
    </g>`,
    block_game: `<g stroke="#6ee7ff" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="100" cy="40" r="10"/>
      <line x1="100" y1="50" x2="100" y2="75"/>
      <line x1="100" y1="60" x2="75" y2="70"/>
      <line x1="75" y1="70" x2="70" y2="85"/>
    </g>`,
    footwork: `<g stroke="#6ee7ff" stroke-width="3" fill="none" stroke-linecap="round">
      <circle cx="85" cy="35" r="10"/>
      <line x1="85" y1="45" x2="90" y2="72"/>
      <line x1="90" y1="72" x2="110" y2="88"/>
      <line x1="90" y1="72" x2="65" y2="88"/>
    </g>`,
  };

  const body = bodies[kind] || bodies.drive;
  return `<svg class="pose-svg" ${common}>${table}${ball}${body}</svg>`;
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
      svg: svgPose(poseId),
    });
    if (out.length >= 4) break;
  }
  return out;
}
