"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock temperature pivot daily data (generated based on the pattern)
const temperaturePivotDailyData = [
  {
    id: "temp-daily-1",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1973,
    month_day: 1,
    jan_min: 11.5,
    jan_max: 28.7,
    feb_min: 12.2,
    feb_max: 29.1,
    mar_min: 13.8,
    mar_max: 30.2,
    apr_min: 15.1,
    apr_max: 28.9,
    may_min: 14.7,
    may_max: 27.8,
    jun_min: 12.9,
    jun_max: 26.5,
  },
  {
    id: "temp-daily-2",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1973,
    month_day: 2,
    jan_min: 12.7,
    jan_max: 28.4,
    feb_min: 13.1,
    feb_max: 28.8,
    mar_min: 14.2,
    mar_max: 29.9,
    apr_min: 15.8,
    apr_max: 29.2,
    may_min: 15.1,
    may_max: 28.1,
    jun_min: 13.2,
    jun_max: 26.8,
  },
  {
    id: "temp-daily-3",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1973,
    month_day: 3,
    jan_min: 11.7,
    jan_max: 26.3,
    feb_min: 12.8,
    feb_max: 27.9,
    mar_min: 13.9,
    mar_max: 29.1,
    apr_min: 15.2,
    apr_max: 28.6,
    may_min: 14.8,
    may_max: 27.5,
    jun_min: 13.0,
    jun_max: 26.2,
  },
  {
    id: "temp-daily-4",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1973,
    month_day: 4,
    jan_min: 11.3,
    jan_max: 29.4,
    feb_min: 12.5,
    feb_max: 29.8,
    mar_min: 14.1,
    mar_max: 30.5,
    apr_min: 15.6,
    apr_max: 29.1,
    may_min: 15.0,
    may_max: 28.3,
    jun_min: 13.1,
    jun_max: 26.9,
  },
  {
    id: "temp-daily-5",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1973,
    month_day: 5,
    jan_min: 12.1,
    jan_max: 28.3,
    feb_min: 13.0,
    feb_max: 28.7,
    mar_min: 14.3,
    mar_max: 29.8,
    apr_min: 15.4,
    apr_max: 28.8,
    may_min: 14.9,
    may_max: 27.9,
    jun_min: 12.8,
    jun_max: 26.4,
  },
  {
    id: "temp-daily-6",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1973,
    month_day: 1,
    jan_min: 13.94,
    jan_max: 17.47,
    feb_min: 14.2,
    feb_max: 18.1,
    mar_min: 15.1,
    mar_max: 19.2,
    apr_min: 16.0,
    apr_max: 20.1,
    may_min: 15.8,
    may_max: 19.8,
    jun_min: 14.5,
    jun_max: 18.5,
  },
  {
    id: "temp-daily-7",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1973,
    month_day: 2,
    jan_min: 12.39,
    jan_max: 19.48,
    feb_min: 13.1,
    feb_max: 20.2,
    mar_min: 14.8,
    mar_max: 21.1,
    apr_min: 15.7,
    apr_max: 21.8,
    may_min: 15.4,
    may_max: 21.2,
    jun_min: 14.1,
    jun_max: 19.9,
  },
  {
    id: "temp-daily-8",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1973,
    month_day: 3,
    jan_min: 14.61,
    jan_max: 20.44,
    feb_min: 14.9,
    feb_max: 21.1,
    mar_min: 15.6,
    mar_max: 22.0,
    apr_min: 16.3,
    apr_max: 22.5,
    may_min: 16.0,
    may_max: 21.9,
    jun_min: 14.8,
    jun_max: 20.6,
  },
]

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station_code", label: "Station", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
  { key: "month_day", label: "Day", sortable: true },
  { key: "jan_min", label: "Jan Min", sortable: true },
  { key: "jan_max", label: "Jan Max", sortable: true },
  { key: "feb_min", label: "Feb Min", sortable: true },
  { key: "feb_max", label: "Feb Max", sortable: true },
  { key: "mar_min", label: "Mar Min", sortable: true },
  { key: "mar_max", label: "Mar Max", sortable: true },
  { key: "apr_min", label: "Apr Min", sortable: true },
  { key: "apr_max", label: "Apr Max", sortable: true },
  { key: "may_min", label: "May Min", sortable: true },
  { key: "may_max", label: "May Max", sortable: true },
  { key: "jun_min", label: "Jun Min", sortable: true },
  { key: "jun_max", label: "Jun Max", sortable: true },
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

// Chart data for Biharamulo station
const chartData = temperaturePivotDailyData
  .filter((item) => item.station_code === "Biharamulo")
  .map((item) => ({
    day: item.month_day,
    "Jan Min": item.jan_min,
    "Jan Max": item.jan_max,
    "Feb Min": item.feb_min,
    "Feb Max": item.feb_max,
    "Mar Min": item.mar_min,
    "Mar Max": item.mar_max,
  }))

export function TemperaturePivotDaily() {
  const [activeTab, setActiveTab] = useState("table")

  const handleExport = (format: string) => {
    console.log("Export temperature pivot daily data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Temperature Pivot Daily</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={temperaturePivotDailyData}
            columns={columns}
            title="Daily Temperature Pivot View"
            onExport={handleExport}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Daily Temperature Range by Month (Biharamulo 1973)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Jan Min" stroke="#1f77b4" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Jan Max" stroke="#1f77b4" />
                  <Line type="monotone" dataKey="Feb Min" stroke="#ff7f0e" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Feb Max" stroke="#ff7f0e" />
                  <Line type="monotone" dataKey="Mar Min" stroke="#2ca02c" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Mar Max" stroke="#2ca02c" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
