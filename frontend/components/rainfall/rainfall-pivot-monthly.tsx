"use client"

import { useEffect, useState, useCallback, useMemo } from "react"

import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { MonthlyPivotRainfallPayload } from "@/models/rainfallModel"
import { RainfallService } from "@/services/rainfallService"


const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station_code", label: "Station", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
  { key: "jan", label: "Jan", sortable: true },
  { key: "feb", label: "Feb", sortable: true },
  { key: "mar", label: "Mar", sortable: true },
  { key: "apr", label: "Apr", sortable: true },
  { key: "may", label: "May", sortable: true },
  { key: "jun", label: "Jun", sortable: true },
  { key: "jul", label: "Jul", sortable: true },
  { key: "aug", label: "Aug", sortable: true },
  { key: "sep", label: "Sep", sortable: true },
  { key: "oct", label: "Oct", sortable: true },
  { key: "nov", label: "Nov", sortable: true },
  { key: "dec", label: "Dec", sortable: true },
]

export function RainfallPivotMonthly() {
 const [activeTab, setActiveTab] = useState<"table" | "charts">("table")
  const [MonthlyPivotRainfallData, setMonthlyPivotRainfallData] = useState<MonthlyPivotRainfallPayload[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const limit = 10
  const [totalCount, setTotalCount] = useState(0)

  type FilterType = {
    key: string
    label: string
    options: string[]
  }

  const [filters, setFilters] = useState<FilterType[]>([
    { key: "climate_scenario", label: "Climate Scenario", options: [] },
    { key: "station", label: "Station", options: [] },
    {
      key: "year_measured",
      label: "Year",
      options: Array.from({ length: 55 }, (_, i) => String(1970 + i)),
    },
  ])

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  // Fetch rainfall data based on current page, limit, and filters
  const loadRainfallData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await RainfallService.getPaginatedMonthlyPivotRainfall(page, limit, activeFilters)
      setMonthlyPivotRainfallData(response.results)
      setTotalCount(response.count)
    } catch (err) {
      console.error("Failed to fetch rainfall data", err)
      setError("Failed to fetch rainfall data.")
    } finally {
      setLoading(false)
    }
  }, [page, limit, activeFilters])

  // Load filter options once on mount
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const [climateScenarios, stationOptions] = await Promise.all([
          RainfallService.getClimateScenarios(),
          RainfallService.getStationOptions(),
        ])

        setFilters((prevFilters) =>
          prevFilters.map((filter) => {
            if (filter.key === "climate_scenario") {
              return {
                ...filter,
                options: climateScenarios.map((s: any) => s.climate_scenario),
              }
            }
            if (filter.key === "station") {
              return {
                ...filter,
                options: stationOptions.map((s: any) => s.code),
              }
            }
            return filter
          })
        )
      } catch (err) {
        console.error("Failed to load filter options", err)
      }
    }
    loadFilterOptions()
  }, [])

  // Reload data when page or filters change
  useEffect(() => {
    loadRainfallData()
  }, [loadRainfallData])

  // Handle filter changes by resetting page and updating filters state
  const handleFilterChange = (updatedFilters: Record<string, string>) => {
    setPage(1)
    setActiveFilters(updatedFilters)
  }

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / limit)

  const handleExport = (format: string) => {
    console.log("Export rainfall pivot monthly data as:", format)
  }

  // Chart data - transform for monthly comparison
  const chartData = MonthlyPivotRainfallData.slice(0, 10).map((item) => ({
    day: item.month_day,
    Jan: item.jan,
    Feb: item.feb,
    Mar: item.mar,
    Apr: item.apr,
    May: item.may,
    Jun: item.jun,
    Jul: item.jul,
    Aug: item.aug,
    Sep: item.sep,
    Oct: item.oct,
    Nov: item.nov,
    Dec: item.dec
  }))
return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rainfall Pivot Monthly</h1>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-blue-500" />
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4">
            <DataTable
              data={MonthlyPivotRainfallData}
              columns={columns}
              title="Monthly Rainfall Pivot View"
              onExport={handleExport}
              filters={filters}
              onFilterChange={handleFilterChange}
              currentPage={page}
              itemsPerPage={limit}
              totalItems={totalCount}
              onPageChange={setPage}
              onItemsPerPageChange={() => {}} // Optional: implement if you want to allow changing items per page
              onSearch={() => {}} // Optional: implement search logic if needed
            />
          </TabsContent>
          <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Monthly Rainfall Pattern by Day</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Biharamulo" fill="#1f77b4" />
                    <Bar dataKey="Igabiro" fill="#ff7f0e" />
                    <Bar dataKey="Kaisho" fill="#2ca02c" />
                    <Bar dataKey="Kayanga" fill="#d62728" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
        </Tabs>
      )}
    </div>
  )
}