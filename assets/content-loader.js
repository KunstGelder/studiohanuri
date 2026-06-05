// Studio Hanuri — content loader
// 페이지의 lang 속성을 보고(EN/NL/KR) 그 언어로 카드를 그려요.
// 데이터: _data/blog/*.json, _data/portfolio/*.json
// 빌드 시점에 manifest.json이 자동 생성되어 어떤 파일들이 있는지 알려줘요.

(async function(){
  const langMap = {'en':'en','nl':'nl','ko':'kr'};
  const lang = langMap[document.documentElement.lang] || 'en';

  // 라벨 (언어별)
  const labels = {
    en: { readMore:'Read more →', portfolioNote:"Our first translated titles are on the way — this shelf is just getting started.", cover:'COVER' },
    nl: { readMore:'Lees meer →', portfolioNote:'Onze eerste vertaalde titels zijn onderweg — deze boekenplank is nog maar net begonnen.', cover:'COVER' },
    kr: { readMore:'자세히 보기 →', portfolioNote:'첫 번역서들이 곧 나옵니다 — 이 책장은 이제 막 시작되었어요.', cover:'COVER' }
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

  // ---------- 블로그 렌더 ----------
  const blogGrid = document.querySelector('.blog-grid');
  if(blogGrid){
    const files = await loadManifest('blog');
    const items = (await Promise.all(files.map(f=>loadJson(`_data/blog/${f}`))))
      .filter(Boolean)
      .sort((a,b)=> (b.date||'').localeCompare(a.date||''));
    blogGrid.innerHTML = items.map(item => {
      const title = item[`title_${lang}`] || item.title_en || '';
      const excerpt = item[`excerpt_${lang}`] || item.excerpt_en || '';
      const tag = item[`tag_${lang}`] || item.tag_en || '';
      const img = item.image || '';
      return `
        <article class="blog-card reveal in">
          <div class="blog-img">${img? `<img src="${img}" alt="${title.replace(/"/g,'&quot;')}">`:''}</div>
          <div class="blog-text">
            <div class="blog-meta"><span class="tag">${tag}</span><span>${fmtDate(item.date)}</span></div>
            <h3>${title}</h3>
            <p>${excerpt}</p>
            <span class="more">${L.readMore}</span>
          </div>
        </article>`;
    }).join('');
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
