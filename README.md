# 🎬 SLRCLUB+ Chrome 확장 프로그램

> **SLRCLUB 커뮤니티를 더 똑똑하게 이용하세요!**  
> 사용자 관리, 메모, 차단 기능을 통해 더욱 쾌적한 커뮤니티 경험을 제공합니다.

---

## 📋 목차
- [주요 기능](#-주요-기능)
- [설치 방법](#-설치-방법)
- [사용 방법](#-사용-방법)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)
- [변경 이력](#-변경-이력)
- [개인정보처리방침](#-개인정보처리방침)
- [라이센스](#-라이센스)

---

## ✨ 주요 기능

### 🚫 사용자 차단
- SLRCLUB 커뮤니티의 특정 사용자를 차단
- 차단된 사용자의 게시글과 댓글을 숨김
- 닉네임 기반의 스마트한 차단 시스템

### 📝 메모 기능
- 특정 사용자에 대한 개인 메모 저장
- 차단과 동시에 메모 작성 가능
- 메모 리스트 관리 (60개 이상 지원)

### 🎲 자동 룰렛
- 커뮤니티 활동을 위한 자동 룰렛 기능
- 무작위 선택으로 다양한 경험 제공

### 👤 회원 정보 조회
- 특정 회원의 최근 게시물 한눈에 보기
- 회원 프로필 빠른 접근

### 🔧 설정 관리
- 차단/메모 기능 일시 활성화/비활성화
- 설정값을 언제든 변경 가능

### 💾 데이터 백업 & 복원
- 차단 리스트 및 메모 데이터 백업
- JSON 형식으로 안전하게 저장 및 복원
- 브라우저 이동 시 데이터 이관 용이

### 🎨 다양한 UI 커스터마이징
- 폰트 변경 기능
- 다크모드 지원 (준비중)
- 반응형 디자인

### 📱 댓글 입력 개선
- 자동 높이 조절로 편한 입력
- 댓글 영역에서 직접 메모/차단 기능 사용

---

## 📥 설치 방법

### Chrome Web Store에서 설치 (권장)
1. [Chrome 웹스토어 바로가기](https://chromewebstore.google.com/detail/kadhpddmpkggmddeokfaiepjigojggfj?utm_source=item-share-cb)에 접속
2. **"Chrome에 추가"** 버튼 클릭
3. 권한 요청 확인 후 **"확장프로그램 추가"** 클릭
4. 설치 완료!

### 지원 브라우저
- ✅ Google Chrome
- ✅ Microsoft Edge  
- ✅ Naver Whale
- ✅ 기타 Chromium 기반 브라우저

---

## 🚀 사용 방법

### 1️⃣ 기본 설정
1. 확장프로그램 아이콘을 클릭하여 팝업 메뉴 오픈
2. **"옵션"** 탭에서 기본 설정 구성
3. 차단/메모 기능 활성화 여부 설정

### 2️⃣ 사용자 차단하기
1. SLRCLUB에서 차단할 사용자 선택
2. 확장프로그램에서 **"차단"** 버튼 클릭
3. 차단된 사용자의 게시글이 자동으로 숨겨집니다

### 3️⃣ 메모 작성하기
1. 사용자를 선택한 후 **"메모"** 탭 클릭
2. 개인 메모 내용 입력
3. 저장하면 나중에 언제든 조회 가능

### 4️⃣ 백업 및 복원
1. 팝업에서 **"백업"** 버튼으로 데이터 다운로드
2. 다른 브라우저에서 **"복원"** 버튼으로 데이터 불러오기

### 5️⃣ 회원 최근 게시물 조회
1. 특정 회원 클릭
2. **"최근 게시물"** 탭에서 해당 회원의 최신 글 확인

---

## 🛠 기술 스택

| 항목 | 기술 |
|------|------|
| **플랫폼** | Chrome Extension (Manifest V3) |
| **프론트엔드** | HTML5, CSS3, JavaScript (Vanilla) |
| **스타일링** | Tailwind CSS, FontAwesome |
| **번들러** | Tailwind CLI |
| **다국어 지원** | 한국어, 영어 |

### 핵심 라이브러리
- **Tailwind CSS** v4.1.4 - 유틸리티 우선 CSS 프레임워크
- **FontAwesome** - 아이콘 라이브러리
- **Chrome Storage API** - 브라우저 로컬 저장소

---

## 📁 프로젝트 구조

```
slrclub/
├── manifest.json                 # Chrome 확장 설정 파일
├── package.json                  # npm 의존성 정의
├── README.md                     # 프로젝트 문서
├── tailwind.config.js            # Tailwind CSS 설정
│
├── main/                         # 핵심 확장 기능
│   ├── background.js             # 서비스 워커 (백그라운드 작업)
│   ├── content.js                # 콘텐츠 스크립트 (페이지 주입)
│   ├── common.js                 # 공통 유틸리티
│   ├── popup.html & popup.js     # 팝업 UI
│   └── options.html & options.js # 옵션 설정 페이지
│
├── js/                           # JavaScript 파일
│   ├── slrclub.js                # 메인 로직
│   └── category.json             # 카테고리 데이터
│
├── css/                          # 스타일시트
│   ├── slrclub.css               # 메인 스타일
│   ├── style.css                 # 기본 스타일
│   ├── style1.css                # 추가 스타일
│   ├── darkmode.css              # 다크모드 스타일
│   ├── ad.css                    # 광고 스타일
│   ├── fontawesome.min.css       # FontAwesome
│   ├── all.min.css               # 통합 CSS
│   └── tailwind.css              # Tailwind 컴파일 결과
│
├── webfonts/                     # 폰트 파일
│
├── img/                          # 이미지 & 로고
│
├── _locales/                     # 다국어 지원
│   ├── ko/messages.json          # 한국어
│   └── en/messages.json          # 영어
│
└── guide/                        # 문서
    └── slrclub_privacy.md        # 개인정보처리방침
```

---

## 💻 개발 가이드

### 개발 환경 설정

```bash
# 프로젝트 클론
git clone <repository-url>
cd slrclub

# 의존성 설치
npm install
```

### Tailwind CSS 개발 모드

```bash
# Watch 모드로 CSS 자동 컴파일
npm run dev
```

이 명령어는 `./css/style.css`를 감시하여 `./css/tailwind.css`로 자동 컴파일합니다.

### 로컬 개발 및 테스트

1. Chrome 주소창에 `chrome://extensions/` 입력
2. **개발자 모드** 토글 활성화
3. **압축해제된 확장프로그램 로드** 클릭
4. 프로젝트 루트 폴더 선택
5. 코드 수정 후 새로고침(↻)하여 변경사항 확인

### 빌드 및 배포

```bash
# 완성된 CSS 생성
npm run build  # (필요시 package.json에 추가)
```

---

## 📝 변경 이력

### v2.3.4 (최신)
- 성능 최적화
- 버그 수정

### v2.2.2
- 🎨 디자인 개선
- UI/UX 향상

### v2.1.0
- ✨ 폰트 변경 기능 추가
- 커스터마이징 옵션 확대

### v2.0.0
- 🔧 메모 제한 수 60개 이상으로 증가
- 안정성 개선

### v1.2.0
- 🎲 자동 룰렛 기능 추가

### v1.1.0
- 👤 회원 최근 게시물 보기 기능 추가
- 📝 댓글 입력창 자동 높이 조절

### v0.0.2
- 💬 댓글 영역에서의 메모, 차단 기능
- 🚫 닉네임 기반 차단으로 변경

### v0.0.1
- 🚀 초기 릴리스
- 기본 차단, 메모, 백업/복원 기능

---

## 🔒 개인정보처리방침

이 확장프로그램은 **사용자의 개인정보를 외부 서버로 전송하지 않습니다.**

### 수집되는 정보
- 차단한 사용자 목록
- 작성한 메모
- 기능 활성화/비활성화 설정

### 저장 위치
- ✅ 브라우저 로컬 저장소 (Local Storage)
- ✅ Chrome Storage API

### 상세 내용
자세한 개인정보처리방침은 [여기](./guide/slrclub_privacy.md)를 참고하세요.

---

## 🤝 기여하기

이 프로젝트에 기여하고 싶으신가요?

1. Fork the repository
2. Feature branch 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. Branch로 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 오픈

---

## 📄 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.

---

## 💬 지원 및 피드백

- 🐛 버그 리포트: [Issues](../../issues) 페이지에서
- 💡 기능 제안: Discussion에서 논의
- 📧 직접 연락: [이메일 주소 입력]

---

## 👨‍💻 개발자

- **프로젝트 유지보수**: [개발자명]
- **라스트 업데이트**: 2024년

---

<p align="center">
  <b>SLRCLUB+ 확장프로그램으로 더 나은 커뮤니티 경험을 누려보세요! 🎬</b>
</p>
