// =============================================
// 質問・マップの設定（ここを編集して増やしてください）
// =============================================
//
// hearts  : ♡ 5段階（A/Bそれぞれ）
// yesNo   : YES / NO（A/Bそれぞれ + コメント）
// ab      : A か B を選ぶ（+ コメント）
// maps    : ポジショニングマップ（2軸）
// deepDive: 自由記述の深掘り質問
//
// id は保存キーになるので、一度使った id は変えないでください
// （変えると過去データと紐づかなくなります）

window.QUESTIONS_CONFIG = {
  hearts: [
    { id: 'selfEsteem',  label: '自己肯定感' },
    { id: 'love',  label: '愛の重さ' },
    { id: 'trust', label: '信頼度' },
    { id: 'dependence', label: '依存度' },  
    { id: 'jealousy', label: '独占欲' },
    { id: 'sexuality', label: '性欲' },
  ],

  yesNo: [
    { id: 'shoulder', label: '相手と肩を組める？' },
    { id: 'flirt', label: '恋人のフリできる？' },
    { id: 'lie',      label: '相手に嘘つける？' },
    { id: 'lieCatch',label: '相手の嘘がわかる？' },
    { id: 'secret',   label: '相手に秘密を打ち明けられる？' },
    { id: 'rely',     label: '困った時に相手を頼れる？' },

  ],

  ab: [
    { id: 'confess', label: '告白/プロポーズをしたのは？' },
    { id: 'apologize', label: '喧嘩したらどっちが謝る？' },
    { id: 'firstLove', label: '先に好きになったのは？' },
    { id: 'firstKiss', label: 'ファーストキスはどっちから？' },
    { id: 'attractive', label: 'モテるのはどっち？' },
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

  deepDive: [
    { id: 'qAtmosphere', label: '二人でいる時の雰囲気' },
    { id: 'qFight',      label: '喧嘩した時は？' },
    { id: 'qAmae',       label: '甘える時は？' },
    { id: 'qProtect',    label: 'お互いを守る時は？' },
    { id: 'qAllDay',     label: '一日中二人でいられるなら？' },
    { id: 'qPrecious',   label: 'ここが尊いポイント' },
    { id: 'qFuture',     label: '将来どうなってほしい？' },
    { id: 'detail',      label: 'その他メモ' },
  ],
};
