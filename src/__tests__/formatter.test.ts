import { describe, it, expect } from 'vitest';
import { Formatter } from '../utils/formatter';
import { EconomicIndicator } from '../types';

describe('Formatter', () => {
  describe('formatValue', () => {
    it('연준 금리를 퍼센트로 포맷해야 함', () => {
      const result = Formatter.formatValue(5.25, 'DFF');
      expect(result).toBe('5.25%');
    });

    it('GDP를 십억 달러 단위로 포맷해야 함', () => {
      const result = Formatter.formatValue(25000, 'GDPC1');
      expect(result).toContain('십억 달러');
    });

    it('비농업 고용지수를 천명 단위로 포맷해야 함', () => {
      const result = Formatter.formatValue(150000, 'PAYEMS');
      expect(result).toContain('천명');
    });

    it('CPI를 소수점 2자리로 포맷해야 함', () => {
      const result = Formatter.formatValue(310.326, 'CPIAUCSL');
      expect(result).toBe('310.33');
    });

    it('Core PCE를 소수점 2자리로 포맷해야 함', () => {
      const result = Formatter.formatValue(125.789, 'PCEPILFE');
      expect(result).toBe('125.79');
    });

    it('PPI를 소수점 2자리로 포맷해야 함', () => {
      const result = Formatter.formatValue(289.556, 'PPIACO');
      expect(result).toBe('289.56');
    });

    it('NaN 값은 N/A로 표시해야 함', () => {
      const result = Formatter.formatValue(NaN, 'any');
      expect(result).toBe('N/A');
    });
  });

  describe('formatDate', () => {
    it('날짜를 한국어 형식으로 포맷해야 함', () => {
      const result = Formatter.formatDate('2024-01-15');
      expect(result).toContain('2024년');
      expect(result).toContain('1월');
      expect(result).toContain('15일');
    });
  });

  describe('formatIndicator', () => {
    it('지표 정보를 포맷해야 함', () => {
      const indicator: EconomicIndicator = {
        id: 'DFF',
        title: '연준 금리',
        value: 5.25,
        units: 'Percent',
        date: '2024-01-15',
      };

      const result = Formatter.formatIndicator(indicator);
      expect(result).toContain('연준 금리');
      expect(result).toContain('5.25%');
      expect(result).toContain('2024년');
    });
  });

  describe('formatTable', () => {
    it('여러 지표를 테이블 형식으로 포맷해야 함', () => {
      const indicators: EconomicIndicator[] = [
        {
          id: 'DFF',
          title: '연준 금리',
          value: 5.25,
          units: 'Percent',
          date: '2024-01-15',
        },
        {
          id: 'CPIAUCSL',
          title: 'CPI',
          value: 310.326,
          units: 'Index',
          date: '2024-01-15',
        },
      ];

      const result = Formatter.formatTable(indicators);
      expect(result).toContain('지표');
      expect(result).toContain('현재값');
      expect(result).toContain('단위');
      expect(result).toContain('날짜');
      expect(result).toContain('연준 금리');
      expect(result).toContain('CPI');
    });
  });

  describe('메시지 포맷터', () => {
    it('에러 메시지를 포맷해야 함', () => {
      const result = Formatter.formatError('에러 발생');
      expect(result).toContain('❌');
      expect(result).toContain('에러 발생');
    });

    it('성공 메시지를 포맷해야 함', () => {
      const result = Formatter.formatSuccess('성공');
      expect(result).toContain('✅');
      expect(result).toContain('성공');
    });

    it('경고 메시지를 포맷해야 함', () => {
      const result = Formatter.formatWarning('경고');
      expect(result).toContain('⚠️');
      expect(result).toContain('경고');
    });

    it('정보 메시지를 포맷해야 함', () => {
      const result = Formatter.formatInfo('정보');
      expect(result).toContain('ℹ️');
      expect(result).toContain('정보');
    });
  });
});