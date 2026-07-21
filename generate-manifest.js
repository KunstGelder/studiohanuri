// Studio Hanuri — manifest 자동 생성
// _data/blog 와 _data/portfolio 폴더를 스캔해서
// 각 폴더의 .json 파일 목록을 manifest.json으로 저장합니다.
// Netlify 빌드 시 실행되어, 새 글이 올라오면 목록이 자동 갱신됩니다.

const fs = require('fs');
const path = require('path');

function buildManifest(dir){
  const full = path.join(__dirname, '_data', dir);
  if(!fs.existsSync(full)){
    console.log(`[manifest] ${dir} 폴더 없음, 건너뜀`);
    return;
  }
  // .json 파일만, manifest.json 자신은 제외
  const files = fs.readdirSync(full)
    .filter(f => f.endsWith('.json') && f !== 'manifest.json')
    .sort();
  const out = path.join(full, 'manifest.json');
  fs.writeFileSync(out, JSON.stringify(files, null, 2));
  console.log(`[manifest] ${dir}: ${files.length}개 파일 등록`);
  files.forEach(f => console.log(`   - ${f}`));
}

buildManifest('blog');
buildManifest('portfolio');
console.log('[manifest] 완료');
