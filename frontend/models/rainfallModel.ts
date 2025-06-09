// models/Rainfall.ts
export interface RainfallPayload {
  date_measured: string;
  year_measured: number;
  month_measured: number;
  month_name: string;
  month_day: number;
  rainfall_total: number;
  station: string;
  climate_scenario: string;
}

export class Rainfall {
  constructor(
    public date_measured: string,
    public rainfall_total: number,
    public station: string,
    public climate_scenario: string
  ) {}

  toPayload(): RainfallPayload {
    const date = new Date(this.date_measured);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return {
      date_measured: this.date_measured,
      year_measured: date.getFullYear(),
      month_measured: date.getMonth() + 1,
      month_name: monthNames[date.getMonth()],
      month_day: date.getDate(),
      rainfall_total: this.rainfall_total,
      station: this.station,
      climate_scenario: this.climate_scenario,
    };
  }
}


export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface ClimateScenario {
  name: string;
  climate_scenario: string;
  technical_code: string;
  description: string;
}

export interface Station {
  code: string;
  name: string;
  longitude: number;
  latitude: number;
  area: number;
  date_established: string; // consider changing to Date if needed
  status: string;
  data_from: string;
  data_to: string;
  operation_mode: string;
  station_type: string;
  river: string;
  subbasin_name: string;
  unit: string;
  location: string;
  basin: string;
  geom: string;
}

// models/MonthlyRainfall.ts

export interface DailyPivotRainfallPayload {
  id: string;
  climate_scenario: string;
  station_code: string;
  year_measured: number;
  month_day: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

export class DailyPivotRainfall {
  constructor(
    public id: string,
    public climate_scenario: string,
    public station_code: string,
    public year_measured: number,
    public month_day: number,
    public jan: number,
    public feb: number,
    public mar: number,
    public apr: number,
    public may: number,
    public jun: number,
    public jul: number,
    public aug: number,
    public sep: number,
    public oct: number,
    public nov: number,
    public dec: number
  ) {}

  toPayload(): DailyPivotRainfallPayload {
    return {
      id: this.id,
      climate_scenario: this.climate_scenario,
      station_code: this.station_code,
      year_measured: this.year_measured,
      month_day: this.month_day,
      jan: this.jan,
      feb: this.feb,
      mar: this.mar,
      apr: this.apr,
      may: this.may,
      jun: this.jun,
      jul: this.jul,
      aug: this.aug,
      sep: this.sep,
      oct: this.oct,
      nov: this.nov,
      dec: this.dec,
    };
  }
}

export class MonthlyPivotRainfallPayload {
  constructor(
    public id: string,
    public climate_scenario: string,
    public station_code: string,
    public year_measured: number,
    public month_day: number,
    public jan: number,
    public feb: number,
    public mar: number,
    public apr: number,
    public may: number,
    public jun: number,
    public jul: number,
    public aug: number,
    public sep: number,
    public oct: number,
    public nov: number,
    public dec: number
  ) {}

  toPayload(): MonthlyPivotRainfallPayload {
    return {
      id: this.id,
      climate_scenario: this.climate_scenario,
      station_code: this.station_code,
      year_measured: this.year_measured,
      month_day: this.month_day,
      jan: this.jan,
      feb: this.feb,
      mar: this.mar,
      apr: this.apr,
      may: this.may,
      jun: this.jun,
      jul: this.jul,
      aug: this.aug,
      sep: this.sep,
      oct: this.oct,
      nov: this.nov,
      dec: this.dec,
    };
  }
}

