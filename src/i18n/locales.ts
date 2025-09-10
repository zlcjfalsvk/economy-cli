export interface Locale {
  // Commands
  commands: {
    help: string;
    all: string;
    list: string;
    live: string;
    estimates: string;
    indicator: string;
    history: string;
  };
  
  // Messages
  messages: {
    fetchingData: string;
    fetchingIndicator: (name: string) => string;
    noData: string;
    unknownError: string;
    invalidIndicator: (key: string, available: string) => string;
    estimatesOnlySingle: string;
    lastUpdate: string;
    nextUpdate: (seconds: number) => string;
    exitHint: string;
    updateCount: string;
    currentTime: string;
    updateInterval: (seconds: number) => string;
    apiKeyMissing: string;
    apiKeyInstructions: string;
    networkError: string;
    rateLimitError: string;
  };

  // Indicators
  indicators: {
    gdp: { name: string; description: string };
    nonfarm: { name: string; description: string };
    cpi: { name: string; description: string };
    ppi: { name: string; description: string };
    corePce: { name: string; description: string };
    fedRate: { name: string; description: string };
  };

  // Table headers
  tables: {
    indicator: string;
    value: string;
    unit: string;
    date: string;
    institution: string;
    estimate: string;
    confidence: string;
    high: string;
    medium: string;
    low: string;
  };

  // Estimates
  estimates: {
    title: string;
    actualVsConsensus: string;
    actual: string;
    consensus: string;
    difference: string;
    range: string;
    median: string;
    participatingInstitutions: string;
    topEstimates: string;
    nextReleaseDate: string;
  };

  // CLI info
  cli: {
    name: string;
    description: string;
    examples: string;
    environment: string;
    availableIndicators: string;
    moreInfo: string;
  };
}

const en: Locale = {
  commands: {
    help: 'Show help',
    all: 'Query all major economic indicators',
    list: 'Show all available indicators',
    live: 'Real-time monitoring mode (comma-separated indicators or all)',
    estimates: 'Show Wall Street estimates (only works with single indicator in --live mode)',
    indicator: 'Query specific economic indicator',
    history: 'Query historical data (default: 10)',
  },

  messages: {
    fetchingData: 'Fetching economic indicator data...',
    fetchingIndicator: (name: string) => `Fetching ${name} data...`,
    noData: 'No data',
    unknownError: 'Unknown error',
    invalidIndicator: (key: string, available: string) => 
      `'${key}' is not a valid indicator. Available indicators: ${available}`,
    estimatesOnlySingle: 'Wall Street estimates are only displayed for single indicator monitoring.',
    lastUpdate: 'Last updated',
    nextUpdate: (seconds: number) => `Next update in ${seconds} seconds...`,
    exitHint: 'Press Ctrl+C to exit',
    updateCount: 'Update count',
    currentTime: 'Current time',
    updateInterval: (seconds: number) => `Update interval: ${seconds}s | Exit: Ctrl+C`,
    apiKeyMissing: 'FRED_API_KEY environment variable is not set.',
    apiKeyInstructions: 
      '  1. Get an API key from https://fred.stlouisfed.org/docs/api/api_key.html\n' +
      '  2. Set environment variable: export FRED_API_KEY=your_api_key\n' +
      '  3. Or add FRED_API_KEY=your_api_key to .env file',
    networkError: 'Network Error',
    rateLimitError: 'API request limit exceeded. Please try again later.',
  },

  indicators: {
    gdp: { 
      name: 'GDP Growth Rate', 
      description: 'Real Gross Domestic Product (Quarterly, Annualized)' 
    },
    nonfarm: { 
      name: 'Nonfarm Payrolls', 
      description: 'Total Nonfarm Employment (Thousands)' 
    },
    cpi: { 
      name: 'Consumer Price Index (CPI)', 
      description: 'Urban Consumer Price Index (Seasonally Adjusted)' 
    },
    ppi: { 
      name: 'Producer Price Index (PPI)', 
      description: 'Producer Price Index for All Commodities (Seasonally Adjusted)' 
    },
    corePce: { 
      name: 'Core PCE Price Index', 
      description: 'Personal Consumption Expenditures excluding Food and Energy' 
    },
    fedRate: { 
      name: 'Federal Funds Rate', 
      description: 'Effective Federal Funds Rate (Daily)' 
    },
  },

  tables: {
    indicator: 'Indicator',
    value: 'Value',
    unit: 'Unit',
    date: 'Date',
    institution: 'Institution',
    estimate: 'Estimate',
    confidence: 'Confidence',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },

  estimates: {
    title: '📊 Wall Street Estimates vs Actual',
    actualVsConsensus: 'Actual vs Consensus',
    actual: 'Actual',
    consensus: 'Consensus',
    difference: 'Difference',
    range: 'Estimate Range',
    median: 'Median',
    participatingInstitutions: 'Number of Estimates',
    topEstimates: 'Top Institutional Estimates',
    nextReleaseDate: 'Next Release Date',
  },

  cli: {
    name: 'economy',
    description: 'CLI tool for real-time U.S. economic indicators',
    examples: 'Examples',
    environment: 'Environment Variables',
    availableIndicators: 'Available Indicators',
    moreInfo: 'For more information, visit',
  },
};

const ko: Locale = {
  commands: {
    help: '도움말 표시',
    all: '모든 주요 경제 지표 한번에 조회',
    list: '사용 가능한 모든 지표 목록 표시',
    live: '실시간 모니터링 모드 (쉼표로 구분된 지표 또는 all)',
    estimates: '월스트릿 추정치 표시 (--live 모드에서 단일 지표일 때만 작동)',
    indicator: '특정 경제 지표 조회',
    history: '과거 데이터 조회 (기본값: 10)',
  },

  messages: {
    fetchingData: '경제 지표 데이터를 가져오는 중...',
    fetchingIndicator: (name: string) => `${name} 데이터를 가져오는 중...`,
    noData: '데이터 없음',
    unknownError: '알 수 없는 오류',
    invalidIndicator: (key: string, available: string) => 
      `'${key}'는 유효하지 않은 지표입니다. 사용 가능한 지표: ${available}`,
    estimatesOnlySingle: '월스트릿 추정치는 단일 지표 모니터링 시에만 표시됩니다.',
    lastUpdate: '마지막 업데이트',
    nextUpdate: (seconds: number) => `다음 업데이트: ${seconds}초 후...`,
    exitHint: '종료하려면 Ctrl+C를 누르세요',
    updateCount: '업데이트 횟수',
    currentTime: '현재 시간',
    updateInterval: (seconds: number) => `업데이트 주기: ${seconds}초 | 종료: Ctrl+C`,
    apiKeyMissing: 'FRED_API_KEY 환경변수가 설정되지 않았습니다.',
    apiKeyInstructions: 
      '  1. https://fred.stlouisfed.org/docs/api/api_key.html 에서 API 키를 발급받으세요.\n' +
      '  2. 환경변수를 설정하세요: export FRED_API_KEY=your_api_key\n' +
      '  3. 또는 .env 파일에 FRED_API_KEY=your_api_key 를 추가하세요.',
    networkError: '네트워크 오류',
    rateLimitError: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
  },

  indicators: {
    gdp: { 
      name: 'GDP 성장률', 
      description: '실질 국내총생산 (분기별, 연율화)' 
    },
    nonfarm: { 
      name: '비농업 고용지수', 
      description: '총 비농업 고용자 수 (천명 단위)' 
    },
    cpi: { 
      name: '소비자물가지수 (CPI)', 
      description: '도시 소비자 물가지수 (계절조정)' 
    },
    ppi: { 
      name: '생산자물가지수 (PPI)', 
      description: '모든 상품 생산자물가지수 (계절조정)' 
    },
    corePce: { 
      name: '근원 PCE 물가지수', 
      description: '식품 및 에너지 제외 개인소비지출 물가지수' 
    },
    fedRate: { 
      name: '연준 금리', 
      description: '연방기금 실효금리 (일별)' 
    },
  },

  tables: {
    indicator: '지표',
    value: '현재값',
    unit: '단위',
    date: '날짜',
    institution: '기관',
    estimate: '추정치',
    confidence: '신뢰도',
    high: '높음',
    medium: '중간',
    low: '낮음',
  },

  estimates: {
    title: '📊 월스트릿 추정치 vs 실제값',
    actualVsConsensus: '실제값 vs 컨센서스',
    actual: '실제값',
    consensus: '컨센서스',
    difference: '차이',
    range: '추정치 범위',
    median: '중간값',
    participatingInstitutions: '참여 기관 수',
    topEstimates: '주요 기관 추정치',
    nextReleaseDate: '다음 발표 예정일',
  },

  cli: {
    name: 'economy',
    description: '미국 경제 지표를 실시간으로 조회하는 CLI 도구',
    examples: '사용 예시',
    environment: '환경 변수',
    availableIndicators: '사용 가능한 지표',
    moreInfo: '자세한 정보는 다음을 참조하세요',
  },
};

export const locales = { en, ko };

export type SupportedLanguage = 'en' | 'ko';