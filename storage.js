const RecordStore = {
  KEY: "spincoach_records_v1",
  MAX: 50,

  _read() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  _write(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list.slice(0, this.MAX)));
  },

  list() {
    return this._read().sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
  },

  save(playerName, formData, plan) {
    const name = String(playerName || "").trim();
    if (!name) return { ok: false, message: "名前を入力してください。" };
    if (!plan?.ok) return { ok: false, message: "先にプランを生成してください。" };

    const record = {
      id: crypto.randomUUID?.() || `r-${Date.now()}`,
      playerName: name,
      savedAt: new Date().toISOString(),
      formData,
      plan,
    };
    const list = this._read();
    list.unshift(record);
    this._write(list);
    return { ok: true, record };
  },

  get(id) {
    return this._read().find((r) => r.id === id) || null;
  },

  remove(id) {
    this._write(this._read().filter((r) => r.id !== id));
  },

  clearAll() {
    this._write([]);
  },
};

const DiaryStore = {
  KEY: "spincoach_diary_v1",
  MAX: 200,

  _read() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  _write(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list.slice(0, this.MAX)));
  },

  list() {
    return this._read().sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.savedAt < b.savedAt ? 1 : -1;
    });
  },

  save({ date, content, good, reflection, playerName, id }) {
    const d = String(date || "").trim();
    if (!d) return { ok: false, message: "日付を選んでください。" };
    const entry = {
      id: id || crypto.randomUUID?.() || `d-${Date.now()}`,
      date: d,
      content: String(content || "").trim(),
      good: String(good || "").trim(),
      reflection: String(reflection || "").trim(),
      playerName: String(playerName || "").trim(),
      savedAt: new Date().toISOString(),
    };
    if (!entry.content && !entry.good && !entry.reflection) {
      return { ok: false, message: "練習内容・良かったところ・反省のいずれかを書いてください。" };
    }
    const list = this._read();
    const idx = list.findIndex((e) => e.id === entry.id);
    if (idx >= 0) list[idx] = entry;
    else list.unshift(entry);
    this._write(list);
    return { ok: true, entry };
  },

  get(id) {
    return this._read().find((e) => e.id === id) || null;
  },

  remove(id) {
    this._write(this._read().filter((e) => e.id !== id));
  },

  clearAll() {
    this._write([]);
  },
};
