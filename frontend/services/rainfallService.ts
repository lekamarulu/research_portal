import {
  RainfallPayload,
  PaginatedResponse,
  DailyPivotRainfallPayload,
  MonthlyPivotRainfallPayload,
} from "@/models/rainfallModel";
import { RainfallRepository } from "@/repository/rainfallRepository";

type Filters = Record<string, string>;

export class RainfallService {
  /**
   * Save new rainfall data
   */
  static async save(payload: RainfallPayload): Promise<RainfallPayload> {
    return RainfallRepository.save(payload);
  }

  /**
   * Get all rainfall data (non-paginated)
   */
  static async getAll(): Promise<RainfallPayload[]> {
    return RainfallRepository.getAll();
  }

  /**
   * Get paginated rainfall data with optional filters
   */
  static async getPaginatedRainfallData(
    page = 1,
    limit = 10,
    filters: Filters = {}
  ): Promise<PaginatedResponse<RainfallPayload>> {
    return RainfallRepository.getPaginatedRainfallData(page, limit, filters);
  }

  /**
   * Get list of station codes for filter dropdowns
   */
  static async getStationOptions(): Promise<string[]> {
    return RainfallRepository.getStationOptions();
  }

  /**
   * Get list of climate scenario options for filters
   */
  static async getClimateScenarios(): Promise<string[]> {
    return RainfallRepository.getClimateScenarios();
  }

  /**
   * Get paginated rainfall data with optional filters
   */
  static async getPaginatedDailyPivotRainfall(
    page = 1,
    limit = 10,
    filters: Filters = {}
  ): Promise<PaginatedResponse<DailyPivotRainfallPayload>> {
    return RainfallRepository.getPaginatedDailyPivotRainfallData(
      page,
      limit,
      filters
    );
  }

  /**
   * Get paginated rainfall data with optional filters
   */
  static async getPaginatedMonthlyPivotRainfall(
    page = 1,
    limit = 10,
    filters: Filters = {}
  ): Promise<PaginatedResponse<MonthlyPivotRainfallPayload>> {
    return RainfallRepository.getPaginatedMonthlyPivotRainfallData(
      page,
      limit,
      filters
    );
  }
}
