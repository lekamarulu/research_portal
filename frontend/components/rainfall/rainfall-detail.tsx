"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data based on provided rainfall data
const rainfallData = [
  {
    id: 1,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-01",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 1,
    rainfall_total: 0,
  },
  {
    id: 7,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1970-01-01",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 1,
    rainfall_total: 5.1,
  },
  {
    id: 12,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-02",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 2,
    rainfall_total: 0,
  },
  {
    id: 18,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1970-01-02",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 2,
    rainfall_total: 0,
  },
  {
    id: 23,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-03",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 3,
    rainfall_total: 0,
  },
  {
    id: 29,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1970-01-03",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 3,
    rainfall_total: 0,
  },
  {
    id: 34,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-04",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 4,
    rainfall_total: 0,
  },
  {
    id: 40,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1970-01-04",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 4,
    rainfall_total: 0,
  },
  {
    id: 45,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-05",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 5,
    rainfall_total: 0.5,
  },
  {
    id: 51,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1970-01-05",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 5,
    rainfall_total: 8.6,
  },
  {
    id: 56,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-06",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 6,
    rainfall_total: 10.3,
  },
  {
    id: 62,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1970-01-06",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 6,
    rainfall_total: 44.9,
  },
  {
    id: 67,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-07",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 7,
    rainfall_total: 0,
  },
  {
    id: 73,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1970-01-07",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 7,
    rainfall_total: 0,
  },
  {
    id: 78,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-08",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 8,
    rainfall_total: 2,
  },
  {
    id: 84,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1970-01-08",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 8,
    rainfall_total: 9.6,
  },
  {
    id: 89,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1970-01-09",
    year_measured: 1970,
    month_measured: 1,
    month_name: "JAN",
    month_day: 9,
    rainfall_total: 0.7,
  },
]

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station_code", label: "Station", sortable: true },
  { key: "date_measured", label: "Date", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
  { key: "month_name", label: "Month", sortable: true },
  { key: "month_day", label: "Day", sortable: true },
  { key: "rainfall_total", label: "Rainfall (mm)", sortable: true },
]

const filters = [
  {
    key: "climate_scenario",
    label: "Climate Scenario",
    options: ["OBSERVED", "SSP126", "SSP245", "SSP370", "SSP585"],
  },
  {
    key: "station_code",
    label: "Station",
    options: [
      "Biharamulo",
      "Bukoba",
      "Igabiro",
      "Izigo",
      "Kaisho",
      "Kayanga",
      "Kishanda",
      "Kyakakera",
      "Ngara",
      "Rubya",
      "Rulenge",
    ],
  },
  {
    key: "year_measured",
    label: "Year",
    options: Array.from({ length: 55 }, (_, i) => String(1970 + i)),
  },
]

// Chart data
const chartData = rainfallData.reduce((acc, item) => {
  const existing = acc.find((d) => d.date === item.date_measured)
  if (existing) {
    existing[item.station_code] = item.rainfall_total
  } else {
    acc.push({
      date: item.date_measured,
      [item.station_code]: item.rainfall_total,
    })
  }
  return acc
}, [] as any[])

export function RainfallDetail() {
  const [activeTab, setActiveTab] = useState("table")

  const handleAdd = () => {
    console.log("Add new rainfall record")
  }

  const handleEdit = (item: any) => {
    console.log("Edit rainfall record:", item)
  }

  const handleDelete = (item: any) => {
    console.log("Delete rainfall record:", item)
  }

  const handleImport = () => {
    console.log("Import rainfall data")
  }

  const handleExport = (format: string) => {
    console.log("Export rainfall data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rainfall Detail</h1>
      </div>

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
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
