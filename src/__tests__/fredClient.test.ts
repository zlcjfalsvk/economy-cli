import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { FredApiClient } from '../api/fredClient';

vi.mock('axios');
vi.mock('../utils/config', () => ({
  FRED_API_KEY: 'test-api-key',
  FRED_BASE_URL: 'https://api.stlouisfed.org/fred/series/observations',
  RATE_LIMIT_CONFIG: {
    maxRequestsPerMinute: 120,
    requestInterval: 500,
    cacheTimeout: 60000,
  },
}));

describe('FredApiClient', () => {
  let client: FredApiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new FredApiClient();
  });

  describe('getLatestObservation', () => {
    it('최신 경제 지표 데이터를 가져와야 함', async () => {
      const mockResponse = {
        data: {
          realtime_start: '2024-01-01',
          realtime_end: '2024-01-01',
          units: 'Percent',
          observations: [
            {
              date: '2024-01-01',
              value: '2.5',
              realtime_start: '2024-01-01',
              realtime_end: '2024-01-01',
            },
          ],
        },
      };

      const mockedAxios = axios as any;
      mockedAxios.create = vi.fn(() => ({
        get: vi.fn().mockResolvedValue(mockResponse),
      }));

      const client = new FredApiClient();
      const result = await client.getLatestObservation('TEST_SERIES', 'Test Indicator');

      expect(result).toBeDefined();
      expect(result?.value).toBe(2.5);
      expect(result?.title).toBe('Test Indicator');
      expect(result?.date).toBe('2024-01-01');
    });

    it('데이터가 없을 때 null을 반환해야 함', async () => {
      const mockResponse = {
        data: {
          observations: [],
        },
      };

      const mockedAxios = axios as any;
      mockedAxios.create = vi.fn(() => ({
        get: vi.fn().mockResolvedValue(mockResponse),
      }));

      const client = new FredApiClient();
      const result = await client.getLatestObservation('TEST_SERIES', 'Test Indicator');

      expect(result).toBeNull();
    });

    it('429 에러 시 적절한 에러 메시지를 표시해야 함', async () => {
      const mockError = {
        isAxiosError: true,
        response: { status: 429 },
        message: 'Too Many Requests',
      };

      const mockedAxios = axios as any;
      mockedAxios.create = vi.fn(() => ({
        get: vi.fn().mockRejectedValue(mockError),
      }));
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);

      const client = new FredApiClient();
      
      await expect(
        client.getLatestObservation('TEST_SERIES', 'Test Indicator')
      ).rejects.toThrow('API 요청 한도를 초과했습니다');
    });
  });

  describe('getHistoricalData', () => {
    it('과거 데이터를 가져와야 함', async () => {
      const mockResponse = {
        data: {
          realtime_start: '2024-01-01',
          realtime_end: '2024-01-31',
          units: 'Percent',
          observations: [
            { date: '2024-01-31', value: '2.5' },
            { date: '2024-01-30', value: '2.4' },
            { date: '2024-01-29', value: '2.3' },
          ],
        },
      };

      const mockedAxios = axios as any;
      mockedAxios.create = vi.fn(() => ({
        get: vi.fn().mockResolvedValue(mockResponse),
      }));

      const client = new FredApiClient();
      const result = await client.getHistoricalData('TEST_SERIES', undefined, undefined, 3);

      expect(result.observations).toHaveLength(3);
      expect(result.observations[0].value).toBe('2.5');
    });
  });

  describe('캐싱', () => {
    it('캐시된 데이터를 반환해야 함', async () => {
      const mockResponse = {
        data: {
          units: 'Percent',
          observations: [
            { date: '2024-01-01', value: '2.5' },
          ],
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      const mockedAxios = axios as any;
      mockedAxios.create = vi.fn(() => ({
        get: mockGet,
      }));

      const client = new FredApiClient();
      
      await client.getLatestObservation('TEST_SERIES', 'Test');
      await client.getLatestObservation('TEST_SERIES', 'Test');

      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('clearCache가 캐시를 비워야 함', async () => {
      const mockResponse = {
        data: {
          units: 'Percent',
          observations: [
            { date: '2024-01-01', value: '2.5' },
          ],
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      const mockedAxios = axios as any;
      mockedAxios.create = vi.fn(() => ({
        get: mockGet,
      }));

      const client = new FredApiClient();
      
      await client.getLatestObservation('TEST_SERIES', 'Test');
      client.clearCache();
      await client.getLatestObservation('TEST_SERIES', 'Test');

      expect(mockGet).toHaveBeenCalledTimes(2);
    });
  });
});