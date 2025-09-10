import { ConsensusEstimate } from '../types/estimates.js';

// 실제 환경에서는 외부 API나 데이터베이스에서 가져와야 합니다
// 데모 목적으로 모의 데이터를 생성합니다
export class EstimatesProvider {
  private mockEstimates: Record<string, ConsensusEstimate> = {
    GDPC1: {
      indicatorId: 'GDPC1',
      indicatorName: 'GDP 성장률',
      consensusEstimate: 2.8,
      high: 3.2,
      low: 2.3,
      median: 2.7,
      numberOfEstimates: 12,
      estimates: [
        { institution: 'Goldman Sachs', estimate: 3.0, date: '2024-01-10', confidence: 'high' },
        { institution: 'JP Morgan', estimate: 2.8, date: '2024-01-11', confidence: 'high' },
        { institution: 'Bank of America', estimate: 2.7, date: '2024-01-09', confidence: 'medium' },
        { institution: 'Morgan Stanley', estimate: 3.2, date: '2024-01-12', confidence: 'medium' },
        { institution: 'Citi', estimate: 2.5, date: '2024-01-08', confidence: 'medium' },
        { institution: 'Wells Fargo', estimate: 2.6, date: '2024-01-10', confidence: 'medium' },
        { institution: 'Deutsche Bank', estimate: 2.9, date: '2024-01-11', confidence: 'low' },
        { institution: 'UBS', estimate: 2.7, date: '2024-01-09', confidence: 'high' },
        { institution: 'Credit Suisse', estimate: 2.3, date: '2024-01-07', confidence: 'medium' },
        { institution: 'Barclays', estimate: 2.8, date: '2024-01-10', confidence: 'high' },
        { institution: 'HSBC', estimate: 2.9, date: '2024-01-11', confidence: 'medium' },
        { institution: 'BNP Paribas', estimate: 2.6, date: '2024-01-08', confidence: 'medium' },
      ],
      lastUpdated: new Date().toISOString(),
      nextReleaseDate: '2024-01-25',
    },
    CPIAUCSL: {
      indicatorId: 'CPIAUCSL',
      indicatorName: 'CPI',
      consensusEstimate: 3.2,
      high: 3.5,
      low: 2.9,
      median: 3.2,
      numberOfEstimates: 15,
      estimates: [
        { institution: 'Goldman Sachs', estimate: 3.3, date: '2024-01-10', confidence: 'high' },
        { institution: 'JP Morgan', estimate: 3.2, date: '2024-01-11', confidence: 'high' },
        { institution: 'Bank of America', estimate: 3.1, date: '2024-01-09', confidence: 'high' },
        { institution: 'Morgan Stanley', estimate: 3.5, date: '2024-01-12', confidence: 'medium' },
        { institution: 'Citi', estimate: 2.9, date: '2024-01-08', confidence: 'medium' },
        { institution: 'Wells Fargo', estimate: 3.2, date: '2024-01-10', confidence: 'high' },
        { institution: 'Deutsche Bank', estimate: 3.4, date: '2024-01-11', confidence: 'medium' },
        { institution: 'UBS', estimate: 3.1, date: '2024-01-09', confidence: 'high' },
        { institution: 'Credit Suisse', estimate: 3.0, date: '2024-01-07', confidence: 'medium' },
        { institution: 'Barclays', estimate: 3.3, date: '2024-01-10', confidence: 'high' },
        { institution: 'HSBC', estimate: 3.2, date: '2024-01-11', confidence: 'high' },
        { institution: 'BNP Paribas', estimate: 3.1, date: '2024-01-08', confidence: 'medium' },
        { institution: 'Nomura', estimate: 3.4, date: '2024-01-09', confidence: 'medium' },
        { institution: 'RBC', estimate: 3.2, date: '2024-01-10', confidence: 'high' },
        { institution: 'Mizuho', estimate: 3.0, date: '2024-01-07', confidence: 'medium' },
      ],
      lastUpdated: new Date().toISOString(),
      nextReleaseDate: '2024-01-15',
    },
    PPIACO: {
      indicatorId: 'PPIACO',
      indicatorName: 'PPI',
      consensusEstimate: 2.5,
      high: 2.9,
      low: 2.1,
      median: 2.5,
      numberOfEstimates: 10,
      estimates: [
        { institution: 'Goldman Sachs', estimate: 2.6, date: '2024-01-10', confidence: 'high' },
        { institution: 'JP Morgan', estimate: 2.5, date: '2024-01-11', confidence: 'medium' },
        { institution: 'Bank of America', estimate: 2.4, date: '2024-01-09', confidence: 'high' },
        { institution: 'Morgan Stanley', estimate: 2.9, date: '2024-01-12', confidence: 'medium' },
        { institution: 'Citi', estimate: 2.1, date: '2024-01-08', confidence: 'low' },
        { institution: 'Wells Fargo', estimate: 2.5, date: '2024-01-10', confidence: 'high' },
        { institution: 'Deutsche Bank', estimate: 2.7, date: '2024-01-11', confidence: 'medium' },
        { institution: 'UBS', estimate: 2.3, date: '2024-01-09', confidence: 'medium' },
        { institution: 'Credit Suisse', estimate: 2.4, date: '2024-01-07', confidence: 'high' },
        { institution: 'Barclays', estimate: 2.6, date: '2024-01-10', confidence: 'medium' },
      ],
      lastUpdated: new Date().toISOString(),
      nextReleaseDate: '2024-01-16',
    },
    DFF: {
      indicatorId: 'DFF',
      indicatorName: '연준 금리',
      consensusEstimate: 5.25,
      high: 5.50,
      low: 5.00,
      median: 5.25,
      numberOfEstimates: 18,
      estimates: [
        { institution: 'Goldman Sachs', estimate: 5.25, date: '2024-01-10', confidence: 'high' },
        { institution: 'JP Morgan', estimate: 5.25, date: '2024-01-11', confidence: 'high' },
        { institution: 'Bank of America', estimate: 5.50, date: '2024-01-09', confidence: 'medium' },
        { institution: 'Morgan Stanley', estimate: 5.25, date: '2024-01-12', confidence: 'high' },
        { institution: 'Citi', estimate: 5.00, date: '2024-01-08', confidence: 'medium' },
        { institution: 'Wells Fargo', estimate: 5.25, date: '2024-01-10', confidence: 'high' },
      ],
      lastUpdated: new Date().toISOString(),
      nextReleaseDate: '2024-01-31',
    },
    PAYEMS: {
      indicatorId: 'PAYEMS',
      indicatorName: '비농업 고용지수',
      consensusEstimate: 185000,
      high: 220000,
      low: 150000,
      median: 185000,
      numberOfEstimates: 14,
      estimates: [
        { institution: 'Goldman Sachs', estimate: 190000, date: '2024-01-10', confidence: 'high' },
        { institution: 'JP Morgan', estimate: 185000, date: '2024-01-11', confidence: 'high' },
        { institution: 'Bank of America', estimate: 175000, date: '2024-01-09', confidence: 'medium' },
        { institution: 'Morgan Stanley', estimate: 220000, date: '2024-01-12', confidence: 'low' },
        { institution: 'Citi', estimate: 150000, date: '2024-01-08', confidence: 'medium' },
        { institution: 'Wells Fargo', estimate: 180000, date: '2024-01-10', confidence: 'high' },
        { institution: 'Deutsche Bank', estimate: 195000, date: '2024-01-11', confidence: 'medium' },
        { institution: 'UBS', estimate: 188000, date: '2024-01-09', confidence: 'high' },
      ],
      lastUpdated: new Date().toISOString(),
      nextReleaseDate: '2024-02-02',
    },
    PCEPILFE: {
      indicatorId: 'PCEPILFE',
      indicatorName: '근원 PCE',
      consensusEstimate: 2.8,
      high: 3.1,
      low: 2.5,
      median: 2.8,
      numberOfEstimates: 11,
      estimates: [
        { institution: 'Goldman Sachs', estimate: 2.9, date: '2024-01-10', confidence: 'high' },
        { institution: 'JP Morgan', estimate: 2.8, date: '2024-01-11', confidence: 'high' },
        { institution: 'Bank of America', estimate: 2.7, date: '2024-01-09', confidence: 'high' },
        { institution: 'Morgan Stanley', estimate: 3.1, date: '2024-01-12', confidence: 'medium' },
        { institution: 'Citi', estimate: 2.5, date: '2024-01-08', confidence: 'medium' },
        { institution: 'Wells Fargo', estimate: 2.8, date: '2024-01-10', confidence: 'high' },
      ],
      lastUpdated: new Date().toISOString(),
      nextReleaseDate: '2024-01-26',
    },
  };

  async getEstimates(seriesId: string): Promise<ConsensusEstimate | null> {
    // 실제 구현에서는 API 호출이나 데이터베이스 조회를 수행
    // 여기서는 모의 데이터 반환
    return this.mockEstimates[seriesId] || null;
  }

  async getLatestEstimates(): Promise<Record<string, ConsensusEstimate>> {
    return this.mockEstimates;
  }

  // 실제값과 추정치 비교
  compareWithActual(actual: number, consensus: number): {
    difference: number;
    percentDifference: number;
    beat: boolean;
    surprise: 'positive' | 'negative' | 'neutral';
  } {
    const difference = actual - consensus;
    const percentDifference = (difference / consensus) * 100;
    const beat = difference > 0;
    
    let surprise: 'positive' | 'negative' | 'neutral';
    if (Math.abs(percentDifference) < 1) {
      surprise = 'neutral';
    } else if (percentDifference > 0) {
      surprise = 'positive';
    } else {
      surprise = 'negative';
    }

    return {
      difference,
      percentDifference,
      beat,
      surprise,
    };
  }
}