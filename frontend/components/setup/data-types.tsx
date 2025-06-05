"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock data types data
const dataTypesData = [
  {
    data_type: "RAINFALL",
    name: "Rainfall Data",
    description: "Daily precipitation measurements in millimeters",
    unit: "mm",
    frequency: "Daily",
    stations_count: 11,
    records_count: 20000,
    date_range: "1970-2024",
    parameters: ["rainfall_total"],
  },
  {
    data_type: "TEMPERATURE",
    name: "Temperature Data",
    description: "Daily minimum and maximum temperature measurements",
    unit: "°C",
    frequency: "Daily",
    stations_count: 11,
    records_count: 18500,
    date_range: "1973-2024",
    parameters: ["minimum", "maximum"],
  },
  {
    data_type: "DISCHARGE",
    name: "Discharge Data",
    description: "River flow discharge and water level measurements",
    unit: "m³/s, m",
    frequency: "Daily",
    stations_count: 8,
    records_count: 15000,
    date_range: "1975-2024",
    parameters: ["discharge", "water_level"],
  },
  {
    data_type: "HUMIDITY",
    name: "Humidity Data",
    description: "Relative humidity measurements",
    unit: "%",
    frequency: "Daily",
    stations_count: 6,
    records_count: 8000,
    date_range: "1980-2024",
    parameters: ["relative_humidity"],
  },
  {
    data_type: "WIND",
    name: "Wind Data",
    description: "Wind speed and direction measurements",
    unit: "m/s, degrees",
    frequency: "Daily",
    stations_count: 5,
    records_count: 6500,
    date_range: "1985-2024",
    parameters: ["wind_speed", "wind_direction"],
  },
]

const columns = [
  { key: "data_type", label: "Data Type", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "unit", label: "Unit", sortable: true },
  { key: "frequency", label: "Frequency", sortable: true },
  { key: "stations_count", label: "Stations", sortable: true },
  { key: "records_count", label: "Records", sortable: true },
  { key: "date_range", label: "Date Range", sortable: true },
]

const filters = [
  {
    key: "frequency",
    label: "Frequency",
    options: ["Daily", "Hourly", "Monthly"],
  },
  {
    key: "unit",
    label: "Unit",
    options: ["mm", "°C", "m³/s, m", "%", "m/s, degrees"],
  },
]

// Chart data
const recordsData = dataTypesData.map((type) => ({
  type: type.data_type,
  records: type.records_count,
}))

const stationsData = dataTypesData.map((type) => ({
  type: type.data_type,
  stations: type.stations_count,
}))

const distributionData = [
  { name: "Rainfall", value: 20000, color: "#3b82f6" },
  { name: "Temperature", value: 18500, color: "#ef4444" },
  { name: "Discharge", value: 15000, color: "#10b981" },
  { name: "Humidity", value: 8000, color: "#f59e0b" },
  { name: "Wind", value: 6500, color: "#8b5cf6" },
]

const coverageData = [
  { parameter: "Rainfall", coverage: 100, start_year: 1970 },
  { parameter: "Temperature", coverage: 100, start_year: 1973 },
  { parameter: "Discharge", coverage: 73, start_year: 1975 },
  { parameter: "Humidity", coverage: 55, start_year: 1980 },
  { parameter: "Wind", coverage: 45, start_year: 1985 },
]

export function DataTypes() {
  const [activeTab, setActiveTab] = useState("table")

  const handleAdd = () => {
    console.log("Add new data type")
  }

  const handleEdit = (item: any) => {
    console.log("Edit data type:", item)
  }

  const handleDelete = (item: any) => {
    console.log("Delete data type:", item)
  }

  const handleExport = (format: string) => {
    console.log("Export data types as:", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Data Types</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Datatable</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            data={dataTypesData}
            columns={columns}
            title="Climate Data Types"
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
                <CardTitle>Records Count by Data Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recordsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="records" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                    >
                      {distributionData.map((entry, index) => (
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
                <CardTitle>Station Coverage by Data Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stationsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stations" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Coverage Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coverageData.map((item) => (
                    <div key={item.parameter} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.parameter}</h4>
                        <p className="text-sm text-gray-600">Since {item.start_year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.coverage}%</p>
                        <p className="text-xs text-gray-500">Coverage</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Type Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataTypesData.map((type) => (
                  <div key={type.data_type} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Unit:</strong> {type.unit}
                      </div>
                      <div>
                        <strong>Frequency:</strong> {type.frequency}
                      </div>
                      <div>
                        <strong>Parameters:</strong> {type.parameters.join(", ")}
                      </div>
                      <div>
                        <strong>Records:</strong> {type.records_count.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
