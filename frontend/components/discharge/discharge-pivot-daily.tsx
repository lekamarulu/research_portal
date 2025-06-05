"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock discharge pivot daily data
const dischargePivotDailyData = [
  {
    id: "discharge-daily-1",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1975,
    month_day: 1,
    jan_discharge: 15.2,
    jan_level: 2.1,
    feb_discharge: 14.8,
    feb_level: 2.0,
    mar_discharge: 16.5,
    mar_level: 2.3,
    apr_discharge: 18.9,
    apr_level: 2.7,
    may_discharge: 22.1,
    may_level: 3.1,
    jun_discharge: 19.8,
    jun_level: 2.8,
  },
  {
    id: "discharge-daily-2",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1975,
    month_day: 2,
    jan_discharge: 14.8,
    jan_level: 2.0,
    feb_discharge: 15.1,
    feb_level: 2.1,
    mar_discharge: 17.2,
    mar_level: 2.4,
    apr_discharge: 19.5,
    apr_level: 2.8,
    may_discharge: 23.4,
    may_level: 3.3,
    jun_discharge: 20.1,
    jun_level: 2.9,
  },
  {
    id: "discharge-daily-3",
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    year_measured: 1975,
    month_day: 3,
    jan_discharge: 16.1,
    jan_level: 2.2,
    feb_discharge: 15.8,
    feb_level: 2.2,
    mar_discharge: 18.1,
    mar_level: 2.5,
    apr_discharge: 20.3,
    apr_level: 2.9,
    may_discharge: 24.7,
    may_level: 3.5,
    jun_discharge: 21.2,
    jun_level: 3.0,
  },
  {
    id: "discharge-daily-4",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1975,
    month_day: 1,
    jan_discharge: 12.4,
    jan_level: 1.8,
    feb_discharge: 11.9,
    feb_level: 1.7,
    mar_discharge: 13.2,
    mar_level: 1.9,
    apr_discharge: 15.1,
    apr_level: 2.2,
    may_discharge: 17.8,
    may_level: 2.5,
    jun_discharge: 16.3,
    jun_level: 2.3,
  },
  {
    id: "discharge-daily-5",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1975,
    month_day: 2,
    jan_discharge: 11.9,
    jan_level: 1.7,
    feb_discharge: 12.3,
    feb_level: 1.8,
    mar_discharge: 13.8,
    mar_level: 2.0,
    apr_discharge: 15.7,
    apr_level: 2.3,
    may_discharge: 18.5,
    may_level: 2.6,
    jun_discharge: 16.9,
    jun_level: 2.4,
  },
  {
    id: "discharge-daily-6",
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    year_measured: 1975,
    month_day: 3,
    jan_discharge: 13.1,
    jan_level: 1.9,
    feb_discharge: 12.8,
    feb_level: 1.8,
    mar_discharge: 14.5,
    mar_level: 2.1,
    apr_discharge: 16.4,
    apr_level: 2.4,
    may_discharge: 19.2,
    may_level: 2.7,
    jun_discharge: 17.6,
    jun_level: 2.5,
  },
]

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station_code", label: "Station", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
  { key: "month_day", label: "Day", sortable: true },
  { key: "jan_discharge", label: "Jan Discharge", sortable: true },
  { key: "jan_level", label: "Jan Level", sortable: true },
  { key: "feb_discharge", label: "Feb Discharge", sortable: true },
  { key: "feb_level", label: "Feb Level", sortable: true },
  { key: "mar_discharge", label: "Mar Discharge", sortable: true },
  { key: "mar_level", label: "Mar Level", sortable: true },
  { key: "apr_discharge", label: "Apr Discharge", sortable: true },
  { key: "apr_level", label: "Apr Level", sortable: true },
  { key: "may_discharge", label: "May Discharge", sortable: true },
  { key: "may_level", label: "May Level", sortable: true },
  { key: "jun_discharge", label: "Jun Discharge", sortable: true },
  { key: "jun_level", label: "Jun Level", sortable: true },
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
const chartData = dischargePivotDailyData
  .filter((item) => item.station_code === "Biharamulo")
  .map((item) => ({
    day: item.month_day,
    "Jan Discharge": item.jan_discharge,
    "Feb Discharge": item.feb_discharge,
    "Mar Discharge": item.mar_discharge,
    "Apr Discharge": item.apr_discharge,
    "May Discharge": item.may_discharge,
    "Jun Discharge": item.jun_discharge,
  }))

export function DischargePivotDaily() {
  const [activeTab, setActiveTab] = useState("table")

  const handleExport = (format: string) => {
    console.log("Export discharge pivot daily data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Discharge Pivot Daily</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={dischargePivotDailyData}
            columns={columns}
            title="Daily Discharge Pivot View"
            onExport={handleExport}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Monthly Discharge Pattern by Day (Biharamulo 1975)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Jan Discharge" fill="#1f77b4" />
                  <Bar dataKey="Feb Discharge" fill="#ff7f0e" />
                  <Bar dataKey="Mar Discharge" fill="#2ca02c" />
                  <Bar dataKey="Apr Discharge" fill="#d62728" />
                  <Bar dataKey="May Discharge" fill="#9467bd" />
                  <Bar dataKey="Jun Discharge" fill="#8c564b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
