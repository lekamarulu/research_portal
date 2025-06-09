"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { DataTable } from "@/components/data-table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { AddRainfallDialog } from "./add-rainfall-dialog"
import { RainfallService } from "@/services/rainfallService"
import { RainfallPayload } from "@/models/rainfallModel"

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station", label: "Station", sortable: true },
  { key: "date_measured", label: "Date", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
  { key: "month_name", label: "Month", sortable: true },
  { key: "month_day", label: "Day", sortable: true },
  { key: "rainfall_total", label: "Rainfall (mm)", sortable: true },
]

export function RainfallDetail() {
  const [activeTab, setActiveTab] = useState<"table" | "charts">("table")
  const [rainfallData, setRainfallData] = useState<RainfallPayload[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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
      const response = await RainfallService.getPaginatedRainfallData(page, limit, activeFilters)
      setRainfallData(response.results)
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

  // Example placeholders for handlers - replace with your actual logic
  const handleAdd = () => setDialogOpen(true)
  const handleEdit = (item: RainfallPayload) => {
    console.log("Edit", item)
    // implement edit logic
  }
  const handleDelete = (item: RainfallPayload) => {
    console.log("Delete", item)
    // implement delete logic
  }
  const handleImport = () => {
    console.log("Import clicked")
    // implement import logic
  }
  const handleExport = (format: string) => {
    console.log("Export as", format)
    // implement export logic
  }

  // Prepare chart data: group by date and station for daily rainfall sums
  const chartData = useMemo(() => {
    // Aggregate rainfall by date for stations Kayanga and Biharamulo
    const dataMap: Record<string, { date: string; Kayanga: number; Biharamulo: number }> = {}

    rainfallData.forEach((item) => {
      const date = item.date_measured
      if (!date) return
      if (!dataMap[date]) {
        dataMap[date] = { date, Kayanga: 0, Biharamulo: 0 }
      }
      if (item.station === "Kayanga") {
        dataMap[date].Kayanga += Number(item.rainfall_total) || 0
      } else if (item.station === "Biharamulo") {
        dataMap[date].Biharamulo += Number(item.rainfall_total) || 0
      }
    })

    // Return array sorted by date descending
    return Object.values(dataMap).sort((a, b) => b.date.localeCompare(a.date))
  }, [rainfallData])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rainfall Detail</h1>
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
              data={rainfallData}
              columns={columns}
              title="Rainfall Measurements"
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onImport={handleImport}
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
            <AddRainfallDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSuccess={loadRainfallData}
            />
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Daily Rainfall Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Kayanga" fill="#3b82f6" name="Kayanga" />
                  <Bar dataKey="Biharamulo" fill="#ef4444" name="Biharamulo" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
