# Economy CLI 🇺🇸 📊

[English](./README.md) | **한국어**

미국 주요 경제 지표를 실시간으로 조회할 수 있는 Node.js CLI 도구입니다. FRED (Federal Reserve Economic Data) API를 통해 최신 경제 데이터를 제공합니다.

## 주요 기능

- 📈 **실시간 경제 지표 조회**: GDP, CPI, PPI, 고용지수, 연준 금리 등 주요 지표 확인
- 📊 **과거 데이터 조회**: 각 지표의 과거 데이터를 원하는 개수만큼 조회
- 🔄 **실시간 모니터링 모드**: --live 옵션으로 지속적인 데이터 업데이트 확인
- 🎯 **월스트릿 추정치**: 단일 지표 모니터링 시 주요 금융기관들의 추정치와 비교
- ⚡ **자동 캐싱**: 60초 캐싱으로 빠른 응답 속도 제공
- 🔒 **Rate Limiting**: API 호출 제한 자동 관리
- 🎨 **보기 좋은 출력**: 색상과 테이블을 활용한 깔끔한 데이터 표시

## 지원 경제 지표

| 지표 코드 | 지표명               | 설명                                      |
| --------- | -------------------- | ----------------------------------------- |
| `gdp`     | GDP 성장률           | 실질 국내총생산 (분기별, 연율화)          |
| `nonfarm` | 비농업 고용지수      | 총 비농업 고용자 수 (천명 단위)           |
| `cpi`     | 소비자물가지수 (CPI) | 도시 소비자 물가지수 (계절조정)           |
| `ppi`     | 생산자물가지수 (PPI) | 모든 상품 생산자물가지수 (계절조정)       |
| `corePce` | 근원 PCE 물가지수    | 식품 및 에너지 제외 개인소비지출 물가지수 |
| `fedRate` | 연준 금리            | 연방기금 실효금리 (일별)                  |

## 설치 방법

### 사전 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- FRED API 키 ([여기서 발급](https://fred.stlouisfed.org/docs/api/api_key.html))

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/economy-cli.git
cd economy-cli

# 의존성 설치
npm install --registry https://registry.npmjs.org/

# TypeScript 빌드
npm run build

# 전역 설치 (선택사항)
npm link
```

## 환경 설정

### 1. FRED API 키 발급

1. [FRED 웹사이트](https://fred.stlouisfed.org/docs/api/api_key.html) 방문
2. 계정 생성 또는 로그인
3. API 키 요청 및 발급

### 2. 환경 변수 설정

#### 방법 1: .env 파일 사용 (권장)

프로젝트 루트에 `.env` 파일 생성:

```env
FRED_API_KEY=your_api_key_here
CLI_LANG=ko  # 언어 설정 (en/ko, 기본값: en)
REFRESH_INTERVAL=30  # --live 옵션의 새로고침 주기 (초 단위, 기본값: 30)
```

#### 방법 2: 시스템 환경 변수

```bash
# Linux/Mac
export FRED_API_KEY=your_api_key_here

# Windows (PowerShell)
$env:FRED_API_KEY="your_api_key_here"

# Windows (CMD)
set FRED_API_KEY=your_api_key_here
```

## 사용 방법

### 기본 명령어

```bash
# 모든 주요 경제 지표 조회
economy --all
economy -a

# 특정 지표 조회
economy --indicator gdp
economy -i fedRate

# 과거 데이터 조회
economy --indicator cpi --history 20
economy -i cpi -H 20

# 사용 가능한 지표 목록 확인
economy --list
economy -l

# 실시간 모니터링 모드
economy --live                    # 모든 지표 실시간 모니터링
economy --live gdp,cpi,fedRate    # 특정 지표만 실시간 모니터링
economy --live cpi --estimates    # CPI 실시간 모니터링 + 월스트릿 추정치

# 도움말 표시
economy --help
economy -h
```

### 사용 예시

#### 1. 모든 경제 지표 한 번에 조회

```bash
$ economy --all

📊 미국 주요 경제 지표
┌─────────────────────┬──────────────┬──────────┬─────────────┐
│ 지표                │ 현재값       │ 단위     │ 날짜        │
├─────────────────────┼──────────────┼──────────┼─────────────┤
│ GDP 성장률          │ 25,460 (십억)│ Billions │ 2024년 1월  │
│ 비농업 고용지수     │ 157,000 (천명)│ Thousands│ 2024년 1월  │
│ CPI                 │ 310.33       │ Index    │ 2024년 1월  │
│ PPI                 │ 289.55       │ Index    │ 2024년 1월  │
│ 근원 PCE            │ 125.79       │ Index    │ 2024년 1월  │
│ 연준 금리           │ 5.33%        │ Percent  │ 2024년 1월  │
└─────────────────────┴──────────────┴──────────┴─────────────┘
ℹ️  마지막 업데이트: 2024. 1. 15. 오후 3:30:00
```

#### 2. 연준 금리 과거 5개 데이터 조회

```bash
$ economy --indicator fedRate --history 5

📊 연준 금리 - 과거 5개 데이터
연방기금 실효금리 (일별)

┌─────────────────┬────────┐
│ 날짜            │ 값     │
├─────────────────┼────────┤
│ 2024년 1월 15일 │ 5.33%  │
│ 2024년 1월 14일 │ 5.33%  │
│ 2024년 1월 13일 │ 5.33%  │
│ 2024년 1월 12일 │ 5.33%  │
│ 2024년 1월 11일 │ 5.33%  │
└─────────────────┴────────┘
```

#### 3. 실시간 모니터링 모드

```bash
$ economy --live gdp,cpi,fedRate

🔄 실시간 경제 지표 모니터링
업데이트 주기: 30초 | 종료: Ctrl+C
현재 시간: 2024. 1. 15. 오후 3:30:00
업데이트 횟수: 1

┌─────────────────┬──────────────┬──────────┬─────────────┐
│ 지표            │ 현재값       │ 단위     │ 날짜        │
├─────────────────┼──────────────┼──────────┼─────────────┤
│ GDP 성장률       │ 25,460 (십억)│ Billions │ 2024년 1월  │
│ CPI             │ 310.33       │ Index    │ 2024년 1월  │
│ 연준 금리       │ 5.33%        │ Percent  │ 2024년 1월  │
└─────────────────┴──────────────┴──────────┴─────────────┘

다음 업데이트: 30초 후...
```

#### 4. 월스트릿 추정치와 함께 모니터링

```bash
$ economy --live cpi --estimates

🔄 실시간 경제 지표 모니터링
업데이트 주기: 30초 | 종료: Ctrl+C
현재 시간: 2024. 1. 15. 오후 3:30:00
업데이트 횟수: 1

┌─────────────────┬──────────────┬──────────┬─────────────┐
│ 지표            │ 현재값       │ 단위     │ 날짜        │
├─────────────────┼──────────────┼──────────┼─────────────┤
│ CPI             │ 310.33       │ Index    │ 2024년 1월  │
└─────────────────┴──────────────┴──────────┴─────────────┘

📊 월스트릿 추정치 vs 실제값

실제값: 310.33
컨센서스: 309.20
차이: +1.13 (+0.37%) 📈

추정치 범위: 308.50 ~ 311.00
중간값: 309.20
참여 기관 수: 15개

주요 기관 추정치:
┌─────────────────┬────────┬────────┬─────────────┐
│ 기관            │ 추정치 │ 신뢰도 │ 날짜        │
├─────────────────┼────────┼────────┼─────────────┤
│ Goldman Sachs   │ 309.50 │ 높음   │ 2024년 1월 10일 │
│ JP Morgan       │ 309.20 │ 높음   │ 2024년 1월 11일 │
│ Bank of America │ 309.10 │ 높음   │ 2024년 1월 9일  │
│ Morgan Stanley  │ 311.00 │ 중간   │ 2024년 1월 12일 │
│ Citi            │ 308.50 │ 중간   │ 2024년 1월 8일  │
└─────────────────┴────────┴────────┴─────────────┘

다음 발표 예정일: 2024년 1월 15일
```

## 개발

### 개발 환경 실행

```bash
# TypeScript 파일 직접 실행 (개발용)
npm run dev

# 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage

# 린트 실행
npm run lint

# 코드 포맷팅
npm run format
```

### 프로젝트 구조

```
economy-cli/
├── src/
│   ├── api/
│   │   └── fredClient.ts      # FRED API 클라이언트
│   ├── commands/
│   │   └── indicators.ts      # CLI 명령어 구현
│   ├── types/
│   │   └── index.ts          # TypeScript 타입 정의
│   ├── utils/
│   │   ├── config.ts         # 설정 및 상수
│   │   ├── formatter.ts      # 출력 포맷터
│   │   └── rateLimiter.ts    # API 호출 제한 관리
│   ├── __tests__/            # 테스트 파일
│   └── index.ts              # CLI 진입점
├── .env.example              # 환경 변수 예제
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## 환경 변수 설정

| 환경 변수 | 설명 | 기본값 | 예시 |
|------------|------|--------|------|
| `FRED_API_KEY` | FRED API 키 (필수) | 없음 | `your_api_key_here` |
| `CLI_LANG` | 언어 설정 | `en` | `ko` 또는 `en` |
| `REFRESH_INTERVAL` | --live 옵션 새로고침 주기 (초) | `30` | `60` |

### 지원 언어

- `en`: 영어 (English)
- `ko`: 한국어 (Korean)

## API 제한 사항

- **호출 제한**: 분당 120회 (FRED API 기본 제한)
- **자동 관리**: Rate limiter가 자동으로 요청 간격 조절
- **캐싱**: 60초 동안 동일한 데이터 캐싱으로 불필요한 API 호출 방지

## 문제 해결

### FRED_API_KEY 오류

```
❌ 오류: FRED_API_KEY 환경변수가 설정되지 않았습니다.
```

**해결 방법:**

1. `.env` 파일에 `FRED_API_KEY=your_key` 추가
2. 또는 환경 변수로 직접 설정

### API 호출 제한 초과

```
❌ 오류: API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.
```

**해결 방법:**

- 1-2분 후 다시 시도
- 캐시가 활성화되어 있는지 확인

### 네트워크 오류

```
❌ 오류: FRED API 오류: Network Error
```

**해결 방법:**

- 인터넷 연결 확인
- FRED API 서버 상태 확인
- 프록시 설정 확인

## 기여하기

프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 관련 링크

- [FRED API 문서](https://fred.stlouisfed.org/docs/api/fred/)
- [FRED 데이터 시리즈 검색](https://fred.stlouisfed.org/tags/series)
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Commander.js](https://github.com/tj/commander.js/)

## 감사의 말

- Federal Reserve Bank of St. Louis for providing the FRED API
- 오픈소스 커뮤니티의 모든 기여자들
