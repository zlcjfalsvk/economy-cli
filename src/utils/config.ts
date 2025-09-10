import dotenv from 'dotenv';
import { IndicatorConfig } from '../types/index.js';

dotenv.config();

export const FRED_API_KEY = process.env.FRED_API_KEY;
export const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

export const INDICATORS: Record<string, IndicatorConfig> = {
  gdp: {
    seriesId: 'GDPC1',
    name: 'GDP 성장률',
    description: '실질 국내총생산 (분기별, 연율화)',
  },
  nonfarm: {
    seriesId: 'PAYEMS',
    name: '비농업 고용지수',
    description: '총 비농업 고용자 수 (천명 단위)',
  },
  cpi: {
    seriesId: 'CPIAUCSL',
    name: '소비자물가지수 (CPI)',
    description: '도시 소비자 물가지수 (계절조정)',
  },
  corePce: {
    seriesId: 'PCEPILFE',
    name: '근원 PCE 물가지수',
    description: '식품 및 에너지 제외 개인소비지출 물가지수',
  },
  fedRate: {
    seriesId: 'DFF',
    name: '연준 금리',
    description: '연방기금 실효금리 (일별)',
  },
  ppi: {
    seriesId: 'PPIACO',
    name: '생산자물가지수 (PPI)',
    description: '모든 상품 생산자물가지수 (계절조정)',
  },
};

export const RATE_LIMIT_CONFIG = {
  maxRequestsPerMinute: 120,
  requestInterval: 500,
  cacheTimeout: 60000,
};