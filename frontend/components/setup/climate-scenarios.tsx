"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock climate scenarios data based on provided data
const climateScenariosData = [
  {
    climate_scenario: "OBSERVED",
    technical_code: "Historical",
    name: "Observed Climate",
    description:
      "Real-world historical climate data from observations (e.g., temperature, precipitation) used as a baseline for model comparison.",
    period: "1970-2024",
    usage_count: 15,
    data_types: ["Rainfall", "Temperature", "Discharge"],
  },
  {
    climate_scenario: "SSP126",
    technical_code: "SSP1-2.6",
    name: "Sustainability – Low Emissions",
    description:
      "A world shifting toward sustainability, equity, and low-carbon technologies; global warming likely limited to 1.5–2°C.",
    period: "2025-2100",
    usage_count: 8,
    data_types: ["Rainfall", "Temperature"],
  },
  {
    climate_scenario: "SSP245",
    technical_code: "SSP2-4.5",
    name: "Middle of the Road – Intermediate Emissions",
    description:
      "Continuation of current socio-economic trends with moderate climate action; projected warming around 2.5–3°C.",
    period: "2025-2100",
    usage_count: 10,
    data_types: ["Rainfall", "Temperature", "Discharge"],
  },
  {
    climate_scenario: "SSP370",
    technical_code: "SSP3-7.0",
    name: "Regional Rivalry – High Emissions",
    description:
      "A fragmented world with regional conflicts, high population growth, and minimal climate cooperation; warming exceeds 3.5°C.",
    period: "2025-2100",
    usage_count: 6,
    data_types: ["Rainfall", "Discharge"],
  },
  {
    climate_scenario: "SSP585",
    technical_code: "SSP5-8.5",
    name: "Fossil-fueled Development – Very High Emissions",
    description:
      "Rapid industrial and economic growth driven by fossil fuels with minimal climate policy; worst-case warming above 4°C by 2100.",
    period: "2025-2100",
    usage_count: 5,
    data_types: ["Rainfall", "Temperature"],
  },
]

const columns = [
  { key: "climate_scenario", label: "Scenario Code", sortable: true },
  { key: "technical_code", label: "Technical Code", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "period", label: "Period", sortable: true },
  { key: "usage_count", label: "Usage Count", sortable: true },
]

const filters = [
  {
    key: "period",
    label: "Period",
    options: ["1970-2024", "2025-2100"],
  },
]

// Chart data
const usageData = climateScenariosData.map((scenario) => ({
  scenario: scenario.climate_scenario,
  count: scenario.usage_count,
}))

const emissionLevels = [
  { name: "Low (SSP126)", value: 8, color: "#22c55e" },
  { name: "Intermediate (SSP245)", value: 10, color: "#f59e0b" },
  { name: "High (SSP370)", value: 6, color: "#ef4444" },
  { name: "Very High (SSP585)", value: 5, color: "#7c2d12" },
  { name: "Historical", value: 15, color: "#3b82f6" },
]

const temperatureProjections = [
  { scenario: "OBSERVED", temp_change: 0, period: "Baseline" },
  { scenario: "SSP126", temp_change: 1.75, period: "2081-2100" },
  { scenario: "SSP245", temp_change: 2.75, period: "2081-2100" },
  { scenario: "SSP370", temp_change: 3.75, period: "2081-2100" },
  { scenario: "SSP585", temp_change: 4.5, period: "2081-2100" },
]

export function ClimateScenarios() {
  const [activeTab, setActiveTab] = useState("table")

  const handleAdd = () => {
    console.log("Add new climate scenario")
  }

  const handleEdit = (item: any) => {
    console.log("Edit climate scenario:", item)
  }

  const handleDelete = (item: any) => {
    console.log("Delete climate scenario:", item)
  }

  const handleExport = (format: string) => {
    console.log("Export climate scenarios data as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Climate Scenarios</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Datatable</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={climateScenariosData}
            columns={columns}
            title="Climate Scenarios"
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExport}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Usage in Research</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="scenario" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emission Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emissionLevels}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {emissionLevels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temperature Projections by Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={temperatureProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="scenario" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="temp_change" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scenario Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900">Historical (OBSERVED)</h4>
                      <p className="text-sm text-blue-700">1970-2024 • Baseline for comparison</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-900">SSP1-2.6 (Low Emissions)</h4>
                      <p className="text-sm text-green-700">Sustainability pathway • +1.5-2°C</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-medium text-yellow-900">SSP2-4.5 (Intermediate)</h4>
                      <p className="text-sm text-yellow-700">Middle of the road • +2.5-3°C</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h4 className="font-medium text-orange-900">SSP3-7.0 (High Emissions)</h4>
                      <p className="text-sm text-orange-700">Regional rivalry • +3.5°C+</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h4 className="font-medium text-red-900">SSP5-8.5 (Very High)</h4>
                      <p className="text-sm text-red-700">Fossil-fueled • +4°C+ by 2100</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
