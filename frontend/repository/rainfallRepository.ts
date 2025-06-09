import api from "@/lib/axios";
import {
  RainfallPayload,
  PaginatedResponse,
  DailyPivotRainfallPayload,
  MonthlyPivotRainfallPayload,
} from "@/models/rainfallModel";

type Filters = Record<string, string>;

export class RainfallRepository {
  static async save(payload: RainfallPayload): Promise<RainfallPayload> {
    const response = await api.post<RainfallPayload>("/rainfall/", payload);
    return response.data;
  }

  static async getAll(): Promise<RainfallPayload[]> {
    const response = await api.get<RainfallPayload[]>("/rainfall");
    return response.data;
  }

  static async getStationOptions(): Promise<string[]> {
    const response = await api.get<string[]>("/station");
    return response.data;
  }

  static async getClimateScenarios(): Promise<string[]> {
    const response = await api.get<string[]>("/scenario");
    return response.data;
  }

  static async getPaginatedRainfallData(
    page = 1,
    limit = 10,
    filters: Filters = {}
  ): Promise<PaginatedResponse<RainfallPayload>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(limit),
    });

    for (const [key, value] of Object.entries(filters)) {
      if (value) params.append(key, value);
    }

    const response = await api.get<PaginatedResponse<RainfallPayload>>(
      `/rainfall?${params.toString()}`
    );
    return response.data;
  }

  static async getPaginatedDailyPivotRainfallData(
    page = 1,
    limit = 10,
    filters: Filters = {}
  ): Promise<PaginatedResponse<DailyPivotRainfallPayload>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(limit),
    });

    for (const [key, value] of Object.entries(filters)) {
      if (value) params.append(key, value);
    }

    const response = await api.get<
      PaginatedResponse<DailyPivotRainfallPayload>
    >(`/rainfall-pivot-daily?${params.toString()}`);
    console.log(response.data);
    return response.data;
  }

  static async getPaginatedMonthlyPivotRainfallData(
    page = 1,
    limit = 10,
    filters: Filters = {}
  ): Promise<PaginatedResponse<MonthlyPivotRainfallPayload>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(limit),
    });

    for (const [key, value] of Object.entries(filters)) {
      if (value) params.append(key, value);
    }

    const response = await api.get<
      PaginatedResponse<MonthlyPivotRainfallPayload>
    >(`/rainfall-pivot-monthly?${params.toString()}`);
    console.log(response.data);
    return response.data;
  }
}
