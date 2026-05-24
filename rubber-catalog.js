/**
 * ラバーカタログ — 商品ごとの登録（随時追加可能）
 * 全商品を一度に網羅するのではなく、入力と照合して個別ヒントを出す。
 * 未登録は coach.js の系統推定へフォールバック。
 *
 * 追加方法: RUBBER_CATALOG に { id, display, category, nameRe, brandRe?, note? } を足す
 */
(function () {
  const C = (id, display, category, namePat, brandPat, note) => ({
    id,
    display,
    category,
    nameRe: new RegExp(namePat, "i"),
    brandRe: brandPat ? new RegExp(brandPat, "i") : null,
    note: note || "",
  });

  const RUBBER_CATALOG = [
    // —— Butterfly ——
    C("bf_t05", "Tenergy 05", "tensor_euro", "tenergy\\s*0?5|テナジー\\s*0?5", "バタフライ|butterfly"),
    C("bf_t64", "Tenergy 64", "tensor_euro", "tenergy\\s*64|テナジー\\s*64", "バタフライ|butterfly"),
    C("bf_t80", "Tenergy 80", "tensor_euro", "tenergy\\s*80|テナジー\\s*80", "バタフライ|butterfly"),
    C("bf_t25", "Tenergy 25", "tensor_euro", "tenergy\\s*25", "バタフライ|butterfly"),
    C("bf_d05", "Dignics 05", "tensor_euro", "dignics\\s*0?5|ディグニクス\\s*0?5", "バタフライ|butterfly"),
    C("bf_d64", "Dignics 64", "tensor_euro", "dignics\\s*64", "バタフライ|butterfly"),
    C("bf_d80", "Dignics 80", "tensor_euro", "dignics\\s*80", "バタフライ|butterfly"),
    C(
      "bf_d09",
      "Dignics 09",
      "tacky_hybrid",
      "dignics\\s*0?9(?!c)|ディグニクス\\s*0?9(?!c)",
      "バタフライ|butterfly",
      "Dignics 09: 粘着トップ＋高弾性。09Cより弾み寄り。擦り込みと加速タイミングの両方をログ。"
    ),
    C(
      "bf_g09c",
      "Glayzer 09C",
      "tacky_hybrid",
      "グレイザー\\s*0?9c|glayzer\\s*0?9c|glayzer",
      "バタフライ|butterfly",
      "グレイザー09C: 粘着トップ＋スプリング。弾み任せより擦り込み→押し切り。BHは振りを小さく。"
    ),
    C("bf_g09cz", "Glayzer 09C ZC", "tacky_hybrid", "グレイザー.*zc|glayzer.*zc", "バタフライ|butterfly"),
    C("bf_rozena", "Rozena", "high_friction", "ロゼナ|rozena", "バタフライ|butterfly"),
    C("bf_flextra", "Flextra", "high_friction", "フレクトラ|flextra", "バタフライ|butterfly"),
    C("bf_sriver", "Sriver", "high_friction", "スライバー|sriver", "バタフライ|butterfly"),
    C("bf_spinart", "Spinart", "high_friction", "スピナート|spinart", "バタフライ|butterfly"),
    C("bf_bryce", "Bryce", "tensor_euro", "ブライス|bryce", "バタフライ|butterfly"),
    C("bf_tespin", "Tespin", "high_friction", "テスピン|tespin", "バタフライ|butterfly"),
    C("bf_feint", "Feint", "short_pips", "フェイント(?!.*ロング)|feint(?!.*long)", "バタフライ|butterfly"),
    C("bf_feint_l", "Feint Long II", "long_pips", "フェイント.*ロング|feint.*long", "バタフライ|butterfly"),
    C("bf_impartial", "Impartial", "short_pips", "インパーシャル|impartial", "バタフライ|butterfly"),

    // —— VICTAS（ヴェガ系は XIOM。VICTAS 欄から移動済み）——
    C(
      "vi_rigan",
      "Rigan",
      "tensor_euro",
      "ライガン|rigan",
      "victas|ヴィクタス",
      "ライガン: 反発と球持ちのバランス。引きと加速を分け、芯で押し切る練習が合います。"
    ),
    C("vi_v15", "V>15 Extra", "tensor_euro", "v>\\s*15|v15", "victas|ヴィクタス"),
    C("vi_v22", "V>22 Double Extra", "tensor_euro", "v>\\s*22|v22", "victas|ヴィクタス"),
    C("vi_cutz", "Cutz", "short_pips", "カッツ|cutz", "victas|ヴィクタス"),
    C("vi_spectal", "Spectol S1/S2/S3", "short_pips", "スペクトル|spectol", "victas|ヴィクタス"),

    // —— Yasaka ——
    C("ya_markv", "Mark V", "high_friction", "マーク[ⅴＶv]|mark\\s*v", "ヤサカ|yasaka"),
    C("ya_rakza7", "Rakza 7", "tensor_euro", "ラクザ\\s*7|rakza\\s*7", "ヤサカ|yasaka"),
    C("ya_rakzaxx", "Rakza XX", "tensor_euro", "ラクザ.*xx|rakza.*xx", "ヤサカ|yasaka"),
    C("ya_rakzax", "Rakza X", "tensor_euro", "ラクザ\\s*x|rakza\\s*x", "ヤサカ|yasaka"),
    C("ya_rakzaz", "Rakza Z", "tacky_hybrid", "ラクザ\\s*z|rakza\\s*z", "ヤサカ|yasaka"),
    C("ya_pip", "Pip P-1", "short_pips", "pip|ピップ", "ヤサカ|yasaka"),

    // —— Tibhar ——
    C("ti_evolution", "Evolution MX-P/MX-S/FX-P", "tensor_euro", "エボリューション|evolution", "ティバー|tibhar"),
    C("ti_hybrid", "Hybrid K1/K3/MK", "tacky_hybrid", "ハイブリッド|hybrid\\s*k", "ティバー|tibhar"),
    C("ti_genius", "Genius+", "tensor_euro", "ジーニアス|genius", "ティバー|tibhar"),
    C("ti_super", "Super Defense", "long_pips", "スーパー.*ディフェンス", "ティバー|tibhar"),
    C("ti_speedy", "Speedy Soft/PP", "short_pips", "スピーディ|speedy", "ティバー|tibhar"),

    // —— Donic ——
    C("do_acuda", "Acuda", "tensor_euro", "アクーダ|acuda", "ドニック|donic"),
    C("do_bluestar", "BlueStar", "tensor_euro", "ブルースター|bluestar", "ドニック|donic"),
    C("do_baracuda", "Baracuda", "tensor_euro", "バラクーダ|baracuda", "ドニック|donic"),
    C("do_spike", "Spike P1/P2", "short_pips", "スパイク|spike", "ドニック|donic"),

    // —— XIOM（ヴェガ系はすべてこちら）——
    C("xi_vega_asia", "Vega Asia", "tensor_euro", "ヴェガ.*アジア|vega.*asia", "xiom|エクシオム"),
    C("xi_vega_eu", "Vega Europe", "tensor_euro", "ヴェガ.*ヨーロッパ|vega.*europe", "xiom|エクシオム"),
    C("xi_vega_jp", "Vega Japan", "tensor_euro", "ヴェガ.*ジャパン|vega.*japan", "xiom|エクシオム"),
    C("xi_vega_pro", "Vega Pro", "tensor_euro", "ヴェガ.*プロ|vega.*pro", "xiom|エクシオム"),
    C("xi_vega_intro", "Vega Intro", "tensor_euro", "ヴェガ.*イントロ|vega.*intro", "xiom|エクシオム"),
    C(
      "xi_vega",
      "Vega（XIOM）",
      "tensor_euro",
      "ヴェガ|vega",
      "xiom|エクシオム",
      "XIOM ヴェガ系: 加速タイミングが数値に出やすい。同じ振りでも打点で回転が変わるので、週次で条件を固定してログ。"
    ),
    C("xi_jekyll", "Jekyll & Hyde", "tacky_hybrid", "jekyll|hyde|ジキル|ハイド", "xiom|エクシオム"),
    C("xi_omega", "Omega", "tensor_euro", "オメガ|omega", "xiom|エクシオム"),

    // —— Nittaku ——
    C("ni_fast", "Fastarc", "tensor_euro", "ファスターク|fastarc", "ニッタク|nittaku"),
    C("ni_hurricane", "Hurricane Pro", "tacky_chinese", "ハリケーン|hurricane", "ニッタク|nittaku"),
    C("ni_moristo", "Moristo", "short_pips", "モリスト|moristo", "ニッタク|nittaku"),

    // —— Andro ——
    C("an_hexer", "Hexer", "tensor_euro", "ヘクサー|hexer", "andro|アンドロ"),
    C("an_rasant", "Rasant", "tensor_euro", "ラザント|rasant", "andro|アンドロ"),
    C("an_impuls", "Impuls Speed", "tensor_euro", "impuls|インパルス", "andro|アンドロ"),

    // —— Stiga ——
    C("st_dna", "DNA", "tensor_euro", "\\bdna\\b", "スティガ|stiga"),
    C("st_mantra", "Mantra", "tensor_euro", "マントラ|mantra", "スティガ|stiga"),
    C("st_axiom", "Axiom", "tensor_euro", "アキシオム|axiom", "スティガ|stiga"),

    // —— 729 / Friendship ——
    C("729_h3", "Hurricane 3", "tacky_chinese", "狂飙|狂飆|h3|ハリケーン\\s*3", "729|友誼|friendship|紅双喜"),
    C("729_b2", "Battle II", "tacky_chinese", "バトル|battle", "729|友誼"),
    C("729_focus", "Focus III", "tacky_chinese", "フォーカス|focus", "729|友誼"),

    // —— DHS ——
    C("dhs_h3", "Hurricane 3 / Neo", "tacky_chinese", "狂飙|neo|ネオ|天極|天玻", "紅双喜|dhs|double\\s*happiness"),

    // —— Nittaku / others pips ——
    C("ni_spectol", "Spectol", "short_pips", "スペクトル", null),

    // —— TSP ——
    C("tsp_spin", "Spin Magic", "high_friction", "スピンマジック", "tsp"),
    C("tsp_reflex", "Reflex", "tensor_euro", "リフレックス|reflex", "tsp"),

    // —— Mizuno ——
    C("mz_road", "Road Sign", "tensor_euro", "ロードサイン", "ミズノ|mizuno"),

    // —— Joola ——
    C("jo_dynaryz", "Dynaryz", "tensor_euro", "ダイナライズ|dynaryz", "ヨーラ|joola"),
    C("jo_rhyzen", "Rhyzen", "tensor_euro", "ライゼン|rhyzen", "ヨーラ|joola"),

    // —— Sanwei ——
    C("sw_target", "Target", "tacky_chinese", "ターゲット|target", "三维|sanwei"),

    // —— Generic fallbacks by strong name only ——
    C("gen_tenergy", "Tenergy", "tensor_euro", "tenergy|テナジー", null),
    C("gen_dignics", "Dignics", "tensor_euro", "dignics|ディグニクス", null),
    C("gen_vega", "Vega（XIOM）", "tensor_euro", "ヴェガ|vega", "xiom|エクシオム"),
    C("gen_markv", "Mark V", "high_friction", "マーク[ⅴＶv]", null),
    C("gen_glayzer", "Glayzer", "tacky_hybrid", "グレイザー|glayzer", null),
    C("gen_rigan", "Rigan", "tensor_euro", "ライガン|rigan", null),
    C("gen_spectal", "Spectal", "short_pips", "スペクタル|spectal", null),
  ];

  function findRubberInCatalog(side) {
    const brand = String(side?.brand || "").trim();
    const name = String(side?.name || "").trim();
    const combined = `${brand} ${name}`.trim();
    if (!combined) return null;

    for (const entry of RUBBER_CATALOG) {
      const nameOk = entry.nameRe.test(name) || entry.nameRe.test(combined);
      if (!nameOk) continue;
      if (!entry.brandRe) return entry;
      if (entry.brandRe.test(brand) || entry.brandRe.test(combined)) return entry;
    }
    return null;
  }

  window.RUBBER_CATALOG = RUBBER_CATALOG;
  window.RUBBER_CATALOG_COUNT = RUBBER_CATALOG.length;
  window.findRubberInCatalog = findRubberInCatalog;
})();
