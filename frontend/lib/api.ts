import { API_CONFIG, buildApiUrl } from "./config"

/**
 * API service for Research Portal data
 */
export const researchPortalApi = {
  /**
   * Fetch rainfall data with optional filters
   */
  async getRainfallData(params: { scenario?: string; station?: string; year?: string }) {
    const url = buildApiUrl(API_CONFIG.endpoints.rainfall, params)

    const response = await fetch(url, API_CONFIG.defaultOptions)

    if (!response.ok) {
      throw new Error(`Rainfall API error: ${response.status}`)
    }

    const result = await response.json()
    return result.data || result // Handle both {data: [...]} and direct array response
  },

    /**
   * Fetch rainfall data with optional filters
   */
  async getStationMonthlyRainfallData(params: { scenario?: string; station?: string; year?: string }) {
    const url = buildApiUrl(API_CONFIG.endpoints.rainfall, params)

    const response = await fetch(url, API_CONFIG.defaultOptions)

    if (!response.ok) {
      throw new Error(`Rainfall API error: ${response.status}`)
    }

    const result = await response.json()
    return result.data || result // Handle both {data: [...]} and direct array response
  },

  /**
   * Fetch all stations
   */
  async getStations() {
    const url = buildApiUrl(API_CONFIG.endpoints.stations)

    const response = await fetch(url, API_CONFIG.defaultOptions)

    if (!response.ok) {
      throw new Error(`Stations API error: ${response.status}`)
    }

    const result = await response.json()
    console.log(result.data)
    return result.data || result // Handle both {data: [...]} and direct array response
  },


  /**
   * Fetch all years
   */
  async getYears() {
    const url = buildApiUrl(API_CONFIG.endpoints.years)

    const response = await fetch(url, API_CONFIG.defaultOptions)

    if (!response.ok) {
      throw new Error(`Years API error: ${response.status}`)
    }

    const result = await response.json()
    console.log(result.data)
    return result.data || result // Handle both {data: [...]} and direct array response
  },



  /**
   * Fetch all climate scenarios
   */
  async getClimateScenarios() {
    const url = buildApiUrl(API_CONFIG.endpoints.climate_scenarios)

    const response = await fetch(url, API_CONFIG.defaultOptions)

    if (!response.ok) {
      throw new Error(`Climate scenario API error: ${response.status}`)
    }

    const result = await response.json()
    console.log(result.data)
    return result.data || result // Handle both {data: [...]} and direct array response
  },

  /**
   * Fetch a specific station by code
   */
  async getStationByCode(code: string) {
    const url = buildApiUrl(`${API_CONFIG.endpoints.stations}/${code}`)

    const response = await fetch(url, API_CONFIG.defaultOptions)

    if (!response.ok) {
      throw new Error(`Station API error: ${response.status}`)
    }

    const result = await response.json()
    return result.data || result
  },
}
