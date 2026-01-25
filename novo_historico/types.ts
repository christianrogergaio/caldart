export interface RegistryItem {
  id: string;
  dateTime: string;
  temp: number;
  humidity: number;
  weather: 'Nublado' | 'Ensolarado' | 'Chuva Leve';
  risk: 'ALTO' | 'BAIXO' | 'MÉDIO';
  intervention: string | null;
  hasAction: boolean;
}

export interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
  intervention?: boolean; // If an intervention happened at this point
  interventionType?: string;
}

export interface InterventionLogItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  tags?: string[];
  isLast?: boolean;
}