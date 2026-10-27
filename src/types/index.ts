export interface UnemploymentRecord {
  id: string;
  region: string;
  date: string; // YYYY-MM-DD
  frequency: string;
  unemploymentRate: number; // in %
  employed: number; // in count
  labourParticipationRate: number; // in %
  area: 'Urban' | 'Rural' | 'National';
  year: number;
  month: number;
  monthName: string;
}

export interface SummaryStats {
  count: number;
  mean: number;
  std: number;
  min: number;
  q25: number;
  median: number;
  q75: number;
  max: number;
}

export interface RegionalStats {
  region: string;
  avgRate: number;
  preCovidAvg: number;
  lockdownAvg: number;
  postCovidAvg: number;
  peakRate: number;
  peakDate: string;
  surgeDelta: number;
  avgLabourParticipation: number;
  totalEmployedAvg: number;
  ruralAvg?: number;
  urbanAvg?: number;
}

export interface FilterState {
  selectedRegions: string[];
  areaFilter: 'All' | 'Urban' | 'Rural';
  dateRange: [string, string];
  minRate: number;
  maxRate: number;
  searchQuery: string;
}

export interface CovidImpactMetrics {
  preCovidRate: number; // Before March 2020
  lockdownPeakRate: number; // March - June 2020
  postLockdownRate: number; // July 2020 onwards
  percentageSurge: number;
  mostAffectedRegion: { name: string; peak: number; delta: number };
  leastAffectedRegion: { name: string; rate: number };
  totalJobsLostEstimated: number;
  urbanPeakRate: number;
  ruralPeakRate: number;
}

export interface NotebookStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  pythonCode: string;
  outputType: 'text' | 'table' | 'chart' | 'stats';
  simulatedOutput?: string;
  educationalNotes: string[];
}
