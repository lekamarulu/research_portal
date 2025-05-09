export interface Year {
  year: string
}

export interface Rainfall {
  id: number
  date_measured: string
  climate_scenario: string
  station: string
  rainfall_total: number
  month_name: string
}

export interface MonthlyRainfall {
  JAN: string
  FEB: string
  MAR: string
  APR: string
  MAY: string
  JUN: string
  JUL: string
  AUG: string
  SEP: string
  OCT: string
  NOV: string
  DEC: string
}


export interface StationMonthlyRainfall {
  station_code: string;
  months: MonthlyRainfall;
}

export interface Station {
    code: string
    name: string
    latitude: number
    longitude: number
    area: number,
    date_established: string,
    status: string,
    data_from: string,
    data_to: string,
    operation_mode: string,
    station_type: string,
    river: string,
    subbasin_name: string,
    unit: string,
    location: string,
    basin: string,
    geom: string
}

export interface ClimateScenario {
    climate_scenario: string,
    technical_code: string,
    name: string,
    description: string 
}