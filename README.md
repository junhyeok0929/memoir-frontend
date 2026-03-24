# ✨ 추억 가계부 (Memoir Frontend) - UI/UX

'추억 가계부' 서비스의 프론트엔드 애플리케이션입니다. **뉴모피즘(Neumorphism)** 디자인을 적용하여 독창적이고 세련된 사용자 경험을 제공합니다.

## 🎨 디자인 컨셉: 뉴모피즘
- **Visual Identity:** 빛과 그림자를 활용한 입체감 있는 UI
- **Styling:** Material-UI 기반의 커스텀 테마 (`theme.js`)
- **Interactive:** 직관적인 버튼과 카드 디자인

## 🛠 기술 스택
- **Framework:** React 18.x
- **UI Framework:** Material-UI (MUI) v5
- **Communication:** Axios (with JWT Interceptors)
- **Routing:** React Router DOM v6

## ✨ 주요 기능
- **통합 대시보드:** 현재 지출 내역 및 전체 거래 현황 제공
- **반응형 거래 내역:** 입출금 내역을 리스트 및 카드로 확인
- **JWT 자동 인증:** Axios 인터셉터를 활용한 편리한 인증 처리
- **거래 및 일기 폼:** 직관적인 입력 방식과 유효성 검사

## ⚙️ 실행 방법
1. `npm install`을 실행하여 필요한 라이브러리를 설치합니다.
2. `npm start` 명령어로 애플리케이션을 실행합니다.
3. 브라우저에서 `http://localhost:3000`에 접속합니다.

## 📂 프로젝트 구조
- `src/pages`: 각각의 화면(로그인, 가입, 목록, 폼) 정의
- `src/api.js`: 백엔드 서버와의 API 통신 설정 (Axios)
- `src/theme.js`: 뉴모피즘 테마 및 스타일 정의
- `src/App.js`: 라우팅 및 전역 상태 관리
