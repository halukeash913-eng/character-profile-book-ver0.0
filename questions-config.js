// =============================================
// 質問・マップの設定（ここを編集して増やしてください）
// =============================================
//
// hearts  : ♡ 5段階（A/Bそれぞれ）
// yesNo   : YES / NO（A/Bそれぞれ + コメント）
// ab      : A か B を選ぶ（+ コメント）
// maps    : ポジショニングマップ（2軸）
// deepDive: 自由記述の深掘り質問
// worldlines: こんな世界なら？（placeholderA / placeholderB で属性の例を世界ごとに指定）
// basicData : キャラ基本データ（A/B共通）
// relationship: 二人の関係性
// work         : 作品紹介
//
// id は保存キーになるので、一度使った id は変えないでください
// （変えると過去データと紐づかなくなります）

window.QUESTIONS_CONFIG = {
  hearts: [
    { id: 'sociality',  label: '社交性' }, 
    { id: 'selfEsteem',  label: '自己肯定感' },
    { id: 'anxiety', label: '警戒心' },  
    { id: 'love',  label: '愛の重さ' },
    { id: 'trust', label: '信頼度' },
    { id: 'dependence', label: '依存度' },  
    { id: 'protect', label: '保護欲' },    
    { id: 'jealousy', label: '独占欲' },
    { id: 'sexuality', label: '性欲' },
  ],

  yesNo: [
    { id: 'dating', label: '正式に付き合ってる？' },
    { id: 'shoulder', label: '相手と肩を組める？' },
    { id: 'sleepTogether',label: '同じベッドで眠れる？' },
    { id: 'flirt', label: '恋人のフリできる？' },
    { id: 'influence',label: '相手の影響を受けてる？' },
    { id: 'lie',      label: '相手に嘘つける？' },
    { id: 'lieCatch',label: '相手の嘘がわかる？' },
    { id: 'secret',   label: '相手に秘密を打ち明けられる？' },
    { id: 'rely',     label: '困った時に相手を頼れる？' },
    { id: 'repay',   label: '相手を傷つけられたら報復する？' },
    { id: 'flee',label: '何もかも捨てて相手と逃げれる？' },
    { id: 'sacrifice', label: '相手のために死ねる？' },
    { id: 'afterlife', label: '来世も出会う？' },

  ],

  ab: [
    { id: 'confess', label: '告白/プロポーズをしたのは？' },
    { id: 'earlyRiser', label: '起きるのが早いのは？' },
    { id: 'apologize', label: '喧嘩したらどっちが謝る？' },
    { id: 'firstLove', label: '先に好きになったのは？' },
    { id: 'firstKiss', label: 'ファーストキスはどっちから？' },
    { id: 'drink', label: '酒に強いのは？' },
    { id: 'contactFrequency', label: '連絡頻度が高いのは？' },
    { id: 'amae', label: '甘え上手なのは？' },
    { id: 'attractive', label: 'モテるのはどっち？' },
    { id: 'firstMove', label: '行為に誘うのはどっち？' },
  ],

  maps: [
    {
      id: 'expression',
      label: '愛情表現は',
      left: '言葉にする',
      right: '行動にする',
      top: '自分からする',
      bottom: '相手のを待つ',
    },
    {
      id: 'anniversary',
      label: '記念日を',
      left: '覚えてる',
      right: '覚えてない',
      top: '祝う',
      bottom: '祝わない',
    },
        {
      id: 'jealousy',
      label: 'ヤキモチは',
      left: '焼く',
      right: '焼かない',
      top: '許す',
      bottom: '許さない',
    },
    {
      id: 'skinship',
      label: 'スキンシップは',
      left: '人前でも',
      right: '二人きりで',
      top: '軽くする',
      bottom: '密着',
    },
    {
      id: 'protect',
      label: '相手を庇う時は',
      left: '無言で',
      right: '呼びかけて',
      top: '突き飛ばす',
      bottom: '引き寄せる',
    },
    {
      id: 'kill',
      label: '相手を殺さなといけない時に',
      left: '殺せる',
      right: '殺せない',
      top: '躊躇する',
      bottom: '躊躇しない',
    },
    {
      id: 'mermaidMeat',
      label: '人魚の肉を',
      left: '食べさせる',
      right: '食べさせない',
      top: '相手にも食べさせる',
      bottom: '食べるのは自分だけ',
      note: '※瀕死の相手に永遠の命を与えるものについて。縦軸は食べさせる時、横軸は食べさせられた時にどうするかを表します。',
    },
    {
      id: 'loveConnection',
      label: '愛情の繋がりは',
      left: '与えられたい',
      right: '与えたい',
      top: '精神的繋がり',
      bottom: '身体的繋がり',
    },
    {
      id: 'moan',
      label: '行為時に',
      left: '喘ぐ',
      right: '喘がない',
      top: '聞かれてもいい',
      bottom: '聞かれたくない',
    },
  ],

    // こんな世界なら？
  worldlines: [
    { id: 'omegaBirth', label: 'オメガバース', placeholderA: '例：Alpha', placeholderB: '例：Omega' },
    { id: 'domsubBirth', label: 'Dom/Subバース', placeholderA: '例：Dom', placeholderB: '例：Sub' },
    { id: 'modern', label: '現代', placeholderA: '例：会社員', placeholderB: '例：大学生' },
    { id: 'school', label: '学生', placeholderA: '例：生徒会長', placeholderB: '例：不良' },
    { id: 'fantasy', label: 'ファンタジー', placeholderA: '例：王子', placeholderB: '例：魔法使い' },
    { id: 'idol', label: 'アイドル', placeholderA: '例：センター', placeholderB: '例：マネージャー' },
    { id: 'vampire', label: '吸血鬼', placeholderA: '例：吸血鬼', placeholderB: '例：人間' },
    { id: 'underworld', label: '裏社会', placeholderA: '例：組長', placeholderB: '例：組織の一員' },
    { id: 'harryPotter', label: 'ハリー・ポッターパロディ', placeholderA: '例：グリフィンドール', placeholderB: '例：スリザリン' },
    { id: 'fate', label: 'Fateパロディ', placeholderA: '例：マスター', placeholderB: '例：サーヴァント' },
    { id: 'landOfTheLustrous', label: '宝石の国パロディ', placeholderA: '例：宝石', placeholderB: '例：月人' },
    { id: 'ageManipulation', label: '年齢操作', placeholderA: '例：大人の姿', placeholderB: '例：子供の姿' },
    { id: 'differentTimeAxis', label: '異なる時間軸の二人', placeholderA: '例：過去の自分', placeholderB: '例：未来の自分' },
  ],

  deepDive: [
    { id: 'qAtmosphere', label: '二人でいる時の雰囲気' },
    { id: 'qFight',      label: '喧嘩した時は？' },
    { id: 'qAmae',       label: '甘える時は？' },
    { id: 'qProtect',    label: 'お互いを守る時は？' },
    { id: 'qAllDay',     label: '一日中二人でいられるなら？' },
    { id: 'qSecret',    label: '二人だけの秘密は？' },
    { id: 'qSupport',    label: '相手が悩んでいたらどうする？' },
    { id: 'qFirstNight', label: '初夜はどんな感じ？' },
    { id: 'qBehavior',   label: '行為の様子は？' },
    { id: 'qPrecious',   label: 'ここが尊いポイント' },
    { id: 'qFuture',     label: '将来どうなってほしい？' },
    { id: 'detail',      label: 'その他メモ' },
  ],


  // ===== キャラ基本データ（A/B共通） =====
  // 追加例: { id: 'favoriteFood', label: '好きな食べ物' },
  basicData: [
    { id: 'birthday',    label: '誕生日' },
    { id: 'bloodType',   label: '血液型' },
    { id: 'mbti',        label: 'MBTI' },
    { id: 'eyeColor',    label: '目の色' },
    { id: 'hairColor',   label: '髪の色' },
    { id: 'personality', label: '性格・特徴' },
    { id: 'likes',       label: '好きなもの' },
    { id: 'dislikes',    label: '嫌いなもの' },
    { id: 'hobbies',     label: '趣味' },
    { id: 'hometown',    label: '出身地' },
    { id: 'family',      label: '家族構成' },
    { id: 'occupation',  label: '職業' },
  ],

  // ===== 二人の関係性 =====
  // type: 'text' | 'textarea'（省略時 text）
  // full: true でプレビュー時に横一列
  // row: 同じ名前の項目は編集画面で横並び
  relationship: [
    { id: 'cpName',      label: 'CP名（任意）', type: 'text', placeholder: '例：AB / A + B' },
    { id: 'relTags',     label: '関係性', type: 'text', placeholder: '例：幼馴染, 両片想い' },
    { id: 'narestome',   label: '出会い', type: 'textarea', full: true, placeholder: '例：転校初日に席が隣だった…' },
    { id: 'distance',    label: '現在の距離感', type: 'text', placeholder: '例：両片想い / 恋人未満' },
    { id: 'cpKeywords', label: '二人のキーワード/キーフレーズは？', type: 'text', placeholder: '' },

    { id: 'turningPoints', label: '二人のターニングポイント', type: 'text' },
    { id: 'bestMemory', label: '二人の一番良い思い出', type: 'text', placeholder: '' },
    { id: 'worstMemory', label: '二人の悪い思い出', type: 'text', placeholder: '' },
    { id: 'anniversary', label: '二人の記念日', type: 'text', placeholder: '' },


    { id: 'FirstImpressionOfB', label: 'Aから見たBの第一印象', type: 'textarea', row: 'impression' },
    { id: 'FirstImpressionOfA', label: 'Bから見たAの第一印象', type: 'textarea', row: 'impression' },

    { id: 'likeAtoB', label: 'AがBの好きなところ', type: 'textarea', row: 'like' },
    { id: 'likeBtoA', label: 'BがAの好きなところ', type: 'textarea', row: 'like' },

    { id: 'dislikeAtoB', label: 'AがBに直して欲しいところ', type: 'textarea', row: 'dislike' },
    { id: 'dislikeBtoA', label: 'BがAに直して欲しいところ', type: 'textarea', row: 'dislike' },

    { id: 'RealizeLoveAtoB', label: 'AがBへの好意を自覚した瞬間', type: 'textarea', row: 'realize' },
    { id: 'RealizeLoveBtoA', label: 'BがAへの好意を自覚した瞬間', type: 'textarea', row: 'realize' },

    { id: 'breakUpB', label: 'Bに別れを告げられたら', type: 'textarea', row: 'breakUp' },
    { id: 'breakUpA', label: 'Aに別れを告げられたら', type: 'textarea', row: 'breakUp' },

    { id: 'someoneConfessionB', label: 'Bが告白されてるのを見てしまったら', type: 'textarea', row: 'someoneConfession' },
    { id: 'someoneConfessionA', label: 'Aが告白されてるのを見てしまったら', type: 'textarea', row: 'someoneConfession' },

    { id: 'criticalConditionB', label: 'Bが大きな怪我をしたら', type: 'textarea', row: 'criticalCondition' },
    { id: 'criticalConditionA', label: 'Aが大きな怪我をしたら', type: 'textarea', row: 'criticalCondition' },

    { id: 'BStepsOffPath', label: 'Bが道を踏み外したら', type: 'textarea', row: 'path' },
    { id: 'AStepsOffPath', label: 'Aが道を踏み外したら', type: 'textarea', row: 'path' },


      { id: 'dailyLife',   label: '二人の日常', type: 'textarea', full: true },    
      { id: 'situation',   label: '見たいシチュエーション', type: 'textarea', full: true },
  ],


  // ===== 作品紹介 =====
  // series はプレビューのタイトル横（年齢差・身長差の近く）にも出ます
  work: [
    { id: 'title',     label: '作品タイトル', type: 'text', placeholder: '例：〇〇の物語' },
    { id: 'series',    label: 'シリーズ', type: 'text', placeholder: '作品のシリーズ名' },
    { id: 'url', label: '配信・関連URL', type: 'url', placeholder: 'https://www.netflix.com/…' },
    { id: 'story',     label: 'ストーリー', type: 'textarea', full: true, placeholder: 'あらすじ・概要' },
    { id: 'roleA',     label: '作品におけるA', type: 'textarea', row: 'workRoles', placeholder: 'この作品でのAの立ち位置・役割' },
    { id: 'roleB',     label: '作品におけるB', type: 'textarea', row: 'workRoles', placeholder: 'この作品でのBの立ち位置・役割' },
    { id: 'roleCP',    label: '作品におけるAB（CP名）', type: 'text', placeholder: 'この作品でのAとBの関係性' },
    { id: 'relatedWorks', label: '関連作品', type: 'text', placeholder: 'この作品に関連する作品名' },
    { id: 'recommend', label: 'おすすめポイント', type: 'textarea', full: true },
    { id: 'memo',      label: 'メモ', type: 'textarea', full: true },
  ],

};
