"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock data based on provided rainfall pivot monthly data
const rainfallPivotMonthlyData = [
  {
    id: "OBSERVED-Biharamulo-1970",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    jan: 176.1,
    feb: 172.2,
    mar: 152.3,
    apr: 266.4,
    may: 56.5,
    jun: 1.7,
    jul: 14.4,
    aug: 7.6,
    sep: 55.4,
    oct: 102.87,
    nov: 106.2,
    dec: 106,
  },
  {
    id: "OBSERVED-Biharamulo-1971",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1971,
    jan: 111.4,
    feb: 118.5,
    mar: 85.6,
    apr: 174.3,
    may: 47,
    jun: 0,
    jul: 7.8,
    aug: 52.2,
    sep: 35.8,
    oct: 64.8,
    nov: 124,
    dec: 89,
  },
  {
    id: "OBSERVED-Igabiro-1970",
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    year_measured: 1970,
    jan: 82.2,
    feb: 59.9,
    mar: 318.9,
    apr: 109.6,
    may: 135.3,
    jun: 0,
    jul: 0,
    aug: 30,
    sep: 63.2,
    oct: 70.2,
    nov: 122.4,
    dec: 81,
  },
  {
    id: "OBSERVED-Igabiro-1971",
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    year_measured: 1971,
    jan: 33.3,
    feb: 151.9,
    mar: 98.8,
    apr: 334.3,
    may: 184.7,
    jun: 4.6,
    jul: 37.3,
    aug: 60.3,
    sep: 35.2,
    oct: 74.1,
    nov: 140.6,
    dec: 58.8,
  },
  {
    id: "OBSERVED-Kaisho-1970",
    climate_scenario: "OBSERVED",
    station_code: "Kaisho",
    year_measured: 1970,
    jan: 88.5,
    feb: 41.2,
    mar: 203.2,
    apr: 194.7,
    may: 134.1,
    jun: 7.1,
    jul: 2.5,
    aug: 27.6,
    sep: 141.9,
    oct: 83,
    nov: 98,
    dec: 74.7,
  },
  {
    id: "OBSERVED-Kaisho-1971",
    climate_scenario: "OBSERVED",
    station_code: "Kaisho",
    year_measured: 1971,
    jan: 69,
    feb: 23.4,
    mar: 106.8,
    apr: 130.6,
    may: 106.2,
    jun: 0,
    jul: 3,
    aug: 55.2,
    sep: 128.9,
    oct: 59.6,
    nov: 153.9,
    dec: 20.8,
  },
  {
    id: "OBSERVED-Kayanga-1970",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1970,
    jan: 85,
    feb: 76.5,
    mar: 149.3,
    apr: 118.6,
    may: 127.9,
    jun: 28.8,
    jul: 21.9,
    aug: 55.5,
    sep: 51.8,
    oct: 95,
    nov: 65.6,
    dec: 84,
  },
  {
    id: "OBSERVED-Kayanga-1971",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1971,
    jan: 90.5,
    feb: 88.7,
    mar: 113.1,
    apr: 241,
    may: 59.5,
    jun: 0,
    jul: 13.4,
    aug: 105.1,
    sep: 59.2,
    oct: 90.8,
    nov: 112.9,
    dec: 103.2,
  },
]

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

// Chart data - transform for comparison
const chartData = [
  { month: "Jan", Biharamulo: 176.1, Igabiro: 82.2, Kaisho: 88.5, Kayanga: 85 },
  { month: "Feb", Biharamulo: 172.2, Igabiro: 59.9, Kaisho: 41.2, Kayanga: 76.5 },
  { month: "Mar", Biharamulo: 152.3, Igabiro: 318.9, Kaisho: 203.2, Kayanga: 149.3 },
  { month: "Apr", Biharamulo: 266.4, Igabiro: 109.6, Kaisho: 194.7, Kayanga: 118.6 },
  { month: "May", Biharamulo: 56.5, Igabiro: 135.3, Kaisho: 134.1, Kayanga: 127.9 },
  { month: "Jun", Biharamulo: 1.7, Igabiro: 0, Kaisho: 7.1, Kayanga: 28.8 },
  { month: "Jul", Biharamulo: 14.4, Igabiro: 0, Kaisho: 2.5, Kayanga: 21.9 },
  { month: "Aug", Biharamulo: 7.6, Igabiro: 30, Kaisho: 27.6, Kayanga: 55.5 },
  { month: "Sep", Biharamulo: 55.4, Igabiro: 63.2, Kaisho: 141.9, Kayanga: 51.8 },
  { month: "Oct", Biharamulo: 102.87, Igabiro: 70.2, Kaisho: 83, Kayanga: 95 },
  { month: "Nov", Biharamulo: 106.2, Igabiro: 122.4, Kaisho: 98, Kayanga: 65.6 },
  { month: "Dec", Biharamulo: 106, Igabiro: 81, Kaisho: 74.7, Kayanga: 84 },
]

export function RainfallPivotMonthly() {
  const [activeTab, setActiveTab] = useState("table")

  const handleExport = (format: string) => {
    console.log("Export rainfall pivot monthly data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rainfall Pivot Monthly</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={rainfallPivotMonthlyData}
            columns={columns}
            title="Monthly Rainfall Pivot View"
            onExport={handleExport}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Monthly Rainfall Comparison (1970)</h3>
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
    </div>
  )
}
