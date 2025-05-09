/**
 * Application configuration
 * This file contains environment-specific configuration values
 */

// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  baseUrl: "http://127.0.0.1:8080/api",

  // API endpoints
  endpoints: {
    years: "/years",
    stations: "/stations",
    rainfall: "/rainfall-monthly-pivot",
    climate_scenarios: "/climate_scenarios"
  },

  // Request options
  defaultOptions: {
    next: { revalidate: 0 }, // Disable caching by default
  } as RequestInit & { next?: { revalidate: number } },
}

/**
 * Helper function to build API URLs
 * @param endpoint - The API endpoint path
 * @param queryParams - Optional query parameters
 * @returns Full API URL with query parameters
 */
export function buildApiUrl(endpoint: string, queryParams?: Record<string, string>): string {
  const url = `${API_CONFIG.baseUrl}${endpoint}`

  if (!queryParams) return url

  const params = new URLSearchParams()
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) params.append(key, value)
  })

  return `${url}${params.toString() ? "?" + params.toString() : ""}`
}
