#!/usr/bin/env node
// Netlify 빌드 시 실행: _data/blog/, _data/portfolio/ 에 manifest.json 생성
// 새 글이 추가되면 자동으로 목록에 잡혀요.
const fs = require('fs');
const path = require('path');

function build(dir){
  const full = path.join('_data', dir);
  if(!fs.existsSync(full)) return;
  const files = fs.readdirSync(full)
    .filter(f => f.endsWith('.json') && f !== 'manifest.json')
    .sort();
  fs.writeFileSync(path.join(full,'manifest.json'), JSON.stringify(files, null, 2));
  console.log(`✓ ${full}/manifest.json (${files.length} items)`);
}

build('blog');
build('portfolio');
