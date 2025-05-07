"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CloudRain, Droplets, MapPin, RefreshCw } from "lucide-react"
import { RainfallTable } from "@/components/rainfall-table"
import { RainfallChart } from "@/components/rainfall-chart"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState("RCP45")
  const [selectedStation, setSelectedStation] = useState("ST001")
  const [selectedYear, setSelectedYear] = useState("2023")

  // Mock data - in a real app, this would come from API
  const [rainfallData, setRainfallData] = useState([])
  const [stationData, setStationData] = useState([])

  const router = useRouter()

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock rainfall data
        setRainfallData([
          {
            id: 1,
            date_measured: "2023-01-15",
            climate_scenario: "RCP45",
            station: "ST001",
            rainfall_total: 25.4,
            month_name: "Jan",
          },
          {
            id: 2,
            date_measured: "2023-02-15",
            climate_scenario: "RCP45",
            station: "ST001",
            rainfall_total: 30.2,
            month_name: "Feb",
          },
          {
            id: 3,
            date_measured: "2023-03-15",
            climate_scenario: "RCP45",
            station: "ST001",
            rainfall_total: 45.7,
            month_name: "Mar",
          },
          {
            id: 4,
            date_measured: "2023-04-15",
            climate_scenario: "RCP45",
            station: "ST001",
            rainfall_total: 50.1,
            month_name: "Apr",
          },
          {
            id: 5,
            date_measured: "2023-05-15",
            climate_scenario: "RCP45",
            station: "ST001",
            rainfall_total: 35.8,
            month_name: "May",
          },
          {
            id: 6,
            date_measured: "2023-06-15",
            climate_scenario: "RCP45",
            station: "ST001",
            rainfall_total: 20.3,
            month_name: "Jun",
          },
        ])

        // Mock station data
        setStationData([
          { code: "ST001", name: "Station A", latitude: 34.05, longitude: -118.25 },
          { code: "ST002", name: "Station B", latitude: 40.71, longitude: -74.01 },
        ])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedScenario, selectedStation, selectedYear])

  const refreshData = () => {
    // Simulate refreshing data
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="container space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of rainfall data and station information</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stationData.length}</div>
            <p className="text-xs text-muted-foreground">Active monitoring stations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rainfall Records</CardTitle>
            <CloudRain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rainfallData.length}</div>
            <p className="text-xs text-muted-foreground">Total rainfall measurements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rainfall</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rainfallData.length > 0
                ? (rainfallData.reduce((sum, item) => sum + item.rainfall_total, 0) / rainfallData.length).toFixed(1)
                : "0"}{" "}
              mm
            </div>
            <p className="text-xs text-muted-foreground">Average across all records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Climate Scenarios</CardTitle>
            <CloudRain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">RCP4.5 and RCP8.5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Rainfall Data</CardTitle>
            <CardDescription>Monthly rainfall totals for the selected station and scenario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-auto">
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RCP45">RCP4.5</SelectItem>
                      <SelectItem value="RCP85">RCP8.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-auto">
                  <Select value={selectedStation} onValueChange={setSelectedStation}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stationData.map((station) => (
                        <SelectItem key={station.code} value={station.code}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-auto">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="chart" className="pt-4">
                  <RainfallChart data={rainfallData} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="table" className="pt-4">
                  <RainfallTable data={rainfallData} isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Station Information</CardTitle>
            <CardDescription>Details about the selected station</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {stationData
                  .filter((station) => station.code === selectedStation)
                  .map((station) => (
                    <div key={station.code} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Station Code:</span>
                        <span className="text-sm">{station.code}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Name:</span>
                        <span className="text-sm">{station.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Latitude:</span>
                        <span className="text-sm">{station.latitude}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Longitude:</span>
                        <span className="text-sm">{station.longitude}</span>
                      </div>
                    </div>
                  ))}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/dashboard/stations/${selectedStation}`)}
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
