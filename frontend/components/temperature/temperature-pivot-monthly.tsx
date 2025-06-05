"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock temperature pivot monthly data (generated based on the pattern)
const temperaturePivotMonthlyData = [
  {
    id: "temp-monthly-1",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1973,
    jan_min: 13.2,
    jan_max: 26.8,
    feb_min: 14.1,
    feb_max: 27.9,
    mar_min: 15.3,
    mar_max: 29.1,
    apr_min: 16.8,
    apr_max: 29.8,
    may_min: 17.2,
    may_max: 28.9,
    jun_min: 15.9,
    jun_max: 27.1,
    jul_min: 14.8,
    jul_max: 26.5,
    aug_min: 15.2,
    aug_max: 27.8,
    sep_min: 16.1,
    sep_max: 28.9,
    oct_min: 17.3,
    oct_max: 29.5,
    nov_min: 16.8,
    nov_max: 28.7,
    dec_min: 15.1,
    dec_max: 27.2,
  },
  {
    id: "temp-monthly-2",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1974,
    jan_min: 13.5,
    jan_max: 27.1,
    feb_min: 14.3,
    feb_max: 28.2,
    mar_min: 15.6,
    mar_max: 29.4,
    apr_min: 17.1,
    apr_max: 30.1,
    may_min: 17.5,
    may_max: 29.2,
    jun_min: 16.2,
    jun_max: 27.4,
    jul_min: 15.1,
    jul_max: 26.8,
    aug_min: 15.5,
    aug_max: 28.1,
    sep_min: 16.4,
    sep_max: 29.2,
    oct_min: 17.6,
    oct_max: 29.8,
    nov_min: 17.1,
    nov_max: 29.0,
    dec_min: 15.4,
    dec_max: 27.5,
  },
  {
    id: "temp-monthly-3",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1973,
    jan_min: 15.2,
    jan_max: 20.1,
    feb_min: 15.8,
    feb_max: 21.2,
    mar_min: 16.4,
    mar_max: 22.3,
    apr_min: 17.1,
    apr_max: 22.8,
    may_min: 16.9,
    may_max: 22.1,
    jun_min: 15.7,
    jun_max: 20.9,
    jul_min: 14.9,
    jul_max: 19.8,
    aug_min: 15.3,
    aug_max: 20.5,
    sep_min: 16.0,
    sep_max: 21.4,
    oct_min: 16.8,
    oct_max: 22.1,
    nov_min: 16.5,
    nov_max: 21.7,
    dec_min: 15.9,
    dec_max: 20.8,
  },
  {
    id: "temp-monthly-4",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1974,
    jan_min: 15.4,
    jan_max: 20.3,
    feb_min: 16.0,
    feb_max: 21.4,
    mar_min: 16.6,
    mar_max: 22.5,
    apr_min: 17.3,
    apr_max: 23.0,
    may_min: 17.1,
    may_max: 22.3,
    jun_min: 15.9,
    jun_max: 21.1,
    jul_min: 15.1,
    jul_max: 20.0,
    aug_min: 15.5,
    aug_max: 20.7,
    sep_min: 16.2,
    sep_max: 21.6,
    oct_min: 17.0,
    oct_max: 22.3,
    nov_min: 16.7,
    nov_max: 21.9,
    dec_min: 16.1,
    dec_max: 21.0,
  },
  {
    id: "temp-monthly-5",
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    year_measured: 1973,
    jan_min: 14.8,
    jan_max: 24.2,
    feb_min: 15.4,
    feb_max: 25.1,
    mar_min: 16.1,
    mar_max: 26.3,
    apr_min: 16.9,
    apr_max: 26.8,
    may_min: 16.7,
    may_max: 26.1,
    jun_min: 15.5,
    jun_max: 24.9,
    jul_min: 14.7,
    jul_max: 23.8,
    aug_min: 15.1,
    aug_max: 24.5,
    sep_min: 15.8,
    sep_max: 25.4,
    oct_min: 16.6,
    oct_max: 26.1,
    nov_min: 16.3,
    nov_max: 25.7,
    dec_min: 15.7,
    dec_max: 24.8,
  },
  {
    id: "temp-monthly-6",
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    year_measured: 1974,
    jan_min: 15.0,
    jan_max: 24.4,
    feb_min: 15.6,
    feb_max: 25.3,
    mar_min: 16.3,
    mar_max: 26.5,
    apr_min: 17.1,
    apr_max: 27.0,
    may_min: 16.9,
    may_max: 26.3,
    jun_min: 15.7,
    jun_max: 25.1,
    jul_min: 14.9,
    jul_max: 24.0,
    aug_min: 15.3,
    aug_max: 24.7,
    sep_min: 16.0,
    sep_max: 25.6,
    oct_min: 16.8,
    oct_max: 26.3,
    nov_min: 16.5,
    nov_max: 25.9,
    dec_min: 15.9,
    dec_max: 25.0,
  },
]

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station_code", label: "Station", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
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
  { key: "jul_min", label: "Jul Min", sortable: true },
  { key: "jul_max", label: "Jul Max", sortable: true },
  { key: "aug_min", label: "Aug Min", sortable: true },
  { key: "aug_max", label: "Aug Max", sortable: true },
  { key: "sep_min", label: "Sep Min", sortable: true },
  { key: "sep_max", label: "Sep Max", sortable: true },
  { key: "oct_min", label: "Oct Min", sortable: true },
  { key: "oct_max", label: "Oct Max", sortable: true },
  { key: "nov_min", label: "Nov Min", sortable: true },
  { key: "nov_max", label: "Nov Max", sortable: true },
  { key: "dec_min", label: "Dec Min", sortable: true },
  { key: "dec_max", label: "Dec Max", sortable: true },
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

// Chart data for comparison
const chartData = [
  { month: "Jan", Biharamulo_Min: 13.2, Biharamulo_Max: 26.8, Kayanga_Min: 15.2, Kayanga_Max: 20.1 },
  { month: "Feb", Biharamulo_Min: 14.1, Biharamulo_Max: 27.9, Kayanga_Min: 15.8, Kayanga_Max: 21.2 },
  { month: "Mar", Biharamulo_Min: 15.3, Biharamulo_Max: 29.1, Kayanga_Min: 16.4, Kayanga_Max: 22.3 },
  { month: "Apr", Biharamulo_Min: 16.8, Biharamulo_Max: 29.8, Kayanga_Min: 17.1, Kayanga_Max: 22.8 },
  { month: "May", Biharamulo_Min: 17.2, Biharamulo_Max: 28.9, Kayanga_Min: 16.9, Kayanga_Max: 22.1 },
  { month: "Jun", Biharamulo_Min: 15.9, Biharamulo_Max: 27.1, Kayanga_Min: 15.7, Kayanga_Max: 20.9 },
  { month: "Jul", Biharamulo_Min: 14.8, Biharamulo_Max: 26.5, Kayanga_Min: 14.9, Kayanga_Max: 19.8 },
  { month: "Aug", Biharamulo_Min: 15.2, Biharamulo_Max: 27.8, Kayanga_Min: 15.3, Kayanga_Max: 20.5 },
  { month: "Sep", Biharamulo_Min: 16.1, Biharamulo_Max: 28.9, Kayanga_Min: 16.0, Kayanga_Max: 21.4 },
  { month: "Oct", Biharamulo_Min: 17.3, Biharamulo_Max: 29.5, Kayanga_Min: 16.8, Kayanga_Max: 22.1 },
  { month: "Nov", Biharamulo_Min: 16.8, Biharamulo_Max: 28.7, Kayanga_Min: 16.5, Kayanga_Max: 21.7 },
  { month: "Dec", Biharamulo_Min: 15.1, Biharamulo_Max: 27.2, Kayanga_Min: 15.9, Kayanga_Max: 20.8 },
]

export function TemperaturePivotMonthly() {
  const [activeTab, setActiveTab] = useState("table")

  const handleExport = (format: string) => {
    console.log("Export temperature pivot monthly data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Temperature Pivot Monthly</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={temperaturePivotMonthlyData}
            columns={columns}
            title="Monthly Temperature Pivot View"
            onExport={handleExport}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Monthly Temperature Comparison (1973)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Biharamulo_Min" fill="#3b82f6" name="Biharamulo Min" />
                  <Bar dataKey="Biharamulo_Max" fill="#1d4ed8" name="Biharamulo Max" />
                  <Bar dataKey="Kayanga_Min" fill="#ef4444" name="Kayanga Min" />
                  <Bar dataKey="Kayanga_Max" fill="#dc2626" name="Kayanga Max" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
