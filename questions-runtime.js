// questions-config.js を使って質問UI・保存・表示を扱う
(function () {
  function cfg() {
    return window.QUESTIONS_CONFIG || { hearts: [], yesNo: [], ab: [], maps: [], deepDive: [] };
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
  };

  window.migratePairQuestions = function (p) {
    if (!p) return p;
    p.hearts = p.hearts || {};
    p.yesNo = p.yesNo || {};
    p.ab = p.ab || {};
    p.deepDive = p.deepDive || {};
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
    return { hearts, yesNo, ab, deepDive };
  };

  function esc(str) {
    if (typeof escapeHtml === 'function') return escapeHtml(str);
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
        const row = document.createElement('div');
        row.className = 'heart-select';
        box.appendChild(lab);
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
          <textarea id="deep_${q.id}" placeholder="任意">${esc(window.editDeep[q.id] || '')}</textarea>
        `;
        deepBox.appendChild(wrap);
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
      if (who || cm) abBody += `<div style="margin-top:8px;"><strong style="font-size:0.85rem;">${esc(q.label)}</strong><div style="margin-top:4px;">${who || '—'}${cm}</div></div>`;
    });
    const abHtml = abBody ? `<details class="accordion preview" open><summary>A / B 質問</summary><div class="accordion-body">${abBody}</div></details>` : '';
    let deepBody = '';
    (c.deepDive || []).forEach(q => {
      const t = (p.deepDive && p.deepDive[q.id]) || '';
      if (t) deepBody += `<div class="deep-dive-row"><span class="deep-dive-question">${esc(q.label)}</span><div class="deep-dive-answer">${esc(t)}</div></div>`;
    });
    const deepHtml = deepBody ? `<details class="accordion preview" open><summary>〇〇の時は？ / 深掘り</summary><div class="accordion-body">${deepBody}</div></details>` : '';
    return {
      heartA: heartsHtml('A'),
      heartB: heartsHtml('B'),
      ynA: yesNoHtml('A'),
      ynB: yesNoHtml('B'),
      abHtml,
      deepHtml,
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
    // コメント入力を反映
    (cfg().maps || []).forEach(m => {
      if (!window.editMaps[m.id]) {
        window.editMaps[m.id] = { ax: 30, ay: 40, bx: 70, by: 60, commentA: '', commentB: '', unanswered: true, answered: false };
      }
      const cA = document.getElementById('mapCommentA_' + m.id);
      const cB = document.getElementById('mapCommentB_' + m.id);
      if (cA) window.editMaps[m.id].commentA = cA.value.trim();
      if (cB) window.editMaps[m.id].commentB = cB.value.trim();
      if ((cA && cA.value.trim()) || (cB && cB.value.trim())) {
        window.editMaps[m.id].unanswered = false;
        window.editMaps[m.id].answered = true;
      }
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
      if (!st) st = { ax: 30, ay: 40, bx: 70, by: 60 };
      if (st.unanswered === true) return;
      const ax = st.ax != null ? st.ax : 30, ay = st.ay != null ? st.ay : 40;
      const bx = st.bx != null ? st.bx : 70, by = st.by != null ? st.by : 60;
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

})();
