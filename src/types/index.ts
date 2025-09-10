export interface EconomicIndicator {
  id: string;
  title: string;
  value: number;
  units: string;
  date: string;
  updated_at?: string;
}

export interface FredApiResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FredObservation[];
}

export interface FredObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

export interface IndicatorConfig {
  seriesId: string;
  name: string;
  description: string;
}