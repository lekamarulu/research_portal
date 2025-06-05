"use client"

import { useState, useMemo } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
} from "recharts"

// Mock SPI data based on the CSV structure
const spiData = [
  {
    id: 1,
    climate_scenario: "SSP585",
    year_measured: 2100,
    period_range: 12,
    year_range: "2099 - 2100",
    spi: 0.34,
  },
  {
    id: 2,
    climate_scenario: "SSP585",
    year_measured: 2099,
    period_range: 6,
    year_range: "2098 - 2099",
    spi: -0.12,
  },
  {
    id: 3,
    climate_scenario: "SSP585",
    year_measured: 2098,
    period_range: 12,
    year_range: "2097 - 2098",
    spi: 1.23,
  },
  {
    id: 4,
    climate_scenario: "SSP585",
    year_measured: 2097,
    period_range: 3,
    year_range: "2096 - 2097",
    spi: -1.45,
  },
  {
    id: 5,
    climate_scenario: "SSP585",
    year_measured: 2096,
    period_range: 12,
    year_range: "2095 - 2096",
    spi: 0.78,
  },
  {
    id: 6,
    climate_scenario: "SSP245",
    year_measured: 2100,
    period_range: 6,
    year_range: "2099 - 2100",
    spi: -0.56,
  },
  {
    id: 7,
    climate_scenario: "SSP245",
    year_measured: 2099,
    period_range: 12,
    year_range: "2098 - 2099",
    spi: 0.89,
  },
  {
    id: 8,
    climate_scenario: "SSP245",
    year_measured: 2098,
    period_range: 3,
    year_range: "2097 - 2098",
    spi: -0.23,
  },
  {
    id: 9,
    climate_scenario: "SSP245",
    year_measured: 2097,
    period_range: 12,
    year_range: "2096 - 2097",
    spi: 1.67,
  },
  {
    id: 10,
    climate_scenario: "SSP245",
    year_measured: 2096,
    period_range: 6,
    year_range: "2095 - 2096",
    spi: -0.34,
  },
  {
    id: 11,
    climate_scenario: "SSP126",
    year_measured: 2100,
    period_range: 12,
    year_range: "2099 - 2100",
    spi: 0.12,
  },
  {
    id: 12,
    climate_scenario: "SSP126",
    year_measured: 2099,
    period_range: 3,
    year_range: "2098 - 2099",
    spi: -0.78,
  },
  {
    id: 13,
    climate_scenario: "SSP126",
    year_measured: 2098,
    period_range: 12,
    year_range: "2097 - 2098",
    spi: 0.45,
  },
  {
    id: 14,
    climate_scenario: "SSP126",
    year_measured: 2097,
    period_range: 6,
    year_range: "2096 - 2097",
    spi: -1.12,
  },
  {
    id: 15,
    climate_scenario: "SSP126",
    year_measured: 2096,
    period_range: 12,
    year_range: "2095 - 2096",
    spi: 1.89,
  },
  {
    id: 16,
    climate_scenario: "OBSERVED",
    year_measured: 2024,
    period_range: 12,
    year_range: "2023 - 2024",
    spi: -0.67,
  },
  {
    id: 17,
    climate_scenario: "OBSERVED",
    year_measured: 2023,
    period_range: 6,
    year_range: "2022 - 2023",
    spi: 0.23,
  },
  {
    id: 18,
    climate_scenario: "OBSERVED",
    year_measured: 2022,
    period_range: 12,
    year_range: "2021 - 2022",
    spi: 1.34,
  },
  {
    id: 19,
    climate_scenario: "OBSERVED",
    year_measured: 2021,
    period_range: 3,
    year_range: "2020 - 2021",
    spi: -0.89,
  },
  {
    id: 20,
    climate_scenario: "OBSERVED",
    year_measured: 2020,
    period_range: 12,
    year_range: "2019 - 2020",
    spi: 0.56,
  },
]

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "year_measured", label: "Year Measured", sortable: true },
  { key: "period_range", label: "Period Range", sortable: true },
  { key: "year_range", label: "Year Range", sortable: true },
  { key: "spi", label: "SPI", sortable: true },
]

const filters = [
  {
    key: "climate_scenario",
    label: "Climate Scenario",
    options: ["OBSERVED", "SSP126", "SSP245", "SSP370", "SSP585"],
  },
  {
    key: "year_measured",
    label: "Year Measured",
    options: Array.from({ length: 81 }, (_, i) => String(2020 + i)), // 2020-2100
  },
  {
    key: "period_range",
    label: "Period Range (months)",
    options: ["3", "6", "12", "24"],
  },
]

export function SPIAnalysis() {
  const [activeTab, setActiveTab] = useState("table")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  // Filter data based on active filters
  const filteredData = useMemo(() => {
    return spiData.filter((item) => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true
        return String(item[key as keyof typeof item]) === value
      })
    })
  }, [activeFilters])

  // Chart data preparations using filtered data
  const timeSeriesData = useMemo(() => {
    return filteredData
      .sort((a, b) => a.year_measured - b.year_measured)
      .map((item) => ({
        year: item.year_measured,
        spi: item.spi,
        scenario: item.climate_scenario,
        period: item.period_range,
      }))
  }, [filteredData])

  const scenarioComparison = useMemo(() => {
    return filteredData
      .reduce((acc, item) => {
        const existing = acc.find((d) => d.year === item.year_measured)
        if (existing) {
          existing[item.climate_scenario] = item.spi
        } else {
          acc.push({
            year: item.year_measured,
            [item.climate_scenario]: item.spi,
          })
        }
        return acc
      }, [] as any[])
      .sort((a, b) => a.year - b.year)
  }, [filteredData])

  // SPI classification data using filtered data
  const spiClassification = useMemo(() => {
    return filteredData.map((item) => {
      let category = ""
      let color = ""
      if (item.spi >= 2.0) {
        category = "Extremely Wet"
        color = "#1e40af"
      } else if (item.spi >= 1.5) {
        category = "Very Wet"
        color = "#3b82f6"
      } else if (item.spi >= 1.0) {
        category = "Moderately Wet"
        color = "#60a5fa"
      } else if (item.spi >= -1.0) {
        category = "Near Normal"
        color = "#22c55e"
      } else if (item.spi >= -1.5) {
        category = "Moderately Dry"
        color = "#f59e0b"
      } else if (item.spi >= -2.0) {
        category = "Very Dry"
        color = "#ef4444"
      } else {
        category = "Extremely Dry"
        color = "#dc2626"
      }

      return {
        ...item,
        category,
        color,
      }
    })
  }, [filteredData])

  // Distribution data using filtered data
  const distributionData = useMemo(() => {
    return [
      {
        category: "Extremely Wet (≥2.0)",
        count: spiClassification.filter((d) => d.spi >= 2.0).length,
        color: "#1e40af",
      },
      {
        category: "Very Wet (1.5-2.0)",
        count: spiClassification.filter((d) => d.spi >= 1.5 && d.spi < 2.0).length,
        color: "#3b82f6",
      },
      {
        category: "Moderately Wet (1.0-1.5)",
        count: spiClassification.filter((d) => d.spi >= 1.0 && d.spi < 1.5).length,
        color: "#60a5fa",
      },
      {
        category: "Near Normal (-1.0-1.0)",
        count: spiClassification.filter((d) => d.spi >= -1.0 && d.spi < 1.0).length,
        color: "#22c55e",
      },
      {
        category: "Moderately Dry (-1.5--1.0)",
        count: spiClassification.filter((d) => d.spi >= -1.5 && d.spi < -1.0).length,
        color: "#f59e0b",
      },
      {
        category: "Very Dry (-2.0--1.5)",
        count: spiClassification.filter((d) => d.spi >= -2.0 && d.spi < -1.5).length,
        color: "#ef4444",
      },
      {
        category: "Extremely Dry (<-2.0)",
        count: spiClassification.filter((d) => d.spi < -2.0).length,
        color: "#dc2626",
      },
    ]
  }, [spiClassification])

  const handleAdd = () => {
    console.log("Add new SPI record")
  }

  const handleEdit = (item: any) => {
    console.log("Edit SPI record:", item)
  }

  const handleDelete = (item: any) => {
    console.log("Delete SPI record:", item)
  }

  const handleImport = () => {
    console.log("Import SPI data")
  }

  const handleExport = (format: string) => {
    console.log("Export SPI data as:", format)
  }

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setActiveFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SPI Analysis</h1>
          <p className="text-sm text-gray-600 mt-1">Standard Precipitation Index - Drought and Wetness Assessment</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="charts">Charts & Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={filteredData}
            columns={columns}
            title="Standard Precipitation Index (SPI) Data"
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onImport={handleImport}
            onExport={handleExport}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          {/* Active Filters Display */}
          {Object.keys(activeFilters).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([key, value]) => {
                    if (!value) return null
                    const filterLabel = filters.find((f) => f.key === key)?.label || key
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {filterLabel}: {value}
                      </span>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total SPI Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredData.length}</div>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(activeFilters).length > 0 ? "Filtered results" : "Across all scenarios"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average SPI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredData.length > 0
                    ? (filteredData.reduce((sum, item) => sum + item.spi, 0) / filteredData.length).toFixed(2)
                    : "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">Overall mean</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drought Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {filteredData.filter((item) => item.spi < -1.0).length}
                </div>
                <p className="text-xs text-muted-foreground">SPI {"<"} -1.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wet Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredData.filter((item) => item.spi > 1.0).length}
                </div>
                <p className="text-xs text-muted-foreground">SPI {">"} 1.0</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SPI Time Series by Climate Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scenarioComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[-3, 3]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="OBSERVED" stroke="#22c55e" name="Observed" strokeWidth={2} />
                    <Line type="monotone" dataKey="SSP126" stroke="#3b82f6" name="SSP1-2.6" strokeWidth={2} />
                    <Line type="monotone" dataKey="SSP245" stroke="#f59e0b" name="SSP2-4.5" strokeWidth={2} />
                    <Line type="monotone" dataKey="SSP585" stroke="#ef4444" name="SSP5-8.5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SPI Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={distributionData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill={(entry) => entry.color} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SPI Scatter Plot - All Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[-3, 3]} />
                    <Tooltip />
                    <Scatter dataKey="spi" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SPI Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={scenarioComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[-3, 3]} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="SSP585"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="SSP245"
                      stackId="2"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="SSP126"
                      stackId="3"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* SPI Classification Guide */}
          <Card>
            <CardHeader>
              <CardTitle>SPI Classification Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-900">Wet Conditions</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-900 rounded"></div>
                      <span>Extremely Wet: SPI ≥ 2.0</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span>Very Wet: 1.5 ≤ SPI {"<"} 2.0</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-400 rounded"></div>
                      <span>Moderately Wet: 1.0 ≤ SPI {"<"} 1.5</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-900">Normal Conditions</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Near Normal: -1.0 ≤ SPI {"<"} 1.0</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-900">Dry Conditions</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span>Moderately Dry: -1.5 ≤ SPI {"<"} -1.0</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Very Dry: -2.0 ≤ SPI {"<"} -1.5</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-700 rounded"></div>
                      <span>Extremely Dry: SPI {"<"} -2.0</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Applications</h4>
                  <div className="text-sm text-gray-600">
                    <p>• Drought monitoring</p>
                    <p>• Water resource planning</p>
                    <p>• Agricultural planning</p>
                    <p>• Climate impact assessment</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
