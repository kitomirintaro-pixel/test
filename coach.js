/**
 * Spinsight 計測を補助するための練習プラン生成（ルールベース・ブラウザ内完結）
 * 公式 API 非連携: アプリで得た数値・感覚はユーザーが入力
 */

const ISSUE_CATALOG = {
  forehand_drive: {
    label: "フォアドライブ（威力・前後の出し入れ）",
    improvements: [
      "打点が高すぎると回転が抜けやすい。ボールの「少し手前」で芯を捉える意識から始める",
      "スイングは腰の回転→腕の加速の順。いきなり腕だけで叩かない",
      "相手の上回転が強いほど、面を少し閉じ気味に保ち、前への送りを短くする",
    ],
    drills: [
      {
        name: "フォア一本ドライブ（定点クロス）",
        time: "12分",
        detail: "相手の上回転を固定コースへ。20本連続でネット・ラインを記録。ミス時は打点か面のどちらか一方だけ修正。",
      },
      {
        name: "前後コントロールドライブ",
        time: "15分",
        detail: "同じスイングイメージで深い球／浅い球を意図的に出し分け。Spinsight で球速と回転のトレードオフを確認。",
      },
    ],
    spinsight:
      "フォアドライブはストローク練で同じ打点帯を繰り返し測り、回転・速度のブレ幅を週で比較すると伸びます。",
  },
  backhand_drive: {
    label: "バックドライブ・バックループ",
    improvements: [
      "替えの一歩が終わってからスイングを開始。肘を支点に前へ送り出す",
      "バックは打点が下がりやすい。膝の屈伸で低い球にも顔の高さを保つ",
      "相手の速い球には面を立てすぎず、まずは台に返すことを優先してタイミングを合わせる",
    ],
    drills: [
      {
        name: "バッククロス連続",
        time: "14分",
        detail: "ライン固定で連続本数を競う。替え後の第一打だけ計測し、足と打点の相関をメモ。",
      },
      {
        name: "ミドル→バック替えドライブ",
        time: "12分",
        detail: "中央処理後にバックへ替え、一本だけフルスイング。替え幅を一定に。",
      },
    ],
    spinsight:
      "バックは替えの直後の第一打で数値が落ちやすいです。OpenPlay で実戦軌道を混ぜて測ると弱点が見えます。",
  },
  cut_defense: {
    label: "カット（チョップ・削りラリー）",
    improvements: [
      "刃角よりも「打球の高さ」と「落ち着いたリズム」を揃えると回転の質が安定する",
      "強い上回転には薄く当てすぎず、ボールの下を通す距離を確保する",
      "攻守切替のタイミングを決め、カットだけの練習日と攻め込みの練習日を分けると上達が早い",
    ],
    drills: [
      {
        name: "定点カット（深さ指定）",
        time: "15分",
        detail: "相手に上回転ループを固定してもらい、落とす深さを2段階で出し分け。長さのばらつきを数値化して自己採点。",
      },
      {
        name: "カット→カウンター切替",
        time: "18分",
        detail: "5球カットの後だけ攻撃可などルールを付け、切替の足と面のリセットを鍛える。",
      },
    ],
    spinsight:
      "カットは回転方向・回転量の再現性が指標になりやすいです。同じ相手球条件で測定セットを固定してください。",
  },
  block_game: {
    label: "ブロック（速球・上回転対応）",
    improvements: [
      "ブロックは「止める」より先に「面と打点を固定」する。指先で押さえすぎない",
      "相手のループが速いほど、待つ位置を少し後ろに取り、前で押し潰されない",
      "返球の長さが伸びる日は面が開いているか、打点が遅れているかを疑う",
    ],
    drills: [
      {
        name: "クロスブロック連続",
        time: "12分",
        detail: "相手に強めの上回転を一点に。面の角度を変えず打点で調整。",
      },
      {
        name: "ブロック→カウンター一本",
        time: "15分",
        detail: "3ブロックに1カウンターなど割合を決め、切替のリズムを固定。",
      },
    ],
    spinsight:
      "ブロックは球速が上がるほど打点のズレが数値に出ます。受け手のリラックス度合いとセットで記録すると改善点が明確です。",
  },
  counter_attack: {
    label: "カウンター・弾みつき速攻",
    improvements: [
      "弾みつきは「短く当てて伸ばす」。振り幅よりタイミングと芯の位置",
      "相手球の上昇期〜最高点上で処理すると安定しやすい。遅れるとネットやラインに振られる",
      "足は小さく、重心移動は素早く。打った直線上に体重が残るようにする",
    ],
    drills: [
      {
        name: "限定カウンターラリー",
        time: "14分",
        detail: "相手のドライブに対しカウンターのみ可。コースを絞り、入り率を記録。",
      },
      {
        name: "速球ドライブ→一本カウンター",
        time: "12分",
        detail: "多球で速い上回転を入れ、一本だけ返す反復。Spinsight で球速と回転のピークを確認。",
      },
    ],
    spinsight:
      "カウンターは球速と回転の立ち上がりが特徴です。打点が1つズレると数値が大きく変わるので、再現性の観察に向きます。",
  },
  smash: {
    label: "スマッシュ（高い球の決め球）",
    improvements: [
      "打点はボールの最高点上〜やや下降初め。手が上がりすぎるとネット、下がりすぎるとラインに振られる",
      "振りは大きくしすぎず、芯で押し切る距離を一定に。足の替えで位置調整し、手だけで届かない",
      "相手のブロックが回転強めなら、面を少し閉じ気味にしてスピード優先のイメージから入る",
    ],
    drills: [
      {
        name: "多球スマッシュ（コース指定）",
        time: "12分",
        detail: "高いノースピン〜弱上回転を一点に。クロス／ストレートを分け、20本の入り率とミス方向を記録。",
      },
      {
        name: "ラリー中スマッシュ一本",
        time: "14分",
        detail: "実戦から浮いた球だけスマッシュ可。打点がズレたら打たずにリセットして再開。",
      },
    ],
    spinsight:
      "スマッシュは球速のピークと打点の相関が強いです。同じ送球高さで測定条件を固定すると伸びます。",
  },
  push_attack: {
    label: "プッシュ（攻めプッシュ・上系プッシュ）",
    improvements: [
      "攻めプッシュは振りより、足の入りと面の微調整。長さは打点と面のセットで作る",
      "相手の下回転が強いほど、薄く当てすぎずボールの下を短く通す",
      "第三球へ繋ぐ意識で、戻しが長すぎないか毎球チェック",
    ],
    drills: [
      {
        name: "定点攻めプッシュ",
        time: "12分",
        detail: "下回転を同じ深さに返し、ネット・長さのばらつきを記録。今日はスピードより入り率優先でも可。",
      },
      {
        name: "プッシュ→ループ一本",
        time: "15分",
        detail: "プッシュ後の上回転に対し一本だけ攻め。替えと打点を固定。",
      },
    ],
    spinsight:
      "プッシュは回転より球速・深さの再現性が指標になりやすいです。同じサーブ条件で測ると比較が楽です。",
  },
  lobbing: {
    label: "ロビング（高い守備からの浮き球）",
    improvements: [
      "ロブは「高さ」と「深さ」と「回転の薄さ」のバランス。いきなり端を狙わずまず台の奥を確保",
      "相手のスマッシュ位置をずらすため、左右と深さを2パターン以上用意する",
      "身体の向きと打点をセットで固定しないと、毎回違う弧線になりやすい",
    ],
    drills: [
      {
        name: "ターゲットロブ",
        time: "14分",
        detail: "相手に攻撃を入れてもらい、指定コースへロブ。弧の高さを2段階で意図的に変える。",
      },
      {
        name: "ロブ→カウンター待ち",
        time: "12分",
        detail: "ロブ後の戻りを早め、相手の決め手が甘い球だけカウンター。",
      },
    ],
    spinsight:
      "ロブは弧線の再現性より、相手の攻撃後に返せたかのログとセットで見ると戦術の改善に繋がります。",
  },
  serve_top: {
    label: "サーブ・上回転系",
    improvements: [
      "上系サーブは振りの終端加速と、ボールへの圧の方向を一致させる。見せかけは腕より腰・肩の向きで作る",
      "長さが伸びる日は打点が遅れているか、面が開きすぎていないかを疑う",
      "回転と速度のトレードオフを週次でログし、試合では入り率優先の日を作る",
    ],
    drills: [
      {
        name: "上系ターゲットサーブ",
        time: "12分",
        detail: "半台またはコース指定で20本。回転・球速を Spinsight で記録し、ブレ幅だけ比較。",
      },
      {
        name: "上系＋別回転の見せかけ",
        time: "15分",
        detail: "振りは似せつつ回転差を付ける日と、純粋に品質を上げる日を週で分ける。",
      },
    ],
    spinsight:
      "サーブ練モードで上系の回転方向・回転量と球速を毎セット記録。照明条件もメモに含めると再現性が上がります。",
  },
  serve_under: {
    label: "サーブ・下回転系",
    improvements: [
      "下系は摩擦の質とボールの落ちる位置の再現性。引きと出すのタイミングを一定に",
      "回転が弱い日は薄く当てすぎ。厚めに捉えるイメージの練習日を週に入れる",
      "長さが浮く日は面が立ちすぎ／打点が早すぎを疑う",
    ],
    drills: [
      {
        name: "下系ショート／ロング出し分け",
        time: "14分",
        detail: "同じ振りイメージで短く止める／長くするを交互。入り数と第二跳をメモ。",
      },
      {
        name: "下系＋横成分の段階導入",
        time: "12分",
        detail: "まず純粋な下系の数値を安定させ、次の週で横成分を足す。",
      },
    ],
    spinsight:
      "下系は回転の絶対値と第二跳の伸びの関係が分かりやすいです。同じタオ投げ高さで測るなど条件を固定してください。",
  },
  serve_side_top: {
    label: "サーブ・横回転（上回転寄り・サイドトップ系）",
    improvements: [
      "横上系は身体の向きとラケット軌道の「ねじれ」を一致させる。肘だけで横に振らない",
      "相手から見て回転の見え方が変わるので、マークと軌道のセットで自己チェック",
      "ミスがサイドに飛ぶ日は打点か体幹の回転がズレていることが多い",
    ],
    drills: [
      {
        name: "横上系コース固定",
        time: "12分",
        detail: "フォア／バックサイドを分け、20本ずつ。Spinsight で横成分の再現性を体感＋数値で確認。",
      },
      {
        name: "横上→似た振りで下系",
        time: "14分",
        detail: "見せかけ用に振りを近づけ、回転差だけを数値で検証。",
      },
    ],
    spinsight:
      "横系は回転方向の表示と球速のバランスをセットで見ると、『かかったつもり』の修正が早いです。",
  },
  serve_side_under: {
    label: "サーブ・横回転（下回転寄り・サイドアンダー系）",
    improvements: [
      "横下系は薄く削りすぎると飛ぶ。ボールの横〜斜め下への摩擦時間を意識",
      "肘の高さが変わると軌道が変わりやすい。リリース点を毎球そろえる",
      "レシーブされやすい日は回転より軌道の読みやすさを疑う",
    ],
    drills: [
      {
        name: "横下系ネット手前管理",
        time: "13分",
        detail: "ショートに落とす日と、長めに切る日を分け、同じ振りから出し分けられるか検証。",
      },
      {
        name: "横下＋上系の切替",
        time: "12分",
        detail: "5球ごとに回転系統を変え、ルーティンを短く保つ。",
      },
    ],
    spinsight:
      "横下系は回転と第二跳の曲がりをセットで見ると、薄さのミスが特定しやすいです。",
  },
  serve_makikomi: {
    label: "サーブ・巻き込み（体幹・フック軌道）",
    improvements: [
      "巻き込みは腕だけで円を描かず、胸の向きと腰の回転でラケットを運ぶ。フォローが身体の外に逃げないようにする",
      "巻き込み過ぎると打点が遅れ、長さが伸びやすい。リリースの手前で一度止まらない",
      "見せかけと実回転のズレを作るなら、腰の止め方と腕の加速タイミングを分ける",
    ],
    drills: [
      {
        name: "巻き込みスローモーション確認",
        time: "10分",
        detail: "動画または鏡で、胸・腰・肘の順序を確認してから通常スピードで20本。",
      },
      {
        name: "巻き込み＋ストレート軌道の切替",
        time: "14分",
        detail: "同じスタンスで軌道だけ変える練習。Spinsight で球速と回転の立ち上がりを比較。",
      },
    ],
    spinsight:
      "巻き込み系はスイング軌道が変わるほど数値の立ち上がりが変わります。正面・斜めからの撮影メモとセットで。",
  },
  serve_yg: {
    label: "サーブ・YG系（横系・チーム独自の呼称など）",
    improvements: [
      "YG などコミュニティ用語は定義が人によります。自分では『軌道・マスク・リリース点』を言語化して固定する",
      "見せかけは振り幅より、ラケットの最初の10cmの軌道と最後の10cmの差で作ると再現しやすい",
      "数値が落ちた日は名称ではなく、打点・肘・体重移動のどれが変わったかを1つに絞る",
    ],
    drills: [
      {
        name: "YG系条件固定セット",
        time: "12分",
        detail: "同じ足の位置・同じタオ高さで20本。名称ではなく条件表で記録。",
      },
      {
        name: "YG系＋別系統の振り分け",
        time: "14分",
        detail: "レシーバーに回転予想を書かせ、予想外れの原因を動画またはメモで振り返る。",
      },
    ],
    spinsight:
      "横系・YG系は回転方向と球速の組が特徴です。週次で『同じ条件表』だけを比較すると迷いが減ります。",
  },
  serve_squat: {
    label: "サーブ・しゃがみ込み（低重心・低いリリース）",
    improvements: [
      "しゃがみサーブは膝・股関節の可動域とセット。無理な深さより、毎球同じ深さを優先",
      "起き上がりのタイミングで軌道が変わる。打った後の還元を試合モードに近づける",
      "腰が上がる日は回転より入り率が落ちやすい。コンディションをメモ",
    ],
    drills: [
      {
        name: "しゃがみ深さマーカー",
        time: "10分",
        detail: "膝の高さをマーカーまたは動画で固定し、20本同じ深さから出す。",
      },
      {
        name: "しゃがみ→通常スタンス切替",
        time: "12分",
        detail: "交互にスタンスを変え、ルーティンを短く保てるか確認。",
      },
    ],
    spinsight:
      "低重心サーブはリリース高が変わると数値が変わりやすいです。撮影でリリース高を週次比較してください。",
  },
  serve_forehand: {
    label: "サーブ・フォア面メイン",
    improvements: [
      "フォアサーブは身体の開きとタイミング。替え足が完了してからスイングを始める",
      "バックサイドのサーブは腰の向きと足の向きをセットで設計",
      "振りが大きくなるほど打点がズレやすい。まずは入り率で振り幅を決める",
    ],
    drills: [
      {
        name: "フォアサーブコース別",
        time: "14分",
        detail: "ミドル／ワイドを分け、同じ回転系統で20本ずつ。Spinsight で左右差を比較。",
      },
      {
        name: "フォアサーブ→第三球シミュ",
        time: "16分",
        detail: "サーブ後の還元を必ず決めた位置で受ける。第三球は一本に限定。",
      },
    ],
    spinsight:
      "フォア面サーブは体の開きで軌道が変わるため、正面動画と数値をセットで週次確認すると伸びます。",
  },
  serve_backhand: {
    label: "サーブ・バック面メイン",
    improvements: [
      "バックサーブは肘とラケット面のリセット。フォア側のサーブとリズムを混ぜない日を作る",
      "タッチの前に身体の向きをそろえると、横成分のブレが減る",
      "粒高・表のバックサーブは回転表現が限定的な分、長さと弧の管理を優先",
    ],
    drills: [
      {
        name: "バックサーブ単独セット",
        time: "12分",
        detail: "回転系統を1つに絞り20本。フォアサーブと混ぜないセットを週に1回入れる。",
      },
      {
        name: "バックサーブ＋一本攻め",
        time: "15分",
        detail: "短い球を狙った後の第三球だけフルスイング可。",
      },
    ],
    spinsight:
      "バックサーブはリリース点のブレが数値に出やすいです。同じ足の角度で測定してください。",
  },
  flick_short: {
    label: "フリック・チキータ（短い下回転への攻め）",
    improvements: [
      "短い球は身体の入りが浅くなりがち。腰をテーブルに近づけるイメージで足を入れる",
      "振りは小さく、摩擦は「ボールの横〜斜め横」を意識。振り幅で誤魔化さない",
      "相手の下回転が強いほど、触球は短く、次の還元を早める",
    ],
    drills: [
      {
        name: "ショート一本フリック",
        time: "12分",
        detail: "サーブまたはドロップの短い下回転に対し、コース固定で入り率を競う。",
      },
      {
        name: "フリック→第三球",
        time: "16分",
        detail: "フリック後の相手球に対し、決め球を一本に限定。ミス理由を毎回一言でメモ。",
      },
    ],
    spinsight:
      "短い球の攻めは回転の立ち上がりと速度のバランスがポイントです。同じサーブ条件で測ると比較が容易です。",
  },
  underspin_receive: {
    label: "下回転の受け（ツッツキ・ストップ）",
    improvements: [
      "ラケット面を「立てすぎ／寝かせすぎ」から微調整し、ボールの下を通す意識を固定する",
      "タイミングは足の入り→体重移動→スイングの順。手だけで取りに行かない",
      "回転が強い球ほど摩擦で掴む時間を短くし、前後のブレを減らす",
    ],
    drills: [
      {
        name: "一本ツッツキ（定点）",
        time: "10分",
        detail: "相手に多様な下回転を出してもらい、ネットミスと長さのばらつきを記録。目標は「同じフォームで長短を出し分け」。",
      },
      {
        name: "半面ストップ→プッシュ",
        time: "15分",
        detail: "ストップで止めた後、同じ受け方からプッシュへ繋ぐ。ラケット角度の差分を小さくする練習。",
      },
    ],
    spinsight:
      "ストローク練／スキルテストで同じ受けフォームを繰り返し、回転・スピードのブレを数値で追うと改善が早いです。",
  },
  topspin_rally: {
    label: "上回転ラリー（連続・安定全般）",
    improvements: [
      "打点を一定にする（高すぎ／低すぎの自覚を Spinsight の再現性チェックに繋げる）",
      "スイングは「小さく当てる→押し込む」の順で増幅。いきなり大きく振らない",
      "相手球の上回転が強いほど、顔の前で待ってから前に送り出す",
    ],
    drills: [
      {
        name: "クロス連続ループ",
        time: "15分",
        detail: "打点とラインを固定し、20本連続を目標。切れたら原因を「打点／面／タイミング」のどれか一つに絞る。",
      },
      {
        name: "バックからフォアへ替え",
        time: "12分",
        detail: "替えの一歩の幅を一定に。替え後の第一打だけ Spinsight で再測定すると癖が見えます。",
      },
    ],
    spinsight:
      "同じドリル条件で回転数・球速を比較し、『振ったつもり』と実測の差を週次で見るのが有効です。",
  },
  spin_reading: {
    label: "回転の見極め・ミート",
    improvements: [
      "サーブ／第三球は「音・マーク・軌道」の手掛かりをセットで観察する",
      "返す前にラベル（上／下／ノースピン寄り）を心の中で言語化する",
      "ミートが甘いときは面の調整より、打点を手前に取りすぎていないかを疑う",
    ],
    drills: [
      {
        name: "隠しマルチボール（回転当て）",
        time: "10分",
        detail: "コーチがランダムに上下を出し、ラケットを触る前に回転を宣言。正答率より反応速度を重視。",
      },
      {
        name: "サーブ受け一本勝負",
        time: "15分",
        detail: "同一サーブでも第二球まで繋がないと負け。読みと足の入りをセットで鍛える。",
      },
    ],
    spinsight:
      "OpenPlay で実戦に近い球を受け、回転方向・回転量の分布をダッシュボードで確認すると癖が可視化されます。",
  },
  serve: {
    label: "サーブの質・変化",
    improvements: [
      "投げ・引き・出すのリズムを一定にし、ボールの落ちる位置を固定する",
      "回転差は腕の速さより、ラケット軌道とボールの摩擦位置で作る",
      "ミスしたサーブの再現性を上げる（同じミスを意図的に減らす）",
    ],
    drills: [
      {
        name: "ターゲットサーブ 20本",
        time: "12分",
        detail: "コースと長さを指定し、20本中の入り数を記録。今日は回転量より入り率優先でも可。",
      },
      {
        name: "同一モーション二種",
        time: "15分",
        detail: "振りが似た上回転と下回転（またはノースピン寄り）を交互に。相手の読み損ねを増やす。",
      },
    ],
    spinsight:
      "サーブ練モードで回転・速度を都度確認し、『狙い値』に対するブレ幅を週で比較してください。",
  },
  third_ball: {
    label: "第3球（サーブ＆レシーブ後の攻め）",
    improvements: [
      "サーブ後の還元と、第三球の足の入り方をセットで設計する",
      "レシーブの質が悪い日は第三球を決め切らず、確率の高いコースに寄せる",
      "相手の出だしパターンを2パターンに分類し、対応表を作る",
    ],
    drills: [
      {
        name: "サーブ→フリック or ツッツキ→攻め",
        time: "20分",
        detail: "レシーブ球に応じて第三球を限定（例: バックミドル）。ミス理由を毎回一語でメモ。",
      },
      {
        name: "レシーブ限定→一本攻め",
        time: "15分",
        detail: "相手のサーブを固定し、第三球だけフルスイング可。足の替え幅を一定に。",
      },
    ],
    spinsight:
      "第三球のスイングだけを切り出して測定し、回転が落ちるポイント（打点・面）を特定します。",
  },
  footwork: {
    label: "フットワーク・身体操作",
    improvements: [
      "一歩目の方向と幅を揃え、最後はクロスステップで調整する癖を付ける",
      "打った後の還元を「相手のラケット」ではなく「自分の重心の中心」基準にする",
      "無理な飛び込みは打点が下がり回転負けしやすい。踏み替えのタイミングを早める",
    ],
    drills: [
      {
        name: "三点踏み替え多球",
        time: "15分",
        detail: "フォア・ミドル・バックへランダム。打ったら必ず中央へ還元。",
      },
      {
        name: "ペン／シェーク替えフットワーク",
        time: "10分",
        detail: "自分の持ち方に合わせ、替えの無駄歩数を減らす。替え後の第一打だけ計測しても良い。",
      },
    ],
    spinsight:
      "同じドリルでも、足が遅い日は球速・回転が落ちやすい傾向があります。コンディション別に記録してください。",
  },
  pace_adapt: {
    label: "球の速さ・タメへの適応",
    improvements: [
      "早い球は打点を手前に取りすぎない。遅い球は待ちすぎて下がらない",
      "タメがある相手には、自分のスイングも短くタメを作って合わせる",
      "練習では意図的に「遅い多球→速い実戦」の順で切り替える",
    ],
    drills: [
      {
        name: "速度変化ラリー",
        time: "15分",
        detail: "コーチ／パートナーが速球と遅球を混ぜる。打点の前後ズレを自己採点。",
      },
      {
        name: "前ステップ限定レシーブ",
        time: "12分",
        detail: "下がらずに前で処理。早い球の練習になる。疲れたら中止。",
      },
    ],
    spinsight:
      "球速と回転の組み合わせをログ化し、苦手ゾーン（速×下など）を特定すると対策が明確になります。",
  },
  mental: {
    label: "メンタル・試合運び",
    improvements: [
      "1点ごとのルーティン（呼吸・ボール観察）を3秒以内に固定する",
      "ミス後の次の一球は難易度を下げ、確実に台に上げる選択を優先",
      "得点が入った後の緩みを「ルーティン再開」で防ぐ",
    ],
    drills: [
      {
        name: "カウント別シミュ",
        time: "20分",
        detail: "8-8、9-9、デュースを繰り返し、得点後の一本だけルーティン必須。",
      },
      {
        name: "ペナルティ付きゲーム",
        time: "15分",
        detail: "決め手を外したら相手に1点など、プレッシャーを人工的に付与。",
      },
    ],
    spinsight:
      "試合モードの数値と練習モードを比較し、本番で落ちる項目（球速・回転・再現性）を特定します。",
  },
};

/** ラバー別: 課題に応じたアドバイスと、ドリル末尾に付ける短いヒント */
const RUBBER_TYPES = {
  high_friction: {
    label: "裏／高摩擦裏ソフト（バランス型）",
    short: "裏・高摩擦",
    global: [
      "バランス型の裏ソフトは摩擦と弾みの中間にあります。数値では『打点がズレた時の落ち幅』が指標になりやすいです。",
    ],
    byIssue: {
      forehand_drive: "芯を捉えた後の押し込み距離を一定に。打点が上がると回転が抜けやすいので、Spinsight の数値と打点メモをセットで残すと改善が早いです。",
      backhand_drive: "替えが終わってからスイング。肘を支点に前へ。食いつきが強いほど面調整は小さく。",
      topspin_rally: "ラリーでは左右の打点ブレを先に潰すと、回転・球速の再現性が上がります。",
      underspin_receive: "下回転では食いつきが強い分、面の微調整は最小限に。戻しの長さで浮きを減らす。",
      flick_short: "短い球は身体をテーブル側へ。摩擦は振り幅より接触の質で作る。",
      cut_defense: "刃角より打球高さの統一を優先。回転の質はスイングの長さよりリズムで出しやすいです。",
      serve: "サーブは腕の加速だけでなく、ボールへの圧と摩擦時間のイメージで回転差を作る。",
      block_game: "面の微調整は指先ではなく、全体のブレの少ない姿勢で。速い球ほど打点を遅らせすぎない。",
      counter_attack: "弾みつきは短い接触から。ラバーのグリップを信頼しつつ、体重の乗せ方で球速を作る。",
      spin_reading: "高摩擦は回転の掛かり方の差が手元に出やすい。読みとセットで足の入りを固定する。",
      third_ball: "第三球は替え直後の第一打で数値が落ちやすい。足の完了を先に。",
      pace_adapt: "球速適応は『面を変える』より『打点帯を変える』練習と相性が良いです。",
      footwork: "足が遅い日は回転が先に落ちることがあります。コンディション別にログを分ける。",
      mental: "数値は結果のログ。ルーティンを挟んでから測定セットを始めるとブレの原因切り分けが楽です。",
    },
    drillNote: {
      forehand_drive: "芯で押し切る距離を毎球そろえる。",
      backhand_drive: "替え完了→スイングの間に余計な止まりを入れない。",
      cut_defense: "打球の高さを2段階で意図的に出し分け。",
      underspin_receive: "面は小さく、戻しの長さで調整。",
      block_game: "面より打点で長さをコントロール。",
      counter_attack: "短く当てて前へ。振り幅よりタイミング。",
      flick_short: "腰をテーブルへ近づけ、振りは小さく。",
      serve: "回転系統ごとにタメとリリース点を固定。",
      smash: "打点は最高点上付近。振り過ぎない。",
      push_attack: "面と打点で長さ。薄く当てすぎない。",
      lobbing: "高さと深さを先に。端を狙いすぎない。",
    },
    serveInvertedExtra:
      "裏面サーブは摩擦で回転を『噛ませる』イメージが使いやすく、打点・リリースのズレが回転量に直結しやすいです。表・粒高と比べて回転の絶対値は出しやすい一方、軌道の読みやすさとのトレードオフを意識してください。",
  },
  tacky_chinese: {
    label: "裏／中国式（粘着系）",
    short: "裏・粘着",
    global: [
      "粘着系は摩擦時間とスイング軌道で回転を作りやすい反面、打点がズレると数値が落ちやすい傾向があります。",
    ],
    byIssue: {
      forehand_drive: "引き足と最後の押し込みをセットで。薄く当てると回転だけで球が伸びないので、『厚めに捉える日』を週に一度入れるとバランスが良いです。",
      backhand_drive: "バックでも同様に、振りの終わりまで意識を抜かない。粘着は替え直後のミートが難しいので多球で反復。",
      topspin_rally: "ラリーでは打点の前後より、スイングの終端までの加速が数値に出やすいです。",
      underspin_receive: "下回転では『寝かせすぎ』に注意。粘着は食い込みが深くなりがちなので、戻しは短めから試す。",
      flick_short: "短い球は振りより、ボールの横〜斜め横への摩擦。粘着は振りが大きいとネットに寄りやすい。",
      cut_defense: "削りは刃の使い方より、ボールの下を通す長さとリズム。粘着カットは回転の立ち上がりが特徴的です。",
      serve: "サーブは軌道とボールへの圧で回転差を作る練習日と、入り率優先の日を分ける。",
      block_game: "粘着のブロックは面を固定しやすい反面、速い球で押し込まれると返球が長くなりがち。打点を手前に取りすぎない。",
      counter_attack: "弾みつきはラバーの粘性を活かしつつ、打点を上げすぎない。短いフリクションが鍵。",
      spin_reading: "粘着は回転の違いが手元に伝わりやすい。読みの言語化→足→スイングの順で固定する。",
      third_ball: "第三球は『引きが足りない』と回転が落ちやすい。Spinsight で引き足の日と通常日を比較。",
      pace_adapt: "遅い球で厚く当てすぎ、速い球で薄く当てすぎに注意。速度帯ごとに面のイメージを変える。",
      footwork: "足が遅れると粘着ほどミートが落ちます。替えの最小ステップを決める。",
      mental: "数値が落ちた日はフォームより、疲労と照明（Spinsight の注意点）もメモに含める。",
    },
    drillNote: {
      forehand_drive: "引き→加速を分けて感じる。最後まで押し切る。",
      topspin_rally: "終端まで加速。打点の前後より加速の抜けを統一。",
      underspin_receive: "寝かせすぎ注意。戻しは短めから。",
      flick_short: "小さく、横摩擦を意識。",
      serve: "軌道と圧で回転差。引き足と終端加速をセット。腕だけにしない。",
      smash: "厚めに捉える日を週に入れる。",
      push_attack: "寝かせすぎない。戻しは短めから。",
      lobbing: "粘着でも弧はリズムで。",
    },
    serveInvertedExtra:
      "粘着裏のサーブは軌道とボールへの圧が変わると回転表現が大きく変わります。巻き込み・しゃがみフォームでも『最後の一瞬の加速』が散らばらないよう、Spinsight でブレ幅を見てください。",
  },
  tensor_euro: {
    label: "裏／テンション系（ヨーロッパ系）",
    short: "裏・テンション",
    global: [
      "テンション系は弾みと出球スピードを活かしやすいです。回転だけでなく『速度とのバランス』を Spinsight で見ると伸びます。",
    ],
    byIssue: {
      forehand_drive: "引きつけはゆっくり、最後だけしっかり加速。弾みに任せて振り幅だけ大きくするとコントロールが落ちます。",
      backhand_drive: "バックは替えと同時に前傾を作ると、テンションの弾みで球が伸びやすい。打点はやや手前気味に取りすぎない。",
      topspin_rally: "ラリーでは『入射角』と『加速タイミング』が数値に出やすい。同じ振りでも打点で回転が変わるので記録を。",
      underspin_receive: "下回転では面を立てすぎると弾みで浮く。ラバーの張りに合わせて面を少し閉じるイメージも試す。",
      flick_short: "短い球はテンションの反発を活かし、振りはコンパクトに。大きく振るとオーバーしやすい。",
      cut_defense: "テンションで削る場合は、刃より球の下降タイミング。回転の質は打点の低さとセット。",
      serve: "サーブは振りの終わりの加速でスピードを出しやすい。回転差は軌道の差で作る練習を。",
      block_game: "ブロックは面を動かしすぎず、弾みで返す。速い球は少し奥で待つ。",
      counter_attack: "弾みつきと相性が良い。短いスイングで芯を捉える練習を優先。",
      spin_reading: "テンションは球の伸びが出やすく、回転の体感が変わることがあります。アプリの数値で補正イメージを。",
      third_ball: "第三球は加速のタイミングがズレるとスピードだけ出て回転が落ちる。両方ログ化。",
      pace_adapt: "速い球では弾みが助長されすぎるので、面と打点のセットで抑える練習を。",
      footwork: "足が遅いとテンションほど打点がズレてスピード優先の球になりがち。",
      mental: "数値が良い日ほど振り幅に頼りすぎていないか確認。",
    },
    drillNote: {
      forehand_drive: "引きは遅く、最後に加速。弾み任せにしない。",
      backhand_drive: "前傾と替えをセット。打点は潰さない。",
      topspin_rally: "加速タイミングを一定に。",
      underspin_receive: "立てすぎ注意。閉じ気味も試す。",
      counter_attack: "短く芯。振り幅よりタイミング。",
      block_game: "面はシンプルに、奥で待つ。",
      serve: "引きは遅く、出すは短く加速。弾み任せにしない。",
      smash: "短く芯。打点優先。",
      push_attack: "立てすぎ注意。閉じ気味も試す。",
      lobbing: "弾みで弧が伸びやすい。高さ管理。",
    },
    serveInvertedExtra:
      "テンション裏のサーブは加速タイミングがズレると『速いが回らない』球になりやすいです。回転と球速を毎セットログし、フォームよりタイミングの修正から入ると改善が早いです。",
  },
  short_pips: {
    label: "表／ショートピップス（表ソフト）",
    short: "表・ショート",
    global: [
      "表（ショート）では回転のかかり方が裏ソフトと異なります。Spinsight の数値は『自分のラバーでの基準』を自分用に作るのがおすすめです。",
    ],
    byIssue: {
      forehand_drive: "表（ショート）では回転より速度・角度の要素が出やすい。スイングはコンパクトに、芯を捉える練習を増やす。",
      backhand_drive: "バック面が表（ショート）の場合は弾み・変化の出方が独特。打点を一定にし、振りのブレを減らす。",
      topspin_rally: "長いラリーより、中台〜前の攻防と相性が良い場合があります。無理に回転勝負しない設計を。",
      underspin_receive: "表（ショート）では面の倒し方で浮きが変わる。戻しの長さより、面の向きの再現性を優先。",
      flick_short: "表のフリックは裏ソフトより角度勝負になりやすい。振りよりタイミングと面。",
      cut_defense: "表（ショート）のカットは回転の質が独特。相手の上回転に対する刃角の再現性を数値ログとセットで。",
      serve: "表でのサーブは変化の出方が異なる。回転差は軌道とボールの当て方のセットで練習。",
      block_game: "表はブロックと相性が良いことが多い。面を固定し、相手の回転を活かす返しを意識。",
      counter_attack: "表のカウンターはスピードが出やすい。打点が遅れるとコントロールが落ちるので足を優先。",
      spin_reading: "表（ショート）は回転の読みが難しい相手にも有効。読みと面のセットを言語化する。",
      third_ball: "第三球は表の得意距離に戦術を寄せる。無理なループ連打を避ける。",
      pace_adapt: "速い球では表の弾みが効く。遅い球では薄く当てすぎない。",
      footwork: "表は打点ミスが数値に出やすい。替えのステップを短く正確に。",
      mental: "数値の解釈は『表（ショート）基準』で統一。他人の裏ソフト数値と直接比較しすぎない。",
    },
    drillNote: {
      forehand_drive: "コンパクトに芯。回転一辺倒にしない。",
      underspin_receive: "倒し方の再現性。戻しは短く試す。",
      block_game: "面固定。相手の回転を利用。",
      counter_attack: "打点優先。遅れると飛ぶ。",
      serve: "振りは大きくしない。リリース点と面で軌道を作る。",
      smash: "短く芯。打点で押し切る。",
      push_attack: "面の倒し方を毎球そろえる。",
      lobbing: "弧の高さより深さと左右のばらつきを先に潰す。",
    },
    serveTableExtra:
      "表（ショート）でのサーブは裏ほど強い回転を掛けにくい反面、出だしの角度・球速・第二跳の伸びで揺さぶれます。Spinsight では回転の絶対値だけでなく球速と『同じ振りでのブレ』を週次比較し、振り過ぎによるミスを減らしてください。バック表サーブでは粒の向きとリリースの再現性が特に効きます。",
  },
  medium_pips: {
    label: "粒高／ミディアムピップス",
    short: "粒高・ミディアム",
    global: [
      "粒高（ミディアム）は変化と安定の中間域です。自分のラバーでの『回転と速度の典型値』をメモしておくと練習設計が楽です。",
    ],
    byIssue: {
      forehand_drive: "振りは大きくしすぎず、芯とタイミング。回転とスピードのバランスを数値で把握。",
      backhand_drive: "バック面が粒高の場合、打点の前後で球質が変わりやすい。同じドリル条件で測る。",
      topspin_rally: "長いループ戦より、台上〜中台の攻防設計が現実的なことが多い。",
      underspin_receive: "下回転処理は面と打点のセット。粒高の倒し方のレパートリーを絞る。",
      flick_short: "短い球は角度とタイミング。振り幅を増やす前に足を入れる。",
      cut_defense: "削りはリズムと刃角の再現性。回転の質は打点の低さと相関しやすい。",
      serve: "変化の出方を数値ログ。同じ振りの見せかけで差を作る練習。",
      block_game: "ブロックは面の微調整より打点。速い球は奥で。",
      counter_attack: "カウンターは打点が合えばスピードが出やすい。替えを短く。",
      spin_reading: "粒高特有の手応えを言語化し、読みとセットで固定。",
      third_ball: "得意距離に戦術を寄せる。",
      pace_adapt: "速度帯ごとに面のイメージを分ける。",
      footwork: "替えの正確さが数値に直結しやすい。",
      mental: "粒高ラバーは数値の基準を自分用に持つ。",
    },
    drillNote: {
      forehand_drive: "芯とタイミング。振り過ぎない。",
      underspin_receive: "倒し方を絞って反復。",
      block_game: "打点で長さを合わせる。",
      serve: "振りの見せかけと第二跳。回転より着台管理。",
      smash: "短く。打点と角度。",
      push_attack: "粒の食い方を一定に。",
      lobbing: "高さより深さと左右。",
    },
    servePipsExtra:
      "粒高（ミディアム）でのサーブは、裏ほど回転の絶対値だけで押し切りにくいことが多いです。第二跳・弧・着台の手前での減速をセットで揃え、Spinsight では球速と回転の組・同じ振りでの着台位置のブレを週次比較してください。大会・カテゴリによって粒高サーブの扱いが異なる場合があるため、公式戦前は要確認です。",
  },
  long_pips: {
    label: "粒高／ロングピップス／一枚ラバー",
    short: "粒高・ロング",
    global: [
      "粒高（ロング／一枚）は相手の回転を利用する要素が強いです。Spinsight は『自分の振り』だけでなく相手球条件のメモとセットが重要です。",
    ],
    byIssue: {
      forehand_drive: "フォアが粒高でない構成が多いので、フォア課題とは別にバック面の役割をはっきりさせる。",
      backhand_drive: "バック面が粒高で攻める場合は距離感と打点が命。無理な威力追求より精度。",
      topspin_rally: "長い上回転ラリー主戦ではなく、戦術プランを変える練習も検討。",
      underspin_receive: "下回転では粒高の倒し方とソフトさのコントロール。戻しの回転理解を深める。",
      flick_short: "粒高面でフリック主戦にしない場合も。戦術に合わせて練習メニューを分ける。",
      cut_defense: "粒高でのカットは相手の上回転を活かす。刃角よりタイミングとリズム。",
      serve: "粒高面でサーブしない構成なら、サーブ課題は別面基準で設計。",
      block_game: "粒高ブロックは回転の逆利用が鍵。面を動かしすぎない日と調整日を分ける。",
      counter_attack: "粒高カウンターは難易度が高い。まずは台上〜短い球の処理精度から。",
      spin_reading: "粒高は読みの訓練とセット。相手の回転と自分の返しの因果をメモ。",
      third_ball: "粒高は第三球の選択肢を限定しやすい。得意パターンを数値で検証。",
      pace_adapt: "速い球の粒高での処理は打点が命。遅い球は変化の読み。",
      footwork: "粒高は小さな足のズレがミスに直結。替えを最小に。",
      mental: "粒高は失点パターンが偏りやすい。メンタル面ではルーティンを短く。",
    },
    drillNote: {
      underspin_receive: "倒し方とソフトさ。戻しのイメージを言語化。",
      block_game: "面を動かしすぎない。逆回転利用。",
      cut_defense: "リズム優先。相手の回転を活かす。",
      spin_reading: "相手回転メモとセットで練習。",
      serve: "軌道とソフトさ。振り過ぎない。",
      smash: "打点とタイミング。無理な威力より精度。",
      push_attack: "粒のコントロール優先。",
      lobbing: "相手の位置と弧。無理に端を狙わない。",
    },
    servePipsExtra:
      "粒高（ロング／一枚）でのサーブは、回転そのものより『出た後の挙動』で相手を誘う練習が現実的です。Spinsight では数値の絶対値比較より、同じ条件での分布とレシーバーのミスパターンをセットで記録してください。短い球のネット距離・二跳目の伸びの再現性を優先。大会・ルールによりサーブ使用可否が異なる場合があります。",
  },
  anti: {
    label: "裏／アンチ・ソフトバンなど（ほぼ無摩擦）",
    short: "裏・アンチ",
    global: [
      "アンチ系は回転のかかり方が特殊です。数値の解釈は『このラバーでの基準』を必ず自分用に持ってください。",
    ],
    byIssue: {
      forehand_drive: "フォアがアンチでないことが多い。課題はバック面の役割とセットで整理。",
      backhand_drive: "アンチで攻めるなら打点と面の極めて細かい調整。多球で反復。",
      topspin_rally: "長い上回転ラリー主戦は難易度が高い。戦術プランの見直しとセット。",
      underspin_receive: "下回転では回転が殺しやすい反面、飛び出しやすい。面とソフトさの練習を優先。",
      flick_short: "アンチでの短い球処理は独特。振りよりタイミングと薄さ。",
      cut_defense: "変化のコントロールが鍵。相手の回転を読む練習とセット。",
      serve: "アンチ面でサーブしない場合は別面基準で。",
      block_game: "ブロックは面とタイミング。回転が乗りにくい分、角度ミスが出やすい。",
      counter_attack: "アンチカウンターは難易度大。まずは安定して台に返すことを優先。",
      spin_reading: "読みがより重要。相手の回転と自分の返しの因果を毎回メモ。",
      third_ball: "選択肢を絞り、得意パターンを反復。",
      pace_adapt: "速い球の処理は打点固定。遅い球は薄さ注意。",
      footwork: "小さなズレがミスに直結。替え最小。",
      mental: "数値より入率とミスパターンの記録を優先しても良いです。",
    },
    drillNote: {
      underspin_receive: "薄さとタイミング。飛び出しに注意。",
      block_game: "角度ミスに注意。面はシンプルに。",
      spin_reading: "相手回転のメモ必須。",
      serve: "薄さとタイミング。振り幅よりリリース固定。",
      smash: "コンパクトに芯。角度意識。",
      push_attack: "倒し方の再現性。",
      lobbing: "弧はタイミングと面。相手位置を見て深さ調整。",
    },
    serveInvertedExtra:
      "アンチ裏のサーブは回転差より軌道・速度・着台で揺さぶる練習が現実的です。数値は『このラバーでの基準』として自分用に残してください。",
  },
};

const STROKE_LABELS = {
  unknown: "指定なし",
  serve: "サーブ",
  fh_topspin: "フォア・上回転（ループ等）",
  bh_topspin: "バック・上回転",
  fh_drive: "フォアドライブ",
  bh_drive: "バックドライブ",
  flick: "フリック・チキータ",
  block: "ブロック",
  cut: "カット",
  receive: "レシーブ全般",
  other: "その他",
};

const KEYWORD_MAP = [
  [/スマッシュ/, "smash"],
  [/ロビ(ング)?|高球.*守備|浮き球/, "lobbing"],
  [/攻めプッシュ/, "push_attack"],
  [/フォアサーブ|ＦＨサーブ|fh.*serve/i, "serve_forehand"],
  [/バックサーブ|ＢＨサーブ|bh.*serve/i, "serve_backhand"],
  [/しゃがみ|しゃがみ込み|低重心.*サーブ/, "serve_squat"],
  [/巻き込み/, "serve_makikomi"],
  [/\byg\b|ＹＧ/i, "serve_yg"],
  [/横回転.*下|横下|サイドアンダ/i, "serve_side_under"],
  [/横回転.*上|横上|サイドトップ/i, "serve_side_top"],
  [/下回転.*サーブ|下回転系.*サーブ|バックスピン.*サーブ/i, "serve_under"],
  [/上回転.*サーブ|上回転系.*サーブ|トップサーブ/i, "serve_top"],
  [/プッシュ/, "push_attack"],
  [/カット|チョップ|削り/, "cut_defense"],
  [/バックハンド.*ドライブ|バック.*ドライブ|ＢＨ.*ドライブ|bh.*drive/i, "backhand_drive"],
  [/フォア.*ドライブ|ＦＨ.*ドライブ|fh.*drive/i, "forehand_drive"],
  [/ドライブ/, "forehand_drive"],
  [/カウンター|弾み|速攻/, "counter_attack"],
  [/ブロック/, "block_game"],
  [/チキータ|フリック/, "flick_short"],
  [/下回転|ツッツキ|ストップ/, "underspin_receive"],
  [/上回転ラリー|連続ラリー|ラリー/, "topspin_rally"],
  [/ループ/, "topspin_rally"],
  [/回転|読み|ミート|見極め/, "spin_reading"],
  [/サーブ|サービス/, "serve"],
  [/第3|三球|三拍子/, "third_ball"],
  [/フット|足|ステップ|還元/, "footwork"],
  [/速い|遅い|タメ|球速/, "pace_adapt"],
  [/メンタル|試合|緊張|マインド/, "mental"],
];

function inferIssuesFromText(text) {
  const ids = [];
  const t = text.trim();
  if (!t) return ids;
  for (const [re, id] of KEYWORD_MAP) {
    if (re.test(t)) ids.push(id);
  }
  return ids;
}

function parseOptionalNumber(elId) {
  const el = document.getElementById(elId);
  if (!el) return null;
  const v = parseFloat(String(el.value).replace(",", "."), 10);
  if (Number.isFinite(v) && v > 0) return v;
  return null;
}

function spinsightNumericLines(spinRps, ballSpeed, strokeType) {
  const lines = [];
  if (spinRps != null) {
    let band =
      spinRps < 55
        ? "今回の回転は控えめの読み取りです。打点・面・引きのどれが主因かを1つに絞って次回同条件で測りましょう。"
        : spinRps < 95
          ? "実戦で使える中域の回転に見えます。同じ数値を『打点がズレた打球』でも再現できるかを次の課題に。"
          : "回転の絶対値は高めに見えます。Spinsight では球速とのバランスと、同じスイングでのブレ幅（標準偏差）も意識すると伸びます。";
    lines.push(`入力された回転の数値: ${spinRps}（アプリ表示に合わせた単位想定）。${band}`);
  }
  if (ballSpeed != null) {
    lines.push(
      `入力された球速の数値: ${ballSpeed}（単位はアプリ表示に合わせてください）。回転とセットでログし、「速くて回る」「遅くて回る」の分布を週次で比較すると戦術が立てやすいです。`
    );
  }
  if (strokeType && strokeType !== "unknown") {
    const label = STROKE_LABELS[strokeType] || strokeType;
    lines.push(
      `今回の数値は主に「${label}」として記録されています。同じショット分類で毎週測ると、感覚と数値のズレが減ります。`
    );
  }
  return lines;
}

function spinsightContextNotes({ rpsRange, stability, freeform, spinRps, ballSpeed, strokeType }) {
  const lines = [];
  lines.push(...spinsightNumericLines(spinRps, ballSpeed, strokeType));

  if (rpsRange && rpsRange !== "unknown") {
    const map = {
      low: "体感では回転が低めの日です。打点・面のミスが数値に出やすいので、フォームの再現性を優先しましょう。",
      mid: "体感では中程度の回転域です。球質の差は摩擦の質やスイング軌道で作れます。数値のブレ幅を週で比較してください。",
      high: "体感では高回転域に近い日です。打点の安定と球速のバランス（スピン効率）を Spinsight で追う段階です。",
    };
    lines.push(map[rpsRange] || "");
  }
  if (stability && stability !== "unknown") {
    const map = {
      shaky: "再現性がまだ揺らぐ段階です。同じドリル条件で測定回数を増やし、中央値ではなく『ばらつき』を見てください。",
      ok: "そこそこ安定しています。次は一つ上の難易度（球速・回転）へ条件を変えて再測定しましょう。",
      solid: "安定しているので、試合モードでの分布を見て弱点コースを特定するのがおすすめです。",
    };
    lines.push(map[stability] || "");
  }
  if (freeform.trim()) {
    lines.push(`あなたの Spinsight メモ: 「${freeform.trim()}」— 週次で同じ条件を再測定し、差分だけを見ると改善点が明確になります。`);
  }

  const nonEmpty = lines.filter(Boolean);
  if (nonEmpty.length === 0) {
    nonEmpty.push(
      "Spinsight のダッシュボードで、同じメニュー（例: ストローク練）を週1回同条件で測ると、感覚と数値のズレが減ります。"
    );
  }
  return nonEmpty;
}

function uniqueByKey(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const k = keyFn(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function resolveRubberByIssue(R, issueId) {
  if (!R?.byIssue || !issueId) return null;
  if (issueId.startsWith("serve_")) {
    return R.byIssue[issueId] || R.byIssue.serve || null;
  }
  return R.byIssue[issueId] || null;
}

function collectRubberAdvice(fh, bh, issueIds) {
  const blocks = [];
  const seenText = new Set();

  const addBlock = (sideLabel, rubberId) => {
    if (!rubberId) return;
    const R = RUBBER_TYPES[rubberId];
    if (!R) return;
    const title = `${sideLabel}（${R.label}）`;
    const bullets = [];
    for (const line of R.global || []) {
      if (!seenText.has(line)) {
        seenText.add(line);
        bullets.push(line);
      }
    }
    for (const issueId of issueIds) {
      const t = resolveRubberByIssue(R, issueId);
      if (t && !seenText.has(t)) {
        seenText.add(t);
        bullets.push(t);
      }
    }
    if (bullets.length) blocks.push({ title, bullets });
  };

  addBlock("フォア面", fh);
  addBlock("バック面", bh);
  return blocks;
}

/** サーブ課題選択時：裏／表／粒高それぞれのサーブ専用アドバイス */
function collectServeRubberExtras(fh, bh) {
  const inverted = new Set(["high_friction", "tacky_chinese", "tensor_euro", "anti"]);
  const lines = [];
  for (const [side, rid] of [
    ["フォア面", fh],
    ["バック面", bh],
  ]) {
    if (!rid) continue;
    const R = RUBBER_TYPES[rid];
    if (!R) continue;
    if (inverted.has(rid) && R.serveInvertedExtra) {
      lines.push(`${side}（裏・サーブ）: ${R.serveInvertedExtra}`);
    }
    if (rid === "short_pips" && R.serveTableExtra) {
      lines.push(`${side}（表・サーブ）: ${R.serveTableExtra}`);
    }
    if ((rid === "medium_pips" || rid === "long_pips") && R.servePipsExtra) {
      lines.push(`${side}（粒高・サーブ）: ${R.servePipsExtra}`);
    }
  }
  return lines;
}

function rubberDrillSuffix(issueId, fh, bh) {
  const drillKey = issueId.startsWith("serve_") ? "serve" : issueId;
  const parts = [];
  for (const [side, rid] of [
    ["フォア", fh],
    ["バック", bh],
  ]) {
    if (!rid) continue;
    const R = RUBBER_TYPES[rid];
    const note = R?.drillNote?.[issueId] || R?.drillNote?.[drillKey];
    if (note) parts.push(`${side}・${R.short}: ${note}`);
  }
  if (parts.length === 0) return "";
  return ` — ${parts.join(" / ")}`;
}

function buildWeeklyPlan(issueIds) {
  const days = [
    { day: "月", focus: "基礎リズム", extra: "ウォームアップ多め、フォーム確認" },
    { day: "火", focus: "弱点ドリルA", extra: "計測セット ×2（前後半で同条件）" },
    { day: "水", focus: "休息 or 軽い素振り", extra: "肩・手首のケア、動画レビュー" },
    { day: "木", focus: "弱点ドリルB", extra: "ゲーム形式でプレッシャーを付与" },
    { day: "金", focus: "実戦近似", extra: "OpenPlay／試合モードでログ比較" },
    { day: "土", focus: "メンテナンス", extra: "得意技の再現性チェックのみ短時間" },
    { day: "日", focus: "振り返り", extra: "メモを1行だけ残し、来週の一項目を決める" },
  ];

  const primary = issueIds[0] ? ISSUE_CATALOG[issueIds[0]] : null;
  const secondary = issueIds[1] ? ISSUE_CATALOG[issueIds[1]] : null;

  if (primary) {
    days[1].focus = `${primary.label}（定点）`;
    days[1].extra = primary.drills[0] ? `${primary.drills[0].name} を中心に` : days[1].extra;
  }
  if (secondary) {
    days[3].focus = `${secondary.label}（応用）`;
    days[3].extra = secondary.drills[0] ? `${secondary.drills[0].name} をゲーム化` : days[3].extra;
  }

  return days;
}

function generatePlan(formData) {
  const selected = [...formData.issues];
  const inferred = inferIssuesFromText(`${formData.goals} ${formData.freeform}`);
  const issueIds = uniqueByKey([...selected, ...inferred], (id) => id);

  if (issueIds.length === 0) {
    return {
      ok: false,
      message: "課題を1つ以上選ぶか、「やりたいこと」にキーワード（例: カット、ドライブ）を書いてください。",
    };
  }

  const improvements = [];
  const drills = [];
  const spinsightHints = [];

  for (const id of issueIds) {
    const cat = ISSUE_CATALOG[id];
    if (!cat) continue;
    improvements.push(...cat.improvements.map((t) => ({ id, text: t })));
    for (const d of cat.drills) {
      const suffix = rubberDrillSuffix(id, formData.rubberFh, formData.rubberBh);
      drills.push({ ...d, issueId: id, detail: d.detail + suffix });
    }
    spinsightHints.push(cat.spinsight);
  }

  const rubberAdvice = collectRubberAdvice(formData.rubberFh, formData.rubberBh, issueIds);
  const hasServeIssue = issueIds.some((id) => id.startsWith("serve_") || id === "serve");
  const serveRubberExtras = hasServeIssue ? collectServeRubberExtras(formData.rubberFh, formData.rubberBh) : [];

  const topImprovements = uniqueByKey(improvements, (x) => x.text).slice(0, 12);
  const topDrills = uniqueByKey(drills, (d) => `${d.name}-${d.detail}`).slice(0, 12);
  const topHints = [...new Set(spinsightHints)].slice(0, 7);
  const spinsightExtra = spinsightContextNotes(formData);

  const summaryParts = issueIds.map((id) => ISSUE_CATALOG[id]?.label).filter(Boolean);
  const rubberSummary =
    [formData.rubberFh, formData.rubberBh].filter(Boolean).length === 0
      ? ""
      : ` ラバー設定を踏まえ、フォア／バックの特性に合わせてメニューを調整しています。`;

  const summary = `今回の入力から、特に強化すると効果が出やすいのは「${summaryParts.join("」「")}」です。${rubberSummary}下記は優先度の高い順の改善ポイントと、週次の進め方です。`;

  return {
    ok: true,
    summary,
    rubberAdvice,
    serveRubberExtras,
    improvements: topImprovements,
    drills: topDrills,
    spinsightHints: topHints,
    spinsightExtra,
    week: buildWeeklyPlan(issueIds),
    issueLabels: summaryParts,
  };
}

function renderPlan(plan, container) {
  container.innerHTML = "";
  container.hidden = false;

  const intro = document.createElement("p");
  intro.className = "plan-summary";
  intro.textContent = plan.summary;
  container.appendChild(intro);

  if (plan.rubberAdvice?.length) {
    const rh = document.createElement("h2");
    rh.textContent = "ラバー特性を踏まえたアドバイス";
    container.appendChild(rh);
    const ul = document.createElement("ul");
    ul.className = "rubber-list";
    for (const block of plan.rubberAdvice) {
      const li = document.createElement("li");
      const strong = document.createElement("strong");
      strong.textContent = block.title;
      li.appendChild(strong);
      const sub = document.createElement("ul");
      sub.className = "plan-list";
      for (const b of block.bullets) {
        const sli = document.createElement("li");
        sli.textContent = b;
        sub.appendChild(sli);
      }
      li.appendChild(sub);
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }

  if (plan.serveRubberExtras?.length) {
    const sh = document.createElement("h2");
    sh.textContent = "サーブ×ラバー（裏・表・粒高）";
    container.appendChild(sh);
    const sul = document.createElement("ul");
    sul.className = "plan-list muted";
    for (const line of plan.serveRubberExtras) {
      const sli = document.createElement("li");
      sli.textContent = line;
      sul.appendChild(sli);
    }
    container.appendChild(sul);
  }

  const impH = document.createElement("h2");
  impH.textContent = "改善のポイント";
  container.appendChild(impH);

  const impOl = document.createElement("ol");
  impOl.className = "plan-list";
  for (const item of plan.improvements) {
    const li = document.createElement("li");
    li.textContent = item.text;
    impOl.appendChild(li);
  }
  container.appendChild(impOl);

  const drillH = document.createElement("h2");
  drillH.textContent = "練習メニュー（今日〜今週）";
  container.appendChild(drillH);

  const drillUl = document.createElement("ul");
  drillUl.className = "drill-cards";
  for (const d of plan.drills) {
    const li = document.createElement("li");
    li.className = "drill-card";
    const title = document.createElement("h3");
    title.textContent = d.name;
    const meta = document.createElement("p");
    meta.className = "drill-meta";
    meta.textContent = `目安時間: ${d.time}`;
    const body = document.createElement("p");
    body.textContent = d.detail;
    li.append(title, meta, body);
    drillUl.appendChild(li);
  }
  container.appendChild(drillUl);

  const weekH = document.createElement("h2");
  weekH.textContent = "1週間の進め方（目安）";
  container.appendChild(weekH);

  const weekTable = document.createElement("div");
  weekTable.className = "week-grid";
  for (const row of plan.week) {
    const cell = document.createElement("div");
    cell.className = "week-cell";
    const d = document.createElement("strong");
    d.textContent = `${row.day}曜`;
    const f = document.createElement("p");
    f.className = "week-focus";
    f.textContent = row.focus;
    const e = document.createElement("p");
    e.className = "week-extra muted";
    e.textContent = row.extra;
    cell.append(d, f, e);
    weekTable.appendChild(cell);
  }
  container.appendChild(weekTable);

  const sh = document.createElement("h2");
  sh.textContent = "Spinsight 活用のヒント";
  container.appendChild(sh);

  const hintP = document.createElement("ul");
  hintP.className = "plan-list";
  for (const h of plan.spinsightHints) {
    const li = document.createElement("li");
    li.textContent = h;
    hintP.appendChild(li);
  }
  container.appendChild(hintP);

  if (plan.spinsightExtra.length) {
    const extraH = document.createElement("h3");
    extraH.textContent = "あなたの入力に基づく計測メモ";
    container.appendChild(extraH);
    const extraUl = document.createElement("ul");
    extraUl.className = "plan-list muted";
    for (const line of plan.spinsightExtra) {
      const li = document.createElement("li");
      li.textContent = line;
      extraUl.appendChild(li);
    }
    container.appendChild(extraUl);
  }

  const disclaimer = document.createElement("p");
  disclaimer.className = "disclaimer muted";
  disclaimer.textContent =
    "本サイトは Spinsight 非公式の補助ツールです。数値の単位はアプリ表示に合わせて解釈してください。怪我のリスクがあるドリルは無理せず、コーチやパートナーと相談してください。";
  container.appendChild(disclaimer);
}

function collectForm() {
  const issues = [...document.querySelectorAll('input[name="issue"]:checked')].map((el) => el.value);
  const goals = document.getElementById("goals").value;
  const rpsRange = document.getElementById("rpsRange").value;
  const stability = document.getElementById("stability").value;
  const freeform = document.getElementById("spinsightNotes").value;
  const rubberFh = document.getElementById("rubberFh").value;
  const rubberBh = document.getElementById("rubberBh").value;
  const strokeType = document.getElementById("strokeType").value;
  const spinRps = parseOptionalNumber("spinRps");
  const ballSpeed = parseOptionalNumber("ballSpeed");
  return {
    issues,
    goals,
    rpsRange,
    stability,
    freeform,
    rubberFh,
    rubberBh,
    strokeType,
    spinRps,
    ballSpeed,
  };
}

function init() {
  const form = document.getElementById("coach-form");
  const out = document.getElementById("plan-output");
  const err = document.getElementById("plan-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    err.textContent = "";
    err.hidden = true;
    const data = collectForm();
    const plan = generatePlan(data);
    if (!plan.ok) {
      err.textContent = plan.message;
      err.hidden = false;
      out.hidden = true;
      out.innerHTML = "";
      return;
    }
    renderPlan(plan, out);
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

document.addEventListener("DOMContentLoaded", init);
