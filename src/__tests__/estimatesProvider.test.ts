import { describe, it, expect, beforeEach } from 'vitest';
import { EstimatesProvider } from '../utils/estimatesProvider';

describe('EstimatesProvider', () => {
  let provider: EstimatesProvider;

  beforeEach(() => {
    provider = new EstimatesProvider();
  });

  describe('getEstimates', () => {
    it('CPI 추정치를 가져와야 함', async () => {
      const estimates = await provider.getEstimates('CPIAUCSL');
      
      expect(estimates).toBeDefined();
      expect(estimates?.indicatorId).toBe('CPIAUCSL');
      expect(estimates?.indicatorName).toBe('CPI');
      expect(estimates?.consensusEstimate).toBeDefined();
      expect(estimates?.high).toBeGreaterThanOrEqual(estimates?.consensusEstimate || 0);
      expect(estimates?.low).toBeLessThanOrEqual(estimates?.consensusEstimate || 0);
      expect(estimates?.estimates).toBeInstanceOf(Array);
      expect(estimates?.estimates.length).toBeGreaterThan(0);
    });

    it('GDP 추정치를 가져와야 함', async () => {
      const estimates = await provider.getEstimates('GDPC1');
      
      expect(estimates).toBeDefined();
      expect(estimates?.indicatorId).toBe('GDPC1');
      expect(estimates?.indicatorName).toBe('GDP 성장률');
      expect(estimates?.numberOfEstimates).toBeGreaterThan(0);
    });

    it('PPI 추정치를 가져와야 함', async () => {
      const estimates = await provider.getEstimates('PPIACO');
      
      expect(estimates).toBeDefined();
      expect(estimates?.indicatorId).toBe('PPIACO');
      expect(estimates?.indicatorName).toBe('PPI');
    });

    it('연준 금리 추정치를 가져와야 함', async () => {
      const estimates = await provider.getEstimates('DFF');
      
      expect(estimates).toBeDefined();
      expect(estimates?.indicatorId).toBe('DFF');
      expect(estimates?.indicatorName).toBe('연준 금리');
    });

    it('비농업 고용지수 추정치를 가져와야 함', async () => {
      const estimates = await provider.getEstimates('PAYEMS');
      
      expect(estimates).toBeDefined();
      expect(estimates?.indicatorId).toBe('PAYEMS');
      expect(estimates?.indicatorName).toBe('비농업 고용지수');
    });

    it('근원 PCE 추정치를 가져와야 함', async () => {
      const estimates = await provider.getEstimates('PCEPILFE');
      
      expect(estimates).toBeDefined();
      expect(estimates?.indicatorId).toBe('PCEPILFE');
      expect(estimates?.indicatorName).toBe('근원 PCE');
    });

    it('존재하지 않는 지표는 null을 반환해야 함', async () => {
      const estimates = await provider.getEstimates('INVALID_ID');
      
      expect(estimates).toBeNull();
    });
  });

  describe('getLatestEstimates', () => {
    it('모든 추정치를 가져와야 함', async () => {
      const allEstimates = await provider.getLatestEstimates();
      
      expect(allEstimates).toBeDefined();
      expect(Object.keys(allEstimates).length).toBeGreaterThan(0);
      expect(allEstimates['CPIAUCSL']).toBeDefined();
      expect(allEstimates['GDPC1']).toBeDefined();
      expect(allEstimates['DFF']).toBeDefined();
    });
  });

  describe('compareWithActual', () => {
    it('실제값이 추정치보다 높을 때 positive surprise를 반환해야 함', () => {
      const result = provider.compareWithActual(105, 100);
      
      expect(result.difference).toBe(5);
      expect(result.percentDifference).toBe(5);
      expect(result.beat).toBe(true);
      expect(result.surprise).toBe('positive');
    });

    it('실제값이 추정치보다 낮을 때 negative surprise를 반환해야 함', () => {
      const result = provider.compareWithActual(95, 100);
      
      expect(result.difference).toBe(-5);
      expect(result.percentDifference).toBe(-5);
      expect(result.beat).toBe(false);
      expect(result.surprise).toBe('negative');
    });

    it('실제값과 추정치 차이가 1% 미만일 때 neutral을 반환해야 함', () => {
      const result = provider.compareWithActual(100.5, 100);
      
      expect(result.difference).toBe(0.5);
      expect(result.percentDifference).toBe(0.5);
      expect(result.beat).toBe(true);
      expect(result.surprise).toBe('neutral');
    });

    it('실제값과 추정치가 같을 때 neutral을 반환해야 함', () => {
      const result = provider.compareWithActual(100, 100);
      
      expect(result.difference).toBe(0);
      expect(result.percentDifference).toBe(0);
      expect(result.beat).toBe(false);
      expect(result.surprise).toBe('neutral');
    });
  });

  describe('추정치 데이터 구조', () => {
    it('각 추정치는 필수 필드를 포함해야 함', async () => {
      const estimates = await provider.getEstimates('CPIAUCSL');
      
      expect(estimates).toBeDefined();
      if (estimates) {
        expect(estimates.estimates[0]).toHaveProperty('institution');
        expect(estimates.estimates[0]).toHaveProperty('estimate');
        expect(estimates.estimates[0]).toHaveProperty('date');
        
        // confidence는 선택사항
        const hasConfidence = 'confidence' in estimates.estimates[0];
        if (hasConfidence) {
          expect(['high', 'medium', 'low']).toContain(estimates.estimates[0].confidence);
        }
      }
    });

    it('추정치 범위가 논리적이어야 함', async () => {
      const estimates = await provider.getEstimates('CPIAUCSL');
      
      expect(estimates).toBeDefined();
      if (estimates) {
        // high >= median >= low
        expect(estimates.high).toBeGreaterThanOrEqual(estimates.median);
        expect(estimates.median).toBeGreaterThanOrEqual(estimates.low);
        
        // consensus는 일반적으로 median과 비슷해야 함
        expect(Math.abs(estimates.consensusEstimate - estimates.median)).toBeLessThan(
          (estimates.high - estimates.low) * 0.5
        );
      }
    });
  });
});