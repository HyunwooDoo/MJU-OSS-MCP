# MJU-OSS-MCP
## AI 기반 최저가 항공권 검색 및 여행 계획 서비스

<img width="170" height="170" alt="embl02" src="https://github.com/user-attachments/assets/44f2ec4a-fd14-4e61-b850-1e985aa679ae" />

<br>
<br>
공개SW실무
3조 레포지토리입니다
<br>
<br>


## 목차

- [주요 기능](#-주요-기능)

- [기술 스택 및 선정 이유](#-기술-스택-및-선정-이유)

- [아키텍처 및 폴더 구조](#-아키텍처-및-폴더-구조)

- [협업 규칙](#-협업-규칙)

- [AI 활용 방식](#-ai-활용-방식)

<br>

## 주요 기능

1. **목적지 선택**: 다양한 여행지를 카드 형태로 제공하여 직관적인 선택

2. **여행 조건 선택**: 여행 기간 및 출발 월을 선택하여 최적의 항공권 검색

3. **AI 텍스트 검색**: 자연어로 여행 정보를 입력하면 AI가 분석하여 최적의 항공권 추천

4. **항공편 검색 결과**: 선택한 조건에 맞는 최저가 항공편을 실시간으로 표시

5. **여행 저장 관리**: 관심 있는 항공편을 저장하고 나중에 다시 확인 가능

<br>

## 🛠 기술 스택 및 선정 이유

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

- `Next.js (App Router)`: SSR/SSG 등 다양한 렌더링 전략 지원, 성능·SEO 우수. Layout, Route Groups 활용으로 페이지 구조 직관적 관리

- `TypeScript`: 정적 타입으로 안정성 확보, 잠재적 버그 사전 방지, 유지보수성 향상

- `Tailwind CSS`: 유틸리티 우선 접근 방식으로 빠르고 일관된 UI 개발, 커스텀 디자인 시스템 구축 용이

### 개발 환경

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)

- `ESLint & Prettier`: 코드 스타일 표준화, 오류 예방, 가독성 향상

<br>

## 아키텍처 및 폴더 구조

유지보수성과 확장성을 고려한 **기능 단위(Feature-based) 구조** 채택

```
├── 📁 app/                      # Next.js App Router
│   ├── 📁 flights/
│   │   └── page.tsx             # 항공편 검색 결과 페이지
│   ├── 📁 saved-trips/
│   │   └── page.tsx             # 저장된 여행 목록 페이지
│   ├── layout.tsx               # 루트 레이아웃 (LocaleProvider)
│   ├── page.tsx                 # 홈 페이지 (목적지/기간/월 선택)
│   └── not-found.tsx            # 404 페이지
│
├── 📁 components/               # 재사용 가능한 UI 컴포넌트
│   ├── DestinationCard.tsx      # 목적지 카드 컴포넌트
│   ├── DurationCard.tsx         # 여행 기간 카드 컴포넌트
│   ├── MonthCard.tsx            # 출발 월 카드 컴포넌트
│   ├── FlightCard.tsx           # 항공편 카드 컴포넌트
│   └── SavedTripCard.tsx        # 저장된 여행 카드 컴포넌트
│
├── 📁 constants/                # 상수 정의
│   └── index.ts                 # 앱 전역 상수 (목적지, 항공사, 기간, 월 등)
│
├── 📁 contexts/                 # React Context
│   └── locale-provider.tsx      # 국제화 Locale Provider (i18n 초기화)
│
├── 📁 hooks/                    # Custom React Hooks (Mutations)
│   └── useSavedTrips.ts         # 여행 저장/삭제 mutation hooks
│
├── 📁 lib/                      # 라이브러리 및 API
│   ├── api.ts                   # API 호출 함수들 (항공편 검색)
│   └── locale-config.ts         # 국제화 설정 (i18next 초기화)
│
├── 📁 styles/                   # 스타일 파일
│   └── globals.css              # 전역 CSS (Tailwind directives)
│
└── 📁 types/                    # TypeScript 타입 정의
    └── index.ts                 # 공통 타입 정의 (Destination, FlightData, SavedTrip 등)

```

<br>

## 협업 규칙

- `Git Flow`: main → develop → feature/기능명 브랜치 전략

- `Commit Convention`: Conventional Commits 규칙 (feat:, fix:, refactor:, chore: 등)

- `Pull Request`: feature → develop로 PR, 최소 1명 이상 승인 후 머지

<br>

## AI 활용 방식

### 자연어 기반 항공권 검색

사용자가 자연어로 여행 정보를 입력하면, LLM이 이를 분석하여 목적지, 여행 기간, 출발 월 등의 조건을 추출하고 최적의 항공편을 검색합니다.

**사용 예시:**

```
"파리로 7일간 4월에 여행하고 싶어요. 로맨틱한 분위기를 원하고 예산은 200만원 정도입니다."
```

**처리 과정:**

1. 사용자 입력 텍스트를 LLM에 전달
2. LLM이 여행 조건 추출 (목적지: 파리, 기간: 7일, 월: 4월, 예산: 200만원)
3. 추출된 조건으로 항공편 검색 API 호출
4. 검색 결과를 사용자에게 표시

**기술 스택:**

- MCP (Model Context Protocol)를 통한 외부 AI 서비스 연동
- 비동기 항공편 검색 API 시뮬레이션
- 실시간 검색 결과 표시 및 사용자 피드백
