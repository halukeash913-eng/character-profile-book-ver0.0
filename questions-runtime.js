// questions-config.js を使って質問UI・保存・表示を扱う
(function () {
  function cfg() {
    return window.QUESTIONS_CONFIG || { hearts: [], yesNo: [], ab: [], maps: [], deepDive: [], worldlines: [], basicData: [], relationship: [], work: [] };
  }

  window.editHearts = {};
  window.editYesNo = {};
  window.editAb = {};
  window.editDeep = {};

  window.resetQuestionBuffers = function () {
    window.editHearts = {};
    window.editYesNo = {};
    window.editAb = {};
    window.editDeep = {};
    (cfg().hearts || []).forEach(q => { window.editHearts[q.id] = { A: 0, B: 0 }; });
    (cfg().yesNo || []).forEach(q => { window.editYesNo[q.id] = { A: '', B: '', commentA: '', commentB: '' }; });
    (cfg().ab || []).forEach(q => { window.editAb[q.id] = { value: '', comment: '' }; });
    (cfg().deepDive || []).forEach(q => { window.editDeep[q.id] = ''; });
    window.editWorldlines = {};
    (cfg().worldlines || []).forEach(q => {
      window.editWorldlines[q.id] = { attrA: '', attrB: '', commentA: '', commentB: '', detail: '' };
    });
  };

  window.migratePairQuestions = function (p) {
    if (!p) return p;
    p.hearts = p.hearts || {};
    p.yesNo = p.yesNo || {};
    p.ab = p.ab || {};
    p.deepDive = p.deepDive || {};
    p.worldlines = p.worldlines || {};
    if (p.loveA != null || p.loveB != null) {
      p.hearts.love = p.hearts.love || { A: p.loveA || 0, B: p.loveB || 0 };
    }
    if (p.trustA != null || p.trustB != null) {
      p.hearts.trust = p.hearts.trust || { A: p.trustA || 0, B: p.trustB || 0 };
    }
    if (p.lieA != null || p.lieB != null || p.lieCommentA || p.lieCommentB) {
      p.yesNo.lie = p.yesNo.lie || {
        A: p.lieA || '', B: p.lieB || '',
        commentA: p.lieCommentA || '', commentB: p.lieCommentB || ''
      };
    }
    if (p.shoulderA != null || p.shoulderB != null || p.shoulderCommentA || p.shoulderCommentB) {
      p.yesNo.shoulder = p.yesNo.shoulder || {
        A: p.shoulderA || '', B: p.shoulderB || '',
        commentA: p.shoulderCommentA || '', commentB: p.shoulderCommentB || ''
      };
    }
    if (p.apologize != null || p.apologizeComment) {
      p.ab.apologize = p.ab.apologize || { value: p.apologize || '', comment: p.apologizeComment || '' };
    }
    if (p.firstLove != null || p.firstLoveComment) {
      p.ab.firstLove = p.ab.firstLove || { value: p.firstLove || '', comment: p.firstLoveComment || '' };
    }
    (cfg().deepDive || []).forEach(q => {
      if (p.deepDive[q.id] == null && p[q.id] != null) p.deepDive[q.id] = p[q.id];
    });
    return p;
  };

  window.loadQuestionBuffersFromPair = function (p) {
    window.resetQuestionBuffers();
    window.migratePairQuestions(p);
    (cfg().hearts || []).forEach(q => {
      const v = (p.hearts && p.hearts[q.id]) || {};
      window.editHearts[q.id] = { A: v.A || 0, B: v.B || 0 };
    });
    (cfg().yesNo || []).forEach(q => {
      const v = (p.yesNo && p.yesNo[q.id]) || {};
      window.editYesNo[q.id] = {
        A: v.A || '', B: v.B || '',
        commentA: v.commentA || '', commentB: v.commentB || ''
      };
    });
    (cfg().ab || []).forEach(q => {
      const v = (p.ab && p.ab[q.id]) || {};
      window.editAb[q.id] = { value: v.value || '', comment: v.comment || '' };
    });
    (cfg().deepDive || []).forEach(q => {
      window.editDeep[q.id] = (p.deepDive && p.deepDive[q.id]) || '';
    });
    window.editWorldlines = {};
    (cfg().worldlines || []).forEach(q => {
      const v = (p.worldlines && p.worldlines[q.id]) || {};
      window.editWorldlines[q.id] = {
        attrA: v.attrA || '',
        attrB: v.attrB || '',
        commentA: v.commentA || v.comment || '',
        commentB: v.commentB || '',
        detail: v.detail || ''
      };
    });
  };

  window.collectQuestionsForSave = function () {
    const hearts = JSON.parse(JSON.stringify(window.editHearts));
    const yesNo = {};
    const ab = {};
    const deepDive = {};
    (cfg().yesNo || []).forEach(q => {
      const a = document.querySelector(`input[name="yn_${q.id}_A"]:checked`);
      const b = document.querySelector(`input[name="yn_${q.id}_B"]:checked`);
      const cA = document.getElementById(`yn_${q.id}_commentA`);
      const cB = document.getElementById(`yn_${q.id}_commentB`);
      yesNo[q.id] = {
        A: a ? a.value : '',
        B: b ? b.value : '',
        commentA: cA ? cA.value.trim() : '',
        commentB: cB ? cB.value.trim() : ''
      };
    });
    (cfg().ab || []).forEach(q => {
      const el = document.querySelector(`input[name="ab_${q.id}"]:checked`);
      const c = document.getElementById(`ab_${q.id}_comment`);
      ab[q.id] = { value: el ? el.value : '', comment: c ? c.value.trim() : '' };
    });
    (cfg().deepDive || []).forEach(q => {
      const el = document.getElementById(`deep_${q.id}`);
      deepDive[q.id] = el ? el.value.trim() : '';
    });
    const worldlines = {};
    (cfg().worldlines || []).forEach(q => {
      const aA = document.getElementById(`wl_${q.id}_attrA`);
      const aB = document.getElementById(`wl_${q.id}_attrB`);
      const cA = document.getElementById(`wl_${q.id}_commentA`);
      const cB = document.getElementById(`wl_${q.id}_commentB`);
      const dt = document.getElementById(`wl_${q.id}_detail`);
      worldlines[q.id] = {
        attrA: aA ? aA.value.trim() : '',
        attrB: aB ? aB.value.trim() : '',
        commentA: cA ? cA.value.trim() : '',
        commentB: cB ? cB.value.trim() : '',
        detail: dt ? dt.value.trim() : ''
      };
    });
    return { hearts, yesNo, ab, deepDive, worldlines };
  };

  function esc(str) {
    if (typeof escapeHtml === 'function') return escapeHtml(str);
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /** config の note を編集・表示用HTMLに */
  function fieldNote(obj) {
    const n = obj && obj.note;
    if (!n) return '';
    return `<p class="section-note field-note">${esc(n)}</p>`;
  }

  function renderHeartRow(container, qid, side) {
    const val = (window.editHearts[qid] && window.editHearts[qid][side]) || 0;
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const span = document.createElement('span');
      span.textContent = '♥';
      if (i <= val) span.classList.add('on');
      span.onclick = () => {
        if (!window.editHearts[qid]) window.editHearts[qid] = { A: 0, B: 0 };
        window.editHearts[qid][side] = i;
        window.renderQuestionEditors();
      };
      container.appendChild(span);
    }
  }

  window.renderQuestionEditors = function () {
    const c = cfg();
    ['A', 'B'].forEach(side => {
      const box = document.getElementById('heartsEditor' + side);
      if (!box) return;
      box.innerHTML = '';
      (c.hearts || []).forEach(q => {
        const lab = document.createElement('label');
        lab.textContent = q.label;
        lab.style.display = 'block';
        lab.style.marginTop = '8px';
        box.appendChild(lab);
        if (q.note) {
          const note = document.createElement('p');
          note.className = 'section-note field-note';
          note.textContent = q.note;
          box.appendChild(note);
        }
        const row = document.createElement('div');
        row.className = 'heart-select';
        box.appendChild(row);
        renderHeartRow(row, q.id, side);
      });
    });
    ['A', 'B'].forEach(side => {
      const box = document.getElementById('yesNoEditor' + side);
      if (!box) return;
      box.innerHTML = '';
      (c.yesNo || []).forEach(q => {
        const v = window.editYesNo[q.id] || {};
        const cur = v[side] || '';
        const comment = side === 'A' ? (v.commentA || '') : (v.commentB || '');
        const div = document.createElement('div');
        div.className = 'editor-block';
        div.innerHTML = `
          <strong>${esc(q.label)}</strong>
          ${fieldNote(q)}
          <div class="choice-group" style="margin-top:8px;">
            <label><input type="radio" name="yn_${q.id}_${side}" value="yes" ${cur==='yes'?'checked':''}/> <span>YES</span></label>
            <label><input type="radio" name="yn_${q.id}_${side}" value="no" ${cur==='no'?'checked':''}/> <span>NO</span></label>
            <label><input type="radio" name="yn_${q.id}_${side}" value="" ${!cur?'checked':''}/> <span>未回答</span></label>
          </div>
          <input type="text" id="yn_${q.id}_comment${side}" placeholder="コメント（任意）" style="margin-top:6px;" value="${esc(comment)}" />
        `;
        box.appendChild(div);
      });
    });
    const abBox = document.getElementById('abEditor');
    if (abBox) {
      abBox.innerHTML = '';
      const labelA = ((document.getElementById('emojiA') || {}).value || '').trim()
        || ((document.getElementById('nameA') || {}).value || 'A');
      const labelB = ((document.getElementById('emojiB') || {}).value || '').trim()
        || ((document.getElementById('nameB') || {}).value || 'B');
      const short = (s) => (s && s.length > 8 ? s.slice(0, 7) + '…' : (s || ''));
      (c.ab || []).forEach(q => {
        const v = window.editAb[q.id] || { value: '', comment: '' };
        const div = document.createElement('div');
        div.className = 'editor-block';
        div.innerHTML = `
          <strong>${esc(q.label)}</strong>
          ${fieldNote(q)}
          <div class="choice-group" style="margin-top:8px;">
            <label><input type="radio" name="ab_${q.id}" value="A" ${v.value==='A'?'checked':''}/> <span>${esc(short(labelA))}</span></label>
            <label><input type="radio" name="ab_${q.id}" value="B" ${v.value==='B'?'checked':''}/> <span>${esc(short(labelB))}</span></label>
            <label><input type="radio" name="ab_${q.id}" value="" ${!v.value?'checked':''}/> <span>未回答</span></label>
          </div>
          <input type="text" id="ab_${q.id}_comment" placeholder="コメント（任意）" style="margin-top:6px;" value="${esc(v.comment || '')}" />
        `;
        abBox.appendChild(div);
      });
    }
    const deepBox = document.getElementById('deepDiveEditor');
    if (deepBox) {
      deepBox.innerHTML = '';
      (c.deepDive || []).forEach(q => {
        const wrap = document.createElement('div');
        wrap.innerHTML = `
          <label>${esc(q.label)}</label>
          ${fieldNote(q)}
          <textarea id="deep_${q.id}" placeholder="任意">${esc(window.editDeep[q.id] || '')}</textarea>
        `;
        deepBox.appendChild(wrap);
      });
    }

    // こんな世界なら？
    const wlBox = document.getElementById('worldlinesEditor');
    if (wlBox) {
      wlBox.innerHTML = '';
      const emojiA = ((document.getElementById('emojiA') || {}).value || '').trim() || 'A';
      const emojiB = ((document.getElementById('emojiB') || {}).value || '').trim() || 'B';
      const colorA = ((document.getElementById('colorA') || {}).value) || '#a78bfa';
      const colorB = ((document.getElementById('colorB') || {}).value) || '#f472b6';
      if (!(c.worldlines || []).length) {
        wlBox.innerHTML = '<p class="section-note">questions-config.js の worldlines に項目を追加してください。</p>';
      }
      (c.worldlines || []).forEach(q => {
        if (!window.editWorldlines) window.editWorldlines = {};
        const v = window.editWorldlines[q.id] || { attrA: '', attrB: '', commentA: '', commentB: '', detail: '' };
        const div = document.createElement('div');
        div.className = 'worldline-card';
        div.innerHTML = `
          <strong>${esc(q.label)}</strong>
          ${fieldNote(q)}
          <div class="worldline-pair-row">
            <div class="worldline-side">
              <div class="worldline-attr">
                <div class="worldline-icon" style="background:${colorA}">${esc(emojiA)}</div>
                <input type="text" id="wl_${q.id}_attrA" placeholder="${esc(q.placeholderA || q.exampleA || '属性（A）')}" value="${esc(v.attrA)}" />
              </div>
              <input type="text" id="wl_${q.id}_commentA" class="worldline-side-comment" placeholder="${esc(q.commentPlaceholderA || 'Aの補足コメント')}" value="${esc(v.commentA)}" />
            </div>
            <div class="worldline-x">×</div>
            <div class="worldline-side">
              <div class="worldline-attr">
                <div class="worldline-icon" style="background:${colorB}">${esc(emojiB)}</div>
                <input type="text" id="wl_${q.id}_attrB" placeholder="${esc(q.placeholderB || q.exampleB || '属性（B）')}" value="${esc(v.attrB)}" />
              </div>
              <input type="text" id="wl_${q.id}_commentB" class="worldline-side-comment" placeholder="${esc(q.commentPlaceholderB || 'Bの補足コメント')}" value="${esc(v.commentB)}" />
            </div>
          </div>
          <label>説明</label>
          <textarea id="wl_${q.id}_detail" placeholder="この世界線での二人の関係・エピソードなど">${esc(v.detail)}</textarea>
        `;
        wlBox.appendChild(div);
      });
    }
  };

  window.buildQuestionsDisplay = function (p) {
    window.migratePairQuestions(p);
    const c = cfg();
    const yn = (v) => v === 'yes' ? '<span class="yn-yes">YES</span>' : v === 'no' ? '<span class="yn-no">NO</span>' : '';
    const memo = (t) => t ? `<div class="song-memo">${esc(t)}</div>` : '';
    const acc = (title, body) => body ? `<details class="accordion preview" open><summary>${title}</summary><div class="accordion-body">${body}</div></details>` : '';
    const heartsHtml = (side) => {
      let b = '';
      (c.hearts || []).forEach(q => {
        const v = (p.hearts && p.hearts[q.id] && p.hearts[q.id][side]) || 0;
        if (v > 0) {
          let h = '<div class="hearts">';
          for (let i = 1; i <= 5; i++) h += `<span class="${i <= v ? 'heart-on' : 'heart-off'}">♥</span>`;
          h += '</div>';
          b += `<div class="label">${esc(q.label)}</div>${h}`;
        }
      });
      return acc('♡ ハート評価', b);
    };
    const yesNoHtml = (side) => {
      let b = '';
      (c.yesNo || []).forEach(q => {
        const v = (p.yesNo && p.yesNo[q.id]) || {};
        const ans = yn(v[side] || '');
        const cm = memo(side === 'A' ? v.commentA : v.commentB);
        if (ans || cm) b += `<div style="margin-top:6px;"><div class="label">${esc(q.label)}</div>${ans}${cm}</div>`;
      });
      return acc('YES / NO', b);
    };
    const abLabel = (ch, fb) => ch.emoji || (ch.name && ch.name.length > 6 ? ch.name.slice(0, 5) + '…' : (ch.name || fb));
    let abBody = '';
    (c.ab || []).forEach(q => {
      const v = (p.ab && p.ab[q.id]) || {};
      let who = '';
      if (v.value === 'A') who = `<span class="choice-a" style="font-size:1.2rem;">${esc(abLabel(p.charA, 'A'))}</span>`;
      if (v.value === 'B') who = `<span class="choice-b" style="font-size:1.2rem;">${esc(abLabel(p.charB, 'B'))}</span>`;
      const cm = memo(v.comment);
      if (who || cm) abBody += `<div style="margin-top:8px;"><strong style="font-size:0.85rem;">${esc(q.label)}</strong>${q.note ? `<div class="section-note field-note">${esc(q.note)}</div>` : ''}<div style="margin-top:4px;">${who || '—'}${cm}</div></div>`;
    });
    const abHtml = abBody ? `<details class="accordion preview" open><summary>A / B 質問</summary><div class="accordion-body">${abBody}</div></details>` : '';
    let deepBody = '';
    (c.deepDive || []).forEach(q => {
      const t = (p.deepDive && p.deepDive[q.id]) || '';
      if (t) deepBody += `<div class="deep-dive-row"><span class="deep-dive-question">${esc(q.label)}</span>${q.note ? `<div class="section-note field-note">${esc(q.note)}</div>` : ''}<div class="deep-dive-answer">${esc(t)}</div></div>`;
    });
    const deepHtml = deepBody ? `<details class="accordion preview" open><summary>〇〇の時は？ / 深掘り</summary><div class="accordion-body">${deepBody}</div></details>` : '';

    let wlBody = '';
    const wlEmojiA = (p.charA && p.charA.emoji) || 'A';
    const wlEmojiB = (p.charB && p.charB.emoji) || 'B';
    const wlColorA = (p.charA && p.charA.color) || '#a78bfa';
    const wlColorB = (p.charB && p.charB.color) || '#f472b6';
    (c.worldlines || []).forEach(q => {
      const v = (p.worldlines && p.worldlines[q.id]) || {};
      const cA = v.commentA || v.comment || '';
      const cB = v.commentB || '';
      if (!(v.attrA || v.attrB || cA || cB || v.detail)) return;
      wlBody += `<div class="worldline-card">
        <strong>${esc(q.label)}</strong>
        ${q.note ? `<p class="section-note field-note">${esc(q.note)}</p>` : ''}
        <div class="worldline-pair-row preview">
          <div class="worldline-side">
            <div class="worldline-preview-attr">
              <div class="worldline-icon" style="background:${wlColorA}">${esc(wlEmojiA)}</div>
              <span class="worldline-attr-text">${esc(v.attrA || '—')}</span>
            </div>
            ${cA ? `<div class="song-memo">${esc(cA)}</div>` : ''}
          </div>
          <div class="worldline-x">×</div>
          <div class="worldline-side">
            <div class="worldline-preview-attr">
              <div class="worldline-icon" style="background:${wlColorB}">${esc(wlEmojiB)}</div>
              <span class="worldline-attr-text">${esc(v.attrB || '—')}</span>
            </div>
            ${cB ? `<div class="song-memo">${esc(cB)}</div>` : ''}
          </div>
        </div>
        ${v.detail ? `<div class="worldline-detail"> ${esc(v.detail)} </div>` : ''}
      </div>`;
    });
    const worldlinesHtml = wlBody
      ? `<details class="accordion preview" open><summary>こんな世界なら？</summary><div class="accordion-body">${wlBody}</div></details>`
      : '';

    return {
      heartA: heartsHtml('A'),
      heartB: heartsHtml('B'),
      ynA: yesNoHtml('A'),
      ynB: yesNoHtml('B'),
      abHtml,
      deepHtml,
      worldlinesHtml,
    };
  };

  // ===== ポジショニングマップ（config駆動） =====
  window.editMaps = {}; // { id: { ax, ay, bx, by, commentA, commentB } }

  window.resetMapBuffers = function () {
    window.editMaps = {};
    (cfg().maps || []).forEach(m => {
      window.editMaps[m.id] = {
        ax: 30, ay: 40, bx: 70, by: 60,
        commentA: '', commentB: '', unanswered: true, answered: false
      };
    });
  };

  window.loadMapBuffersFromPair = function (p) {
    window.resetMapBuffers();
    // 新形式
    if (p.maps) {
      Object.keys(p.maps).forEach(id => {
        const src = p.maps[id] || {};
        const usesDefaultPosition =
          (src.ax == null || src.ax === 30) && (src.ay == null || src.ay === 40) &&
          (src.bx == null || src.bx === 70) && (src.by == null || src.by === 60);
        const hasAnswer = src.answered === true || !usesDefaultPosition || !!src.commentA || !!src.commentB;
        window.editMaps[id] = {
          ax: src.ax != null ? src.ax : 30,
          ay: src.ay != null ? src.ay : 40,
          bx: src.bx != null ? src.bx : 70,
          by: src.by != null ? src.by : 60,
          commentA: src.commentA || '',
          commentB: src.commentB || '',
          unanswered: src.unanswered === true || !hasAnswer,
          answered: hasAnswer
        };
      });
    }
    // 旧形式からの移行
    const maps = cfg().maps || [];
    if (p.posMap && maps[0]) {
      const id = maps[0].id;
      if (!p.maps || !p.maps[id]) {
        window.editMaps[id] = {
          ax: p.posMap.ax != null ? p.posMap.ax : 30,
          ay: p.posMap.ay != null ? p.posMap.ay : 40,
          bx: p.posMap.bx != null ? p.posMap.bx : 70,
          by: p.posMap.by != null ? p.posMap.by : 60,
          commentA: p.posMap.commentA || p.posMap.comment || '',
          commentB: p.posMap.commentB || '',
          unanswered: (p.posMap.ax == null || p.posMap.ax === 30) &&
            (p.posMap.ay == null || p.posMap.ay === 40) &&
            (p.posMap.bx == null || p.posMap.bx === 70) &&
            (p.posMap.by == null || p.posMap.by === 60) &&
            !(p.posMap.commentA || p.posMap.comment || p.posMap.commentB),
          answered: !((p.posMap.ax == null || p.posMap.ax === 30) &&
            (p.posMap.ay == null || p.posMap.ay === 40) &&
            (p.posMap.bx == null || p.posMap.bx === 70) &&
            (p.posMap.by == null || p.posMap.by === 60) &&
            !(p.posMap.commentA || p.posMap.comment || p.posMap.commentB))
        };
      }
    }
    if (p.posMap2 && maps[1]) {
      const id = maps[1].id;
      if (!p.maps || !p.maps[id]) {
        window.editMaps[id] = {
          ax: p.posMap2.ax != null ? p.posMap2.ax : 30,
          ay: p.posMap2.ay != null ? p.posMap2.ay : 40,
          bx: p.posMap2.bx != null ? p.posMap2.bx : 70,
          by: p.posMap2.by != null ? p.posMap2.by : 60,
          commentA: p.posMap2.commentA || '',
          commentB: p.posMap2.commentB || '',
          unanswered: (p.posMap2.ax == null || p.posMap2.ax === 30) &&
            (p.posMap2.ay == null || p.posMap2.ay === 40) &&
            (p.posMap2.bx == null || p.posMap2.bx === 70) &&
            (p.posMap2.by == null || p.posMap2.by === 60) &&
            !(p.posMap2.commentA || p.posMap2.commentB),
          answered: !((p.posMap2.ax == null || p.posMap2.ax === 30) &&
            (p.posMap2.ay == null || p.posMap2.ay === 40) &&
            (p.posMap2.bx == null || p.posMap2.bx === 70) &&
            (p.posMap2.by == null || p.posMap2.by === 60) &&
            !(p.posMap2.commentA || p.posMap2.commentB))
        };
      }
    }
  };

  window.collectMapsForSave = function () {
    // コメント入力を反映し、未回答フラグを再計算
    (cfg().maps || []).forEach(m => {
      if (!window.editMaps[m.id]) {
        window.editMaps[m.id] = { ax: 30, ay: 40, bx: 70, by: 60, commentA: '', commentB: '', unanswered: true, answered: false };
      }
      const st = window.editMaps[m.id];
      const cA = document.getElementById('mapCommentA_' + m.id);
      const cB = document.getElementById('mapCommentB_' + m.id);
      if (cA) st.commentA = cA.value.trim();
      if (cB) st.commentB = cB.value.trim();
      const ax = st.ax != null ? st.ax : 30;
      const ay = st.ay != null ? st.ay : 40;
      const bx = st.bx != null ? st.bx : 70;
      const by = st.by != null ? st.by : 60;
      const atDefault = (ax === 30 && ay === 40 && bx === 70 && by === 60);
      const hasComment = !!(st.commentA || st.commentB);
      const hasAnswer = !atDefault || hasComment;
      st.unanswered = !hasAnswer;
      st.answered = hasAnswer;
    });
    return JSON.parse(JSON.stringify(window.editMaps));
  };

  window.renderMapsEditor = function () {
    const box = document.getElementById('mapsEditor');
    if (!box) return;
    const emojiA = ((document.getElementById('emojiA') || {}).value || '').trim() || 'A';
    const emojiB = ((document.getElementById('emojiB') || {}).value || '').trim() || 'B';
    const colorA = ((document.getElementById('colorA') || {}).value) || '#a78bfa';
    const colorB = ((document.getElementById('colorB') || {}).value) || '#f472b6';

    box.innerHTML = '';
    (cfg().maps || []).forEach(m => {
      if (!window.editMaps[m.id]) {
        window.editMaps[m.id] = { ax: 30, ay: 40, bx: 70, by: 60, commentA: '', commentB: '', unanswered: true, answered: false };
      }
      const st = window.editMaps[m.id];
      const wrap = document.createElement('div');
      wrap.className = 'editor-block';
      wrap.innerHTML = `
        <strong>${esc(m.label)}</strong>
        ${fieldNote(m)}
        <p class="section-note">横：${esc(m.left)} ⟷ ${esc(m.right)}　／　縦：${esc(m.top)} ⟷ ${esc(m.bottom)}</p>
        <div style="display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="setPlaceMode('A','${m.id}')">Aを置く</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="setPlaceMode('B','${m.id}')">Bを置く</button>
          <span id="placeHint_${m.id}" style="font-size:0.8rem;color:var(--text-muted);align-self:center;"></span>
        </div>
        <div class="pos-map-wrap">
          <div class="pos-map-frame">
            <div class="pos-axis-label pos-axis-top">${esc(m.top)}</div>
            <div class="pos-axis-label pos-axis-left">${esc(m.left)}</div>
            <div class="pos-map" id="editPosMap_${m.id}" onclick="onPosMapClick(event,'${m.id}')">
              <div class="pos-marker-wrap" id="wrapA_${m.id}" style="left:${st.ax}%;top:${st.ay}%;">
                <div class="pos-bubble" id="bubbleA_${m.id}" style="display:none;"></div>
                <div class="pos-marker" id="markerA_${m.id}" style="background:${colorA};">${esc(emojiA)}</div>
              </div>
              <div class="pos-marker-wrap" id="wrapB_${m.id}" style="left:${st.bx}%;top:${st.by}%;">
                <div class="pos-bubble" id="bubbleB_${m.id}" style="display:none;"></div>
                <div class="pos-marker" id="markerB_${m.id}" style="background:${colorB};">${esc(emojiB)}</div>
              </div>
            </div>
            <div class="pos-axis-label pos-axis-right">${esc(m.right)}</div>
            <div class="pos-axis-label pos-axis-bottom">${esc(m.bottom)}</div>
          </div>
          <div id="posCoord_${m.id}" style="text-align:center;font-size:0.85rem;color:var(--accent);margin-top:8px;font-weight:600;"></div>
        </div>
        <div class="form-row">
          <div><label>Aコメント</label><input type="text" id="mapCommentA_${m.id}" placeholder="任意" value="${esc(st.commentA)}" oninput="syncMapComments('${m.id}')" /></div>
          <div><label>Bコメント</label><input type="text" id="mapCommentB_${m.id}" placeholder="任意" value="${esc(st.commentB)}" oninput="syncMapComments('${m.id}')" /></div>
        </div>
      `;
      box.appendChild(wrap);
      updateMapMarkers(m.id);
      const map = document.getElementById('editPosMap_' + m.id);
      if (map) {
        map.addEventListener('pointerdown', event => {
          const markerWrap = event.target.closest('.pos-marker-wrap:not(.readonly)');
          if (!markerWrap) return;
          event.preventDefault();
          map.dataset.draggingMarker = markerWrap.id.startsWith('wrapA_') ? 'A' : 'B';
          window._placeMode = map.dataset.draggingMarker;
          window._placeMap = m.id;
          map.setPointerCapture(event.pointerId);
        });
        map.addEventListener('pointermove', event => {
          const side = map.dataset.draggingMarker;
          if (!side) return;
          const rect = map.getBoundingClientRect();
          if (rect.width < 10 || rect.height < 10) return;
          const x = Math.max(8, Math.min(92, ((event.clientX - rect.left) / rect.width) * 100));
          const y = Math.max(8, Math.min(92, ((event.clientY - rect.top) / rect.height) * 100));
          const st = window.editMaps[m.id];
          if (side === 'A') { st.ax = x; st.ay = y; }
          else { st.bx = x; st.by = y; }
          st.unanswered = false;
          st.answered = true;
          updateMapMarkers(m.id);
        });
        const stopMarkerDrag = event => {
          if (!map.dataset.draggingMarker) return;
          delete map.dataset.draggingMarker;
          if (event.type === 'pointerup') map.dataset.suppressMapClick = 'true';
          if (map.hasPointerCapture(event.pointerId)) map.releasePointerCapture(event.pointerId);
        };
        map.addEventListener('pointerup', stopMarkerDrag);
        map.addEventListener('pointercancel', stopMarkerDrag);
      }
    });
  };

  window.syncMapComments = function (id) {
    if (!window.editMaps[id]) return;
    const cA = document.getElementById('mapCommentA_' + id);
    const cB = document.getElementById('mapCommentB_' + id);
    if (cA) window.editMaps[id].commentA = cA.value;
    if (cB) window.editMaps[id].commentB = cB.value;
    if ((cA && cA.value.trim()) || (cB && cB.value.trim())) {
      window.editMaps[id].unanswered = false;
      window.editMaps[id].answered = true;
    }
    updateMapMarkers(id);
  };

  window.updateMapMarkers = function (id) {
    const st = window.editMaps[id];
    if (!st) return;
    const emojiA = ((document.getElementById('emojiA') || {}).value || '').trim() || 'A';
    const emojiB = ((document.getElementById('emojiB') || {}).value || '').trim() || 'B';
    const colorA = ((document.getElementById('colorA') || {}).value) || '#a78bfa';
    const colorB = ((document.getElementById('colorB') || {}).value) || '#f472b6';
    const mA = document.getElementById('markerA_' + id);
    const mB = document.getElementById('markerB_' + id);
    const wA = document.getElementById('wrapA_' + id);
    const wB = document.getElementById('wrapB_' + id);
    const bA = document.getElementById('bubbleA_' + id);
    const bB = document.getElementById('bubbleB_' + id);
    if (mA) { mA.textContent = emojiA; mA.style.background = colorA; }
    if (mB) { mB.textContent = emojiB; mB.style.background = colorB; }
    if (wA) { wA.style.left = st.ax + '%'; wA.style.top = st.ay + '%'; }
    if (wB) { wB.style.left = st.bx + '%'; wB.style.top = st.by + '%'; }
    const fmt = (typeof formatBubbleText === 'function') ? formatBubbleText : (s => s || '');
    if (bA) {
      if (st.commentA) { bA.textContent = fmt(st.commentA); bA.style.display = 'block'; }
      else bA.style.display = 'none';
    }
    if (bB) {
      if (st.commentB) { bB.textContent = fmt(st.commentB); bB.style.display = 'block'; }
      else bB.style.display = 'none';
    }
    if (typeof applyPairBubblePlacement === 'function') {
      applyPairBubblePlacement(wA, wB, st.ax, st.ay, st.bx, st.by, !!st.commentA, !!st.commentB);
    }
    const coord = document.getElementById('posCoord_' + id);
    if (coord) {
      coord.textContent = 'A: (' + Math.round(st.ax) + '%, ' + Math.round(st.ay) + '%)  /  B: (' + Math.round(st.bx) + '%, ' + Math.round(st.by) + '%)';
    }
  };

  window.setPlaceMode = function (which, mapId) {
    window._placeMode = which;
    window._placeMap = mapId;
    const hint = document.getElementById('placeHint_' + mapId);
    if (hint) {
      hint.textContent = '【配置モード】マップをクリック → ' + which;
      hint.style.color = '#a78bfa';
      hint.style.fontWeight = '700';
    }
    if (!window.editMaps[mapId]) {
      window.editMaps[mapId] = { ax: 30, ay: 40, bx: 70, by: 60, commentA: '', commentB: '', unanswered: true, answered: false };
    }
  };

  window.onPosMapClick = function (e, mapId) {
    const map = document.getElementById('editPosMap_' + mapId);
    if (map && map.dataset.suppressMapClick) {
      delete map.dataset.suppressMapClick;
      return;
    }
    if (e.target.closest('.pos-marker-wrap')) return;
    if (!map) return;
    if (!window._placeMode || window._placeMap !== mapId) window.setPlaceMode('A', mapId);
    window._placeMap = mapId;
    const rect = map.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(8, Math.min(92, x));
    y = Math.max(8, Math.min(92, y));
    if (!window.editMaps[mapId]) {
      window.editMaps[mapId] = { ax: 30, ay: 40, bx: 70, by: 60, commentA: '', commentB: '', unanswered: true, answered: false };
    }
    const st = window.editMaps[mapId];
    if (window._placeMode === 'B') { st.bx = x; st.by = y; }
    else { st.ax = x; st.ay = y; }
    st.unanswered = false;
    st.answered = true;
    updateMapMarkers(mapId);
    const hint = document.getElementById('placeHint_' + mapId);
    if (hint) hint.textContent = window._placeMode + ' を配置（' + Math.round(x) + '%, ' + Math.round(y) + '%）';
  };

  window.buildMapsDisplay = function (p) {
    window.loadMapBuffersFromPair(p); // 移行込みで editMaps に載せるが、表示は p から読む
    const mapsData = p.maps || window.editMaps || {};
    // 旧形式フォールバックは load 済み
    const list = cfg().maps || [];
    if (!list.length) return '';
    const emojiA = (p.charA && p.charA.emoji) || 'A';
    const emojiB = (p.charB && p.charB.emoji) || 'B';
    const colorA = (p.charA && p.charA.color) || '#a78bfa';
    const colorB = (p.charB && p.charB.color) || '#f472b6';
    const fmt = (typeof formatBubbleText === 'function') ? formatBubbleText : (s => s || '');

    let inner = '';
    list.forEach(m => {
      let st = (p.maps && p.maps[m.id]) || mapsData[m.id];
      if (!st && m.id === (list[0] && list[0].id) && p.posMap) st = p.posMap;
      if (!st && m.id === (list[1] && list[1].id) && p.posMap2) st = p.posMap2;
      if (!st) return; // データなし → 非表示
      const ax = st.ax != null ? st.ax : 30, ay = st.ay != null ? st.ay : 40;
      const bx = st.bx != null ? st.bx : 70, by = st.by != null ? st.by : 60;
      const atDefault = (ax === 30 && ay === 40 && bx === 70 && by === 60);
      const noComment = !(st.commentA || st.commentB);
      // 移動なし・コメントなしはプレビューに出さない
      // unanswered 明示、またはデフォルト位置＋コメントなし
      if (st.unanswered === true || (atDefault && noComment && st.answered !== true)) return;
      if (atDefault && noComment) return;
      const bubbleA = st.commentA ? `<div class="pos-bubble">${esc(fmt(st.commentA))}</div>` : '';
      const bubbleB = st.commentB ? `<div class="pos-bubble">${esc(fmt(st.commentB))}</div>` : '';
      const hasA = !!st.commentA, hasB = !!st.commentB;
      let clsA = 'pos-marker-wrap readonly';
      let clsB = 'pos-marker-wrap readonly';
      if (typeof computeBubbleClasses === 'function') {
        const cls = computeBubbleClasses(ax, ay, bx, by, hasA, hasB);
        clsA += cls.A.map(c => ' ' + c).join('');
        clsB += cls.B.map(c => ' ' + c).join('');
      } else {
        if (hasA && hasB) {
          if (ay <= by) { if (by < 80) clsB += ' bubble-below'; }
          else { if (ay < 80) clsA += ' bubble-below'; }
          if (ax <= bx) { clsA += ' bubble-left'; clsB += ' bubble-right'; }
          else { clsB += ' bubble-left'; clsA += ' bubble-right'; }
        } else {
          if (hasA && ay < 30) clsA += ' bubble-below';
          if (hasB && by < 30) clsB += ' bubble-below';
        }
      }
      inner += `
        <div class="editor-block maps-preview-card">
          <strong>${esc(m.label)}</strong>
          ${m.note ? `<p class="section-note field-note">${esc(m.note)}</p>` : ''}
          <div class="pos-map-wrap">
            <div class="pos-map-frame">
              <div class="pos-axis-label pos-axis-top">${esc(m.top)}</div>
              <div class="pos-axis-label pos-axis-left">${esc(m.left)}</div>
              <div class="pos-map" style="pointer-events:none;">
                <div class="${clsA}" style="left:${ax}%;top:${ay}%;">${bubbleA}<div class="pos-marker readonly" style="background:${colorA};">${esc(emojiA)}</div></div>
                <div class="${clsB}" style="left:${bx}%;top:${by}%;">${bubbleB}<div class="pos-marker readonly" style="background:${colorB};">${esc(emojiB)}</div></div>
              </div>
              <div class="pos-axis-label pos-axis-right">${esc(m.right)}</div>
              <div class="pos-axis-label pos-axis-bottom">${esc(m.bottom)}</div>
            </div>
          </div>
        </div>`;
    });
    if (!inner) return '';
    return `<details class="accordion preview" open><summary>ポジショニングマップ</summary><div class="accordion-body"><div class="maps-preview-grid">${inner}</div></div></details>`;
  };

  // loadQuestionBuffersFromPair にマップも載せる
  const _origLoad = window.loadQuestionBuffersFromPair;
  window.loadQuestionBuffersFromPair = function (p) {
    if (_origLoad) _origLoad(p);
    window.loadMapBuffersFromPair(p);
  };
  const _origReset = window.resetQuestionBuffers;
  window.resetQuestionBuffers = function () {
    if (_origReset) _origReset();
    window.resetMapBuffers();
  };
  const _origCollect = window.collectQuestionsForSave;
  window.collectQuestionsForSave = function () {
    const base = _origCollect ? _origCollect() : {};
    base.maps = window.collectMapsForSave();
    return base;
  };
  const _origRender = window.renderQuestionEditors;
  window.renderQuestionEditors = function () {
    if (_origRender) _origRender();
    window.renderMapsEditor();
  };
  const _origDisp = window.buildQuestionsDisplay;
  window.buildQuestionsDisplay = function (p) {
    const d = _origDisp ? _origDisp(p) : {};
    d.mapsHtml = window.buildMapsDisplay(p);
    return d;
  };



  // ===== 基本データ・関係性（config駆動） =====
  window.renderBasicDataEditors = function () {
    const list = cfg().basicData || [];
    ['A', 'B'].forEach(side => {
      const box = document.getElementById('basicDataEditor' + side);
      if (!box) return;
      box.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'basic-data-grid';
      list.forEach(f => {
        const item = document.createElement('div');
        item.className = 'basic-data-item';
        const id = f.id + side;
        item.innerHTML = `<label for="${id}">${esc(f.label)}</label>${fieldNote(f)}<input type="text" id="${id}" />`;
        grid.appendChild(item);
      });
      box.appendChild(grid);
    });
  };

  window.fillBasicDataEditors = function (charA, charB) {
    const list = cfg().basicData || [];
    const a = charA || {}, b = charB || {};
    list.forEach(f => {
      const elA = document.getElementById(f.id + 'A');
      const elB = document.getElementById(f.id + 'B');
      let va = a[f.id], vb = b[f.id];
      if (f.id === 'hometown') {
        va = va || a.birthplace || a.hometown || '';
        vb = vb || b.birthplace || b.hometown || '';
      }
      if (elA) elA.value = va || '';
      if (elB) elB.value = vb || '';
    });
  };

  window.clearBasicDataEditors = function () {
    (cfg().basicData || []).forEach(f => {
      const elA = document.getElementById(f.id + 'A');
      const elB = document.getElementById(f.id + 'B');
      if (elA) elA.value = '';
      if (elB) elB.value = '';
    });
  };

  window.collectBasicData = function (side) {
    const out = {};
    (cfg().basicData || []).forEach(f => {
      const el = document.getElementById(f.id + side);
      out[f.id] = el ? el.value.trim() : '';
    });
    return out;
  };

  window.buildBasicDataDisplay = function (character) {
    const list = cfg().basicData || [];
    if (!character) return '';
    let fields = '';
    list.forEach(f => {
      let v = character[f.id];
      if (f.id === 'hometown') v = v || character.birthplace || '';
      if (!v) return;
      fields += `<div class="basic-data-item"><div class="basic-data-label">${esc(f.label)}</div><div class="basic-data-value">${esc(v)}</div></div>`;
    });
    if (!fields) return '';
    return `<details class="accordion preview basic-data-accordion" open><summary>基本データ</summary><div class="accordion-body"><div class="basic-data-grid preview-basic-data">${fields}</div></div></details>`;
  };

  window.renderRelationshipEditor = function () {
    const box = document.getElementById('relationshipEditor');
    if (!box) return;
    box.innerHTML = '';
    const list = cfg().relationship || [];
    if (!list.length) {
      box.innerHTML = '<p class="section-note">questions-config.js の relationship に項目を追加してください。</p>';
      return;
    }
    const note = document.createElement('p');
    note.className = 'section-note';
    note.textContent = '空欄のままでもOKです。';
    box.appendChild(note);

    const used = new Set();
    list.forEach(f => {
      if (used.has(f.id)) return;
      if (f.row) {
        const group = list.filter(x => x.row === f.row);
        group.forEach(x => used.add(x.id));
        const row = document.createElement('div');
        row.className = 'form-row';
        group.forEach(x => {
          const wrap = document.createElement('div');
          const input = (x.type === 'textarea')
            ? `<textarea id="${x.id}" placeholder="${esc(x.placeholder || '')}"></textarea>`
            : `<input type="text" id="${x.id}" placeholder="${esc(x.placeholder || '')}" />`;
          wrap.innerHTML = `<label>${esc(x.label)}</label>${fieldNote(x)}${input}`;
          row.appendChild(wrap);
        });
        box.appendChild(row);
        return;
      }
      used.add(f.id);
      const wrap = document.createElement('div');
      const input = (f.type === 'textarea')
        ? `<textarea id="${f.id}" placeholder="${esc(f.placeholder || '')}"></textarea>`
        : `<input type="text" id="${f.id}" placeholder="${esc(f.placeholder || '')}" />`;
      wrap.innerHTML = `<label>${esc(f.label)}</label>${fieldNote(f)}${input}`;
      box.appendChild(wrap);
    });
  };

  window.fillRelationshipEditor = function (p) {
    p = p || {};
    (cfg().relationship || []).forEach(f => {
      const el = document.getElementById(f.id);
      if (el) el.value = p[f.id] || '';
    });
  };

  window.clearRelationshipEditor = function () {
    (cfg().relationship || []).forEach(f => {
      const el = document.getElementById(f.id);
      if (el) el.value = '';
    });
  };

  window.collectRelationship = function () {
    const out = {};
    (cfg().relationship || []).forEach(f => {
      const el = document.getElementById(f.id);
      out[f.id] = el ? el.value.trim() : '';
    });
    return out;
  };

  window.buildRelationshipDisplay = function (p) {
    const list = cfg().relationship || [];
    if (!p) return '';
    const show = (label, value, full) => value
      ? `<div class="rel-item${full ? ' rel-full' : ''}"><label>${esc(label)}</label><div class="value">${esc(value)}</div></div>`
      : '';
    let body = '';
    let has = false;
    const used = new Set();

    list.forEach(f => {
      if (used.has(f.id)) return;
      if (f.id === 'cpName') {
        if (p.cpName) has = true;
        used.add(f.id);
        return;
      }

      // 同じ row の項目はプレビューでも横並び（空欄でも列位置を固定）
      if (f.row) {
        const group = list.filter(x => x.row === f.row);
        group.forEach(x => used.add(x.id));
        const any = group.some(x => p[x.id]);
        if (!any) return;
        has = true;
        const cells = group.map(x => {
          const v = p[x.id];
          if (v) return show(x.label, v, false);
          // 回答なしでも枠を残して左右の位置を固定
          return `<div class="rel-item rel-item-empty" aria-hidden="true"></div>`;
        });
        body += `<div class="rel-pair-row">${cells.join('')}</div>`;
        return;
      }

      used.add(f.id);
      const v = p[f.id];
      if (v) {
        has = true;
        body += show(f.label, v, !!f.full || f.type === 'textarea');
      }
    });

    if (!has && !p.cpName) return '';
    const title = p.cpName ? `二人の関係性：${esc(p.cpName)}` : '二人の関係性';
    return `<details class="accordion preview" open><summary>${title}</summary><div class="accordion-body"><div class="rel-grid">${body}</div></div></details>`;
  };



  // ===== 作品紹介（config駆動） =====
  // 作品の関係者（名前＋紹介）バッファ
  window.editWorkRelated = [];

  function newWorkRelatedId() {
    return 'wr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  window.addWorkRelated = function () {
    if (!window.editWorkRelated) window.editWorkRelated = [];
    window.editWorkRelated.push({ id: newWorkRelatedId(), name: '', intro: '' });
    window.renderWorkRelatedEditor();
  };

  window.removeWorkRelated = function (id) {
    window.editWorkRelated = (window.editWorkRelated || []).filter(x => x.id !== id);
    window.renderWorkRelatedEditor();
  };

  window.renderWorkRelatedEditor = function () {
    const box = document.getElementById('workRelatedEditor');
    if (!box) return;
    const list = window.editWorkRelated || [];
    if (!list.length) {
      box.innerHTML = '<p class="section-note">まだ関係者がいません。「＋ 関係者を追加」から追加できます。</p>';
      return;
    }
    box.innerHTML = '';
    list.forEach((person, idx) => {
      const div = document.createElement('div');
      div.className = 'editor-block';
      div.innerHTML = `
        <div class="editor-block-header">
          <span class="editor-block-title">関係者 ${idx + 1}</span>
          <button type="button" class="btn btn-danger btn-sm remove-btn" onclick="removeWorkRelated('${person.id}')">削除</button>
        </div>
        <label>名前</label>
        <input type="text" data-wr-id="${person.id}" data-wr-field="name" placeholder="例：担当編集 / 友人C" value="${esc(person.name || '')}" />
        <label>紹介</label>
        <textarea data-wr-id="${person.id}" data-wr-field="intro" placeholder="簡単な紹介">${esc(person.intro || '')}</textarea>
      `;
      box.appendChild(div);
    });
    // 入力をバッファへ反映
    box.querySelectorAll('[data-wr-id]').forEach(el => {
      const sync = () => {
        const person = (window.editWorkRelated || []).find(x => x.id === el.getAttribute('data-wr-id'));
        if (!person) return;
        person[el.getAttribute('data-wr-field')] = el.value;
      };
      el.addEventListener('input', sync);
      el.addEventListener('change', sync);
    });
  };

  window.renderWorkEditor = function () {
    const box = document.getElementById('workEditor');
    if (!box) return;
    box.innerHTML = '';
    const list = cfg().work || [];
    if (!list.length) {
      box.innerHTML = '<p class="section-note">questions-config.js の work に項目を追加してください。</p>';
    }
    const used = new Set();
    list.forEach(f => {
      if (used.has(f.id)) return;
      if (f.row) {
        const group = list.filter(x => x.row === f.row);
        group.forEach(x => used.add(x.id));
        const row = document.createElement('div');
        row.className = 'form-row';
        group.forEach(x => {
          const wrap = document.createElement('div');
          const input = (x.type === 'textarea')
            ? `<textarea id="work_${x.id}" placeholder="${esc(x.placeholder || '')}"></textarea>`
            : `<input type="text" id="work_${x.id}" placeholder="${esc(x.placeholder || '')}" />`;
          wrap.innerHTML = `<label>${esc(x.label)}</label>${fieldNote(x)}${input}`;
          row.appendChild(wrap);
        });
        box.appendChild(row);
        return;
      }
      used.add(f.id);
      const wrap = document.createElement('div');
      if (f.id === 'memo') {
        // キャラメモと同様：プレビュー表示トグル
        const input = `<textarea id="work_${f.id}" placeholder="${esc(f.placeholder || '')}"></textarea>`;
        wrap.innerHTML = `
          <div class="memo-label-row">
            <label for="work_${f.id}">${esc(f.label)}</label>
            <label class="memo-preview-toggle"><input type="checkbox" id="work_memoVisible" checked />プレビューに表示</label>
          </div>
          ${fieldNote(f)}
          ${input}
        `;
      } else {
        let input;
        if (f.type === 'textarea') {
          input = `<textarea id="work_${f.id}" placeholder="${esc(f.placeholder || '')}"></textarea>`;
        } else if (f.type === 'url' || f.id === 'url') {
          input = `<input type="url" id="work_${f.id}" placeholder="${esc(f.placeholder || 'https://…')}" inputmode="url" />`;
        } else {
          input = `<input type="text" id="work_${f.id}" placeholder="${esc(f.placeholder || '')}" />`;
        }
        wrap.innerHTML = `<label>${esc(f.label)}</label>${fieldNote(f)}${input}`;
      }
      box.appendChild(wrap);
    });

    // 関係者（動的追加）
    const relatedWrap = document.createElement('div');
    relatedWrap.className = 'work-related-section';
    relatedWrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:16px 0 8px;flex-wrap:wrap;">
        <strong style="color:var(--accent);">関係者</strong>
        <button type="button" class="btn btn-secondary btn-sm" onclick="addWorkRelated()">＋ 関係者を追加</button>
      </div>
      <p class="section-note">名前と紹介だけ。あとから何人でも追加できます。</p>
      <div id="workRelatedEditor"></div>
    `;
    box.appendChild(relatedWrap);
    window.renderWorkRelatedEditor();
  };

  window.fillWorkEditor = function (work) {
    work = work || {};
    (cfg().work || []).forEach(f => {
      const el = document.getElementById('work_' + f.id);
      if (el) el.value = work[f.id] || '';
    });
    const mv = document.getElementById('work_memoVisible');
    if (mv) mv.checked = work.memoVisible !== false;
    window.editWorkRelated = Array.isArray(work.related)
      ? JSON.parse(JSON.stringify(work.related))
      : [];
    window.renderWorkRelatedEditor();
  };

  window.clearWorkEditor = function () {
    (cfg().work || []).forEach(f => {
      const el = document.getElementById('work_' + f.id);
      if (el) el.value = '';
    });
    const mv = document.getElementById('work_memoVisible');
    if (mv) mv.checked = true;
    window.editWorkRelated = [];
    window.renderWorkRelatedEditor();
  };

  window.collectWork = function () {
    const out = {};
    (cfg().work || []).forEach(f => {
      const el = document.getElementById('work_' + f.id);
      out[f.id] = el ? el.value.trim() : '';
    });
    const mv = document.getElementById('work_memoVisible');
    out.memoVisible = mv ? mv.checked : true;
    // 関係者：空の名前は除外
    out.related = (window.editWorkRelated || [])
      .map(x => ({
        id: x.id || newWorkRelatedId(),
        name: (x.name || '').trim(),
        intro: (x.intro || '').trim()
      }))
      .filter(x => x.name || x.intro);
    return out;
  };

  window.buildWorkDisplay = function (p) {
    const list = cfg().work || [];
    const work = (p && p.work) || {};
    const related = Array.isArray(work.related) ? work.related : [];
    if (!list.length && !related.length) return '';
    const linkify = (url) => {
      const u = String(url || '').trim();
      if (!u) return '';
      const href = /^https?:\/\//i.test(u) ? u : ('https://' + u);
      // イメソン同様：URL本文は隠してボタンだけ
      let label = 'リンクを開く';
      const low = href.toLowerCase();
      if (low.includes('netflix')) label = '▶ Netflixで見る';
      else if (low.includes('amazon') || low.includes('primevideo') || low.includes('prime.video')) label = '▶ Prime Videoで見る';
      else if (low.includes('disney')) label = '▶ Disney+で見る';
      else if (low.includes('youtube') || low.includes('youtu.be')) label = '▶ YouTubeで見る';
      else if (low.includes('abema')) label = '▶ ABEMAで見る';
      else if (low.includes('hulu')) label = '▶ Huluで見る';
      else if (low.includes('unext') || low.includes('u-next')) label = '▶ U-NEXTで見る';
      else if (low.includes('dmm') || low.includes('d-anime')) label = '▶ 配信サイトで見る';
      return `<div class="song-actions"><a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}</a></div>`;
    };
    const show = (label, value, full, asLink) => value
      ? `<div class="rel-item${full ? ' rel-full' : ''}"><label>${esc(label)}</label><div class="value">${asLink ? linkify(value) : esc(value)}</div></div>`
      : '';
    let body = '';
    let has = false;
    const used = new Set();
    list.forEach(f => {
      if (used.has(f.id)) return;
      if (f.row) {
        const group = list.filter(x => x.row === f.row);
        group.forEach(x => used.add(x.id));
        const any = group.some(x => work[x.id]);
        if (!any) return;
        has = true;
        const cells = group.map(x => {
          const v = work[x.id];
          if (v) return show(x.label, v, false, x.type === 'url' || x.id === 'url');
          return `<div class="rel-item rel-item-empty" aria-hidden="true"></div>`;
        });
        body += `<div class="rel-pair-row">${cells.join('')}</div>`;
        return;
      }
      used.add(f.id);
      const v = work[f.id];
      if (v) {
        // メモは「プレビューに表示」オフなら出さない
        if (f.id === 'memo' && work.memoVisible === false) return;
        has = true;
        const asLink = f.type === 'url' || f.id === 'url' || f.id === 'link';
        body += show(f.label, v, !!f.full || f.type === 'textarea', asLink);
      }
    });

    // 関係者
    const people = related.filter(x => x && (x.name || x.intro));
    if (people.length) {
      has = true;
      let peopleHtml = '<div class="work-related-preview"><div class="label" style="margin-bottom:6px;">関係者</div>';
      people.forEach(person => {
        peopleHtml += `<div class="work-related-card">
          <div class="work-related-name">${esc(person.name || '（名前なし）')}</div>
          ${person.intro ? `<div class="work-related-intro">${esc(person.intro)}</div>` : ''}
        </div>`;
      });
      peopleHtml += '</div>';
      body += `<div class="rel-item rel-full">${peopleHtml}</div>`;
    }

    if (!has) return '';
    const head = work.title ? `作品：${esc(work.title)}` : '作品紹介';
    return `<details class="accordion preview" open><summary>${head}</summary><div class="accordion-body"><div class="rel-grid">${body}</div></div></details>`;
  };

})();
