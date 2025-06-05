"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock discharge data (generated based on the pattern)
const dischargeData = [
  {
    id: 1,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1975-01-01",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 1,
    discharge: 15.2,
    water_level: 2.1,
  },
  {
    id: 2,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1975-01-02",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 2,
    discharge: 14.8,
    water_level: 2.0,
  },
  {
    id: 3,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1975-01-03",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 3,
    discharge: 16.1,
    water_level: 2.2,
  },
  {
    id: 4,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1975-01-04",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 4,
    discharge: 17.3,
    water_level: 2.4,
  },
  {
    id: 5,
    climate_scenario: "OBSERVED",
    station_code: "Biharamulo",
    date_measured: "1975-01-05",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 5,
    discharge: 18.7,
    water_level: 2.6,
  },
  {
    id: 6,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1975-01-01",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 1,
    discharge: 12.4,
    water_level: 1.8,
  },
  {
    id: 7,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1975-01-02",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 2,
    discharge: 11.9,
    water_level: 1.7,
  },
  {
    id: 8,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1975-01-03",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 3,
    discharge: 13.1,
    water_level: 1.9,
  },
  {
    id: 9,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1975-01-04",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 4,
    discharge: 14.2,
    water_level: 2.0,
  },
  {
    id: 10,
    climate_scenario: "OBSERVED",
    station_code: "Kayanga",
    date_measured: "1975-01-05",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 5,
    discharge: 15.6,
    water_level: 2.2,
  },
  {
    id: 11,
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    date_measured: "1975-01-01",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 1,
    discharge: 8.9,
    water_level: 1.3,
  },
  {
    id: 12,
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    date_measured: "1975-01-02",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 2,
    discharge: 9.2,
    water_level: 1.4,
  },
  {
    id: 13,
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    date_measured: "1975-01-03",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 3,
    discharge: 10.1,
    water_level: 1.5,
  },
  {
    id: 14,
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    date_measured: "1975-01-04",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 4,
    discharge: 11.3,
    water_level: 1.6,
  },
  {
    id: 15,
    climate_scenario: "OBSERVED",
    station_code: "Igabiro",
    date_measured: "1975-01-05",
    year_measured: 1975,
    month_measured: 1,
    month_name: "JAN",
    month_day: 5,
    discharge: 12.7,
    water_level: 1.8,
  },
]

const columns = [
  { key: "climate_scenario", label: "Climate Scenario", sortable: true },
  { key: "station_code", label: "Station", sortable: true },
  { key: "date_measured", label: "Date", sortable: true },
  { key: "year_measured", label: "Year", sortable: true },
  { key: "month_name", label: "Month", sortable: true },
  { key: "month_day", label: "Day", sortable: true },
  { key: "discharge", label: "Discharge (m³/s)", sortable: true },
  { key: "water_level", label: "Water Level (m)", sortable: true },
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
const chartData = dischargeData.map((item) => ({
  date: item.date_measured,
  station: item.station_code,
  discharge: item.discharge,
  water_level: item.water_level,
  day: item.month_day,
}))

export function DischargeDetail() {
  const [activeTab, setActiveTab] = useState("table")

  const handleAdd = () => {
    console.log("Add new discharge record")
  }

  const handleEdit = (item: any) => {
    console.log("Edit discharge record:", item)
  }

  const handleDelete = (item: any) => {
    console.log("Delete discharge record:", item)
  }

  const handleImport = () => {
    console.log("Import discharge data")
  }

  const handleExport = (format: string) => {
    console.log("Export discharge data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Discharge Detail</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={dischargeData}
            columns={columns}
            title="Discharge Measurements"
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onImport={handleImport}
            onExport={handleExport}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Daily Discharge by Station</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.filter((d) => d.station === "Biharamulo" || d.station === "Kayanga")}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="discharge" stroke="#3b82f6" name="Discharge" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Water Level by Station</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.filter((d) => d.station === "Biharamulo" || d.station === "Kayanga")}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="water_level" stroke="#ef4444" name="Water Level" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
