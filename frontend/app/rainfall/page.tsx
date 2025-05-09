"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RainfallTable } from "@/components/rainfall-table"
import { Plus, Filter, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { researchPortalApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { ClimateScenario, Station, StationMonthlyRainfall, Year } from "@/lib/models"

export default function RainfallPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [selectedScenario, setSelectedScenario] = useState("OBSERVED")
    const [selectedStation, setSelectedStation] = useState("Biharamulo")
    const [selectedYear, setSelectedYear] = useState("1973")

    const [climateScenarioData, setClimateScenarioData] = useState<ClimateScenario[]>([])
    const [yearData, setYearData] = useState<Year[]>([])
    const [stationData, setStationData] = useState<Station[]>([])
    const [stationMonthlyRainfallData, setStationMonthlyRainfallData] = useState<StationMonthlyRainfall[]>([])


    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
  
    useEffect(() => {
      // Fetch data from API
      const fetchData = async () => {
        setIsLoading(true)
        try {
          setError(null)
  
          //Fetch rainfall data
          const stationMonthlyRainfallResult = await researchPortalApi.getStationMonthlyRainfallData({
            scenario: selectedScenario,
            station: selectedStation,
            year: selectedYear,
          })
          setStationMonthlyRainfallData(stationMonthlyRainfallResult)
  
          const stationResult = await researchPortalApi.getStations()
          setStationData(stationResult)
  
  
          const yearResult = await researchPortalApi.getYears()
          setYearData(yearResult)
  
          const climateScenarioResult = await researchPortalApi.getClimateScenarios()
          setClimateScenarioData(climateScenarioResult)
  
        } catch (error) {
          console.error("Error fetching data:", error)
          setError(error instanceof Error ? error.message : "Failed to fetch data")
  
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchData()
    }, [selectedScenario, selectedStation, selectedYear])
  
    const refreshData = () => {
      // Simulate refreshing data
      setIsLoading(true)
      setSelectedScenario((prev) => prev)
    }
  
    const handeRetry = () => {
      setError(null)
      refreshData()
    }
  
  return (
    <div className="container space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rainfall Data</h1>
          <p className="text-muted-foreground">View and manage rainfall records</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Rainfall Record</DialogTitle>
                <DialogDescription>Enter the details for the new rainfall record</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input id="date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="scenario" className="text-right">
                    Scenario
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RCP45">RCP4.5</SelectItem>
                      <SelectItem value="RCP85">RCP8.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="station" className="text-right">
                    Station
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ST001">Station A</SelectItem>
                      <SelectItem value="ST002">Station B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rainfall" className="text-right">
                    Rainfall (mm)
                  </Label>
                  <Input id="rainfall" type="number" step="0.1" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rainfall Records</CardTitle>
          <CardDescription>Browse and filter rainfall data across stations and climate scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="grid w-full gap-2">
                <Label htmlFor="scenario">Climate Scenario</Label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger id="scenario">
                    <SelectValue placeholder="All scenarios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All scenarios</SelectItem>
                    {climateScenarioData.map((scenario) => (
                      <SelectItem key={scenario.climate_scenario} value={scenario.climate_scenario}>
                        {scenario.climate_scenario}: {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="grid w-full gap-2">
                <Label htmlFor="station">Station</Label>
                <Select value={selectedStation} onValueChange={setStationData}>
                  <SelectTrigger id="station">
                    <SelectValue placeholder="All stations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stations</SelectItem>
                    <SelectItem value="ST001">Station A</SelectItem>
                    <SelectItem value="ST002">Station B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="year">Year</Label>
                <Select value={selectedYear} onValueChange={setYearData}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div className="flex items-end">
                <Button>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* <RainfallTable data={stationMonthlyRainfallData} isLoading={isLoading} /> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
