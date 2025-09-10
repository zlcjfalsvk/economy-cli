import axios, { AxiosInstance } from 'axios';
import NodeCache from 'node-cache';
import { FredApiResponse, EconomicIndicator } from '../types/index.js';
import { FRED_API_KEY, FRED_BASE_URL, RATE_LIMIT_CONFIG } from '../utils/config.js';
import { rateLimiter } from '../utils/rateLimiter.js';

export class FredApiClient {
  private axiosInstance: AxiosInstance;
  private cache: NodeCache;

  constructor() {
    if (!FRED_API_KEY) {
      throw new Error('FRED_API_KEY 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    }

    this.axiosInstance = axios.create({
      baseURL: FRED_BASE_URL,
      timeout: 10000,
      params: {
        api_key: FRED_API_KEY,
        file_type: 'json',
      },
    });

    this.cache = new NodeCache({
      stdTTL: RATE_LIMIT_CONFIG.cacheTimeout / 1000,
      checkperiod: 120,
    });
  }

  async getLatestObservation(seriesId: string, title: string): Promise<EconomicIndicator | null> {
    const cacheKey = `latest_${seriesId}`;
    const cached = this.cache.get<EconomicIndicator>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await rateLimiter.execute(async () => {
        return this.axiosInstance.get<FredApiResponse>('', {
          params: {
            series_id: seriesId,
            sort_order: 'desc',
            limit: 1,
          },
        });
      });

      if (response.data.observations.length === 0) {
        return null;
      }

      const latestObservation = response.data.observations[0];
      const indicator: EconomicIndicator = {
        id: seriesId,
        title,
        value: parseFloat(latestObservation.value),
        units: response.data.units || '',
        date: latestObservation.date,
        updated_at: new Date().toISOString(),
      };

      this.cache.set(cacheKey, indicator);
      return indicator;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        }
        throw new Error(`FRED API 오류: ${error.message}`);
      }
      throw error;
    }
  }

  async getHistoricalData(
    seriesId: string,
    startDate?: string,
    endDate?: string,
    limit: number = 10
  ): Promise<FredApiResponse> {
    const cacheKey = `historical_${seriesId}_${startDate}_${endDate}_${limit}`;
    const cached = this.cache.get<FredApiResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const params: any = {
        series_id: seriesId,
        sort_order: 'desc',
        limit,
      };

      if (startDate) params.observation_start = startDate;
      if (endDate) params.observation_end = endDate;

      const response = await rateLimiter.execute(async () => {
        return this.axiosInstance.get<FredApiResponse>('', { params });
      });

      this.cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        }
        throw new Error(`FRED API 오류: ${error.message}`);
      }
      throw error;
    }
  }

  clearCache(): void {
    this.cache.flushAll();
  }

  getCacheStats() {
    return this.cache.getStats();
  }
}