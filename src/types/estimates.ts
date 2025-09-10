export interface WallStreetEstimate {
  institution: string;
  analyst?: string;
  estimate: number;
  date: string;
  confidence?: 'high' | 'medium' | 'low';
}

export interface ConsensusEstimate {
  indicatorId: string;
  indicatorName: string;
  actualValue?: number;
  consensusEstimate: number;
  high: number;
  low: number;
  median: number;
  numberOfEstimates: number;
  estimates: WallStreetEstimate[];
  lastUpdated: string;
  nextReleaseDate?: string;
}

export interface EstimateComparison {
  actual: number;
  consensus: number;
  difference: number;
  percentDifference: number;
  beat: boolean;
  surprise?: 'positive' | 'negative' | 'neutral';
}