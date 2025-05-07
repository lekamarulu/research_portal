"use client"

import { useState } from "react"
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

export default function RainfallPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [filterScenario, setFilterScenario] = useState("")
  const [filterStation, setFilterStation] = useState("")
  const [filterYear, setFilterYear] = useState("")

  // Mock data - in a real app, this would come from API
  const rainfallData = [
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
      date_measured: "2023-01-15",
      climate_scenario: "RCP85",
      station: "ST002",
      rainfall_total: 22.1,
      month_name: "Jan",
    },
    {
      id: 5,
      date_measured: "2023-02-15",
      climate_scenario: "RCP85",
      station: "ST002",
      rainfall_total: 28.5,
      month_name: "Feb",
    },
    {
      id: 6,
      date_measured: "2023-03-15",
      climate_scenario: "RCP85",
      station: "ST002",
      rainfall_total: 40.3,
      month_name: "Mar",
    },
  ]

  const handleFilter = () => {
    setIsLoading(true)
    // In a real app, you would fetch filtered data from API
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleExport = () => {
    // In a real app, you would generate and download a CSV file
    alert("Exporting data...")
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
          <Button variant="outline" onClick={handleExport}>
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
                <Select value={filterScenario} onValueChange={setFilterScenario}>
                  <SelectTrigger id="scenario">
                    <SelectValue placeholder="All scenarios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All scenarios</SelectItem>
                    <SelectItem value="RCP45">RCP4.5</SelectItem>
                    <SelectItem value="RCP85">RCP8.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="station">Station</Label>
                <Select value={filterStation} onValueChange={setFilterStation}>
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
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleFilter}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <RainfallTable data={rainfallData} isLoading={isLoading} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
