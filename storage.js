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
};
