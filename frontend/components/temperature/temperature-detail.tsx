"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock data based on provided temperature data
const temperatureData = [
  {
    id: 1,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-01",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 1,
    minimum: 11.5,
    maximum: 28.7,
  },
  {
    id: 2,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-02",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 2,
    minimum: 12.7,
    maximum: 28.4,
  },
  {
    id: 3,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-03",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 3,
    minimum: 11.7,
    maximum: 26.3,
  },
  {
    id: 4,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-04",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 4,
    minimum: 11.3,
    maximum: 29.4,
  },
  {
    id: 5,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-05",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 5,
    minimum: 12.1,
    maximum: 28.3,
  },
  {
    id: 6,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-06",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 6,
    minimum: 13.1,
    maximum: 29.4,
  },
  {
    id: 7,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-07",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 7,
    minimum: 15.7,
    maximum: 22.3,
  },
  {
    id: 8,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-08",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 8,
    minimum: 15.8,
    maximum: 24.7,
  },
  {
    id: 9,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-09",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 9,
    minimum: 12.7,
    maximum: 26,
  },
  {
    id: 10,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1973-01-10",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 10,
    minimum: 13.5,
    maximum: 26.6,
  },
  {
    id: 11,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1973-01-01",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 1,
    minimum: 13.94,
    maximum: 17.47,
  },
  {
    id: 12,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1973-01-02",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 2,
    minimum: 12.39,
    maximum: 19.48,
  },
  {
    id: 13,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1973-01-03",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 3,
    minimum: 14.61,
    maximum: 20.44,
  },
  {
    id: 14,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1973-01-04",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 4,
    minimum: 15.08,
    maximum: 21.31,
  },
  {
    id: 15,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1973-01-05",
    year_measured: 1973,
    month_measured: 1,
    month_name: "JAN",
    month_day: 5,
    minimum: 15.95,
    maximum: 20.83,
  },
]

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station_code", label: "Station", sortable: true },
  { key: "date_measured", label: "Date", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
  { key: "month_name", label: "Month", sortable: true },
  { key: "month_day", label: "Day", sortable: true },
  { key: "minimum", label: "Min Temp (°C)", sortable: true },
  { key: "maximum", label: "Max Temp (°C)", sortable: true },
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
const chartData = temperatureData.map((item) => ({
  date: item.date_measured,
  station: item.station_code,
  minimum: item.minimum,
  maximum: item.maximum,
  day: item.month_day,
}))

export function TemperatureDetail() {
  const [activeTab, setActiveTab] = useState("table")

  const handleAdd = () => {
    console.log("Add new temperature record")
  }

  const handleEdit = (item: any) => {
    console.log("Edit temperature record:", item)
  }

  const handleDelete = (item: any) => {
    console.log("Delete temperature record:", item)
  }

  const handleImport = () => {
    console.log("Import temperature data")
  }

  const handleExport = (format: string) => {
    console.log("Export temperature data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Temperature Detail</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={temperatureData}
            columns={columns}
            title="Temperature Measurements"
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
              <h3 className="text-lg font-semibold mb-4">Daily Temperature Range</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="minimum" stroke="#3b82f6" name="Min Temperature" />
                  <Line type="monotone" dataKey="maximum" stroke="#ef4444" name="Max Temperature" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
