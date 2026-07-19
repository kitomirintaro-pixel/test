/** 部活予定表の写真から練習曜日・時間を読み取り、週スケジュールへ反映する */

const SchedulePhoto = {
  _worker: null,
  _busy: false,
  _lastSchedule: null,

  DAY_DEFS: [
    { key: "mon", labels: ["月曜日", "月曜", "月"] },
    { key: "tue", labels: ["火曜日", "火曜", "火"] },
    { key: "wed", labels: ["水曜日", "水曜", "水"] },
    { key: "thu", labels: ["木曜日", "木曜", "木"] },
    { key: "fri", labels: ["金曜日", "金曜", "金"] },
    { key: "sat", labels: ["土曜日", "土曜", "土"] },
    { key: "sun", labels: ["日曜日", "日曜", "日"] },
  ],

  REST_RE: /休み|休日|休部|オフ|ＯＦＦ|OFF|off|なし|無し|休みます|×|✕|✖|―|ー(?!\d)|[-−]{2,}/,
  PRACTICE_RE: /練習|部活|試合|練|有|あり|○|●|◎|◯|〇|◯/,

  init() {
    const zone = document.getElementById("schedule-photo-zone");
    const fileInput = document.getElementById("schedule-photo-input");
    const pickBtn = document.getElementById("schedule-photo-pick");
    const applyBtn = document.getElementById("schedule-photo-apply");
    const generateBtn = document.getElementById("schedule-photo-generate");
    if (!zone || !fileInput) return;

    pickBtn?.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (file) this.handleImageFile(file);
      fileInput.value = "";
    });

    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("is-dragover");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("is-dragover"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("is-dragover");
      const file = [...(e.dataTransfer?.files || [])].find((f) => f.type.startsWith("image/"));
      if (file) this.handleImageFile(file);
    });

    zone.addEventListener("paste", (e) => {
      const items = [...(e.clipboardData?.items || [])];
      const imageItem = items.find((it) => it.type.startsWith("image/"));
      if (!imageItem) return;
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) this.handleImageFile(file);
    });

    document.addEventListener("paste", (e) => {
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const section = document.getElementById("schedule-photo-section");
      if (!section) return;
      const items = [...(e.clipboardData?.items || [])];
      const imageItem = items.find((it) => it.type.startsWith("image/"));
      if (!imageItem) return;
      e.preventDefault();
      if (section.tagName === "DETAILS") section.open = true;
      const file = imageItem.getAsFile();
      if (file) this.handleImageFile(file);
    });

    applyBtn?.addEventListener("click", () => this.applyFromEditor(false));
    generateBtn?.addEventListener("click", () => this.applyFromEditor(true));
  },

  setStatus(text, isError = false) {
    const el = document.getElementById("schedule-photo-status");
    if (!el) return;
    el.hidden = !text;
    el.textContent = text || "";
    el.classList.toggle("is-error", Boolean(isError));
  },

  setBusy(busy) {
    this._busy = busy;
    const zone = document.getElementById("schedule-photo-zone");
    const pickBtn = document.getElementById("schedule-photo-pick");
    zone?.classList.toggle("is-busy", busy);
    if (pickBtn) pickBtn.disabled = busy;
  },

  async handleImageFile(file) {
    if (this._busy) return;
    if (!file?.type?.startsWith("image/")) {
      this.setStatus("画像ファイルを選んでください。", true);
      return;
    }

    this.setBusy(true);
    this.setStatus("写真を準備しています…");
    this.hideResult();

    try {
      const previewUrl = URL.createObjectURL(file);
      const preview = document.getElementById("schedule-photo-preview");
      if (preview) {
        preview.src = previewUrl;
        preview.hidden = false;
      }

      const bitmap = await this.prepareImage(file);
      this.setStatus("文字を読み取っています（初回は少し時間がかかります）…");
      const text = await this.recognizeText(bitmap);
      if (bitmap.close) bitmap.close();

      const parsed = this.parseScheduleText(text);
      this._lastSchedule = parsed.schedule;
      this.renderResult(parsed);

      if (parsed.practiceDays.length === 0) {
        this.setStatus(
          "練習日をはっきり読み取れませんでした。下の曜日を手直しするか、もっと明るい写真で再試行してください。",
          true
        );
      } else {
        const days = parsed.practiceDays.map((d) => d.label).join("・");
        this.setStatus(`練習ありと判断: ${days}。内容を確認して反映してください。`);
      }
    } catch (err) {
      console.error(err);
      this.setStatus(
        "読み取りに失敗しました。ネット接続を確認するか、曜日を手入力してください。",
        true
      );
    } finally {
      this.setBusy(false);
    }
  },

  async prepareImage(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("image load failed"));
        el.src = url;
      });
      const maxW = 1600;
      const scale = img.width > maxW ? maxW / img.width : 1;
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  },

  async ensureWorker() {
    if (this._worker) return this._worker;
    if (typeof Tesseract === "undefined" || !Tesseract.createWorker) {
      throw new Error("Tesseract not loaded");
    }
    const worker = await Tesseract.createWorker("jpn", 1, {
      logger: (m) => {
        if (m.status === "recognizing text" && typeof m.progress === "number") {
          const pct = Math.round(m.progress * 100);
          this.setStatus(`文字を読み取っています… ${pct}%`);
        } else if (m.status === "loading language traineddata") {
          this.setStatus("日本語の読み取りデータを準備中…");
        }
      },
    });
    await worker.setParameters({
      tessedit_pageseg_mode: "6",
      preserve_interword_spaces: "1",
    });
    this._worker = worker;
    return worker;
  },

  async recognizeText(image) {
    const worker = await this.ensureWorker();
    const {
      data: { text },
    } = await worker.recognize(image);
    return String(text || "");
  },

  snapMinutes(raw) {
    const allowed =
      typeof VALID_PRACTICE_MINUTES !== "undefined"
        ? VALID_PRACTICE_MINUTES.filter((m) => m > 0)
        : [10, 15, 20, 30, 45, 60, 90, 120];
    let closest = allowed[0];
    for (const m of allowed) {
      if (Math.abs(m - raw) < Math.abs(closest - raw)) closest = m;
    }
    return closest;
  },

  defaultMinutesForDay(key) {
    return key === "sat" || key === "sun" ? 120 : 90;
  },

  extractDurationMinutes(chunk) {
    if (!chunk) return null;
    const range = chunk.match(
      /(\d{1,2})\s*[:：時]\s*(\d{0,2})\s*[-〜~～―－]\s*(\d{1,2})\s*[:：時]\s*(\d{0,2})/
    );
    if (range) {
      const h1 = parseInt(range[1], 10);
      const m1 = parseInt(range[2] || "0", 10);
      const h2 = parseInt(range[3], 10);
      const m2 = parseInt(range[4] || "0", 10);
      let mins = h2 * 60 + m2 - (h1 * 60 + m1);
      if (mins <= 0) mins += 24 * 60;
      if (mins >= 10 && mins <= 180) return this.snapMinutes(mins);
    }
    const hours = chunk.match(/(\d+(?:\.\d+)?)\s*時間/);
    if (hours) {
      const mins = Math.round(parseFloat(hours[1]) * 60);
      if (mins >= 10) return this.snapMinutes(mins);
    }
    const minutes = chunk.match(/(\d{2,3})\s*分/);
    if (minutes) {
      const mins = parseInt(minutes[1], 10);
      if (mins >= 10 && mins <= 180) return this.snapMinutes(mins);
    }
    return null;
  },

  normalizeOcrText(text) {
    return String(text || "")
      .replace(/[Ｍｍ]/g, "M")
      .replace(/[Ｔｔ]/g, "T")
      .replace(/[Ｗｗ]/g, "W")
      .replace(/[Ｆｆ]/g, "F")
      .replace(/[Ｓｓ]/g, "S")
      .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xff10 + 0x30))
      .replace(/[：]/g, ":")
      .replace(/[〜～]/g, "〜");
  },

  lineMentionsDay(line, day) {
    for (const lb of day.labels) {
      if (lb.length >= 2 && line.includes(lb)) return lb;
    }
    const ch = day.labels[day.labels.length - 1];
    // 1文字は独立しているときだけ。「練習日」「曜日」の中の「日」などは除外
    const reStrict =
      ch === "日"
        ? /(?<![曜習祝祭])日(?![曜祝])/
        : new RegExp(`(?<![一-龥])${ch}(?![曜一-龥])`);
    if (reStrict.test(line)) return ch;
    return null;
  },

  parseScheduleText(rawText) {
    const text = this.normalizeOcrText(rawText);
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const schedule = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };
    const notes = [];
    const found = {};

    // Pattern C: 「練習日: 月・水・金」のような列挙
    const listHit = text.match(
      /練習(?:日|ある日|予定)?[^月火水木金土日\n]{0,12}([月火水木金土日・･、,\s　]{3,20})/
    );
    if (listHit) {
      const token = listHit[1];
      const listDuration = this.extractDurationMinutes(text);
      for (const day of this.DAY_DEFS) {
        const ch = day.labels[day.labels.length - 1];
        if (token.includes(ch)) {
          schedule[day.key] = listDuration ?? this.defaultMinutesForDay(day.key);
          found[day.key] = "practice";
        }
      }
    }

    // Pattern A: per-line 「月曜 練習」「火:休み」
    for (const line of lines) {
      for (const day of this.DAY_DEFS) {
        const label = this.lineMentionsDay(line, day);
        if (!label) continue;

        const idx = line.indexOf(label);
        const after = line.slice(idx + label.length);
        const before = line.slice(0, idx);
        const chunk = `${before} ${after}`.trim();

        if (this.REST_RE.test(chunk) && !this.PRACTICE_RE.test(after)) {
          schedule[day.key] = 0;
          found[day.key] = "rest";
          continue;
        }
        if (this.PRACTICE_RE.test(chunk) || this.extractDurationMinutes(chunk) != null) {
          const mins = this.extractDurationMinutes(chunk) ?? this.defaultMinutesForDay(day.key);
          schedule[day.key] = mins;
          found[day.key] = "practice";
        }
      }
    }

    // Pattern B: header row 月 火 水 木 金 土 日 + status row
    const headerIdx = lines.findIndex((line) => {
      const hits = this.DAY_DEFS.filter((d) => this.lineMentionsDay(line, d)).length;
      return hits >= 5;
    });
    if (headerIdx >= 0) {
      const header = lines[headerIdx];
      const order = [];
      for (const day of this.DAY_DEFS) {
        const lb = this.lineMentionsDay(header, day);
        if (!lb) continue;
        const pos = header.indexOf(lb);
        if (pos >= 0) order.push({ key: day.key, pos, label: lb });
      }
      order.sort((a, b) => a.pos - b.pos);

      for (let i = headerIdx + 1; i < Math.min(lines.length, headerIdx + 4); i += 1) {
        const row = lines[i];
        if (!row || this.DAY_DEFS.filter((d) => this.lineMentionsDay(row, d)).length >= 4) {
          continue;
        }
        const cells = row.split(/[\s　|/]+/).filter(Boolean);
        if (cells.length >= order.length) {
          order.forEach((day, idx) => {
            const cell = cells[idx] || "";
            if (this.REST_RE.test(cell)) {
              schedule[day.key] = 0;
              found[day.key] = "rest";
            } else if (this.PRACTICE_RE.test(cell) || /\d/.test(cell)) {
              schedule[day.key] =
                this.extractDurationMinutes(cell) ?? this.defaultMinutesForDay(day.key);
              found[day.key] = "practice";
            }
          });
          break;
        }

        order.forEach((day, idx) => {
          const start = day.pos;
          const end = idx + 1 < order.length ? order[idx + 1].pos : row.length;
          const cell = row.slice(Math.max(0, start - 1), Math.min(row.length, end + 2));
          if (this.REST_RE.test(cell)) {
            schedule[day.key] = 0;
            found[day.key] = "rest";
          } else if (this.PRACTICE_RE.test(cell) || this.extractDurationMinutes(cell) != null) {
            schedule[day.key] =
              this.extractDurationMinutes(cell) ?? this.defaultMinutesForDay(day.key);
            found[day.key] = "practice";
          }
        });
      }
    }

    // （曜日ごとの時間は各行で確定。全体からの上書きはしない）

    if (typeof normalizeWeekSchedule === "function") {
      Object.assign(schedule, normalizeWeekSchedule(schedule));
    }

    const practiceDays = this.DAY_DEFS.filter((d) => schedule[d.key] > 0).map((d) => ({
      key: d.key,
      label: d.labels[1] || d.labels[0],
      minutes: schedule[d.key],
    }));

    if (practiceDays.length === 0) {
      notes.push("練習日が見つかりませんでした。");
    } else {
      notes.push(
        `練習日 ${practiceDays.length} 日（時間不明の日は平日90分・土日120分で仮置き）`
      );
    }

    return {
      schedule,
      practiceDays,
      notes,
      rawText: text.slice(0, 800),
    };
  },

  hideResult() {
    const result = document.getElementById("schedule-photo-result");
    if (result) result.hidden = true;
  },

  renderResult(parsed) {
    const result = document.getElementById("schedule-photo-result");
    const grid = document.getElementById("schedule-photo-day-grid");
    const notes = document.getElementById("schedule-photo-notes");
    const raw = document.getElementById("schedule-photo-raw");
    if (!result || !grid) return;

    grid.innerHTML = "";
    const allowed =
      typeof VALID_PRACTICE_MINUTES !== "undefined"
        ? VALID_PRACTICE_MINUTES
        : [0, 10, 15, 20, 30, 45, 60, 90, 120];

    for (const day of this.DAY_DEFS) {
      const label = document.createElement("label");
      label.className = "schedule-photo-day";
      const span = document.createElement("span");
      span.textContent = (day.labels[1] || day.labels[0]).replace("曜", "") + "曜";
      const sel = document.createElement("select");
      sel.dataset.dayKey = day.key;
      for (const m of allowed) {
        const opt = document.createElement("option");
        opt.value = String(m);
        opt.textContent = m === 0 ? "休み" : `${m}分`;
        if (m === parsed.schedule[day.key]) opt.selected = true;
        sel.appendChild(opt);
      }
      label.append(span, sel);
      grid.appendChild(label);
    }

    if (notes) {
      notes.textContent = (parsed.notes || []).join(" ");
    }
    if (raw) {
      raw.textContent = parsed.rawText ? `読み取り原文（確認用）:\n${parsed.rawText}` : "";
      raw.hidden = !parsed.rawText;
    }

    result.hidden = false;
  },

  readEditorSchedule() {
    const grid = document.getElementById("schedule-photo-day-grid");
    const schedule = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };
    if (!grid) return schedule;
    grid.querySelectorAll("select[data-day-key]").forEach((sel) => {
      schedule[sel.dataset.dayKey] = parseInt(sel.value, 10) || 0;
    });
    return typeof normalizeWeekSchedule === "function"
      ? normalizeWeekSchedule(schedule)
      : schedule;
  },

  applyFromEditor(alsoGenerate) {
    const schedule = this.readEditorSchedule();
    const practiceCount = Object.values(schedule).filter((m) => m > 0).length;
    if (practiceCount === 0) {
      this.setStatus("練習日が1日もありません。曜日を直してから反映してください。", true);
      return;
    }

    if (typeof SimpleInput !== "undefined" && SimpleInput.applyCustomSchedule) {
      SimpleInput.applyCustomSchedule(schedule);
    } else if (typeof restoreWeekScheduleToDom === "function") {
      restoreWeekScheduleToDom(schedule);
    }

    const labels = this.DAY_DEFS.filter((d) => schedule[d.key] > 0)
      .map((d) => `${d.labels[1] || d.labels[0]}${schedule[d.key]}分`)
      .join("・");

    if (typeof showAppStatus === "function") {
      showAppStatus(`練習予定を反映しました（${labels}）`);
    }
    this.setStatus(`反映済み: ${labels}`);

    if (alsoGenerate && typeof generateAndShowPlan === "function") {
      const ok = generateAndShowPlan();
      if (ok !== false) {
        document.getElementById("plan-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      document.getElementById("simple-summary-practice")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  },
};

window.SchedulePhoto = SchedulePhoto;
document.addEventListener("DOMContentLoaded", () => SchedulePhoto.init());
