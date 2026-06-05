# 🐯 Studio Hanuri — 배포 & 관리자 셋업 가이드

이 가이드대로 따라하면 `studiohanuri.com/admin` 에서 로그인하고
글·책을 추가하면 사이트에 자동 반영됩니다.

소요 시간: **약 40-60분** (처음 한 번만)

---

## 📋 준비물

- [ ] **GitHub 계정** (없으면 https://github.com/signup — 무료)
- [ ] **Netlify 계정** (없으면 https://app.netlify.com/signup — 무료, GitHub 계정으로 가입 가능)
- [ ] **이 폴더** (`studiohanuri-site`) — 사이트 전체 파일
- [ ] (선택) **studiohanuri.com 도메인** — 나중에 연결

---

## 1단계 — GitHub에 사이트 올리기 (15분)

### 1-1. 새 저장소 만들기
1. https://github.com 로그인
2. 우측 상단 **+** → **New repository** 클릭
3. 입력:
   - Repository name: **studiohanuri-site**
   - Public 선택 (무료 플랜에선 Public이 편함)
   - "Add a README file" **체크하지 말기** (이미 파일 있으니까)
4. **Create repository** 클릭

### 1-2. 사이트 파일 업로드
저장소 화면에서 "**uploading an existing file**" 링크 클릭 → 이 폴더(`studiohanuri-site`)의 **모든 내용**을 끌어다 놓기.

⚠️ 폴더 자체가 아니라 **폴더 안의 파일들**을 올려야 해요. 폴더 안 내용을 전체 선택해서 드래그하세요. 포함되어야 할 것:
- `index.html`, `index-nl.html`, `index-kr.html`
- `assets/` 폴더 (이미지·로고·JS 다 들어있는 것)
- `_data/` 폴더 (블로그·포트폴리오 JSON들 + manifest.json)
- `admin/` 폴더 (CMS 설정)
- `netlify.toml`, `build-manifest.js`, `.gitignore`

업로드 후 **Commit changes** 클릭.

---

## 2단계 — Netlify에 연결 (10분)

### 2-1. 사이트 추가
1. https://app.netlify.com 로그인
2. **Add new site** → **Import an existing project** 클릭
3. **Deploy with GitHub** 선택 → GitHub 권한 허용
4. 방금 만든 **studiohanuri-site** 저장소 선택
5. 배포 설정 (대부분 자동 입력됨):
   - Branch: `main`
   - Build command: `node build-manifest.js` (자동 채워짐)
   - Publish directory: `.` (자동)
6. **Deploy site** 클릭

1-2분 기다리면 임시 주소(예: `random-name-12345.netlify.app`)에서 사이트가 떠요. 한 번 들어가서 잘 보이는지 확인하세요.

---

## 3단계 — 관리자 로그인 활성화 (15분) ⭐ 핵심

### 3-1. Identity 켜기
Netlify 대시보드에서:
1. 좌측 메뉴 **Site configuration** → **Identity**
2. **Enable Identity** 클릭
3. **Registration** 섹션에서 **Invite only** 선택 (아무나 가입 못 하게)
4. **External providers** (선택): Google 추가하면 구글 계정으로 로그인 가능

### 3-2. Git Gateway 켜기
같은 Identity 페이지를 아래로 스크롤:
1. **Services** 섹션의 **Git Gateway** → **Enable Git Gateway**
2. 활성화되면 끝 (저장 누를 필요 없음)

### 3-3. 본인을 초대
1. Identity 페이지 위쪽 **Invite users** 클릭
2. 본인 이메일 입력 → **Send**
3. 이메일 확인하면 **Accept the invite** 링크가 와요 → 클릭
4. 사이트로 리다이렉트되면서 비밀번호 설정 화면이 뜸 → 비밀번호 정하기
5. 자동으로 `/admin/` 페이지로 이동, 로그인 완료

### 3-4. 관리자 들어가기
다음부터는:
- **`사이트주소/admin/`** 로 직접 접속
- 본인 이메일/비밀번호로 로그인
- 블로그·포트폴리오 메뉴에서 글 추가/수정 → **Publish** 누르면 1-2분 뒤 사이트에 반영

---

## 4단계 — 도메인 연결 (도메인 있으면, 10분)

studiohanuri.com을 어디서 샀는지에 따라 달라요. Netlify에서:

1. **Site configuration** → **Domain management**
2. **Add custom domain** → `studiohanuri.com` 입력
3. Netlify가 알려주는 DNS 설정을 도메인 등록업체(Cafe24, GoDaddy 등)에서 입력
   - 보통 A 레코드와 CNAME 레코드를 추가
4. 30분~몇 시간 기다리면 연결됨
5. **HTTPS** 자동 활성화 (Let's Encrypt 무료 인증서)

---

## 5단계 — 문의 폼 알림 받기 (5분) ⭐

사이트 방문자가 문의 폼을 작성하면 본인 이메일로 알림이 오게 설정해요.
(이 단계 안 하면 폼 제출은 되지만 알림을 못 받고, 대시보드에서 직접 봐야 해요.)

### 5-1. 폼 인식 확인
Netlify 대시보드에서:
1. 좌측 메뉴 **Forms** 클릭
2. 첫 배포가 끝났으면 **contact-en, contact-nl, contact-kr** 세 폼이 보임
3. 안 보이면 한 번 더 배포(**Deploys** → **Trigger deploy**) 후 다시 확인

### 5-2. 이메일 알림 추가
1. **Forms** 페이지에서 **Form notifications** 또는 **Notifications** 설정으로 가기
   (보통 우측 상단 톱니바퀴 또는 **Settings** 버튼)
2. **Add notification** → **Email notification** 선택
3. 입력:
   - Event: **New form submission**
   - Form: **All forms** 또는 세 폼 각각
   - Email to notify: **studiohanuri@gmail.com**
4. **Save**

이제 누가 폼을 보내면 본인 이메일로 알림이 와요. 대시보드의 **Forms** 메뉴에서 모든 제출 내역도 볼 수 있어요.

### 5-3. 스팸 방지 (선택)
스팸이 많이 들어오면:
- Netlify 대시보드 → **Forms** → 폼 선택 → **Settings**
- **Spam filtering** 활성화 또는 reCAPTCHA 추가 (필요 시)

---

---

## ✏️ 일상적인 사용법

### 새 블로그 글 쓰기
1. `사이트주소/admin/` 접속, 로그인
2. **📝 Blog / 소식** 메뉴 클릭
3. 우측 상단 **New Blog / 소식** 클릭
4. 입력:
   - Date: 발행일
   - Image: 사진 업로드 (또는 기존 사진 선택)
   - Tag (3개 언어): Event / Evenement / 행사 같은 분류
   - Title (3개 언어): 글 제목
   - Excerpt (3개 언어): 1-2문장 미리보기
5. 우측 상단 **Publish** → **Publish now**
6. 1-2분 뒤 사이트에 자동 반영

### 새 책 (포트폴리오) 추가
1. **📚 Portfolio / 책** 메뉴 → **New Portfolio**
2. Order: 보이는 순서 (1이 제일 먼저)
3. Direction: 번역 방향 (KR→NL 또는 NL→KR)
4. Cover: 책 표지 (없으면 비워둬도 됨, 회색 박스로 표시)
5. Title·Publisher 3개 언어 입력
6. **Publish**

### 기존 항목 수정/삭제
컬렉션 목록에서 항목 클릭 → 수정 후 Publish, 또는 우측 상단 **Delete entry**.

---

## ⚠️ 자주 만나는 문제

**"로그인은 됐는데 admin이 안 떠요"**
→ Git Gateway 활성화 다시 확인 (3-2 단계). 그래도 안 되면 브라우저 시크릿 모드로 시도.

**"새 글을 발행했는데 사이트에 안 보여요"**
→ Netlify 대시보드의 **Deploys** 탭에서 빌드가 끝났는지 확인. 보통 1-2분 걸려요. 빌드 실패하면 빨갛게 표시되고 로그 확인 가능.

**"이미지가 깨져서 나와요"**
→ admin에서 이미지 업로드하면 `/assets/uploads/` 에 저장돼요. JSON 파일의 image 경로가 `/assets/uploads/파일명.jpg`로 시작하는지 확인.

**"한국어판은 잘 보이는데 다른 언어판이 안 바뀌었어요"**
→ 글 쓸 때 3개 언어 필드 다 채워야 해요. 한 언어만 채우면 나머지 언어판에선 "undefined" 표시될 수 있음.

**"디자인을 바꾸고 싶어요"**
→ admin은 콘텐츠(글/책) 관리용이고, About/Services 같은 고정 텍스트나 디자인은 HTML/CSS 직접 수정이 필요해요. GitHub에서 파일 편집하거나 코드 다룰 줄 아는 분께 부탁하면 돼요.

---

## 🔗 유용한 링크

- 사이트 대시보드: https://app.netlify.com
- GitHub 저장소: https://github.com/본인계정/studiohanuri-site
- 관리자 페이지: `사이트주소/admin/`
- Decap CMS 공식 문서: https://decapcms.org/docs/

---

## 🚨 백업

GitHub에 모든 글이 저장되니까 자동으로 백업돼요. 추가 백업은 안 해도 되지만, 안심되려면 가끔 저장소를 ZIP으로 다운로드해두면 좋아요 (GitHub 저장소 → Code → Download ZIP).

---

문제가 생기면 Netlify 대시보드의 **Deploys** 탭에서 빌드 로그를 확인하세요. 빨간색 메시지가 힌트예요. 🐯
