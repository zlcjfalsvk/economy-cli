import dotenv from 'dotenv';
import { IndicatorConfig } from '../types/index.js';
import { i18n } from '../i18n/index.js';

dotenv.config();

export const FRED_API_KEY = process.env.FRED_API_KEY;
export const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

export function getIndicators(): Record<string, IndicatorConfig> {
  const t = i18n.t;
  
  return {
    gdp: {
      seriesId: 'GDPC1',
      name: t.indicators.gdp.name,
      description: t.indicators.gdp.description,
    },
    nonfarm: {
      seriesId: 'PAYEMS',
      name: t.indicators.nonfarm.name,
      description: t.indicators.nonfarm.description,
    },
    cpi: {
      seriesId: 'CPIAUCSL',
      name: t.indicators.cpi.name,
      description: t.indicators.cpi.description,
    },
    corePce: {
      seriesId: 'PCEPILFE',
      name: t.indicators.corePce.name,
      description: t.indicators.corePce.description,
    },
    fedRate: {
      seriesId: 'DFF',
      name: t.indicators.fedRate.name,
      description: t.indicators.fedRate.description,
    },
    ppi: {
      seriesId: 'PPIACO',
      name: t.indicators.ppi.name,
      description: t.indicators.ppi.description,
    },
  };
}

// Use getter to always get fresh indicators with current language
export function INDICATORS() {
  return getIndicators();
}

export const RATE_LIMIT_CONFIG = {
  maxRequestsPerMinute: 120,
  requestInterval: 500,
  cacheTimeout: 60000,
};