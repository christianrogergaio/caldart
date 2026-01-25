export interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
  risk: number; // 0-100
}

export interface HeatmapCell {
  id: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  opacity: number;
}

export interface Alert {
  id: string;
  location: string;
  message: string;
  type: 'warning' | 'critical';
}