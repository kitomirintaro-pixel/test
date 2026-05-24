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
    C("bf_zyre03", "Zyre 03", "tensor_euro", "ザイア|zyre\\s*0?3", "バタフライ|butterfly"),
    C("bf_d09c", "Dignics 09C", "tacky_hybrid", "ディグニクス\\s*0?9c|dignics\\s*0?9c", "バタフライ|butterfly"),
    C("bf_glayzer", "Glayzer", "tacky_hybrid", "グレイザー(?!.*0?9c)|glayzer(?!.*0?9c)", "バタフライ|butterfly"),
    C("bf_t19", "Tenergy 19", "tensor_euro", "テナジー\\s*19|tenergy\\s*19", "バタフライ|butterfly"),
    C("bf_roundell", "Roundell", "high_friction", "ラウンデル|roundell", "バタフライ|butterfly"),
    C("bf_tackiness_chop", "Tackiness Chop", "high_friction", "タキネス.*チョップ|tackiness.*chop", "バタフライ|butterfly"),
    C("bf_sriver_el", "Sriver-EL", "high_friction", "スレイバー.*el|sriver.*el", "バタフライ|butterfly"),
    C("bf_baggler", "Baggler", "high_friction", "バグラー|baggler", "バタフライ|butterfly"),
    C("bf_impartial_x", "Impartial XS/XB", "short_pips", "インパーシャル.*(xs|xb)", "バタフライ|butterfly"),
    C("bf_challenger", "Challenger Attack", "high_friction", "チャレンジャー.*アタック|challenger.*attack", "バタフライ|butterfly"),
    C("bf_speedy_po", "Speedy P.O.", "short_pips", "スピーディー.*p\\.?o|speedy.*p\\.?o", "バタフライ|butterfly"),
    C("bf_ilius_s", "Ilius S", "high_friction", "イリウス\\s*s|ilius\\s*s", "バタフライ|butterfly"),
    C("bf_ilius_b", "Ilius B", "high_friction", "イリウス\\s*b|ilius\\s*b", "バタフライ|butterfly"),
    C("bf_feint_l3", "Feint Long III", "long_pips", "フェイント.*ロング\\s*3|feint.*long\\s*3", "バタフライ|butterfly"),
    C("bf_feint_l2", "Feint Long II", "long_pips", "フェイント.*ロング\\s*2|feint.*long\\s*2", "バタフライ|butterfly"),
    C("bf_feint_soft", "Feint Soft", "short_pips", "フェイント.*ソフト|feint.*soft", "バタフライ|butterfly"),
    C("bf_feint_ox", "Feint OX", "short_pips", "フェイント.*ox|feint.*ox", "バタフライ|butterfly"),
    C("bf_largestorm", "Largestorm Spin", "long_pips", "ラージストーム.*スピン|largestorm", "バタフライ|butterfly"),
    C("bf_large44", "Largest 44DX", "long_pips", "ラージ44|large.*44", "バタフライ|butterfly"),
    C("bf_super_anti", "Super Anti", "anti", "スーパーアンチ|super.*anti", "バタフライ|butterfly"),
    C("bf_orthodox", "Orthodox DX", "anti", "オーソドックス|orthodox", "バタフライ|butterfly"),

    // —— VICTAS（ヴェガ系は XIOM）——
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
    C("vi_v20", "V>20 Extra", "tensor_euro", "v>\\s*20|v20", "victas|ヴィクタス"),
    C("vi_v11", "V>11 Extra", "tensor_euro", "v>\\s*11|v11", "victas|ヴィクタス"),
    C("vi_v15_stiff", "V>15 Stiff/Limber", "tensor_euro", "v>\\s*15.*(スティフ|stiff|リンバー|limber)", "victas|ヴィクタス"),
    C("vi_ventus", "Ventus", "tensor_euro", "ヴェンタス|ventus", "victas|ヴィクタス"),
    C("vi_vj07", "VJ>07", "tensor_euro", "vj>\\s*0?7|vj07", "victas|ヴィクタス"),
    C("vi_v15_sticky", "V>15 Sticky", "tacky_hybrid", "v>\\s*15.*スティッキー|v15.*sticky", "victas|ヴィクタス"),
    C("vi_triple", "Triple Extra", "tensor_euro", "トリプル", "victas|ヴィクタス"),
    C("vi_vs401", "VS>401", "tensor_euro", "vs>\\s*401|vs401", "victas|ヴィクタス"),
    C("vi_vs402", "VS>402", "tensor_euro", "vs>\\s*402|vs402", "victas|ヴィクタス"),
    C("vi_vo101", "VO>101", "short_pips", "vo>\\s*101|vo101", "victas|ヴィクタス"),
    C("vi_vo102", "VO>102", "short_pips", "vo>\\s*102|vo102", "victas|ヴィクタス"),
    C("vi_vo103", "VO>103", "short_pips", "vo>\\s*103|vo103", "victas|ヴィクタス"),
    C("vi_spinpips", "Spin Pips D1/D2/D3", "short_pips", "スピンピップス|spin\\s*pips", "victas|ヴィクタス"),
    C("vi_carl", "Curl P1V–P5V", "short_pips", "カール\\s*p[1-5]|curl\\s*p", "victas|ヴィクタス"),
    C("vi_vl", "V>L1/L2/L3", "long_pips", "v>\\s*l[1-3]|v>l", "victas|ヴィクタス"),

    // —— Yasaka ——
    C("ya_markv", "Mark V", "high_friction", "マーク[ⅴＶv]|mark\\s*v", "ヤサカ|yasaka"),
    C("ya_rakza7", "Rakza 7", "tensor_euro", "ラクザ\\s*7|rakza\\s*7", "ヤサカ|yasaka"),
    C("ya_rakzaxx", "Rakza XX", "tensor_euro", "ラクザ.*xx|rakza.*xx", "ヤサカ|yasaka"),
    C("ya_rakzax", "Rakza X", "tensor_euro", "ラクザ\\s*x|rakza\\s*x", "ヤサカ|yasaka"),
    C("ya_rakzaz", "Rakza Z", "tacky_hybrid", "ラクザ\\s*z|rakza\\s*z", "ヤサカ|yasaka"),
    C("ya_pip", "Pip P-1", "short_pips", "pip|ピップ", "ヤサカ|yasaka"),
    C("ya_rakza9", "Rakza 9", "tensor_euro", "ラクザ\\s*9|rakza\\s*9", "ヤサカ|yasaka"),
    C("ya_rakza_soft", "Rakza Soft/Hard", "tensor_euro", "ラクザ.*(ソフト|soft|ハード|hard)", "ヤサカ|yasaka"),
    C("ya_raigan", "Raigan", "tensor_euro", "ライガン(?!.*スピン)|raigan(?!.*spin)", "ヤサカ|yasaka"),
    C("ya_raigan_spin", "Raigan Spin", "tensor_euro", "ライガンスピン|raigan.*spin", "ヤサカ|yasaka"),
    C("ya_shoryu", "Shoryu II", "high_friction", "翔龍|shoryu", "ヤサカ|yasaka"),
    C("ya_kiryu", "Kiryu II", "high_friction", "輝龍|kiryu", "ヤサカ|yasaka"),
    C("ya_markv_var", "Mark V AD/M2/XS/GPS/HPS", "high_friction", "マーク[ⅴＶv].*(ad|m2|xs|gps|hps|30)", "ヤサカ|yasaka"),
    C("ya_original", "Original", "short_pips", "オリジナル(?!.*エクストラ)|original", "ヤサカ|yasaka"),
    C("ya_original_ext", "Original Extra", "high_friction", "オリジナル.*エクストラ", "ヤサカ|yasaka"),
    C("ya_original_pips", "Original 大粒/小粒", "short_pips", "オリジナル.*(大粒|小粒)", "ヤサカ|yasaka"),
    C("ya_original_t", "Original T", "short_pips", "オリジナル.*tバージョン|original.*t", "ヤサカ|yasaka"),
    C("ya_rakza_po", "Rakza PO", "short_pips", "ラクザ\\s*po|rakza\\s*po", "ヤサカ|yasaka"),
    C("ya_spinate", "Spinate", "high_friction", "スピネイト|spinate", "ヤサカ|yasaka"),
    C("ya_elflak", "Elfrack RF", "short_pips", "エルフラーク|elfrak|elflack", "ヤサカ|yasaka"),
    C("ya_trick_anti", "Trick Anti", "anti", "トリックアンチ|trick.*anti", "ヤサカ|yasaka"),
    C("ya_anti_power", "Anti Power", "anti", "アンチパワー|anti.*power", "ヤサカ|yasaka"),
    C("ya_a1", "A-1", "short_pips", "\\ba-?1\\b", "ヤサカ|yasaka"),
    C("ya_a2", "A-2", "short_pips", "\\ba-?2\\b", "ヤサカ|yasaka"),
    C("ya_phantom", "Phantom 007–0012", "long_pips", "ファントム|phantom", "ヤサカ|yasaka"),
    C("ya_extend", "Extend LB", "long_pips", "エクステンド|extend", "ヤサカ|yasaka"),
    C("ya_largecraft", "Large Craft", "long_pips", "ラージクラフト|large.*craft", "ヤサカ|yasaka"),

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
    C("ni_junction", "Junction", "tensor_euro", "ジャネクション|junction", "ニッタク|nittaku"),
    C("ni_hammond", "Hammond Z2/CR", "tensor_euro", "ハモンド|hammond", "ニッタク|nittaku"),
    C("ni_fast_g1", "Fastarc G-1", "tensor_euro", "ファスターク\\s*g-?1|fastarc\\s*g", "ニッタク|nittaku"),
    C("ni_fast_c1", "Fastarc C-1", "tensor_euro", "ファスターク\\s*c-?1|fastarc\\s*c", "ニッタク|nittaku"),
    C("ni_fast_s1", "Fastarc S-1", "tensor_euro", "ファスターク\\s*s-?1|fastarc\\s*s", "ニッタク|nittaku"),
    C("ni_fast_p1", "Fastarc P-1", "tensor_euro", "ファスターク\\s*p-?1|fastarc\\s*p", "ニッタク|nittaku"),
    C("ni_flyatt", "Flyatt", "tensor_euro", "フライアット|flyatt", "ニッタク|nittaku"),
    C("ni_factive", "Factive", "tensor_euro", "ファクティブ|factive", "ニッタク|nittaku"),
    C("ni_sieger", "Sieger PK50", "tensor_euro", "ズィーガー|sieger|pk50", "ニッタク|nittaku"),
    C("ni_kyohyo", "Kyohyo 3/8/Neo/Pro3", "tacky_chinese", "キョウヒョウ|kyohyo|狂飆", "ニッタク|nittaku"),
    C("ni_stellack", "Stellack", "tensor_euro", "ステラック|stellack", "ニッタク|nittaku"),
    C("ni_revest", "Revest", "tensor_euro", "レベスト|revest", "ニッタク|nittaku"),
    C("ni_rooking", "Rooking", "tensor_euro", "ルーキング|rooking", "ニッタク|nittaku"),
    C("ni_moristo_sp", "Moristo SP", "short_pips", "モリスト\\s*sp|moristo\\s*sp", "ニッタク|nittaku"),
    C("ni_sonic", "Sonic AR", "short_pips", "ソニック\\s*ar|sonic", "ニッタク|nittaku"),
    C("ni_donuckle", "Donuckle", "short_pips", "ドナックル|donuckle", "ニッタク|nittaku"),
    C("ni_pimple", "Pimple Slide", "short_pips", "ピンプルスライド|pimple.*slide", "ニッタク|nittaku"),
    C("ni_express", "Express", "short_pips", "エクスプレス|express", "ニッタク|nittaku"),
    C("ni_super_large", "Super Large", "long_pips", "スーパー大粒", "ニッタク|nittaku"),
    C("ni_warrest", "Warrest", "long_pips", "ウォーレスト|warrest", "ニッタク|nittaku"),
    C("ni_glastree", "Glastree 44", "long_pips", "グラストリー|glastree", "ニッタク|nittaku"),
    C("ni_royal_large", "Royal Large", "long_pips", "ロイヤルラージ|royal.*large", "ニッタク|nittaku"),
    C("ni_jewel", "Jewel Large", "long_pips", "ジュエルラージ|jewel", "ニッタク|nittaku"),
    C("ni_hammond44", "Hammond 44", "long_pips", "ハモンド44|hammond.*44", "ニッタク|nittaku"),
    C("ni_moristo44", "Moristo 44", "long_pips", "モリスト44|moristo.*44", "ニッタク|nittaku"),
    C("ni_praxon", "Praxon 450/350", "long_pips", "プラクソン|praxon", "ニッタク|nittaku"),
    C("ni_arhelg", "Arhelg", "long_pips", "アルヘルグ|arhelg", "ニッタク|nittaku"),

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
    C("mz_q_power", "Q Power", "tensor_euro", "qパワー|q\\s*power", "ミズノ|mizuno"),
    C("mz_q5", "Q5", "tensor_euro", "q5", "ミズノ|mizuno"),
    C("mz_q4", "Q4", "tensor_euro", "q4", "ミズノ|mizuno"),
    C("mz_q3", "Q3", "tensor_euro", "q3", "ミズノ|mizuno"),
    C("mz_q_quality", "Q Quality", "tensor_euro", "qクオリティ|q\\s*quality", "ミズノ|mizuno"),
    C("mz_q1", "Q1", "tensor_euro", "q1", "ミズノ|mizuno"),
    C("mz_booster", "Booster JP", "tensor_euro", "ブースター|booster", "ミズノ|mizuno"),
    C("mz_unison", "Unison Plus", "tensor_euro", "ユニゾン|unison", "ミズノ|mizuno"),

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
