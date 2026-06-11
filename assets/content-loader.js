// Studio Hanuri — content loader
// 페이지의 lang 속성을 보고(EN/NL/KR) 그 언어로 카드를 그려요.
// 데이터: _data/blog/*.json, _data/portfolio/*.json
// 빌드 시점에 manifest.json이 자동 생성되어 어떤 파일들이 있는지 알려줘요.

(async function(){
  const langMap = {'en':'en','nl':'nl','ko':'kr'};
  const lang = langMap[document.documentElement.lang] || 'en';

  // 라벨 (언어별)
  const labels = {
    en: { readMore:'Read more →', portfolioNote:"Our first translated titles are on the way — this shelf is just getting started.", cover:'COVER', close:'Close' },
    nl: { readMore:'Lees meer →', portfolioNote:'Onze eerste vertaalde titels zijn onderweg — deze boekenplank is nog maar net begonnen.', cover:'COVER', close:'Sluiten' },
    kr: { readMore:'자세히 보기 →', portfolioNote:'첫 번역서들이 곧 나옵니다 — 이 책장은 이제 막 시작되었어요.', cover:'COVER', close:'닫기' }
  };
  const L = labels[lang];

  // 날짜 포맷
  function fmtDate(iso){
    if(!iso) return '';
    const d = new Date(iso);
    if(isNaN(d)) return iso;
    if(lang==='kr') return `${d.getFullYear()}년 ${d.getMonth()+1}월`;
    const months = lang==='nl'
      ? ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']
      : ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`.replace(/^./,c=>c.toUpperCase());
  }

  // manifest 로드: 빌드 시 생성되는 파일 목록
  async function loadManifest(dir){
    try {
      const r = await fetch(`_data/${dir}/manifest.json`);
      if(r.ok) return await r.json();
    } catch(e){}
    return [];
  }

  async function loadJson(path){
    try { const r = await fetch(path); if(r.ok) return await r.json(); } catch(e){}
    return null;
  }

  // ---------- 모달 ----------
  function buildModal(){
    if(document.getElementById('blog-modal')) return;
    const style = document.createElement('style');
    style.textContent = `
      #blog-modal{display:none;position:fixed;inset:0;z-index:9000;align-items:center;justify-content:center;padding:1.5rem;}
      #blog-modal.open{display:flex;}
      #blog-modal-backdrop{position:absolute;inset:0;background:rgba(22,40,90,.55);backdrop-filter:blur(4px);}
      #blog-modal-box{position:relative;z-index:1;background:#fff;border-radius:20px;max-width:1500px;width:100%;max-height:88vh;overflow:hidden;box-shadow:0 32px 80px -16px rgba(22,40,90,.45);display:flex;flex-direction:row;}
      #blog-modal-imgwrap{flex:0 0 50%;max-width:50%;background:#f6f3ec;display:flex;align-items:center;justify-content:center;max-height:88vh;overflow:hidden;}
      #blog-modal-imgwrap.empty{display:none;}
      #blog-modal-img{width:100%;height:100%;object-fit:contain;display:block;}
      #blog-modal-body{flex:1;padding:2.4rem 2.6rem;overflow-y:auto;max-height:88vh;}
      #blog-modal-meta{display:flex;gap:.8rem;align-items:center;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:#2a4a9d;font-weight:600;margin-bottom:1rem;}
      #blog-modal-meta .tag{background:#e7ebf7;padding:.2rem .6rem;border-radius:20px;}
      #blog-modal-title{font-family:'Fraunces',Georgia,serif;font-weight:500;font-size:1.75rem;line-height:1.2;color:#1a1a22;margin-bottom:1.4rem;}
      #blog-modal-content{font-size:1rem;line-height:1.85;color:#4a4a55;max-width:60ch;}
      #blog-modal-content p{margin-bottom:1.1rem;}
      #blog-modal-close{position:absolute;top:1.1rem;right:1.2rem;z-index:2;background:rgba(255,255,255,.9);border:none;border-radius:50%;width:36px;height:36px;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.15);transition:background .2s;}
      #blog-modal-close:hover{background:#fff;}
      @media(max-width:720px){
        #blog-modal-box{flex-direction:column;max-height:90vh;overflow-y:auto;}
        #blog-modal-imgwrap{flex:none;max-width:100%;width:100%;max-height:50vh;}
        #blog-modal-img{max-height:50vh;}
        #blog-modal-body{padding:1.6rem 1.6rem 2rem;max-height:none;overflow-y:visible;}
        #blog-modal-title{font-size:1.4rem;}
      }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'blog-modal';
    modal.innerHTML = `
      <div id="blog-modal-backdrop"></div>
      <div id="blog-modal-box">
        <button id="blog-modal-close" aria-label="${L.close}">✕</button>
        <div id="blog-modal-imgwrap"><img id="blog-modal-img" src="" alt=""></div>
        <div id="blog-modal-body">
          <div id="blog-modal-meta"><span class="tag" id="blog-modal-tag"></span><span id="blog-modal-date"></span></div>
          <h2 id="blog-modal-title"></h2>
          <div id="blog-modal-content"></div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('blog-modal-close').addEventListener('click', closeModal);
    document.getElementById('blog-modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });
  }

  function openModal(item, lang){
    const title = item[`title_${lang}`] || item.title_en || '';
    const tag = item[`tag_${lang}`] || item.tag_en || '';
    const body = item[`body_${lang}`] || item.body_en || '';
    const img = item.image || '';

    const imgEl = document.getElementById('blog-modal-img');
    const imgWrap = document.getElementById('blog-modal-imgwrap');
    if(img){ imgEl.src = img; imgEl.alt = title; imgWrap.classList.remove('empty'); }
    else { imgEl.src=''; imgWrap.classList.add('empty'); }
    document.getElementById('blog-modal-tag').textContent = tag;
    document.getElementById('blog-modal-date').textContent = fmtDate(item.date);
    document.getElementById('blog-modal-title').textContent = title;
    // body 필드가 있으면 그대로, 없으면 excerpt로 fallback
    const excerpt = item[`excerpt_${lang}`] || item.excerpt_en || '';
    const content = body || excerpt;
    document.getElementById('blog-modal-content').innerHTML = content
      .split('\n\n').map(p => p.trim() ? `<p>${p.trim()}</p>` : '').join('');

    document.getElementById('blog-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    document.getElementById('blog-modal').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---------- 블로그 렌더 ----------
  const blogGrid = document.querySelector('.blog-grid');
  if(blogGrid){
    buildModal();
    const files = await loadManifest('blog');
    const items = (await Promise.all(files.map(f=>loadJson(`_data/blog/${f}`))))
      .filter(Boolean)
      .sort((a,b)=> (b.date||'').localeCompare(a.date||''));
    blogGrid.innerHTML = items.map((item, i) => {
      const title = item[`title_${lang}`] || item.title_en || '';
      const excerpt = item[`excerpt_${lang}`] || item.excerpt_en || '';
      const tag = item[`tag_${lang}`] || item.tag_en || '';
      const img = item.image || '';
      return `
        <article class="blog-card reveal in" data-blog-index="${i}" style="cursor:pointer;">
          <div class="blog-img">${img ? `<img src="${img}" alt="${title.replace(/"/g,'&quot;')}">` : ''}</div>
          <div class="blog-text">
            <div class="blog-meta"><span class="tag">${tag}</span><span>${fmtDate(item.date)}</span></div>
            <h3>${title}</h3>
            <p>${excerpt}</p>
            <span class="more">${L.readMore}</span>
          </div>
        </article>`;
    }).join('');

    // 카드 클릭 이벤트
    blogGrid.querySelectorAll('.blog-card').forEach((card, i) => {
      card.addEventListener('click', () => openModal(items[i], lang));
    });
  }

  // ---------- 포트폴리오 렌더 ----------
  const portGrid = document.querySelector('.port-grid');
  if(portGrid){
    const files = await loadManifest('portfolio');
    const items = (await Promise.all(files.map(f=>loadJson(`_data/portfolio/${f}`))))
      .filter(Boolean)
      .sort((a,b)=> (a.order||0)-(b.order||0));
    portGrid.innerHTML = items.map(item => {
      const title = item[`title_${lang}`] || item.title_en || '';
      const pub = item[`publisher_${lang}`] || item.publisher_en || '';
      const dir = item.direction === 'NL_KR' ? 'NL → KR' : 'KR → NL';
      const cover = item.cover || '';
      return `
        <div class="port-card reveal in">
          <div class="port-cover">${cover
            ? `<img src="${cover}" alt="${title.replace(/"/g,'&quot;')}" style="width:100%;height:100%;object-fit:cover">`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z"/><path d="M18 4h2v14"/></svg><span>${L.cover}</span>`}</div>
          <div class="port-info">
            <h4>${title}</h4>
            <div class="pub">${pub}</div>
            <span class="port-dir">${dir}</span>
          </div>
        </div>`;
    }).join('');
  }
})();
