"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock data based on provided rainfall pivot daily data
const rainfallPivotDailyData = [
  {
    id: "d05a11a869685c78ea7d5c90c13484b6",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 1,
    jan: 5.1,
    feb: 0,
    mar: 0,
    apr: 10.5,
    may: 14.5,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 44.2,
  },
  {
    id: "d51129cc1b58ef358258e8a5800a7656",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 2,
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 22.86,
    nov: 2.1,
    dec: 0,
  },
  {
    id: "dbfc4ed9ec795e383e365904701e4edb",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 3,
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 42.5,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 3.81,
    nov: 7.7,
    dec: 0,
  },
  {
    id: "71b0ac3928938751bd5deff0d7e5ee53",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 4,
    jan: 0,
    feb: 3.81,
    mar: 0,
    apr: 15.4,
    may: 13.4,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 3,
    dec: 0.8,
  },
  {
    id: "993842e267de983fca98ba76826e5304",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 5,
    jan: 8.6,
    feb: 0,
    mar: 0,
    apr: 17.3,
    may: 0.2,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 1.3,
    oct: 0,
    nov: 7.5,
    dec: 0,
  },
  {
    id: "cf4a2eb5457f3da1bee71bf9fbd1a048",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 6,
    jan: 44.9,
    feb: 0,
    mar: 0,
    apr: 18.8,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0.1,
    oct: 0,
    nov: 0,
    dec: 0.1,
  },
  {
    id: "b1e2992caa757811998c52c682e34475",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 7,
    jan: 0,
    feb: 0,
    mar: 9.4,
    apr: 4.5,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0.1,
    oct: 0,
    nov: 1.4,
    dec: 2.2,
  },
  {
    id: "d0313f501bccd33d5d82932932c519bb",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 8,
    jan: 9.6,
    feb: 0,
    mar: 1.8,
    apr: 12,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0.4,
    dec: 0,
  },
  {
    id: "d78377900e1fb0c0520265f21078f427",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 9,
    jan: 0.7,
    feb: 0,
    mar: 20.6,
    apr: 24.1,
    may: 13.8,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 0,
  },
  {
    id: "2c6cb5b7b76041d2b8233b7285595335",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1970,
    month_day: 10,
    jan: 0,
    feb: 0,
    mar: 2.3,
    apr: 1.6,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 1.2,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 11.9,
  },
]

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station_code", label: "Station", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
  { key: "month_day", label: "Day", sortable: true },
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

// Chart data - transform for monthly comparison
const chartData = rainfallPivotDailyData.slice(0, 10).map((item) => ({
  day: item.month_day,
  Jan: item.jan,
  Feb: item.feb,
  Mar: item.mar,
  Apr: item.apr,
  May: item.may,
  Jun: item.jun,
}))

export function RainfallPivotDaily() {
  const [activeTab, setActiveTab] = useState("table")

  const handleExport = (format: string) => {
    console.log("Export rainfall pivot daily data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rainfall Pivot Daily</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={rainfallPivotDailyData}
            columns={columns}
            title="Daily Rainfall Pivot View"
            onExport={handleExport}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Monthly Rainfall Pattern by Day</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Jan" stroke="#1f77b4" />
                  <Line type="monotone" dataKey="Feb" stroke="#ff7f0e" />
                  <Line type="monotone" dataKey="Mar" stroke="#2ca02c" />
                  <Line type="monotone" dataKey="Apr" stroke="#d62728" />
                  <Line type="monotone" dataKey="May" stroke="#9467bd" />
                  <Line type="monotone" dataKey="Jun" stroke="#8c564b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
